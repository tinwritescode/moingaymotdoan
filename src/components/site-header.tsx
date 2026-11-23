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
 * The top bar on every page; `children` go after the book picker (breadcrumb, status, prev/next).
 * `book` is the slug of the book being read, so the picker opens on it.
 */
export function SiteHeader(props: ParentProps<{ book?: string }>) {
  const books = createMemo(async () => pickerBooks((await getToc()).books));
  return (
    <header class="kt-header flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-rule bg-card px-6 py-3 font-sans">
      <a href="/" class="kt-brand font-serif text-[17px] font-semibold">
        Kinh Thánh <span class="font-normal text-muted">· ghi chú từng đoạn</span>
      </a>
      <BookPicker books={books()} current={props.book} />
      {props.children}
    </header>
  );
}
