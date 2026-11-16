import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BOOKS, type Book } from "./books";

/** chapters[c - 1][v - 1] is the text of verse c:v. */
export type Bible = ReadonlyMap<string, readonly (readonly string[])[]>;

function isChapters(x: unknown): x is string[][] {
  return (
    Array.isArray(x) &&
    x.every((c) => Array.isArray(c) && c.length > 0 && c.every((v) => typeof v === "string"))
  );
}

export function loadBible(dir: string): Bible {
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

export const chaptersOf = (bible: Bible, book: Book) => bible.get(book.code) ?? [];
