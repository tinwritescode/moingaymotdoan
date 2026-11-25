import { Title } from "@solidjs/meta";
import type { RouteProps } from "@solidjs/router";
import { defineFileRoute } from "@solidjs/router/fs";
import { createMemo, createSignal, isPending, onSettled, Show } from "solid-js";
import type { ChapterLink, TocBook } from "../../../lib/content";
import { BOOKS, testamentOf } from "../../../lib/content/books";
import { BookPicker, type PickerBook } from "../../components/book-picker";
import { ChapterKeys } from "../../components/chapter-keys";
import { ChapterReader, type ReadingScale } from "../../components/chapter-reader";
import { NotFound } from "../../components/not-found";
import { getChapter, getToc } from "../../data";
import { chapterHref } from "../../router";

// Starts loading the đoạn and the header's mục lục together, as soon as navigation (or a link preload) begins.
export const route = defineFileRoute("/:book/:chapter", {
  preload: ({ params }) => {
    void getToc();
    void getChapter(params.book, Number(params.chapter));
  },
});

const FONT_SCALE_KEY = "kt:reading-scale:v1";
const NEXT_SCALE: Record<ReadingScale, ReadingScale> = { sm: "md", md: "lg", lg: "sm" };
const SCALE_LABEL: Record<ReadingScale, string> = { sm: "Nhỏ", md: "Vừa", lg: "Lớn" };

function pickerBooks(toc: TocBook[]): PickerBook[] {
  const written = new Map(toc.map((t) => [t.book.code, t.chapters]));
  return BOOKS.map((b) => ({
    slug: b.slug,
    name: b.name,
    testament: testamentOf(b),
    chapters: (written.get(b.code) ?? []).map((ch) => ({ number: ch.number, title: ch.title })),
  }));
}

const linkHref = (l: ChapterLink | null) => (l ? chapterHref({ slug: l.book.slug, number: l.number }) : null);

/** Only đoạn with a ghi chú exist; anything else is the not-found page. */
export default function ChapterPage(props: RouteProps<typeof route>) {
  const view = createMemo(() => getChapter(props.params.book, Number(props.params.chapter)));
  const books = createMemo(async () => pickerBooks((await getToc()).books));
  const [scale, setScale] = createSignal<ReadingScale>("md");

  onSettled(() => {
    try {
      const saved = window.localStorage.getItem(FONT_SCALE_KEY);
      if (saved === "sm" || saved === "md" || saved === "lg") setScale(saved);
    } catch {
      // ignore
    }
  });

  const cycleScale = () => {
    const next = NEXT_SCALE[scale()];
    setScale(next);
    try {
      window.localStorage.setItem(FONT_SCALE_KEY, next);
    } catch {
      // ignore
    }
  };

  return (
    <Show when={view()} fallback={<NotFound />}>
      {(ch) => (
        // Keeps the đoạn on screen, dimmed, while the next one loads.
        <div class={["flex flex-1 flex-col transition-opacity", { "opacity-60": isPending(view) }]}>
          <Title>{`${ch().book.name} ${ch().number} — ${ch().title}`}</Title>

          <header class="sticky top-0 z-20 border-b border-rule/70 bg-paper/88 backdrop-blur-md font-sans">
            <div class="mx-auto flex w-full max-w-[38rem] items-center justify-between gap-2 px-4 py-2 text-sm text-muted sm:px-5">
              <a
                href={`/#${ch().book.slug}`}
                class="inline-flex min-h-10 items-center gap-1 rounded-full px-2.5 text-muted transition-colors hover:bg-card hover:text-ink"
              >
                <span aria-hidden="true">‹</span>
                <span>Mục lục</span>
              </a>

              <div class="flex items-center gap-2">
                <span class="hidden text-xs font-medium text-ink sm:inline">
                  {ch().book.name} {ch().number}
                </span>
                <BookPicker books={books()} current={ch().book.slug} />
              </div>

              <button
                type="button"
                onClick={cycleScale}
                title={`Đổi cỡ chữ đọc (đang dùng: ${SCALE_LABEL[scale()]})`}
                aria-label={`Đổi cỡ chữ đọc (đang dùng: ${SCALE_LABEL[scale()]})`}
                class="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-rule bg-card px-3.5 font-serif text-sm text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Aa
              </button>
            </div>
          </header>

          <ChapterKeys prev={linkHref(ch().prev)} next={linkHref(ch().next)} />
          <ChapterReader view={ch()} scale={scale()} />
        </div>
      )}
    </Show>
  );
}
