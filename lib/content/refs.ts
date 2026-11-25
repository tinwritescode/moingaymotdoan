import type { Locale } from "../i18n/locale";
import { chaptersOf, type Bible } from "./bible";
import { bookByName, type Book } from "./books";

export type Verse = { number: number; text: string };

/** A resolved chỗ dẫn / scripture reference: one chapter, a verse range, with the verse text. */
export type Ref = { label: string; book: Book; chapter: number; verses: Verse[] };

/** "1:3" or "1:3–13". */
export function verseLabel(args: { chapter: number; verses: Verse[] }) {
  const from = args.verses[0].number;
  const to = args.verses[args.verses.length - 1].number;
  return `${args.chapter}:${from}${to > from ? `–${to}` : ""}`;
}

/** One item inside "( … ; … )": an optional lead word such as "so" or "cf.", then the reference. */
export type RefPart = { lead: string; ref: Ref };

const PART_VI = /^(?:(so)\s+)?(?:(.+?)\s+)?(\d+):(\d+)(?:\s*[–-]\s*(\d+))?$/u;
const PART_EN = /^(?:(cf\.|see|compare)\s+)?(?:(.+?)\s+)?(\d+):(\d+)(?:\s*[–-]\s*(\d+))?$/iu;
const HAS_REF = /\d+:\d+/;

function resolve(args: {
  bible: Bible;
  book: Book;
  chapter: number;
  from: number;
  to: number;
  label: string;
  locale: Locale;
}): Ref {
  const { bible, book, chapter, from, to, label, locale } = args;
  const verses = chaptersOf(bible, book)[chapter - 1];
  if (!verses || from < 1 || to < from || to > verses.length) {
    throw new Error(
      locale === "en"
        ? `Reference "${label}" points to a nonexistent verse`
        : `Chỗ dẫn "${label}" trỏ tới câu không tồn tại`,
    );
  }
  const sliced = verses
    .slice(from - 1, to)
    .map((text, i) => ({ number: from + i, text }))
    .filter((v) => v.text !== "");
  // If a citation explicitly targets only a critical-text omitted verse (e.g. Matthew 17:21 in BSB),
  // keep a clear note instead of returning an empty array.
  const resolvedVerses =
    sliced.length > 0
      ? sliced
      : [{ number: from, text: "[Verse omitted in earliest manuscripts]" }];
  return {
    label,
    book,
    chapter,
    verses: resolvedVerses,
  };
}

function parsePart(args: {
  text: string;
  book: Book | undefined;
  bible: Bible;
  locale: Locale;
}): RefPart & { book: Book } {
  const { locale } = args;
  const text = args.text.trim();
  const m = (locale === "en" ? PART_EN : PART_VI).exec(text);
  if (!m) {
    throw new Error(locale === "en" ? `Cannot parse reference "${text}"` : `Không đọc được chỗ dẫn "${text}"`);
  }
  const [, lead = "", name, c, v, end] = m;
  if (name === undefined && !args.book) {
    throw new Error(locale === "en" ? `Reference "${text}" is missing a book name` : `Chỗ dẫn "${text}" thiếu tên sách`);
  }
  const book = name === undefined ? args.book : bookByName(name, locale);
  if (!book) {
    throw new Error(
      locale === "en"
        ? `Unknown book name "${name}" in reference "${text}"`
        : `Tên sách lạ "${name}" trong chỗ dẫn "${text}"`,
    );
  }
  const label = `${name === undefined ? "" : `${name} `}${c}:${v}${end ? `–${end}` : ""}`;
  const from = Number(v);
  const ref = resolve({
    bible: args.bible,
    book,
    chapter: Number(c),
    from,
    to: end ? Number(end) : from,
    label,
    locale,
  });
  return { lead: lead && `${lead} `, ref, book };
}

/**
 * Parses the inside of a "( … )" group. Returns null when it holds no scripture reference.
 * A part without a book name uses the previous part's book, or `book` for the first part.
 */
export function parseRefGroup(args: {
  inner: string;
  book: Book;
  bible: Bible;
  locale?: Locale;
}): RefPart[] | null {
  if (!HAS_REF.test(args.inner)) return null;
  const locale = args.locale ?? "vi";
  let book = args.book;
  return args.inner.split(";").map((text) => {
    const part = parsePart({ text, book, bible: args.bible, locale });
    book = part.book;
    return { lead: part.lead, ref: part.ref };
  });
}

/** Looks up a single reference such as "Giăng 1:1", "John 1:1", or (with `book`) "1:26". */
export function lookupRef(args: { text: string; book: Book | undefined; bible: Bible; locale?: Locale }): Ref {
  return parsePart({ ...args, locale: args.locale ?? "vi" }).ref;
}
