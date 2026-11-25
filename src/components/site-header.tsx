import { createMemo, type ParentProps } from "solid-js";
import { BOOKS, testamentOf } from "../../lib/content/books";
import type { TocBook } from "../../lib/content";
import { getToc } from "../data";
import { BookPicker, type PickerBook } from "./book-picker";

function pickerBooks(toc: TocBook[]): PickerBook[] {
  const written = new Map(toc.map((t) => [t.book.code, t.chapters]));
  return BOOKS.map((b) => ({
    slug: b.slug,
    name: b.name,
    testament: testamentOf(b),
    chapters: (written.get(b.code) ?? []).map((ch) => ({ number: ch.number, title: ch.title })),
  }));
}

/**
 * The top bar on every page; `children` go after the top navigation (breadcrumb, prev/next).
 * `book` is the slug of the book being read, so the picker opens on it.
 */
export function SiteHeader(props: ParentProps<{ book?: string; section?: "cam-xuc" }>) {
  const books = createMemo(async () => pickerBooks((await getToc()).books));
  return (
    <header class="kt-header flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-rule bg-card px-4 py-3 font-sans sm:gap-x-5 sm:px-6">
      <a href="/" class="kt-brand font-serif text-[17px] font-semibold">
        Kinh Thánh <span class="font-normal text-muted">· ghi chú từng đoạn</span>
      </a>
      <div class="flex items-center gap-2">
        <BookPicker books={books()} current={props.book} />
        <a
          href="/cam-xuc"
          aria-current={props.section === "cam-xuc" ? "page" : undefined}
          class={[
            "inline-flex min-h-11 items-center rounded-lg border px-3.5 text-sm transition-colors",
            props.section === "cam-xuc"
              ? "border-ink bg-ink font-semibold text-paper"
              : "border-rule hover:border-accent",
          ]}
        >
          Theo cảm xúc
        </a>
      </div>
      {props.children}
    </header>
  );
}
