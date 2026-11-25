import { Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { createMemo, createSignal, For, onSettled, Show } from "solid-js";
import type { TocBook } from "../../lib/content";
import { testamentOf } from "../../lib/content/books";
import { plainText } from "../../lib/content/note";
import { formatShortDate } from "../../lib/history/types";
import { AI_NOTICE } from "../../lib/notice";
import { ariaState } from "../components/aria";
import { ContinueReading } from "../components/continue-reading";
import { FloatingDock } from "../components/floating-dock";
import { SiteHeader } from "../components/site-header";
import { useUser } from "../components/user-context";
import { getChapter, getToc, type Toc } from "../data";
import { chapterHref } from "../router";

/** Where Bắt đầu đọc points: the first book written, at its first đoạn. */
const startOf = (toc: Toc) => toc.books[0];

// The lead-in needs the mục lục to know which đoạn it quotes, so that read is chained here, not in the render.
export const route = {
  preload: () =>
    void getToc().then((toc) => {
      const start = startOf(toc);
      if (start) void getChapter(start.book.slug, start.chapters[0].number);
    }),
} satisfies RouteDefinition;

const WEEKDAYS_VI = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"] as const;

type TestamentFilter = "tat-ca" | "cu-uoc" | "tan-uoc";
type ChapterViewMode = "dots" | "list";

function timeGreeting(now: Date): { dateLine: string; headline: string } {
  const day = WEEKDAYS_VI[now.getDay()];
  const dateLine = `${day}, ${now.getDate()} tháng ${now.getMonth() + 1}`;
  const h = now.getHours();
  const headline = h < 12 ? "Chào buổi sáng." : h < 18 ? "Chào buổi chiều." : "Chào buổi tối.";
  return { dateLine, headline };
}

/** Trang chủ phong cách Tĩnh Lặng: một cột thoáng, lời chào nhẹ, Xem tiếp, tiến độ sách và lưới chấm đoạn. */
export default function MucLuc() {
  const toc = createMemo(() => getToc());
  const [greeting, setGreeting] = createSignal<{ dateLine: string; headline: string } | null>(null);
  const [testament, setTestament] = createSignal<TestamentFilter>("tat-ca");
  const [chapterMode, setChapterMode] = createSignal<ChapterViewMode>("dots");

  onSettled(() => {
    setGreeting(timeGreeting(new Date()));
  });

  const otCount = createMemo(() => toc().books.filter((b) => testamentOf(b.book) === "cu-uoc").length);
  const ntCount = createMemo(() => toc().books.filter((b) => testamentOf(b.book) === "tan-uoc").length);

  return (
    <>
      <Title>Kinh Thánh — ghi chú từng đoạn</Title>
      <SiteHeader />
      <main class="kt-home mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
        <header class="mb-5">
          <p class="font-sans text-[13px] text-muted">
            {greeting()?.dateLine ?? "Kinh Thánh Bản Truyền Thống · 66 sách · 1.189 đoạn"}
          </p>
          <h1 class="mt-0.5 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
            {greeting()?.headline ?? "Kinh Thánh bằng lời thường."}
          </h1>
          <p class="mt-1.5 text-[15px] text-muted">
            Mỗi đoạn Kinh Thánh kể lại bằng lời thường, kèm nguyên văn Bản Truyền Thống.
          </p>
        </header>

        <Show
          when={startOf(toc())}
          fallback={<p class="mt-8 text-muted">Chưa có đoạn nào. Mời bạn quay lại sau.</p>}
        >
          {(start) => (
            <>
              <ContinueReading toc={toc().books} />

              <p class="mt-4 rounded-2xl border border-rule bg-card/70 px-4 py-3 font-sans text-xs leading-relaxed text-muted">
                {AI_NOTICE}
              </p>

              <StartHere book={start()} />

              <BookIndex
                toc={toc().books}
                testament={testament()}
                otCount={otCount()}
                ntCount={ntCount()}
                onTestament={setTestament}
              />

              <div class="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-6 font-sans">
                <p class="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-muted">
                  <span class="inline-flex items-center gap-1.5">
                    <i aria-hidden="true" class="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
                    đã đọc xong
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <i
                      aria-hidden="true"
                      class="inline-block h-2.5 w-2.5 rounded-full border-[1.5px] border-accent bg-side"
                    />
                    đã xem
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <i aria-hidden="true" class="inline-block h-2.5 w-2.5 rounded-full border border-rule" />
                    chưa đọc
                  </span>
                </p>

                <div
                  role="group"
                  aria-label="Kiểu hiển thị các đoạn"
                  class="inline-flex rounded-full border border-rule bg-card p-0.5 text-xs"
                >
                  <button
                    type="button"
                    aria-pressed={ariaState(chapterMode() === "dots")}
                    onClick={() => setChapterMode("dots")}
                    class="min-h-8 cursor-pointer rounded-full px-3 text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
                  >
                    Lưới chấm
                  </button>
                  <button
                    type="button"
                    aria-pressed={ariaState(chapterMode() === "list")}
                    onClick={() => setChapterMode("list")}
                    class="min-h-8 cursor-pointer rounded-full px-3 text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
                  >
                    Tiêu đề
                  </button>
                </div>
              </div>

              <For each={toc().books}>
                {(b) => (
                  <BookSection
                    entry={b}
                    hidden={testament() !== "tat-ca" && testamentOf(b.book) !== testament()}
                    mode={chapterMode()}
                  />
                )}
              </For>
            </>
          )}
        </Show>
      </main>
      <FloatingDock active="home" />
    </>
  );
}

/** The first sentence of a story paragraph, without its chỗ dẫn. */
function firstSentence(text: string): string {
  const plain = text.replace(/\s*\([^)]*\)/g, "");
  return /^.*?[.!?](?=\s|$)/.exec(plain)?.[0] ?? plain;
}

function StartHere(props: { book: TocBook }) {
  const ch = () => props.book.chapters[0];
  // The lead-in under the title: the first sentence of that đoạn's Câu chuyện.
  const lead = createMemo(async () => {
    const view = await getChapter(props.book.book.slug, ch().number);
    const story = view?.sections.find((s) => s.heading === "Câu chuyện")?.paragraphs[0];
    return story ? firstSentence(plainText(story)) : "";
  });

  return (
    <section aria-labelledby="bat-dau" class="kt-start mt-4 rounded-3xl bg-side p-5 sm:p-6">
      <p id="bat-dau" class="font-sans text-xs font-medium text-accent">
        Bắt đầu đọc · {props.book.book.name} {ch().number}
      </p>
      <h2 class="kt-start-title mt-1 font-serif text-2xl leading-snug font-semibold text-ink sm:text-[1.6rem]">
        {ch().title}
      </h2>
      <p class="mt-2 text-base leading-relaxed text-ink/90">{lead()}</p>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 font-sans text-sm">
        <a
          href={chapterHref({ slug: props.book.book.slug, number: ch().number })}
          class="kt-start-cta inline-flex min-h-10 items-center font-medium text-accent underline-offset-4 hover:underline"
        >
          Đọc đoạn này →
        </a>
        <div class="flex items-center gap-3 text-xs text-muted">
          <a href="/cam-xuc" class="hover:text-accent">
            100 cảm xúc
          </a>
          <span aria-hidden="true">·</span>
          <a href="/ebook" class="hover:text-accent">
            Tải ebook
          </a>
        </div>
      </div>
    </section>
  );
}

function BookIndex(props: {
  toc: TocBook[];
  testament: TestamentFilter;
  otCount: number;
  ntCount: number;
  onTestament: (t: TestamentFilter) => void;
}) {
  const { ready, bookSummary } = useUser();

  return (
    <nav aria-labelledby="cac-sach" class="kt-books mt-8">
      <div class="flex flex-wrap items-center justify-between gap-2.5">
        <h2 id="cac-sach" class="font-display text-lg font-normal text-ink">
          Các sách
        </h2>
        <div
          role="group"
          aria-label="Chọn giao ước"
          class="inline-flex rounded-full border border-rule bg-card p-0.5 font-sans text-xs"
        >
          <button
            type="button"
            aria-pressed={ariaState(props.testament === "tat-ca")}
            onClick={() => props.onTestament("tat-ca")}
            class="min-h-8 cursor-pointer rounded-full px-3 text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
          >
            Tất cả
          </button>
          <button
            type="button"
            aria-pressed={ariaState(props.testament === "cu-uoc")}
            onClick={() => props.onTestament("cu-uoc")}
            class="min-h-8 cursor-pointer rounded-full px-3 text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
          >
            Cựu Ước · {props.otCount}
          </button>
          <button
            type="button"
            aria-pressed={ariaState(props.testament === "tan-uoc")}
            onClick={() => props.onTestament("tan-uoc")}
            class="min-h-8 cursor-pointer rounded-full px-3 text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
          >
            Tân Ước · {props.ntCount}
          </button>
        </div>
      </div>

      <ol class="mt-3 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
        <For each={props.toc}>
          {(t) => {
            const readCount = () => (ready() ? (bookSummary(t.book.slug)?.read ?? 0) : 0);
            const pct = () => (t.chapters.length > 0 ? Math.round((readCount() / t.chapters.length) * 100) : 0);
            return (
              <li
                hidden={props.testament !== "tat-ca" && testamentOf(t.book) !== props.testament}
                class="border-b border-rule py-2.5"
              >
                <a href={`#${t.book.slug}`} class="kt-books-link group block">
                  <div class="flex items-baseline justify-between gap-2">
                    <span class="font-serif text-[16.5px] text-ink transition-colors group-hover:text-accent">
                      {t.book.name}
                    </span>
                    <span
                      class={[
                        "shrink-0 font-sans text-xs",
                        readCount() > 0 ? "font-medium text-accent" : "text-muted",
                      ]}
                    >
                      {readCount() > 0 ? `${readCount()}/${t.chapters.length}` : `${t.chapters.length} đoạn`}
                    </span>
                  </div>
                  <span aria-hidden="true" class="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-rule">
                    <span
                      class="block h-full rounded-full bg-accent transition-[width] duration-300"
                      style={{ width: `${pct()}%` }}
                    />
                  </span>
                </a>
              </li>
            );
          }}
        </For>
      </ol>
    </nav>
  );
}

function BookSection(props: { entry: TocBook; hidden: boolean; mode: ChapterViewMode }) {
  const { ready, progressFor, bookSummary } = useUser();
  const readCount = () => (ready() ? (bookSummary(props.entry.book.slug)?.read ?? 0) : 0);

  return (
    <section
      id={props.entry.book.slug}
      hidden={props.hidden}
      aria-labelledby={`${props.entry.book.slug}-ten`}
      class="kt-book scroll-mt-20 pt-8"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <div class="flex flex-wrap items-baseline gap-2.5">
          <h2 id={`${props.entry.book.slug}-ten`} class="kt-book-name font-display text-lg font-normal text-ink">
            {props.entry.book.name}
          </h2>
          <span class="font-sans text-xs text-accent">
            {readCount() > 0
              ? `${readCount()} / ${props.entry.chapters.length} đã xem`
              : `${props.entry.chapters.length} đoạn`}
          </span>
        </div>
        <a href="#cac-sach" class="font-sans text-xs text-muted hover:text-accent">
          ↑ Các sách
        </a>
      </div>

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
            const prog = () => (ready() ? progressFor("chapter", `${props.entry.book.slug}/${ch.number}`) : undefined);
            const state = () => (prog()?.completed ? "ok" : prog() ? "seen" : "none");
            return (
              <li>
                <a
                  href={chapterHref({ slug: props.entry.book.slug, number: ch.number })}
                  title={
                    prog()
                      ? `Đoạn ${ch.number}: ${ch.title} (đã xem ${formatShortDate(prog()!.lastReadAt)})`
                      : `Đoạn ${ch.number}: ${ch.title}`
                  }
                  aria-label={`Đoạn ${ch.number}: ${ch.title}`}
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
                      : "group flex items-baseline gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-card"
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
                                {p().completed ? "✓" : "• đã xem"}
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
    </section>
  );
}
