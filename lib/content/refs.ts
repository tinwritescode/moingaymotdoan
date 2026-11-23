import { chaptersOf, type Bible } from "./bible";
import { bookByName, type Book } from "./books";

export type Verse = { number: number; text: string };

/** A resolved chỗ dẫn: one chapter, a verse range, with the verse text. */
export type Ref = { label: string; book: Book; chapter: number; verses: Verse[] };

/** "1:3" or "1:3–13". */
export function verseLabel(args: { chapter: number; verses: Verse[] }) {
  const from = args.verses[0].number;
  const to = args.verses[args.verses.length - 1].number;
  return `${args.chapter}:${from}${to > from ? `–${to}` : ""}`;
}

/** One item inside "( … ; … )": an optional lead word such as "so", then the chỗ dẫn. */
export type RefPart = { lead: string; ref: Ref };

const PART = /^(?:(so)\s+)?(?:(.+?)\s+)?(\d+):(\d+)(?:\s*[–-]\s*(\d+))?$/u;
const HAS_REF = /\d+:\d+/;

function resolve(args: {
  bible: Bible;
  book: Book;
  chapter: number;
  from: number;
  to: number;
  label: string;
}): Ref {
  const { bible, book, chapter, from, to, label } = args;
  const verses = chaptersOf(bible, book)[chapter - 1];
  if (!verses || from < 1 || to < from || to > verses.length) {
    throw new Error(`Chỗ dẫn "${label}" trỏ tới câu không tồn tại`);
  }
  return {
    label,
    book,
    chapter,
    verses: verses.slice(from - 1, to).map((text, i) => ({ number: from + i, text })),
  };
}

function parsePart(args: {
  text: string;
  book: Book | undefined;
  bible: Bible;
}): RefPart & { book: Book } {
  const text = args.text.trim();
  const m = PART.exec(text);
  if (!m) throw new Error(`Không đọc được chỗ dẫn "${text}"`);
  const [, lead = "", name, c, v, end] = m;
  if (name === undefined && !args.book) throw new Error(`Chỗ dẫn "${text}" thiếu tên sách`);
  const book = name === undefined ? args.book : bookByName(name);
  if (!book) throw new Error(`Tên sách lạ "${name}" trong chỗ dẫn "${text}"`);
  const label = `${name === undefined ? "" : `${name} `}${c}:${v}${end ? `–${end}` : ""}`;
  const from = Number(v);
  const ref = resolve({
    bible: args.bible,
    book,
    chapter: Number(c),
    from,
    to: end ? Number(end) : from,
    label,
  });
  return { lead: lead && `${lead} `, ref, book };
}

/**
 * Parses the inside of a "( … )" group. Returns null when it holds no chỗ dẫn.
 * A part without a book name uses the previous part's book, or `book` for the first part.
 */
export function parseRefGroup(args: { inner: string; book: Book; bible: Bible }): RefPart[] | null {
  if (!HAS_REF.test(args.inner)) return null;
  let book = args.book;
  return args.inner.split(";").map((text) => {
    const part = parsePart({ text, book, bible: args.bible });
    book = part.book;
    return { lead: part.lead, ref: part.ref };
  });
}

/** Tra một chỗ dẫn such as "Giăng 1:1" or, with `book`, "1:26". */
export function lookupRef(args: { text: string; book: Book | undefined; bible: Bible }): Ref {
  return parsePart(args).ref;
}
