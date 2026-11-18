import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chaptersOf, loadBible } from "./bible";
import { BOOKS, bookBySlug, type Book } from "./books";
import { parseNote, type Inline, type Note, type Opinion, type Section } from "./note";
import { lookupRef, type Ref, type Verse } from "./refs";

export type { Book } from "./books";
export type { Inline, Opinion, Section } from "./note";
export type { Ref, Verse } from "./refs";

/** Nháp: what the owner sees while writing and reviewing. Công bố: what readers see. */
export type Mode = "nhap" | "cong-bo";
// CONTENT_MODE=nhap lets a production deploy show unapproved chapters too.
export const MODE: Mode =
  process.env.NODE_ENV === "production" && process.env.CONTENT_MODE !== "nhap" ? "cong-bo" : "nhap";

export type Summary = { cao: number; vua: number; thap: number; verified: number; total: number };

export type TocChapter = {
  number: number;
  title: string;
  draft: { approved: boolean; summary: Summary } | null;
};
export type TocBook = { book: Book; chapters: TocChapter[] };

type ChapterBase = {
  book: Book;
  number: number;
  title: string;
  verses: Verse[];
  sections: Section[];
  /** May sit in another book: the reading order runs on across books. */
  prev: ChapterLink | null;
  next: ChapterLink | null;
};
export type ChapterLink = { book: Book; number: number; title: string };
export type ChapterView =
  | (ChapterBase & { mode: "cong-bo"; opinions: Inline[][] })
  | (ChapterBase & { mode: "nhap"; approved: boolean; summary: Summary; opinions: Opinion[] });

export type Content = {
  toc(mode: Mode): TocBook[];
  chapter(args: { slug: string; number: number; mode: Mode }): ChapterView | null;
  lookup(args: { text: string; book?: Book }): Ref;
};

function summarize(opinions: Opinion[]): Summary {
  const count = (pred: (o: Opinion) => boolean) => opinions.filter(pred).length;
  return {
    cao: count((o) => o.level === "cao"),
    vua: count((o) => o.level === "vua"),
    thap: count((o) => o.level === "thap"),
    verified: count((o) => o.verified),
    total: opinions.length,
  };
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

  const visible = (book: Book, mode: Mode) =>
    [...(notes.get(book.code) ?? new Map<number, Note>())]
      .filter(([, note]) => mode === "nhap" || note.approved)
      .sort(([a], [b]) => a - b);

  return {
    toc(mode) {
      return BOOKS.map((book) => ({
        book,
        chapters: visible(book, mode).map(([number, note]) => ({
          number,
          title: note.title,
          draft: mode === "nhap" ? { approved: note.approved, summary: summarize(note.opinions) } : null,
        })),
      })).filter((b) => b.chapters.length > 0);
    },

    chapter({ slug, number, mode }) {
      const book = bookBySlug(slug);
      if (!book) return null;
      const note = visible(book, mode).find(([n]) => n === number)?.[1];
      if (!note) return null;
      const order: ChapterLink[] = BOOKS.flatMap((b) =>
        visible(b, mode).map(([n, nt]) => ({ book: b, number: n, title: nt.title })),
      );
      const at = order.findIndex((l) => l.book.code === book.code && l.number === number);
      const base: ChapterBase = {
        book,
        number,
        title: note.title,
        verses: chaptersOf(bible, book)[number - 1].map((text, i) => ({ number: i + 1, text })),
        sections: note.sections,
        prev: order[at - 1] ?? null,
        next: order[at + 1] ?? null,
      };
      return mode === "nhap"
        ? { ...base, mode, approved: note.approved, summary: summarize(note.opinions), opinions: note.opinions }
        : { ...base, mode, opinions: note.opinions.filter((o) => o.verified).map((o) => o.body) };
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
