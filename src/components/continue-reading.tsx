import { createEffect, createMemo, Show } from "solid-js";
import type { TocBook } from "../../lib/content";
import { bookFromAnySlug, translateBookSlug } from "../../lib/content/books";
import { formatDateTime } from "../../lib/history/types";
import type { Locale } from "../../lib/i18n";
import { CONTINUE_HEIGHT_STORAGE_KEY } from "../lib/preferences";
import { accountHref, chapterHref, historyHref, homeHref } from "../router";
import { useAuth } from "./auth-context";
import { useHistory } from "./history-context";
import { useLocale } from "./locale-context";
import { StreakCard } from "./streak-card";
import { useStreak } from "./streak-context";
import { writeStorage } from "./preferences-context";
import { ProgressRing, WeeklyDots } from "./progress-ring";
import { Bone, Skeleton } from "./skeleton";

type NextChapter = {
  href: string;
  label: string;
  title: string;
};

/** Finds the chapter immediately following (bookSlug, chapter) in the localized TOC. */
export function findNextChapter(
  toc: TocBook[],
  bookSlug: string | null,
  chapter: number | null,
  locale: Locale = "vi",
): NextChapter | null {
  if (!bookSlug || !chapter) return null;
  const localizedSlug = translateBookSlug(bookSlug, locale) ?? bookSlug;
  const bookIndex = toc.findIndex((b) => b.book.slug === localizedSlug);
  if (bookIndex < 0) return null;
  const book = toc[bookIndex];
  const chIndex = book.chapters.findIndex((c) => c.number === chapter);
  if (chIndex < 0) return null;

  const sameBookNext = book.chapters[chIndex + 1];
  if (sameBookNext) {
    return {
      href: chapterHref({ slug: book.book.slug, number: sameBookNext.number, locale }),
      label: `${book.book.name} ${sameBookNext.number}`,
      title: sameBookNext.title,
    };
  }

  const nextBook = toc[bookIndex + 1];
  const firstNext = nextBook?.chapters[0];
  if (nextBook && firstNext) {
    return {
      href: chapterHref({ slug: nextBook.book.slug, number: firstNext.number, locale }),
      label: `${nextBook.book.name} ${firstNext.number}`,
      title: firstNext.title,
    };
  }
  return null;
}

/** Resolves localized display info (href, subtitle, title) for a history chapter entry. */
export function resolveChapterDisplay(
  toc: TocBook[],
  bookSlug: string | null,
  chapter: number | null,
  fallbackSubtitle: string,
  fallbackTitle: string,
  locale: Locale,
) {
  const localizedBook = bookSlug ? bookFromAnySlug(bookSlug, locale) : undefined;
  const tocBook = localizedBook ? toc.find((b) => b.book.code === localizedBook.code) : undefined;
  const tocChapter = chapter ? tocBook?.chapters.find((c) => c.number === chapter) : undefined;
  const slug = localizedBook?.slug ?? bookSlug ?? "";
  return {
    href: chapterHref({ slug, number: chapter ?? 1, locale }),
    subtitle: localizedBook && chapter ? `${localizedBook.name} ${chapter}` : fallbackSubtitle,
    title: tocChapter?.title ?? fallbackTitle,
    totalChapters: tocBook?.chapters.length ?? 0,
  };
}

/** "Continue reading" card + 3 quiet stats cards on the home page when history exists. */
export function ContinueReading(props: { toc: TocBook[] }) {
  const { user, initialized } = useAuth();
  const { hydrated, syncing, latestChapter, stats, bookSummary } = useHistory();
  const streak = useStreak();
  const { locale, t } = useLocale();

  const latestDisplay = createMemo(() => {
    const latest = latestChapter();
    if (!latest) return null;
    return resolveChapterDisplay(
      props.toc,
      latest.bookSlug,
      latest.chapter,
      latest.subtitle,
      latest.title,
      locale(),
    );
  });

  const nextChapter = createMemo(() => {
    const latest = latestChapter();
    return latest ? findNextChapter(props.toc, latest.bookSlug, latest.chapter, locale()) : null;
  });

  const bookPercent = createMemo(() => {
    const latest = latestChapter();
    const display = latestDisplay();
    if (!latest?.bookSlug || !display || display.totalChapters === 0) return 0;
    const read = bookSummary(latest.bookSlug)?.read ?? 1;
    return Math.min(100, Math.round((read / display.totalChapters) * 100));
  });

  const settled = createMemo(() => hydrated() && initialized() && !syncing());

  // Once auth and history settle, remember the card's height (or that there is none) for the next load's init script,
  // and keep it current: parts of the card (the streak card, its reminder row) fill in after it first shows.
  let card: HTMLDivElement | undefined;
  createEffect(
    () => (settled() ? Boolean(latestChapter()) : undefined),
    (shown) => {
      if (shown === undefined) return;
      const el = card;
      if (!shown || !el) {
        writeStorage(CONTINUE_HEIGHT_STORAGE_KEY, null);
        return;
      }
      const remember = () => writeStorage(CONTINUE_HEIGHT_STORAGE_KEY, String(el.offsetHeight));
      remember();
      if (typeof ResizeObserver === "undefined") return;
      const watch = new ResizeObserver(remember);
      watch.observe(el);
      return () => watch.disconnect();
    },
  );

  return (
    <Show when={hydrated() && latestChapter()} fallback={<Show when={!settled()}>{<ContinueSkeleton />}</Show>}>
      {(latest) => (
        <div ref={card} class="space-y-2.5">
          <StreakCard next={nextChapter()} />
          <section
            aria-labelledby="xem-tiep-heading"
            class="grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-3xl border border-rule bg-card p-5"
          >
            <div class="relative h-[4.5rem] w-[4.5rem]">
              <ProgressRing radius={30} percent={bookPercent()} />
              <span class="absolute inset-0 grid place-items-center font-sans text-sm font-medium text-ink">
                {bookPercent()}%
              </span>
            </div>

            <div class="min-w-0">
              <p id="xem-tiep-heading" class="font-sans text-xs font-medium text-accent">
                {t().continueReading.heading(formatDateTime(latest().lastReadAt, locale()))}
              </p>
              <h2 class="mt-0.5 truncate font-display text-xl font-normal text-ink sm:text-[1.35rem]">
                {latestDisplay()?.subtitle ?? latest().subtitle}
              </h2>
              <p class="truncate text-sm text-muted">{latestDisplay()?.title ?? latest().title}</p>
            </div>

            <div class="col-span-full flex flex-wrap items-center gap-2 font-sans text-sm">
              <a
                href={latestDisplay()?.href ?? chapterHref({ slug: latest().bookSlug ?? "", number: latest().chapter ?? 1, locale: locale() })}
                class="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 font-medium text-paper transition-opacity hover:opacity-90"
              >
                {latest().completed ? t().continueReading.readAgain : t().continueReading.continueBtn}
              </a>
              <Show when={nextChapter()}>
                {(next) => (
                  <a
                    href={next().href}
                    title={next().title}
                    class="inline-flex min-h-11 items-center rounded-full bg-side px-4 font-normal text-accent transition-colors hover:bg-accent hover:text-paper"
                  >
                    {t().continueReading.nextChapter(next().label)}
                  </a>
                )}
              </Show>
            </div>
          </section>

          <section aria-label={t().continueReading.statsAriaLabel} class="grid grid-cols-3 gap-2 font-sans">
            <a
              href={historyHref(locale())}
              class="rounded-2xl border border-rule bg-card p-3.5 transition-colors hover:border-accent"
            >
              <strong class="block text-2xl leading-none font-light text-ink">{stats().chaptersRead}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">{t().continueReading.chaptersRead(stats().chaptersRead)}</span>
            </a>

            <a
              href={historyHref(locale())}
              class="rounded-2xl border border-rule bg-card p-3.5 transition-colors hover:border-accent"
            >
              <strong class="block text-2xl leading-none font-light text-ink">{streak.state().days}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">{t().continueReading.dayStreak}</span>
              <WeeklyDots />
            </a>

            <a
              href={historyHref(locale())}
              class="rounded-2xl border border-rule bg-card p-3.5 transition-colors hover:border-accent"
            >
              <strong class="block text-2xl leading-none font-light text-ink">{stats().booksOpened}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">{t().continueReading.booksOpened(stats().booksOpened)}</span>
            </a>
          </section>

          <Show when={initialized() && !user()}>
            <p class="px-1 font-sans text-xs text-muted">
              {t().continueReading.localOnlyPrefix} ·{" "}
              <a href={accountHref(locale(), homeHref(locale()))} class="text-accent underline underline-offset-4">
                {t().continueReading.signInToSync}
              </a>
            </p>
          </Show>
        </div>
      )}
    </Show>
  );
}

/**
 * The card's shapes while history loads, as tall as the card was last time (app.css), so the card replaces it in place.
 * shortcut: a device that has never shown the card has no height to hold, so the skeleton is empty there; add a default
 * height for signed-in readers if first loads after sign-in feel blank.
 */
function ContinueSkeleton() {
  const { t } = useLocale();
  return (
    <Skeleton label={t().history.loadingLabel} class="kt-continue-skeleton grid">
      <div class="grid h-full grid-rows-[1fr_auto_auto] gap-2.5">
        <div class="flex items-start gap-4 rounded-3xl border border-rule bg-card p-5">
          <Bone class="h-20 w-20 shrink-0" />
          <div class="flex-1 space-y-2 pt-3">
            <Bone class="h-7 w-24" />
            <Bone class="h-3 w-20" />
          </div>
        </div>
        <div class="grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-3xl border border-rule bg-card p-5">
          <Bone class="h-[4.5rem] w-[4.5rem]" />
          <div class="space-y-2">
            <Bone class="h-3 w-40" />
            <Bone class="h-5 w-28" />
            <Bone class="h-3 w-32" />
          </div>
          <Bone class="col-span-full h-11 w-44" />
        </div>
        <div class="grid grid-cols-3 gap-2">
          <Bone class="h-[5.75rem] rounded-2xl" />
          <Bone class="h-[5.75rem] rounded-2xl" />
          <Bone class="h-[5.75rem] rounded-2xl" />
        </div>
      </div>
    </Skeleton>
  );
}
