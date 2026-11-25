import type { TocBook } from "../content";
import { testamentOf } from "../content/books";
import type { Locale } from "../i18n/locale";

/** One downloadable ebook: the whole Bible or one testament (only what is written). */
export type Bundle = { slug: string; name: string; books: TocBook[] };

export function bundles(toc: TocBook[], locale: Locale = "vi"): Bundle[] {
  const of = (t: "cu-uoc" | "tan-uoc") => toc.filter((b) => testamentOf(b.book) === t);
  const sets: Bundle[] =
    locale === "en"
      ? [
          { slug: "complete", name: "Complete Bible", books: toc },
          { slug: "old-testament", name: "Old Testament", books: of("cu-uoc") },
          { slug: "new-testament", name: "New Testament", books: of("tan-uoc") },
        ]
      : [
          { slug: "tat-ca", name: "Trọn bộ", books: toc },
          { slug: "cuu-uoc", name: "Cựu Ước", books: of("cu-uoc") },
          { slug: "tan-uoc", name: "Tân Ước", books: of("tan-uoc") },
        ];
  return sets.filter((b) => b.books.length > 0);
}

/** `<slug>.epub` is the short edition; full-text suffix adds each chapter's whole text. */
export const ebookFile = (args: { slug: string; fullText: boolean; locale?: Locale }) =>
  `${args.slug}${args.fullText ? (args.locale === "en" ? "-full-text" : "-nguyen-van") : ""}.epub`;
