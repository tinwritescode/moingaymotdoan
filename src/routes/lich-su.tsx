import { Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { createMemo, createSignal, For, Show } from "solid-js";
import {
  formatDateTime,
  formatTime,
  groupLogsByDate,
  itemHref,
  type ReadingLog,
} from "../../lib/history/types";
import { ariaState } from "../components/aria";
import { findNextChapter } from "../components/continue-reading";
import { FloatingDock } from "../components/floating-dock";
import { ProgressRing, WeeklyDots } from "../components/progress-ring";
import { SiteHeader } from "../components/site-header";
import { useUser } from "../components/user-context";
import { getToc } from "../data";
import { chapterHref } from "../router";

export const route = {
  preload: () => {
    void getToc();
  },
} satisfies RouteDefinition;

type FilterTab = "tat-ca" | "chapter" | "mood" | "completed";

const TAB =
  "inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-rule bg-card px-3.5 font-sans text-xs transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-paper";

/** Trang lịch sử đọc phong cách Tĩnh Lặng: vòng tiến độ, 7 ngày gần nhất, nhật ký theo ngày tháng năm. */
export default function LichSuPage() {
  const toc = createMemo(() => getToc());
  const {
    user,
    ready,
    historyLoading,
    syncError,
    progress,
    logs,
    latestChapter,
    stats,
    progressFor,
    bookSummary,
    toggleCompleted,
    deleteLog,
    clearAllHistory,
    refreshHistory,
  } = useUser();

  const [tab, setTab] = createSignal<FilterTab>("tat-ca");
  const [confirmClear, setConfirmClear] = createSignal(false);

  const nextChapter = createMemo(() => {
    const latest = latestChapter();
    return latest ? findNextChapter(toc().books, latest.bookSlug, latest.chapter) : null;
  });

  const bookPercent = createMemo(() => {
    const latest = latestChapter();
    if (!latest?.bookSlug) return 0;
    const book = toc().books.find((b) => b.book.slug === latest.bookSlug);
    const total = book?.chapters.length ?? 0;
    if (total === 0) return 0;
    const read = bookSummary(latest.bookSlug)?.read ?? 1;
    return Math.min(100, Math.round((read / total) * 100));
  });

  const filteredLogs = createMemo(() => {
    const currentTab = tab();
    const list = logs();
    if (currentTab === "tat-ca") return list;
    if (currentTab === "chapter") return list.filter((l) => l.kind === "chapter");
    if (currentTab === "mood") return list.filter((l) => l.kind === "mood");
    return list.filter((l) => progressFor(l.kind, l.itemKey)?.completed);
  });

  const groupedLogs = createMemo(() => groupLogsByDate(filteredLogs()));

  const completedList = createMemo(() =>
    progress()
      .filter((p) => p.completed)
      .sort((a, b) => (b.completedAt ?? b.lastReadAt).localeCompare(a.completedAt ?? a.lastReadAt)),
  );

  const handleToggle = (log: ReadingLog) => {
    const isCompleted = progressFor(log.kind, log.itemKey)?.completed ?? false;
    void toggleCompleted({
      kind: log.kind,
      itemKey: log.itemKey,
      bookSlug: log.bookSlug,
      chapter: log.chapter,
      title: log.title,
      subtitle: log.subtitle,
      completed: !isCompleted,
    });
  };

  return (
    <>
      <Title>Lịch sử đọc — Kinh Thánh</Title>
      <SiteHeader section="lich-su" />

      <main class="mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
        <header class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="font-sans text-xs font-medium text-accent">Nhật ký đọc Kinh Thánh</p>
            <h1 class="mt-1 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
              Lịch sử đã xem
            </h1>
          </div>
          <Show when={ready() && user()}>
            <button
              type="button"
              onClick={() => void refreshHistory()}
              class="min-h-9 cursor-pointer rounded-full border border-rule bg-card px-3.5 font-sans text-xs text-muted transition-colors hover:border-accent hover:text-ink"
            >
              {historyLoading() ? "Đang đồng bộ…" : "Làm mới"}
            </button>
          </Show>
        </header>

        <Show when={ready() && !user()}>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-side px-4 py-3.5 font-sans text-xs">
            <p class="text-ink/85">
              Lịch sử đang lưu trên thiết bị này. <strong class="font-medium">Đăng nhập</strong> để đồng bộ đám mây.
            </p>
            <a
              href="/tai-khoan?next=/lich-su"
              class="inline-flex min-h-9 shrink-0 items-center rounded-full bg-accent px-4 font-medium text-paper hover:opacity-90"
            >
              Đăng nhập
            </a>
          </div>
        </Show>

        <Show when={syncError()}>
          {(err) => (
            <p
              role="alert"
              class="mt-4 rounded-2xl border border-thap/40 bg-thap/10 px-4 py-3 font-sans text-xs text-thap"
            >
              {err()}
            </p>
          )}
        </Show>

        <Show
          when={ready()}
          fallback={<p class="mt-8 font-sans text-sm text-muted">Đang tải lịch sử đọc của bạn…</p>}
        >
          <Show when={latestChapter()}>
            {(latest) => (
              <section
                aria-labelledby="tiep-tuc-doc"
                class="mt-5 grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-3xl border border-rule bg-card p-5"
              >
                <div class="relative h-[4.5rem] w-[4.5rem]">
                  <ProgressRing radius={30} percent={bookPercent()} />
                  <span class="absolute inset-0 grid place-items-center font-sans text-sm font-medium text-ink">
                    {bookPercent()}%
                  </span>
                </div>
                <div class="min-w-0">
                  <h2 id="tiep-tuc-doc" class="font-sans text-xs font-medium text-accent">
                    Xem tiếp · {formatDateTime(latest().lastReadAt)}
                  </h2>
                  <p class="mt-0.5 truncate font-display text-xl font-normal text-ink">{latest().subtitle}</p>
                  <p class="truncate text-sm text-muted">{latest().title}</p>
                </div>
                <div class="col-span-full flex flex-wrap gap-2 font-sans text-sm">
                  <a
                    href={chapterHref({ slug: latest().bookSlug ?? "", number: latest().chapter ?? 1 })}
                    class="inline-flex min-h-11 items-center rounded-full bg-accent px-5 font-medium text-paper transition-opacity hover:opacity-90"
                  >
                    {latest().completed ? "Đọc lại đoạn này" : "Tiếp tục đọc"}
                  </a>
                  <Show when={nextChapter()}>
                    {(next) => (
                      <a
                        href={next().href}
                        title={next().title}
                        class="inline-flex min-h-11 items-center rounded-full bg-side px-4 text-accent transition-colors hover:bg-accent hover:text-paper"
                      >
                        Đoạn kế: {next().label} →
                      </a>
                    )}
                  </Show>
                </div>
              </section>
            )}
          </Show>

          <section aria-label="Thống kê tiến độ đọc" class="mt-3 grid grid-cols-3 gap-2 font-sans">
            <div class="rounded-2xl border border-rule bg-card p-3.5">
              <strong class="block text-2xl leading-none font-light text-ink">{stats().chaptersRead}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">/ 1.189 đoạn</span>
            </div>
            <div class="rounded-2xl border border-rule bg-card p-3.5">
              <strong class="block text-2xl leading-none font-light text-ink">{stats().streak}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">ngày liên tiếp</span>
              <WeeklyDots logs={logs()} />
            </div>
            <div class="rounded-2xl border border-rule bg-card p-3.5">
              <strong class="block text-2xl leading-none font-light text-accent">{stats().chaptersCompleted}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">đã đọc xong</span>
            </div>
          </section>

          <div class="mt-6 flex flex-wrap items-center justify-between gap-2.5">
            <div role="group" aria-label="Lọc lịch sử đọc" class="flex flex-wrap gap-1.5">
              <button
                type="button"
                aria-pressed={ariaState(tab() === "tat-ca")}
                onClick={() => setTab("tat-ca")}
                class={TAB}
              >
                <span>Tất cả</span>
                <span class="opacity-75">{logs().length}</span>
              </button>
              <button
                type="button"
                aria-pressed={ariaState(tab() === "chapter")}
                onClick={() => setTab("chapter")}
                class={TAB}
              >
                <span>Kinh Thánh</span>
                <span class="opacity-75">{logs().filter((l) => l.kind === "chapter").length}</span>
              </button>
              <button
                type="button"
                aria-pressed={ariaState(tab() === "mood")}
                onClick={() => setTab("mood")}
                class={TAB}
              >
                <span>Cảm xúc</span>
                <span class="opacity-75">{logs().filter((l) => l.kind === "mood").length}</span>
              </button>
              <button
                type="button"
                aria-pressed={ariaState(tab() === "completed")}
                onClick={() => setTab("completed")}
                class={TAB}
              >
                <span>Đã xong</span>
                <span class="opacity-75">{completedList().length}</span>
              </button>
            </div>

            <Show when={logs().length > 0 || progress().length > 0}>
              <Show
                when={confirmClear()}
                fallback={
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    class="min-h-9 cursor-pointer rounded-full px-2.5 font-sans text-xs text-muted hover:text-thap"
                  >
                    Xóa hết
                  </button>
                }
              >
                <div class="flex items-center gap-1.5 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmClear(false);
                      void clearAllHistory();
                    }}
                    class="min-h-8 cursor-pointer rounded-full bg-thap px-3 font-medium text-paper"
                  >
                    Xác nhận xóa
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    class="min-h-8 cursor-pointer rounded-full border border-rule px-3 text-muted hover:text-ink"
                  >
                    Hủy
                  </button>
                </div>
              </Show>
            </Show>
          </div>

          <Show
            when={groupedLogs().length > 0}
            fallback={
              <div class="mt-7 rounded-3xl border border-rule bg-card p-8 text-center font-sans">
                <p class="text-base font-medium text-ink">
                  {logs().length === 0 ? "Chưa có lịch sử đọc nào." : "Không có mục nào trong bộ lọc này."}
                </p>
                <p class="mt-2 text-sm text-muted">
                  Khi bạn mở một đoạn Kinh Thánh hoặc chủ đề cảm xúc, trang sẽ tự lưu lại ngày giờ để bạn quay lại xem
                  tiếp.
                </p>
                <div class="mt-5 flex flex-wrap justify-center gap-2.5 text-sm">
                  <a
                    href="/sang-the-ky/1"
                    class="inline-flex min-h-11 items-center rounded-full bg-accent px-5 font-medium text-paper hover:opacity-90"
                  >
                    Đọc Sáng-thế Ký 1
                  </a>
                  <a
                    href="/cam-xuc"
                    class="inline-flex min-h-11 items-center rounded-full bg-side px-5 text-accent hover:bg-accent hover:text-paper"
                  >
                    Đọc theo cảm xúc
                  </a>
                </div>
              </div>
            }
          >
            <div class="mt-7 space-y-7">
              <For each={groupedLogs()}>
                {(group) => (
                  <section aria-labelledby={`ngay-${group.dateKey}`}>
                    <div class="flex items-baseline justify-between gap-2 pb-2">
                      <h2 id={`ngay-${group.dateKey}`} class="font-display text-base font-normal text-ink">
                        {group.label}
                      </h2>
                      <span class="font-sans text-xs text-muted">{group.items.length} mục</span>
                    </div>

                    <ul class="space-y-2">
                      <For each={group.items}>
                        {(log) => {
                          const prog = () => progressFor(log.kind, log.itemKey);
                          const isCompleted = () => prog()?.completed ?? false;
                          return (
                            <li class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rule bg-card p-4 transition-colors hover:border-accent/60">
                              <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-xs text-muted">
                                  <span>{formatTime(log.readAt)}</span>
                                  <span aria-hidden="true">·</span>
                                  <span class="text-accent">
                                    {log.kind === "chapter" ? log.subtitle : `Cảm xúc · ${log.subtitle}`}
                                  </span>
                                  <Show when={isCompleted()}>
                                    <span class="rounded-full bg-side px-2 py-0.5 font-medium text-accent">✓ Xong</span>
                                  </Show>
                                </div>
                                <a
                                  href={itemHref(log)}
                                  class="mt-1 block font-serif text-[17px] leading-snug font-semibold text-ink hover:text-accent"
                                >
                                  {log.title}
                                </a>
                              </div>

                              <div class="flex items-center gap-1.5 font-sans text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleToggle(log)}
                                  title={isCompleted() ? "Bỏ đánh dấu đã đọc xong" : "Đánh dấu đã đọc xong"}
                                  class={[
                                    "inline-flex min-h-9 cursor-pointer items-center rounded-full px-3 font-medium transition-colors",
                                    isCompleted()
                                      ? "bg-side text-accent"
                                      : "border border-rule bg-paper/50 text-muted hover:border-accent hover:text-ink",
                                  ]}
                                >
                                  {isCompleted() ? "✓ Xong" : "Đánh dấu"}
                                </button>
                                <a
                                  href={itemHref(log)}
                                  class="inline-flex min-h-9 items-center rounded-full bg-accent px-3.5 font-medium text-paper hover:opacity-90"
                                >
                                  Xem tiếp
                                </a>
                                <button
                                  type="button"
                                  aria-label={`Xóa ${log.title} khỏi lịch sử ngày ${group.label}`}
                                  onClick={() => void deleteLog(log.id)}
                                  class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-base text-muted hover:bg-side hover:text-thap"
                                >
                                  ×
                                </button>
                              </div>
                            </li>
                          );
                        }}
                      </For>
                    </ul>
                  </section>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </main>

      <FloatingDock active="lich-su" />
    </>
  );
}
