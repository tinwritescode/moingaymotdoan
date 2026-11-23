import type { Book } from "./books";

/** chapters[c - 1][v - 1] is the text of verse c:v. */
export type Bible = ReadonlyMap<string, readonly (readonly string[])[]>;

export const chaptersOf = (bible: Bible, book: Book) => bible.get(book.code) ?? [];
