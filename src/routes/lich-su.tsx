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

const KICKER = "font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase";
const TAB =
  "inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-rule bg-card px-3.5 font-sans text-sm transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper";

/** Trang lịch sử đọc: xem tiếp đoạn gần nhất, thống kê tiến độ, và nhật ký từng ngày tháng năm. */
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

      <main class="mx-auto w-full max-w-4xl animate-reveal px-4 pt-7 pb-20 sm:px-6 sm:pt-10 motion-reduce:animate-none">
        <header class="border-b border-rule pb-6">
          <p class={`${KICKER} text-accent`}>Nhật ký đọc Kinh Thánh</p>
          <div class="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 class="font-display text-4xl leading-tight font-extrabold sm:text-5xl">Lịch sử đã xem</h1>
              <p class="mt-2 max-w-2xl text-base text-muted">
                Theo dõi từng ngày tháng năm bạn đã đọc đoạn nào, đánh dấu đoạn đã đọc xong và quay lại xem tiếp ngay.
              </p>
            </div>
            <Show when={ready() && user()}>
              <button
                type="button"
                onClick={() => void refreshHistory()}
                class="min-h-10 cursor-pointer rounded-lg border border-rule bg-card px-3.5 font-sans text-xs font-medium text-muted transition-colors hover:border-accent hover:text-ink"
              >
                {historyLoading() ? "Đang đồng bộ…" : "Làm mới đồng bộ"}
              </button>
            </Show>
          </div>
        </header>

        <Show when={ready() && !user()}>
          <div class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rule bg-side/70 px-4 py-3.5 font-sans text-sm">
            <p class="text-muted">
              Lịch sử hiện đang lưu tạm trên trình duyệt này.{" "}
              <strong class="font-medium text-ink">Đăng nhập</strong> để lưu lâu dài và xem tiếp trên điện thoại, máy
              tính khác.
            </p>
            <a
              href="/tai-khoan?next=/lich-su"
              class="inline-flex min-h-10 shrink-0 items-center rounded-lg bg-ink px-4 text-xs font-semibold text-paper transition-colors hover:bg-accent"
            >
              Đăng nhập / Tạo tài khoản
            </a>
          </div>
        </Show>

        <Show when={syncError()}>
          {(err) => (
            <p
              role="alert"
              class="mt-4 rounded-xl border border-thap/40 bg-thap/10 px-4 py-3 font-sans text-sm text-thap"
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
                class="mt-6 rounded-2xl border border-accent/35 bg-card p-5 sm:p-6"
              >
                <div class="flex flex-wrap items-center justify-between gap-2 font-sans text-xs">
                  <h2 id="tiep-tuc-doc" class="font-semibold tracking-[0.14em] text-accent uppercase">
                    Xem tiếp · {formatDateTime(latest().lastReadAt)}
                  </h2>
                  <Show when={latest().completed}>
                    <span class="rounded-full bg-cao/10 px-2.5 py-0.5 font-medium text-cao">✓ Đã đọc xong</span>
                  </Show>
                </div>
                <p class="mt-2 font-sans text-sm text-muted">{latest().subtitle}</p>
                <p class="mt-0.5 font-display text-2xl font-semibold sm:text-3xl">{latest().title}</p>
                <div class="mt-4 flex flex-wrap gap-2.5 font-sans text-sm">
                  <a
                    href={chapterHref({ slug: latest().bookSlug ?? "", number: latest().chapter ?? 1 })}
                    class="inline-flex min-h-11 items-center rounded-xl bg-ink px-5 font-semibold text-paper transition-colors hover:bg-accent"
                  >
                    {latest().completed ? "Đọc lại đoạn này" : "Xem tiếp đoạn này"}
                  </a>
                  <Show when={nextChapter()}>
                    {(next) => (
                      <a
                        href={next().href}
                        title={next().title}
                        class="inline-flex min-h-11 items-center rounded-xl border border-rule bg-paper/60 px-4 font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                      >
                        Sang đoạn kế: {next().label} →
                      </a>
                    )}
                  </Show>
                </div>
              </section>
            )}
          </Show>

          <section aria-label="Thống kê tiến độ đọc" class="mt-6 grid grid-cols-2 gap-3 font-sans sm:grid-cols-4">
            <div class="rounded-xl border border-rule bg-card p-4">
              <p class="text-xs text-muted">Đoạn đã xem</p>
              <p class="mt-1 font-display text-2xl font-semibold text-ink">
                {stats().chaptersRead}
                <span class="font-sans text-xs font-normal text-muted"> / 1.189</span>
              </p>
            </div>
            <div class="rounded-xl border border-rule bg-card p-4">
              <p class="text-xs text-muted">Đã đọc xong</p>
              <p class="mt-1 font-display text-2xl font-semibold text-cao">{stats().chaptersCompleted}</p>
            </div>
            <div class="rounded-xl border border-rule bg-card p-4">
              <p class="text-xs text-muted">Sách đã mở</p>
              <p class="mt-1 font-display text-2xl font-semibold text-ink">
                {stats().booksOpened}
                <span class="font-sans text-xs font-normal text-muted"> / 66</span>
              </p>
            </div>
            <div class="rounded-xl border border-rule bg-card p-4">
              <p class="text-xs text-muted">Chuỗi ngày đọc</p>
              <p class="mt-1 font-display text-2xl font-semibold text-accent">
                {stats().streak}
                <span class="font-sans text-xs font-normal text-muted"> ngày</span>
              </p>
            </div>
          </section>

          <div class="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label="Lọc lịch sử đọc" class="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={ariaState(tab() === "tat-ca")}
                onClick={() => setTab("tat-ca")}
                class={TAB}
              >
                <span>Tất cả</span>
                <span class="text-xs opacity-75">{logs().length}</span>
              </button>
              <button
                type="button"
                aria-pressed={ariaState(tab() === "chapter")}
                onClick={() => setTab("chapter")}
                class={TAB}
              >
                <span>Kinh Thánh</span>
                <span class="text-xs opacity-75">{logs().filter((l) => l.kind === "chapter").length}</span>
              </button>
              <button
                type="button"
                aria-pressed={ariaState(tab() === "mood")}
                onClick={() => setTab("mood")}
                class={TAB}
              >
                <span>Theo cảm xúc</span>
                <span class="text-xs opacity-75">{logs().filter((l) => l.kind === "mood").length}</span>
              </button>
              <button
                type="button"
                aria-pressed={ariaState(tab() === "completed")}
                onClick={() => setTab("completed")}
                class={TAB}
              >
                <span>Đã đọc xong</span>
                <span class="text-xs opacity-75">{completedList().length}</span>
              </button>
            </div>

            <Show when={logs().length > 0 || progress().length > 0}>
              <Show
                when={confirmClear()}
                fallback={
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    class="min-h-10 cursor-pointer rounded-lg px-3 font-sans text-xs text-muted hover:text-thap"
                  >
                    Xóa toàn bộ lịch sử
                  </button>
                }
              >
                <div class="flex items-center gap-2 font-sans text-xs">
                  <span class="text-muted">Chắc chắn xóa hết?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmClear(false);
                      void clearAllHistory();
                    }}
                    class="min-h-9 cursor-pointer rounded-lg bg-thap px-3 font-semibold text-paper"
                  >
                    Xóa hết
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    class="min-h-9 cursor-pointer rounded-lg border border-rule px-3 text-muted hover:text-ink"
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
              <div class="mt-8 rounded-2xl border border-rule bg-card p-8 text-center font-sans">
                <p class="text-lg font-medium text-ink">
                  {logs().length === 0 ? "Chưa có lịch sử đọc nào." : "Không có mục nào trong bộ lọc này."}
                </p>
                <p class="mt-2 text-sm text-muted">
                  Khi bạn mở một đoạn Kinh Thánh hoặc một chủ đề cảm xúc, trang sẽ tự động lưu lại ngày giờ và tiến độ
                  để bạn quay lại xem tiếp.
                </p>
                <div class="mt-5 flex flex-wrap justify-center gap-3 text-sm">
                  <a
                    href="/sang-the-ky/1"
                    class="inline-flex min-h-11 items-center rounded-xl bg-ink px-5 font-semibold text-paper hover:bg-accent"
                  >
                    Đọc Sáng-thế Ký 1
                  </a>
                  <a
                    href="/cam-xuc"
                    class="inline-flex min-h-11 items-center rounded-xl border border-rule bg-paper/60 px-5 font-medium hover:border-accent hover:text-accent"
                  >
                    Đọc theo cảm xúc
                  </a>
                </div>
              </div>
            }
          >
            <div class="mt-8 space-y-8">
              <For each={groupedLogs()}>
                {(group) => (
                  <section aria-labelledby={`ngay-${group.dateKey}`}>
                    <div class="flex items-baseline justify-between gap-2 border-b border-ink pb-2">
                      <h2 id={`ngay-${group.dateKey}`} class="font-display text-2xl font-semibold">
                        {group.label}
                      </h2>
                      <span class="font-sans text-xs text-muted">{group.items.length} mục đã xem</span>
                    </div>

                    <ul class="mt-4 space-y-3">
                      <For each={group.items}>
                        {(log) => {
                          const prog = () => progressFor(log.kind, log.itemKey);
                          const isCompleted = () => prog()?.completed ?? false;
                          return (
                            <li class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rule bg-card p-4 transition-colors hover:border-accent/60">
                              <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-sans text-xs text-muted">
                                  <span class="font-medium text-ink/80">{formatTime(log.readAt)}</span>
                                  <span aria-hidden="true">·</span>
                                  <span class="text-accent">
                                    {log.kind === "chapter" ? log.subtitle : `Cảm xúc · ${log.subtitle}`}
                                  </span>
                                  <Show when={isCompleted()}>
                                    <span class="rounded-full bg-cao/10 px-2 py-0.5 font-medium text-cao">
                                      ✓ Đã đọc xong
                                    </span>
                                  </Show>
                                </div>
                                <a
                                  href={itemHref(log)}
                                  class="mt-1 block font-serif text-lg leading-snug font-semibold hover:text-accent"
                                >
                                  {log.title}
                                </a>
                              </div>

                              <div class="flex flex-wrap items-center gap-2 font-sans text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleToggle(log)}
                                  title={isCompleted() ? "Bỏ đánh dấu đã đọc xong" : "Đánh dấu đã đọc xong"}
                                  class={[
                                    "inline-flex min-h-9 cursor-pointer items-center rounded-lg border px-3 font-medium transition-colors",
                                    isCompleted()
                                      ? "border-cao/40 bg-cao/10 text-cao"
                                      : "border-rule bg-paper/60 text-muted hover:border-accent hover:text-ink",
                                  ]}
                                >
                                  {isCompleted() ? "✓ Xong" : "Đánh dấu xong"}
                                </button>
                                <a
                                  href={itemHref(log)}
                                  class="inline-flex min-h-9 items-center rounded-lg bg-ink px-3.5 font-semibold text-paper transition-colors hover:bg-accent"
                                >
                                  Xem tiếp →
                                </a>
                                <button
                                  type="button"
                                  aria-label={`Xóa ${log.title} khỏi lịch sử ngày ${group.label}`}
                                  onClick={() => void deleteLog(log.id)}
                                  class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-base text-muted hover:bg-side hover:text-thap"
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
    </>
  );
}
