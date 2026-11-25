import { createEffect, createMemo, Show } from "solid-js";
import type { ChapterView } from "../../lib/content";
import { formatDateTime } from "../../lib/history/types";
import { chapterHref } from "../router";
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
 * Thanh trạng thái đọc cuối phần Câu chuyện:
 * cho biết ngày giờ đã xem, nút đánh dấu "Đã đọc xong" và lối tắt sang đoạn kế tiếp / lịch sử.
 */
export function ChapterProgressBar(props: { view: ChapterView }) {
  const { ready, user, progressFor, toggleCompleted } = useUser();

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
      <div class="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rule bg-card px-4 py-3 font-sans text-sm">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={handleToggle}
            aria-pressed={completed() ? "true" : "false"}
            class={[
              "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              completed()
                ? "border-cao/40 bg-cao/10 text-cao"
                : "border-rule bg-paper/60 text-ink hover:border-accent hover:text-accent",
            ]}
          >
            <span>{completed() ? "✓ Đã đọc xong đoạn này" : "Đánh dấu đã đọc xong"}</span>
          </button>

          <Show when={entry()}>
            {(e) => (
              <span class="text-xs text-muted">
                Đã xem {e().readCount > 1 ? `${e().readCount} lần · ` : ""}
                {formatDateTime(e().lastReadAt)}
              </span>
            )}
          </Show>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-xs">
          <Show when={props.view.next}>
            {(n) => (
              <a
                href={chapterHref({ slug: n().book.slug, number: n().number })}
                class="font-semibold text-accent underline-offset-4 hover:underline"
              >
                Đọc tiếp: {n().book.name} {n().number} →
              </a>
            )}
          </Show>
          <a href="/lich-su" class="text-muted underline-offset-4 hover:text-accent hover:underline">
            Lịch sử
          </a>
          <Show when={!user()}>
            <a
              href={`/tai-khoan?next=${encodeURIComponent(chapterHref({ slug: props.view.book.slug, number: props.view.number }))}`}
              class="text-muted underline-offset-4 hover:text-accent hover:underline"
            >
              Đăng nhập lưu đám mây
            </a>
          </Show>
        </div>
      </div>
    </Show>
  );
}
