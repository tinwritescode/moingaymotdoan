import { createEffect, createMemo, createSignal, onSettled, Show } from "solid-js";
import type { ChapterView } from "../../lib/content";
import { canonicalBookSlug } from "../../lib/content/books";
import { chapterItemKey, localDateKey, moodItemKey, type VisitInput } from "../../lib/history/types";
import { chapterHref } from "../router";
import { DoneSheet } from "./done-sheet";
import { useHistory } from "./history-context";
import { useLocale } from "./locale-context";
import { ProgressRing } from "./progress-ring";

const VISIT_SETTLE_MS = 500;

/** Shared debounced visit recorder so chapter and mood trackers do not duplicate timer wiring. */
function VisitRecorder(props: { target: VisitInput | null }) {
  const { hydrated, recordVisit } = useHistory();
  const activeTarget = createMemo(() => (hydrated() ? props.target : null));

  createEffect(
    () => activeTarget(),
    (item) => {
      if (!item) return;
      const timer = setTimeout(() => {
        void recordVisit(item);
      }, VISIT_SETTLE_MS);
      return () => clearTimeout(timer);
    },
  );

  return null;
}

/** Automatically records a chapter reading visit after 500ms. */
export function ChapterVisitRecorder(props: { view: ChapterView }) {
  const target = createMemo<VisitInput>(() => {
    const v = props.view;
    const canonicalSlug = canonicalBookSlug(v.book.code) ?? v.book.slug;
    return {
      kind: "chapter",
      itemKey: chapterItemKey(canonicalSlug, v.number),
      bookSlug: canonicalSlug,
      chapter: v.number,
      title: v.title,
      subtitle: `${v.book.name} ${v.number}`,
    };
  });

  return <VisitRecorder target={target()} />;
}

/** Automatically records a mood guide visit after 500ms. */
export function MoodVisitRecorder(props: { slug: string; title: string; groupName: string }) {
  const target = createMemo<VisitInput>(() => ({
    kind: "mood",
    itemKey: moodItemKey(props.slug),
    bookSlug: null,
    chapter: null,
    title: props.title,
    subtitle: props.groupName,
  }));

  return <VisitRecorder target={target()} />;
}

/**
 * Floating bottom progress pill inside chapter reader:
 * prev/next arrows, live scroll progress ring, and "Mark complete" toggle.
 */
export function ChapterProgressBar(props: { view: ChapterView }) {
  const { hydrated, progress, progressFor, toggleCompleted } = useHistory();
  const { locale, t } = useLocale();
  const [scrollPct, setScrollPct] = createSignal(0);
  const [sheetOpen, setSheetOpen] = createSignal(false);

  onSettled(() => {
    const update = () => {
      const el = document.documentElement;
      const max = Math.max(1, el.scrollHeight - window.innerHeight);
      setScrollPct(Math.max(0, Math.min(100, Math.round((window.scrollY / max) * 100))));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  });

  const canonicalSlug = createMemo(() => canonicalBookSlug(props.view.book.code) ?? props.view.book.slug);
  const itemKey = createMemo(() => chapterItemKey(canonicalSlug(), props.view.number));
  const entry = createMemo(() => progressFor("chapter", itemKey()));
  const completed = createMemo(() => entry()?.completed ?? false);

  // The day's first completed đoạn opens the done sheet.
  const firstCompletionToday = () => {
    const today = localDateKey(new Date());
    return !progress().some((p) => p.completed && p.completedAt !== null && localDateKey(new Date(p.completedAt)) === today);
  };

  const handleToggle = () => {
    const v = props.view;
    const cSlug = canonicalSlug();
    if (!completed() && firstCompletionToday()) setSheetOpen(true);
    void toggleCompleted({
      kind: "chapter",
      itemKey: chapterItemKey(cSlug, v.number),
      bookSlug: cSlug,
      chapter: v.number,
      title: v.title,
      subtitle: `${v.book.name} ${v.number}`,
      completed: !completed(),
    });
  };

  return (
    <Show when={hydrated()}>
      <div
        role="region"
        aria-label={t().chapter.progressRegionLabel}
        class="fixed bottom-3.5 left-1/2 z-30 flex w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-rule bg-card/90 p-1.5 shadow-lg backdrop-blur-md font-sans"
      >
        <Show
          when={props.view.prev}
          fallback={
            <span
              aria-hidden="true"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm text-muted/40"
            >
              ←
            </span>
          }
        >
          {(prev) => (
            <a
              href={chapterHref({ slug: prev().book.slug, number: prev().number, locale: locale() })}
              aria-label={t().chapter.prevChapterAria(prev().book.name, prev().number)}
              title={`${prev().book.name} ${prev().number} — ${prev().title}`}
              class="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm text-muted transition-colors hover:bg-side hover:text-accent"
            >
              ←
            </a>
          )}
        </Show>

        <div class="flex items-center gap-2 pl-0.5">
          <div class="h-7 w-7 shrink-0">
            <ProgressRing radius={11} percent={completed() ? 100 : scrollPct()} strokeWidth={3} />
          </div>
          <span class="min-w-[2.25rem] text-xs text-muted">{completed() ? "100%" : `${scrollPct()}%`}</span>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={completed() ? "true" : "false"}
          class={[
            "inline-flex min-h-10 cursor-pointer items-center rounded-full px-4 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-[13px]",
            completed() ? "bg-side text-accent" : "bg-accent text-paper hover:opacity-90",
          ]}
        >
          {completed() ? t().chapter.completedLabel : t().chapter.markCompleteLabel}
        </button>

        <Show
          when={props.view.next}
          fallback={
            <span
              aria-hidden="true"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm text-muted/40"
            >
              →
            </span>
          }
        >
          {(next) => (
            <a
              href={chapterHref({ slug: next().book.slug, number: next().number, locale: locale() })}
              aria-label={t().chapter.nextChapterAria(next().book.name, next().number)}
              title={`${next().book.name} ${next().number} — ${next().title}`}
              class="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm text-muted transition-colors hover:bg-side hover:text-accent"
            >
              →
            </a>
          )}
        </Show>
      </div>
      <DoneSheet open={sheetOpen()} onClose={() => setSheetOpen(false)} />
    </Show>
  );
}
