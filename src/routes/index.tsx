import { Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { createMemo, For, Show } from "solid-js";
import type { TocBook } from "../../lib/content";
import { testamentOf } from "../../lib/content/books";
import { plainText } from "../../lib/content/note";
import { AI_NOTICE } from "../../lib/notice";
import { SiteHeader } from "../components/site-header";
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

const KICKER = "font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase";

/** Mục lục as a magazine front page: masthead, where to start, then every book and its đoạn. */
export default function MucLuc() {
  const toc = createMemo(() => getToc());
  return (
    <>
      <Title>Kinh Thánh — ghi chú từng đoạn</Title>
      <SiteHeader />
      <div class="kt-home mx-auto w-full max-w-6xl animate-reveal px-6 pb-20 motion-reduce:animate-none">
        <header class="kt-hero pt-10 text-center sm:pt-14">
          <h1 class="kt-hero-title font-display text-6xl leading-none font-extrabold sm:text-8xl">Kinh Thánh</h1>
          <p class="kt-hero-sub mt-3 font-display text-2xl text-accent italic">bằng lời thường</p>
          <p class="mx-auto mt-4 max-w-xl text-muted">
            Mỗi đoạn Kinh Thánh, kể lại bằng lời thường, kèm nguyên văn Bản Truyền Thống. <em>Đoạn</em> nghĩa là
            chương.
          </p>
          <p class="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-sm">
            <a href="/cam-xuc" class="font-semibold text-accent underline-offset-4 hover:underline">
              Đọc theo cảm xúc (100 chủ đề) →
            </a>
            <span aria-hidden="true" class="text-rule">
              ·
            </span>
            <a href="/ebook" class="text-accent underline-offset-4 hover:underline">
              Tải ebook cho Kindle →
            </a>
          </p>
          <div aria-hidden="true" class="mt-10 flex items-center gap-5 text-accent/70">
            <span class="h-px flex-1 bg-rule" />
            <span class="font-display text-xl leading-none">✦</span>
            <span class="h-px flex-1 bg-rule" />
          </div>
        </header>

        <p class="mt-6 rounded-xl border border-rule bg-card px-4 py-3 font-sans text-sm leading-relaxed text-muted">
          {AI_NOTICE}
        </p>

        <Show
          when={startOf(toc())}
          fallback={<p class="mt-10 text-muted">Chưa có đoạn nào. Mời bạn quay lại sau.</p>}
        >
          {(start) => (
            <>
              <StartHere book={start()} />
              <BookIndex toc={toc().books} />
              <For each={toc().books}>{(b) => <BookSection entry={b} />}</For>
            </>
          )}
        </Show>
      </div>
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
    <section
      aria-labelledby="bat-dau"
      class="kt-start flex flex-wrap items-end gap-x-14 gap-y-6 border-b border-rule py-12"
    >
      <div class="min-w-0 flex-[999_1_32rem]">
        <p id="bat-dau" class={`${KICKER} text-accent`}>
          Bắt đầu đọc · {props.book.book.name} {ch().number}
        </p>
        <h2 class="kt-start-title mt-3 font-display text-5xl leading-[1.05] font-extrabold text-balance sm:text-7xl">
          {ch().title}
        </h2>
        <p class="mt-5 max-w-2xl text-xl leading-relaxed">{lead()}</p>
        <a
          href={chapterHref({ slug: props.book.book.slug, number: ch().number })}
          class="kt-start-cta mt-6 inline-flex min-h-12 items-center bg-ink px-6 font-sans font-semibold text-paper hover:bg-accent"
        >
          Đọc đoạn này
        </a>
      </div>
      <p
        aria-hidden="true"
        class="kt-start-number flex-[1_1_10rem] text-right font-display text-[11rem] leading-[0.8] font-extrabold text-rule"
      >
        {ch().number}
      </p>
    </section>
  );
}

function BookIndex(props: { toc: TocBook[] }) {
  return (
    <nav aria-labelledby="cac-sach" class="kt-books border-b border-rule py-10">
      <h2 id="cac-sach" class={KICKER}>
        Các sách
      </h2>
      <ol class="mt-3">
        <For each={props.toc}>
          {(t) => (
            <li class="border-b border-rule last:border-b-0">
              <a
                href={`#${t.book.slug}`}
                class="kt-books-link group flex min-h-20 flex-wrap items-baseline gap-x-6 gap-y-1 py-4"
              >
                <span class="flex-[1_1_18rem] font-display text-4xl font-semibold group-hover:text-accent sm:text-5xl">
                  {t.book.name}
                </span>
                <span class="font-sans text-sm text-muted">
                  {testamentOf(t.book) === "cu-uoc" ? "Cựu Ước" : "Tân Ước"}
                </span>
                <span class="min-w-24 text-right font-sans font-semibold">{t.chapters.length} đoạn</span>
              </a>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}

function BookSection(props: { entry: TocBook }) {
  return (
    <section
      id={props.entry.book.slug}
      aria-labelledby={`${props.entry.book.slug}-ten`}
      class="kt-book scroll-mt-6 pt-14"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-2">
        <h2 id={`${props.entry.book.slug}-ten`} class="kt-book-name font-display text-3xl font-semibold">
          {props.entry.book.name}
        </h2>
        <a href="#cac-sach" class="font-sans text-sm text-muted hover:text-accent">
          ↑ Các sách
        </a>
      </div>
      <ol class="kt-chapter-list mt-5 gap-x-10 sm:columns-2 lg:columns-3">
        <For each={props.entry.chapters}>
          {(ch) => (
            <li class="mb-3 break-inside-avoid">
              <a
                href={chapterHref({ slug: props.entry.book.slug, number: ch.number })}
                class="kt-chapter-link group flex gap-3"
              >
                <span class="w-7 shrink-0 text-right font-sans text-sm leading-7 text-accent">{ch.number}</span>
                <span class="leading-snug group-hover:text-accent">{ch.title}</span>
              </a>
            </li>
          )}
        </For>
      </ol>
    </section>
  );
}
