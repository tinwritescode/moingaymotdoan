import { query } from "@solidjs/router";
import type { ChapterView, Mode, TocBook } from "../lib/content";

/** What every page needs: the mode it is built in and the đoạn it may link to. */
export type Toc = { mode: Mode; books: TocBook[] };

/** The static file each query reads in the browser; the server writes the same files at build time. */
export const dataUrl = {
  toc: () => "/data/toc.json",
  chapter: (args: { slug: string; number: number }) => `/data/${args.slug}/${args.number}.json`,
};

/**
 * The server reads content/ itself; the browser reads the JSON the build wrote from it.
 * shortcut: the browser trusts that JSON's shape (same origin, written from these types); validate if it ever comes from elsewhere.
 */
async function fetchJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url);
  return res.ok ? res.json() : null;
}

export const getToc = query(async (): Promise<Toc> => {
  if (import.meta.env.SSR) {
    return (await import("./content.server")).loadToc();
  }
  const toc = await fetchJson<Toc>(dataUrl.toc());
  if (!toc) throw new Error("Không tải được mục lục");
  return toc;
}, "toc");

/** null: no such đoạn, or not published in this mode. */
export const getChapter = query(async (slug: string, number: number): Promise<ChapterView | null> => {
  if (import.meta.env.SSR) {
    return (await import("./content.server")).loadChapter({ slug, number });
  }
  return fetchJson<ChapterView>(dataUrl.chapter({ slug, number }));
}, "chapter");
