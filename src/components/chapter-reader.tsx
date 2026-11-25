import type { JSX } from "@solidjs/web";
import { createMemo, createSignal, For, Show } from "solid-js";
import type { ChapterView, Inline, Opinion, Section, SectionKey } from "../../lib/content";
import { findSection, plainText } from "../../lib/content/note";
import { verseLabel } from "../../lib/content/refs";
import type { ReadingScale } from "../lib/preferences";
import { chapterHref } from "../router";
import { InlineText } from "./inline";
import { InlineVersesContext, type VerseRange } from "./inline-verses";
import { useLocale } from "./locale-context";
import { ChapterProgressBar, ChapterVisitRecorder } from "./reading-tracker";
import { VerseText } from "./verse-text";

export type { ReadingScale };

const SCALE_CLASS: Record<ReadingScale, string> = {
  sm: "text-[1.08rem] leading-[1.85]",
  md: "text-[1.22rem] leading-[1.9]",
  lg: "text-[1.38rem] leading-[1.95]",
};

const LEVEL_CLASS = {
  cao: "bg-cao/12 text-cao",
  vua: "bg-vua/12 text-vua",
  thap: "bg-thap/12 text-thap",
} as const;

function estimateMinutes(section: Section | undefined): number {
  if (!section) return 2;
  const words = section.paragraphs.reduce((sum, p) => sum + plainText(p).split(/\s+/u).length, 0);
  return Math.max(1, Math.round(words / 180));
}

function OpinionCard(props: { opinion: Opinion }) {
  const { t } = useLocale();
  return (
    <article class="kt-opinion rounded-2xl border border-rule bg-paper/50 p-4">
      <p>
        <InlineText nodes={props.opinion.body} />
      </p>
      <p class="mt-2.5 flex flex-wrap items-center gap-2 font-sans text-xs">
        <span class={["rounded-full px-2.5 py-0.5 font-medium", LEVEL_CLASS[props.opinion.level]]}>
          {t().chapter.confidencePrefix} {t().chapter.confidence[props.opinion.level]}
        </span>
        <span class="text-muted">{props.opinion.reason}</span>
      </p>
    </article>
  );
}

/** One paragraph of Story. Its citations into this chapter open the verses right below it. */
function StoryParagraph(props: { nodes: Inline[]; view: ChapterView; dropCap: boolean }) {
  const { t } = useLocale();
  const [shown, setShown] = createSignal<VerseRange | null>(null);
  const verses = () => {
    const r = shown();
    if (!r) return [];
    return props.view.verses.filter((v) => v.number >= r.from && v.number <= r.to);
  };
  const inline = {
    get bookCode() {
      return props.view.book.code;
    },
    get chapter() {
      return props.view.number;
    },
    shown,
    toggle: (r: VerseRange) => setShown((s) => (s?.from === r.from && s.to === r.to ? null : r)),
  };

  return (
    <InlineVersesContext value={inline}>
      <p
        class={{
          "first-letter:float-left first-letter:mt-1 first-letter:mr-2.5 first-letter:font-display first-letter:text-[4rem] first-letter:leading-[0.9] first-letter:font-light first-letter:text-accent":
            props.dropCap,
        }}
      >
        <InlineText nodes={props.nodes} />
      </p>
      <Show when={verses().length > 0}>
        <div class="kt-inline-verses mt-3 rounded-2xl border border-rule bg-card px-5 py-4 text-[1.06rem] leading-[1.8]">
          <p class="mb-1.5 font-sans text-xs font-medium text-accent">
            {t().chapter.inlineScriptureHeading(
              props.view.book.name,
              verseLabel({ chapter: props.view.number, verses: verses() }),
            )}
          </p>
          <p>
            <VerseText verses={verses()} />
          </p>
        </div>
      </Show>
    </InlineVersesContext>
  );
}

function Prose(props: { section: Section | undefined }) {
  return (
    <For each={props.section?.paragraphs ?? []}>
      {(p) => (
        <p>
          <InlineText nodes={p} />
        </p>
      )}
    </For>
  );
}

type Fold = { id: string; label: string; body: () => JSX.Element };

/**
 * Quiet chapter reader: focused single column (38rem), spacious typography,
 * Key Takeaways with sage accent border below the Story, deeper sections folded in rounded cards.
 */
export function ChapterReader(props: { view: ChapterView; scale?: ReadingScale }) {
  const { locale, t } = useLocale();
  const section = (key: SectionKey) => findSection(props.view.sections, key);
  const written = (key: SectionKey) => (section(key)?.paragraphs.length ?? 0) > 0;
  const prose = (id: string, key: SectionKey, fallbackLabel: string): Fold[] =>
    written(key)
      ? [{ id, label: section(key)?.heading ?? fallbackLabel, body: () => <Prose section={section(key)} /> }]
      : [];

  const minutes = createMemo(() => estimateMinutes(section("story")));

  const folds = createMemo((): Fold[] => {
    const ch = props.view;
    const msg = t().chapter;
    const opinions: Fold[] =
      ch.opinions.length === 0
        ? []
        : [
            {
              id: "giai-kinh",
              label: msg.commentatorsHeading(ch.opinions.length),
              body: () => <For each={ch.opinions}>{(o) => <OpinionCard opinion={o} />}</For>,
            },
          ];
    return [
      ...prose("y-nghia", "meaning", msg.deeperMeaning),
      ...prose("luu-y", "notes", msg.notesAndNuances),
      ...opinions,
      {
        id: "nguyen-van",
        label: msg.fullTextHeading(ch.verses.length),
        body: () => (
          <p class="leading-[1.85]">
            <VerseText verses={ch.verses} />
          </p>
        ),
      },
    ];
  });

  return (
    <div class="kt-reader mx-auto w-full max-w-[38rem] flex-1 px-5 pt-6 pb-16 sm:pt-9">
      <article class="kt-chapter min-w-0">
        <div class="animate-reveal motion-reduce:animate-none">
          <p class="kt-kicker font-sans text-xs font-medium text-accent">
            {t().chapter.kicker(props.view.book.name, props.view.number)}
          </p>
          <h1 class="kt-title mt-1.5 font-display text-3xl leading-[1.16] font-light tracking-tight text-balance text-ink sm:text-[2.45rem]">
            {props.view.title}
          </h1>
          <p class="kt-lead mt-2.5 font-sans text-xs text-muted">
            {t().chapter.lead(props.view.verses.length, minutes())}
          </p>

          <section
            id="cau-chuyen"
            aria-label={t().chapter.storyAriaLabel}
            class={["kt-scripture mt-8 scroll-mt-16 space-y-6", SCALE_CLASS[props.scale ?? "md"]]}
          >
            <For each={section("story")?.paragraphs ?? []}>
              {(p, i) => (
                <div>
                  <StoryParagraph nodes={p} view={props.view} dropCap={i() === 0} />
                </div>
              )}
            </For>
          </section>
        </div>

        <Show when={written("takeaways")}>
          <section
            aria-labelledby="dieu-can-nho"
            class="kt-aside my-9 border-l-[3px] border-accent py-1 pl-5"
          >
            <h2 id="dieu-can-nho" class="font-sans text-sm font-medium text-accent">
              {t().chapter.keyTakeaways}
            </h2>
            <div class="mt-2.5 space-y-3 text-[1.06rem] leading-[1.75] text-ink">
              <Prose section={section("takeaways")} />
            </div>
          </section>
        </Show>

        <div class="kt-notes mt-8 space-y-2">
          <For each={folds()}>
            {(f) => (
              <details
                id={f.id}
                class="kt-note group scroll-mt-16 rounded-2xl border border-rule bg-card px-4 sm:px-5"
              >
                <summary class="kt-note-heading flex min-h-14 cursor-pointer items-center justify-between gap-4 font-sans text-[15px] font-normal text-ink [&::-webkit-details-marker]:hidden">
                  <span>{f.label}</span>
                  <span
                    aria-hidden="true"
                    class="h-2 w-2 shrink-0 rotate-45 border-r-[1.5px] border-b-[1.5px] border-muted transition-transform duration-200 group-open:-rotate-135"
                  />
                </summary>
                <div class="kt-note-body space-y-4 pb-5 text-[1.06rem] leading-[1.8]">{f.body()}</div>
              </details>
            )}
          </For>
        </div>

        <nav
          aria-label={t().chapter.bottomNavLabel}
          class="kt-chapter-nav mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6 font-sans text-sm"
        >
          <Show when={props.view.prev} fallback={<span />}>
            {(prev) => (
              <a
                href={chapterHref({ slug: prev().book.slug, number: prev().number, locale: locale() })}
                class="inline-flex min-h-11 items-center rounded-full border border-rule bg-card px-4 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                ← {prev().book.name} {prev().number}
              </a>
            )}
          </Show>
          <Show when={props.view.next}>
            {(next) => (
              <a
                href={chapterHref({ slug: next().book.slug, number: next().number, locale: locale() })}
                class="inline-flex min-h-11 items-center rounded-full bg-side px-4 font-medium text-accent transition-colors hover:bg-accent hover:text-paper"
              >
                {next().book.name} {next().number} →
              </a>
            )}
          </Show>
        </nav>

        <p class="kt-byline mt-6 font-sans text-xs leading-relaxed text-muted">{t().aiNotice}</p>
      </article>

      <ChapterVisitRecorder view={props.view} />
      <ChapterProgressBar view={props.view} />
    </div>
  );
}
