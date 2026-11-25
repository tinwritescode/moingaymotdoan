import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "../i18n/locale";
import { chaptersOf, type Bible } from "./bible";
import { bookBySlug, booksFor, type Book } from "./books";
import { parseNote, type Note, type Opinion, type Section } from "./note";
import { lookupRef, type Ref, type Verse } from "./refs";

export type { Book } from "./books";
export type { Inline, Opinion, Section, SectionKey } from "./note";
export type { Ref, Verse } from "./refs";

export type TocChapter = {
  number: number;
  title: string;
};
export type TocBook = { book: Book; chapters: TocChapter[] };

export type ChapterLink = { book: Book; number: number; title: string };
export type ChapterView = {
  book: Book;
  number: number;
  title: string;
  verses: Verse[];
  sections: Section[];
  opinions: Opinion[];
  /** May sit in another book: the reading order runs on across books. */
  prev: ChapterLink | null;
  next: ChapterLink | null;
};

export type Content = {
  locale: Locale;
  toc(): TocBook[];
  chapter(args: { slug: string; number: number }): ChapterView | null;
  lookup(args: { text: string; book?: Book }): Ref;
};

function isChapters(x: unknown): x is string[][] {
  return (
    Array.isArray(x) &&
    x.every((c) => Array.isArray(c) && c.length > 0 && c.every((v) => typeof v === "string"))
  );
}

function loadBible(dir: string, locale: Locale): Bible {
  const bible = new Map<string, string[][]>();
  for (const book of booksFor(locale)) {
    const file = join(dir, `${book.code}.json`);
    const data: unknown = JSON.parse(readFileSync(file, "utf8"));
    const chapters =
      typeof data === "object" && data !== null && "chapters" in data ? data.chapters : undefined;
    if (!isChapters(chapters)) {
      throw new Error(locale === "en" ? `Invalid Bible data format: ${file}` : `Dữ liệu Kinh Thánh sai dạng: ${file}`);
    }
    bible.set(book.code, chapters);
  }
  return bible;
}

/** Loads and checks every chapter note once; any broken rule throws with the file name, failing the build. */
export function createContent(args: { contentDir: string; bibleDir: string; locale?: Locale }): Content {
  const locale = args.locale ?? "vi";
  const books = booksFor(locale);
  const bible = loadBible(args.bibleDir, locale);
  const notes = new Map<string, Map<number, Note>>();
  const errors: string[] = [];

  if (existsSync(args.contentDir)) {
    for (const slug of readdirSync(args.contentDir)) {
      if (slug.startsWith(".")) continue;
      const book = bookBySlug(slug, locale);
      if (!book) {
        throw new Error(
          locale === "en" ? `${slug}: invalid book slug` : `${slug}: không phải tên sách (slug) hợp lệ`,
        );
      }
      const byNumber = new Map<number, Note>();
      for (const file of readdirSync(join(args.contentDir, slug))) {
        if (file.startsWith(".")) continue;
        const path = join(args.contentDir, slug, file);
        const m = /^(\d+)\.md$/.exec(file);
        const number = m ? Number(m[1]) : NaN;
        if (!(number >= 1 && number <= chaptersOf(bible, book).length)) {
          throw new Error(
            locale === "en"
              ? `${path}: filename must be a valid chapter number in ${book.name}`
              : `${path}: tên file phải là số đoạn có trong ${book.name}`,
          );
        }
        try {
          byNumber.set(
            number,
            parseNote({ source: readFileSync(path, "utf8"), book, chapter: number, bible, locale }),
          );
        } catch (e) {
          errors.push(`${path}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
      notes.set(book.code, byNumber);
    }
  }
  // Every broken note at once, so several writers can each find their own file's errors.
  if (errors.length > 0) throw new Error(errors.join("\n"));

  const entriesOf = (book: Book) =>
    [...(notes.get(book.code) ?? new Map<number, Note>())].sort(([a], [b]) => a - b);

  return {
    locale,
    toc() {
      return books
        .map((book) => ({
          book,
          chapters: entriesOf(book).map(([number, note]) => ({
            number,
            title: note.title,
          })),
        }))
        .filter((b) => b.chapters.length > 0);
    },

    chapter({ slug, number }) {
      const book = bookBySlug(slug, locale);
      if (!book) return null;
      const note = notes.get(book.code)?.get(number);
      if (!note) return null;
      const order: ChapterLink[] = books.flatMap((b) =>
        entriesOf(b).map(([n, nt]) => ({ book: b, number: n, title: nt.title })),
      );
      const at = order.findIndex((l) => l.book.code === book.code && l.number === number);
      return {
        book,
        number,
        title: note.title,
        verses: chaptersOf(bible, book)[number - 1]
          .map((text, i) => ({ number: i + 1, text }))
          .filter((v) => v.text !== ""),
        sections: note.sections,
        opinions: note.opinions,
        prev: order[at - 1] ?? null,
        next: order[at + 1] ?? null,
      };
    },

    lookup({ text, book }) {
      return lookupRef({ text, book, bible, locale });
    },
  };
}

const cached: Partial<Record<Locale, Content>> = {};

/**
 * The repo's own content: content/ + data/bible/ (vi) and content-en/ + data/bible-en/ (en).
 * Cached in production only; in dev it is re-read on every request so an edited note shows on reload.
 */
export function getContent(locale: Locale = "vi"): Content {
  const load = () =>
    createContent({
      contentDir: join(process.cwd(), locale === "en" ? "content-en" : "content"),
      bibleDir: join(process.cwd(), "data", locale === "en" ? "bible-en" : "bible"),
      locale,
    });
  if (process.env.NODE_ENV !== "production") return load();
  cached[locale] ??= load();
  return cached[locale];
}
