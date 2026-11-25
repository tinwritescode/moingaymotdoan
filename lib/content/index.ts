import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chaptersOf, type Bible } from "./bible";
import { BOOKS, bookBySlug, type Book } from "./books";
import { parseNote, type Note, type Opinion, type Section } from "./note";
import { lookupRef, type Ref, type Verse } from "./refs";

export type { Book } from "./books";
export type { Inline, Opinion, Section } from "./note";
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

function loadBible(dir: string): Bible {
  const bible = new Map<string, string[][]>();
  for (const book of BOOKS) {
    const file = join(dir, `${book.code}.json`);
    const data: unknown = JSON.parse(readFileSync(file, "utf8"));
    const chapters =
      typeof data === "object" && data !== null && "chapters" in data ? data.chapters : undefined;
    if (!isChapters(chapters)) throw new Error(`Dữ liệu Kinh Thánh sai dạng: ${file}`);
    bible.set(book.code, chapters);
  }
  return bible;
}

/** Loads and checks every ghi chú once; any broken rule throws with the file name, failing the build. */
export function createContent(args: { contentDir: string; bibleDir: string }): Content {
  const bible = loadBible(args.bibleDir);
  const notes = new Map<string, Map<number, Note>>();
  const errors: string[] = [];

  for (const slug of readdirSync(args.contentDir)) {
    const book = bookBySlug(slug);
    if (!book) throw new Error(`${slug}: không phải tên sách (slug) hợp lệ`);
    const byNumber = new Map<number, Note>();
    for (const file of readdirSync(join(args.contentDir, slug))) {
      const path = join(args.contentDir, slug, file);
      const m = /^(\d+)\.md$/.exec(file);
      const number = m ? Number(m[1]) : NaN;
      if (!(number >= 1 && number <= chaptersOf(bible, book).length)) {
        throw new Error(`${path}: tên file phải là số đoạn có trong ${book.name}`);
      }
      try {
        byNumber.set(number, parseNote({ source: readFileSync(path, "utf8"), book, chapter: number, bible }));
      } catch (e) {
        errors.push(`${path}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    notes.set(book.code, byNumber);
  }
  // Every broken ghi chú at once, so several writers can each find their own file's errors.
  if (errors.length > 0) throw new Error(errors.join("\n"));

  const entriesOf = (book: Book) =>
    [...(notes.get(book.code) ?? new Map<number, Note>())].sort(([a], [b]) => a - b);

  return {
    toc() {
      return BOOKS.map((book) => ({
        book,
        chapters: entriesOf(book).map(([number, note]) => ({
          number,
          title: note.title,
        })),
      })).filter((b) => b.chapters.length > 0);
    },

    chapter({ slug, number }) {
      const book = bookBySlug(slug);
      if (!book) return null;
      const note = notes.get(book.code)?.get(number);
      if (!note) return null;
      const order: ChapterLink[] = BOOKS.flatMap((b) =>
        entriesOf(b).map(([n, nt]) => ({ book: b, number: n, title: nt.title })),
      );
      const at = order.findIndex((l) => l.book.code === book.code && l.number === number);
      return {
        book,
        number,
        title: note.title,
        verses: chaptersOf(bible, book)[number - 1].map((text, i) => ({ number: i + 1, text })),
        sections: note.sections,
        opinions: note.opinions,
        prev: order[at - 1] ?? null,
        next: order[at + 1] ?? null,
      };
    },

    lookup({ text, book }) {
      return lookupRef({ text, book, bible });
    },
  };
}

let cached: Content | undefined;

/**
 * The repo's own content: content/ and data/bible/. Cached in production only; in dev it is
 * re-read on every request so an edited ghi chú shows on reload, without restarting the server.
 */
export function getContent(): Content {
  const load = () =>
    createContent({
      contentDir: join(process.cwd(), "content"),
      bibleDir: join(process.cwd(), "data", "bible"),
    });
  if (process.env.NODE_ENV !== "production") return load();
  cached ??= load();
  return cached;
}
