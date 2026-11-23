import { getContent, MODE } from "../lib/content";
import type { Toc } from "./data";

// Server only: reads content/ and data/bible/ from disk.
export const loadToc = (): Toc => ({ mode: MODE, books: getContent().toc(MODE) });
export const loadChapter = (args: { slug: string; number: number }) =>
  getContent().chapter({ ...args, mode: MODE });
