import { testamentOf } from "../content/books";
import type { TocBook } from "../content";

/** One downloadable ebook: the whole Bible or one testament (only what is written). */
export type Bundle = { slug: string; name: string; books: TocBook[] };

export function bundles(toc: TocBook[]): Bundle[] {
  const of = (t: "cu-uoc" | "tan-uoc") => toc.filter((b) => testamentOf(b.book) === t);
  const sets: Bundle[] = [
    { slug: "tat-ca", name: "Trọn bộ", books: toc },
    { slug: "cuu-uoc", name: "Cựu Ước", books: of("cu-uoc") },
    { slug: "tan-uoc", name: "Tân Ước", books: of("tan-uoc") },
  ];
  return sets.filter((b) => b.books.length > 0);
}

/** `<slug>.epub` is the short edition; `<slug>-nguyen-van.epub` adds each đoạn's whole text. */
export const ebookFile = (args: { slug: string; fullText: boolean }) =>
  `${args.slug}${args.fullText ? "-nguyen-van" : ""}.epub`;
