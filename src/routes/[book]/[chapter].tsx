import type { RouteProps } from "@solidjs/router";
import { defineFileRoute } from "@solidjs/router/fs";
import { createMemo, isPending, Show } from "solid-js";
import type { ChapterLink, ChapterView, TocBook } from "../../../lib/content";
import { BOOKS, testamentOf } from "../../../lib/content/books";
import { plainText } from "../../../lib/content/note";
import { BookPicker, type PickerBook } from "../../components/book-picker";
import { ChapterKeys } from "../../components/chapter-keys";
import { ChapterReader } from "../../components/chapter-reader";
import { DisplayMenu, ThemeToggle } from "../../components/display-controls";
import { NotFound } from "../../components/not-found";
import { usePreferences } from "../../components/preferences-context";
import { Seo } from "../../components/seo";
import { getChapter, getToc } from "../../data";
import { chapterHref } from "../../router";

// Starts loading the đoạn and the header's mục lục together, as soon as navigation (or a link preload) begins.
export const route = defineFileRoute("/:book/:chapter", {
  preload: ({ params }) => {
    void getToc();
    void getChapter(params.book, Number(params.chapter));
  },
});

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

function chapterSummary(ch: ChapterView): string {
  const story = ch.sections.find((s) => s.heading === "Câu chuyện")?.paragraphs[0];
  if (story) return plainText(story);
  return `Đọc ${ch.book.name} đoạn ${ch.number} (${ch.title}) bằng lời thường, kèm nguyên văn Bản Truyền Thống 1926.`;
}

/** Only đoạn with a ghi chú exist; anything else is the not-found page. */
export default function ChapterPage(props: RouteProps<typeof route>) {
  const view = createMemo(() => getChapter(props.params.book, Number(props.params.chapter)));
  const books = createMemo(async () => pickerBooks((await getToc()).books));
  const { scale } = usePreferences();

  return (
    <Show when={view()} fallback={<NotFound />}>
      {(ch) => (
        // Keeps the đoạn on screen, dimmed, while the next one loads.
        <div class={["flex flex-1 flex-col transition-opacity", { "opacity-60": isPending(view) }]}>
          <Seo
            title={`${ch().book.name} ${ch().number} — ${ch().title} | Mỗi Ngày Một Đoạn`}
            description={chapterSummary(ch())}
            path={chapterHref({ slug: ch().book.slug, number: ch().number })}
            type="article"
          />

          <header class="sticky top-0 z-20 border-b border-rule/70 bg-paper/88 backdrop-blur-md font-sans">
            <div class="mx-auto flex w-full max-w-[38rem] items-center justify-between gap-2 px-4 py-2 text-sm text-muted sm:px-5">
              <a
                href={`/#${ch().book.slug}`}
                class="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-muted transition-colors hover:bg-card hover:text-ink"
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

              <div class="flex items-center gap-1.5">
                <ThemeToggle compact />
                <DisplayMenu compact />
              </div>
            </div>
          </header>

          <ChapterKeys prev={linkHref(ch().prev)} next={linkHref(ch().next)} />
          <ChapterReader view={ch()} scale={scale()} />
        </div>
      )}
    </Show>
  );
}
