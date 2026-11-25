import { createMemo, isPending, Show } from "solid-js";
import type { ChapterLink, ChapterView } from "../../lib/content";
import { findSection, plainText } from "../../lib/content/note";
import type { Locale } from "../../lib/i18n";
import { BookPicker } from "../components/book-picker";
import { ChapterKeys } from "../components/chapter-keys";
import { ChapterReader } from "../components/chapter-reader";
import { ChapterTour } from "../components/tour";
import { DisplayMenu, ThemeToggle } from "../components/display-controls";
import { LanguageToggle } from "../components/language-switcher";
import { useLocale } from "../components/locale-context";
import { NotFound } from "../components/not-found";
import { usePreferences } from "../components/preferences-context";
import { Seo } from "../components/seo";
import { getChapter } from "../data";
import { chapterHref, homeHref } from "../router";

const linkHref = (l: ChapterLink | null, locale: Locale) =>
  l ? chapterHref({ slug: l.book.slug, number: l.number, locale }) : null;

/** Shared chapter reader page for both Vietnamese (/:book/:chapter) and English (/en/:book/:chapter). */
export function ChapterPageView(props: { book: string; chapter: number }) {
  const { locale, t } = useLocale();
  const view = createMemo(() => getChapter(props.book, props.chapter, locale()));
  const { scale } = usePreferences();

  const summaryOf = (ch: ChapterView): string => {
    const story = findSection(ch.sections, "story")?.paragraphs[0];
    if (story) return plainText(story);
    return t().seo.chapterFallbackDesc(ch.book.name, ch.number, ch.title);
  };

  return (
    <Show when={view()} fallback={<NotFound />}>
      {(ch) => (
        <div class={["flex flex-1 flex-col transition-opacity", { "opacity-60": isPending(view) }]}>
          <Seo
            title={t().seo.chapterTitle(ch().book.name, ch().number, ch().title)}
            description={summaryOf(ch())}
            path={chapterHref({ slug: ch().book.slug, number: ch().number, locale: locale() })}
            type="article"
          />

          <header class="sticky top-0 z-20 border-b border-rule/70 bg-paper/88 backdrop-blur-md font-sans">
            <div class="mx-auto flex w-full max-w-[38rem] items-center justify-between gap-2 px-4 py-2 text-sm text-muted sm:px-5">
              <a
                href={`${homeHref(locale())}#${ch().book.slug}`}
                class="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-muted transition-colors hover:bg-card hover:text-ink"
              >
                <span aria-hidden="true">‹</span>
                <span>{t().header.backToToc}</span>
              </a>

              <div class="flex items-center gap-2">
                <span class="hidden text-xs font-medium text-ink sm:inline">
                  {ch().book.name} {ch().number}
                </span>
                <BookPicker current={ch().book.slug} />
              </div>

              <div class="kt-display-controls flex items-center gap-1.5">
                <ThemeToggle compact />
                <DisplayMenu compact />
                <LanguageToggle />
              </div>
            </div>
          </header>

          <ChapterKeys prev={linkHref(ch().prev, locale())} next={linkHref(ch().next, locale())} />
          <ChapterReader view={ch()} scale={scale()} />
          <ChapterTour />
        </div>
      )}
    </Show>
  );
}
