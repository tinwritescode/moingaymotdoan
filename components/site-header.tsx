import Link from "next/link";
import { BOOKS, testamentOf } from "@/lib/content/books";
import { getContent, MODE } from "@/lib/content";
import { BookPicker, type PickerBook } from "./book-picker";

function pickerBooks(): PickerBook[] {
  const written = new Map(getContent().toc(MODE).map((t) => [t.book.code, t.chapters]));
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
export function SiteHeader(props: { children?: React.ReactNode; book?: string }) {
  return (
    <header className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-rule bg-card px-6 py-3 font-sans">
      <Link href="/" className="font-serif text-[17px] font-semibold">
        Kinh Thánh <span className="font-normal text-muted">· ghi chú từng đoạn</span>
      </Link>
      <BookPicker books={pickerBooks()} current={props.book} />
      {props.children}
    </header>
  );
}
