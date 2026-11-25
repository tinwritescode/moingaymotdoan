import { getContent } from "../lib/content";
import { getMoodCatalog } from "../lib/moods";
import type { Toc } from "./data";

// Server only: reads content/ and data/bible/ from disk.
export const loadToc = (): Toc => ({ books: getContent().toc() });
export const loadChapter = (args: { slug: string; number: number }) => getContent().chapter(args);
export const loadMoodIndex = () => getMoodCatalog().index();
export const loadMood = (slug: string) => getMoodCatalog().mood(slug);
