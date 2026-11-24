import { getContent, MODE } from "../lib/content";
import { getMoodCatalog } from "../lib/moods";
import type { Toc } from "./data";

// Server only: reads content/ and data/bible/ from disk.
export const loadToc = (): Toc => ({ mode: MODE, books: getContent().toc(MODE) });
export const loadChapter = (args: { slug: string; number: number }) =>
  getContent().chapter({ ...args, mode: MODE });
export const loadMoodIndex = () => getMoodCatalog().index(MODE);
export const loadMood = (slug: string) => getMoodCatalog().mood({ slug, mode: MODE });
