import { getContent } from "../lib/content";
import type { Locale } from "../lib/i18n";
import { getMoodCatalog } from "../lib/moods";
import type { Toc } from "./data";

// Server only: reads content/ + data/bible/ (vi) or content-en/ + data/bible-en/ (en) from disk.
export const loadToc = (locale: Locale = "vi"): Toc => ({ books: getContent(locale).toc() });
export const loadChapter = (args: { slug: string; number: number; locale?: Locale }) =>
  getContent(args.locale ?? "vi").chapter({ slug: args.slug, number: args.number });
export const loadMoodIndex = (locale: Locale = "vi") => getMoodCatalog(locale).index();
export const loadMood = (slug: string, locale: Locale = "vi") => getMoodCatalog(locale).mood(slug);
