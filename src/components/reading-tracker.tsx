import { createEffect, createMemo, createSignal, onSettled, Show } from "solid-js";
import type { ChapterView } from "../../lib/content";
import { chapterHref } from "../router";
import { ProgressRing } from "./progress-ring";
import { useUser } from "./user-context";

/** Tự động ghi nhận lượt đọc một đoạn Kinh Thánh sau 500ms ổn định. */
export function ChapterVisitRecorder(props: { view: ChapterView }) {
  const { ready, recordVisit } = useUser();

  const target = createMemo(() => {
    if (!ready()) return null;
    const v = props.view;
    return {
      kind: "chapter" as const,
      itemKey: `${v.book.slug}/${v.number}`,
      bookSlug: v.book.slug,
      chapter: v.number,
      title: v.title,
      subtitle: `${v.book.name} ${v.number}`,
    };
  });

  createEffect(
    () => target(),
    (item) => {
      if (!item) return;
      const timer = setTimeout(() => {
        void recordVisit(item);
      }, 500);
      return () => clearTimeout(timer);
    },
  );

  return null;
}

/** Tự động ghi nhận lượt đọc một chuyên mục cảm xúc sau 500ms ổn định. */
export function MoodVisitRecorder(props: { slug: string; title: string; groupName: string }) {
  const { ready, recordVisit } = useUser();

  const target = createMemo(() => {
    if (!ready()) return null;
    return {
      kind: "mood" as const,
      itemKey: props.slug,
      bookSlug: null,
      chapter: null,
      title: props.title,
      subtitle: props.groupName,
    };
  });

  createEffect(
    () => target(),
    (item) => {
      if (!item) return;
      const timer = setTimeout(() => {
        void recordVisit(item);
      }, 500);
      return () => clearTimeout(timer);
    },
  );

  return null;
}

/**
 * Thanh nổi cuối màn hình đọc kiểu Tĩnh Lặng:
 * mũi tên đoạn trước/sau, vòng tiến độ cuộn theo thời gian thực và nút "Đánh dấu đã đọc xong".
 */
export function ChapterProgressBar(props: { view: ChapterView }) {
  const { ready, progressFor, toggleCompleted } = useUser();
  const [scrollPct, setScrollPct] = createSignal(0);

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

  const itemKey = createMemo(() => `${props.view.book.slug}/${props.view.number}`);
  const entry = createMemo(() => progressFor("chapter", itemKey()));
  const completed = createMemo(() => entry()?.completed ?? false);

  const handleToggle = () => {
    const v = props.view;
    void toggleCompleted({
      kind: "chapter",
      itemKey: `${v.book.slug}/${v.number}`,
      bookSlug: v.book.slug,
      chapter: v.number,
      title: v.title,
      subtitle: `${v.book.name} ${v.number}`,
      completed: !completed(),
    });
  };

  return (
    <Show when={ready()}>
      <div
        role="region"
        aria-label="Tiến độ đọc đoạn này"
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
              href={chapterHref({ slug: prev().book.slug, number: prev().number })}
              aria-label={`Đoạn trước: ${prev().book.name} ${prev().number}`}
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
          {completed() ? "✓ Đã đọc xong" : "Đánh dấu xong"}
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
              href={chapterHref({ slug: next().book.slug, number: next().number })}
              aria-label={`Đoạn kế: ${next().book.name} ${next().number}`}
              title={`${next().book.name} ${next().number} — ${next().title}`}
              class="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm text-muted transition-colors hover:bg-side hover:text-accent"
            >
              →
            </a>
          )}
        </Show>
      </div>
    </Show>
  );
}
