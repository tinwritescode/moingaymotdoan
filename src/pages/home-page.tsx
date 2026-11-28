import { useLocation } from "@solidjs/router";
import { createEffect, createMemo, createSignal, For, onSettled, Show } from "solid-js";
import type { TocBook } from "../../lib/content";
import { groupBooks, testamentOf } from "../../lib/content/books";
import { findSection, plainText } from "../../lib/content/note";
import { chapterItemKey, formatShortDate } from "../../lib/history/types";
import { messagesFor, type Locale } from "../../lib/i18n";
import { ariaState } from "../components/aria";
import { ContinueReading } from "../components/continue-reading";
import { FloatingDock } from "../components/floating-dock";
import { useHistory } from "../components/history-context";
import { useLocale } from "../components/locale-context";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { WelcomeSheet } from "../components/tour";
import { getChapter, getToc, type Toc } from "../data";
import { chapterHref, ebookHref, homeHref, moodsHref } from "../router";

/** Where Start Reading points: the first book written, at its first chapter. */
export const startOf = (toc: Toc) => toc.books[0];

type TestamentFilter = "tat-ca" | "cu-uoc" | "tan-uoc";
type ChapterViewMode = "dots" | "list";

function timeGreeting(now: Date, locale: Locale): { dateLine: string; headline: string } {
  const m = messagesFor(locale).home;
  const dateLine = m.formatDateLine(now);
  const h = now.getHours();
  const headline = h < 12 ? m.morning : h < 18 ? m.afternoon : m.evening;
  return { dateLine, headline };
}

/** Quiet home page shared by Vietnamese (/) and English (/en). */
export function HomePage() {
  const { locale, t } = useLocale();
  const location = useLocation();
  const toc = createMemo(() => getToc(locale()));
  const [now, setNow] = createSignal<Date | null>(null);

  onSettled(() => {
    setNow(new Date());
  });

  const greeting = createMemo(() => {
    const d = now();
    return d ? timeGreeting(d, locale()) : null;
  });


  return (
    <>
      <Seo title={t().seo.defaultTitle} description={t().seo.defaultDescription} path={homeHref(locale())} />
      <SiteHeader />
      <main class="kt-home mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
        <header class="mb-5">
          <p class="font-sans text-[13px] text-muted">{greeting()?.dateLine ?? t().home.fallbackKicker}</p>
          <h1 class="mt-0.5 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
            {greeting()?.headline ?? t().home.fallbackHeadline}
          </h1>
          <p class="mt-1.5 text-[15px] text-muted">{t().home.subtitle}</p>
        </header>

        <Show when={startOf(toc())} fallback={<p class="mt-8 text-muted">{t().home.emptyFallback}</p>}>
          {(start) => (
            <>
              {/* Its skeleton holds this slot's room before hydration for a returning reader, so nothing below shifts. */}
              <div class="kt-continue">
                <ContinueReading toc={toc().books} />
              </div>

              <p class="mt-4 rounded-2xl border border-rule bg-card/70 px-4 py-3 font-sans text-xs leading-relaxed text-muted">
                {t().aiNotice}
              </p>

              <StartHere book={start()} />

              <BookIndex toc={toc().books} hash={location.hash} />
            </>
          )}
        </Show>
      </main>
      <FloatingDock active="home" />
      {/* Outside <main>: its reveal animation's transform would pin a fixed sheet to main, not the screen. */}
      <Show when={startOf(toc())}>
        {(start) => (
          <WelcomeSheet
            startHref={chapterHref({ slug: start().book.slug, number: start().chapters[0].number, locale: locale() })}
          />
        )}
      </Show>
    </>
  );
}

/** The first sentence of a story paragraph, without its citations. */
function firstSentence(text: string): string {
  const plain = text.replace(/\s*\([^)]*\)/g, "");
  return /^.*?[.!?](?=\s|$)/.exec(plain)?.[0] ?? plain;
}

function StartHere(props: { book: TocBook }) {
  const { locale, t } = useLocale();
  const ch = () => props.book.chapters[0];
  const lead = createMemo(async () => {
    const view = await getChapter(props.book.book.slug, ch().number, locale());
    const story = view ? findSection(view.sections, "story")?.paragraphs[0] : undefined;
    return story ? firstSentence(plainText(story)) : "";
  });

  return (
    <section aria-labelledby="bat-dau" class="kt-start mt-4 rounded-3xl bg-side p-5 sm:p-6">
      <p id="bat-dau" class="font-sans text-xs font-medium text-accent">
        {t().home.startReading(props.book.book.name, ch().number)}
      </p>
      <h2 class="kt-start-title mt-1 font-serif text-2xl leading-snug font-semibold text-ink sm:text-[1.6rem]">
        {ch().title}
      </h2>
      <p class="mt-2 text-base leading-relaxed text-ink/90">{lead()}</p>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 font-sans text-sm">
        <a
          href={chapterHref({ slug: props.book.book.slug, number: ch().number, locale: locale() })}
          class="kt-start-cta inline-flex min-h-10 items-center font-medium text-accent underline-offset-4 hover:underline"
        >
          {t().home.readThisChapter}
        </a>
        <div class="flex items-center gap-3 text-xs text-muted">
          <a href={moodsHref(locale())} class="hover:text-accent">
            {t().home.moodsLink}
          </a>
          <span aria-hidden="true">·</span>
          <a href={ebookHref(locale())} class="hover:text-accent">
            {t().home.ebookLink}
          </a>
        </div>
      </div>
    </section>
  );
}

/** The books as small tiles under their group; a tile opens its chapters just below its row, one book at a time. */
export function BookIndex(props: { toc: TocBook[]; hash: string }) {
  const { t } = useLocale();
  const [testament, setTestament] = createSignal<TestamentFilter>("tat-ca");
  const [mode, setMode] = createSignal<ChapterViewMode>("dots");
  const [open, setOpen] = createSignal<string | null>(null);
  const groups = createMemo(() => groupBooks(props.toc));
  const countOf = (tm: TestamentFilter) => props.toc.filter((b) => testamentOf(b.book) === tm).length;

  // The chapter page's "Mục lục" links to /#<book>: open that book.
  createEffect(
    () => decodeURIComponent(props.hash.slice(1)),
    (slug) => {
      if (!props.toc.some((b) => b.book.slug === slug)) return;
      setOpen(slug);
      document.getElementById(slug)?.scrollIntoView({ block: "start" });
    },
  );

  return (
    <nav aria-labelledby="cac-sach" class="kt-books mt-8">
      <div class="flex flex-wrap items-center justify-between gap-2.5">
        <h2 id="cac-sach" class="font-display text-lg font-normal text-ink">
          {t().home.booksHeading}
        </h2>
        <div
          role="group"
          aria-label={t().home.chooseTestamentLabel}
          class="inline-flex rounded-full border border-rule bg-card p-0.5 font-sans text-xs"
        >
          <For
            each={[
              ["tat-ca", t().home.filterAll],
              ["cu-uoc", t().home.filterOld(countOf("cu-uoc"))],
              ["tan-uoc", t().home.filterNew(countOf("tan-uoc"))],
            ] as const}
          >
            {(f) => (
              <button
                type="button"
                aria-pressed={ariaState(testament() === f[0])}
                onClick={() => setTestament(f[0])}
                class="min-h-8 cursor-pointer rounded-full px-3 text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
              >
                {f[1]}
              </button>
            )}
          </For>
        </div>
      </div>

      <For each={groups()}>
        {(g) => (
          <section
            hidden={testament() !== "tat-ca" && testamentOf(g.entries[0].book) !== testament()}
            aria-labelledby={`nhom-${g.id}`}
            class="mt-6"
          >
            <h3 id={`nhom-${g.id}`} class="mb-2 font-sans text-xs font-semibold tracking-widest text-muted uppercase">
              {t().home.bookGroups[g.id]}
            </h3>
            {/* Dense flow: tiles after an open panel fill the rest of its row, so the panel sits under the row. */}
            <div class="grid grid-flow-row-dense grid-cols-2 gap-2 sm:grid-cols-3">
              <For each={g.entries}>
                {(entry) => (
                  <BookTile
                    entry={entry}
                    open={open() === entry.book.slug}
                    mode={mode()}
                    onToggle={() => setOpen(open() === entry.book.slug ? null : entry.book.slug)}
                    onMode={setMode}
                  />
                )}
              </For>
            </div>
          </section>
        )}
      </For>
    </nav>
  );
}

function BookTile(props: {
  entry: TocBook;
  open: boolean;
  mode: ChapterViewMode;
  onToggle: () => void;
  onMode: (m: ChapterViewMode) => void;
}) {
  const { hydrated, bookSummary } = useHistory();
  const { t } = useLocale();
  const slug = () => props.entry.book.slug;
  const total = () => props.entry.chapters.length;
  const readCount = () => (hydrated() ? (bookSummary(slug())?.read ?? 0) : 0);

  return (
    <>
      <button
        id={slug()}
        type="button"
        aria-expanded={ariaState(props.open)}
        aria-controls={`${slug()}-doan`}
        onClick={() => props.onToggle()}
        class="kt-books-link flex min-h-[4.25rem] scroll-mt-20 cursor-pointer flex-col justify-between gap-2 rounded-2xl border border-rule bg-card px-3 py-2.5 text-left transition-colors hover:border-accent aria-expanded:border-accent aria-expanded:bg-side"
      >
        <span class="font-serif text-[15px] leading-snug text-ink">{props.entry.book.name}</span>
        <span class="flex items-center gap-2">
          <span aria-hidden="true" class="block h-[3px] flex-1 overflow-hidden rounded-full bg-rule">
            <span
              class="block h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${total() > 0 ? Math.round((readCount() / total()) * 100) : 0}%` }}
            />
          </span>
          <span class={["shrink-0 font-sans text-xs", readCount() > 0 ? "font-medium text-accent" : "text-muted"]}>
            {readCount() > 0 ? `${readCount()}/${total()}` : t().home.chaptersCount(total())}
          </span>
        </span>
      </button>
      <ChapterPanel entry={props.entry} hidden={!props.open} mode={props.mode} onMode={props.onMode} onClose={props.onToggle} />
    </>
  );
}

function ChapterPanel(props: {
  entry: TocBook;
  hidden: boolean;
  mode: ChapterViewMode;
  onMode: (m: ChapterViewMode) => void;
  onClose: () => void;
}) {
  const { hydrated, progressFor } = useHistory();
  const { locale, t } = useLocale();
  const slug = () => props.entry.book.slug;

  return (
    <section
      id={`${slug()}-doan`}
      hidden={props.hidden}
      aria-labelledby={`${slug()}-ten`}
      class="kt-book col-span-full rounded-2xl border border-rule bg-card p-4"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h4 id={`${slug()}-ten`} class="kt-book-name font-display text-lg font-normal text-ink">
          {props.entry.book.name}
        </h4>
        <div class="flex items-center gap-1.5 font-sans">
          <div
            role="group"
            aria-label={t().home.chapterDisplayLabel}
            class="inline-flex rounded-full border border-rule bg-paper p-0.5 text-xs"
          >
            <button
              type="button"
              aria-pressed={ariaState(props.mode === "dots")}
              onClick={() => props.onMode("dots")}
              class="min-h-8 cursor-pointer rounded-full px-3 text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
            >
              {t().home.viewDots}
            </button>
            <button
              type="button"
              aria-pressed={ariaState(props.mode === "list")}
              onClick={() => props.onMode("list")}
              class="min-h-8 cursor-pointer rounded-full px-3 text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
            >
              {t().home.viewTitles}
            </button>
          </div>
          <button
            type="button"
            aria-label={t().home.closeBook}
            onClick={() => props.onClose()}
            class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-side hover:text-ink"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>

      {/* Only an open book's chapters render: all 66 lists made up two thirds of the home page's HTML. */}
      <Show when={!props.hidden}>
        <ol
          class={[
            "kt-chapter-list mt-3",
            props.mode === "dots"
              ? "grid grid-cols-[repeat(auto-fill,minmax(2.35rem,1fr))] gap-1.5"
              : "space-y-1.5",
          ]}
        >
          <For each={props.entry.chapters}>
            {(ch) => {
              const prog = () =>
                hydrated() ? progressFor("chapter", chapterItemKey(slug(), ch.number)) : undefined;
              const state = () => (prog()?.completed ? "ok" : prog() ? "seen" : "none");
              return (
                <li>
                  <a
                    href={chapterHref({ slug: slug(), number: ch.number, locale: locale() })}
                    title={t().home.chapterTitleAttr(
                      ch.number,
                      ch.title,
                      prog() ? formatShortDate(prog()!.lastReadAt, locale()) : undefined,
                    )}
                    aria-label={t().home.chapterAriaLabel(ch.number, ch.title)}
                    class={
                      props.mode === "dots"
                        ? [
                            "flex aspect-square items-center justify-center rounded-full font-sans text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                            state() === "ok"
                              ? "border border-accent bg-accent font-medium text-paper"
                              : state() === "seen"
                                ? "border-[1.5px] border-accent bg-side font-medium text-accent"
                                : "border border-rule text-muted hover:border-accent hover:text-accent",
                          ]
                        : "group flex items-baseline gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-side"
                    }
                  >
                    <Show
                      when={props.mode === "dots"}
                      fallback={
                        <>
                          <span
                            class={[
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-sans text-[11px]",
                              state() === "ok"
                                ? "bg-accent font-medium text-paper"
                                : state() === "seen"
                                  ? "border border-accent bg-side font-medium text-accent"
                                  : "border border-rule text-muted",
                            ]}
                          >
                            {ch.number}
                          </span>
                          <span class="leading-snug text-ink group-hover:text-accent">
                            {ch.title}
                            <Show when={prog()}>
                              {(p) => (
                                <span class="ml-1.5 font-sans text-[11px] text-accent">
                                  {p().completed ? "✓" : t().home.seenBadge}
                                </span>
                              )}
                            </Show>
                          </span>
                        </>
                      }
                    >
                      {ch.number}
                    </Show>
                  </a>
                </li>
              );
            }}
          </For>
        </ol>

        <p class="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-sans text-xs text-muted">
          <span class="inline-flex items-center gap-1.5">
            <i aria-hidden="true" class="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            {t().home.legendCompleted}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <i aria-hidden="true" class="inline-block h-2.5 w-2.5 rounded-full border-[1.5px] border-accent bg-side" />
            {t().home.legendSeen}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <i aria-hidden="true" class="inline-block h-2.5 w-2.5 rounded-full border border-rule" />
            {t().home.legendUnread}
          </span>
        </p>
      </Show>
    </section>
  );
}
