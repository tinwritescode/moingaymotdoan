import { query } from "@solidjs/router";
import type { ChapterView, TocBook } from "../lib/content";
import type { Locale } from "../lib/i18n";
import type { MoodIndex, MoodView } from "../lib/moods";
import type { KtddDataset, ThanhCaDataset, TinDieuDataset, TvchhDataset } from "../lib/worship/types";

/** What every page needs: the list of books and chapters it may link to. */
export type Toc = { books: TocBook[] };

/** The static file each query reads in the browser; the server writes the same files at build time. */
export const dataUrl = {
  toc: (locale: Locale = "vi") => (locale === "en" ? "/data/en/toc.json" : "/data/toc.json"),
  chapter: (args: { slug: string; number: number; locale?: Locale }) =>
    args.locale === "en" ? `/data/en/${args.slug}/${args.number}.json` : `/data/${args.slug}/${args.number}.json`,
  moodIndex: (locale: Locale = "vi") => (locale === "en" ? "/data/en/moods.json" : "/data/cam-xuc.json"),
  mood: (slug: string, locale: Locale = "vi") =>
    locale === "en" ? `/data/en/moods/${slug}.json` : `/data/cam-xuc/${slug}.json`,
  worship: (name: "thanh-ca" | "tvchh" | "ktdd" | "tin-dieu") => `/data/worship/${name}.json`,
};

/**
 * The server reads content/ itself; the browser reads the JSON the build wrote from it.
 * shortcut: the browser trusts that JSON's shape (same origin, written from these types); validate if it ever comes from elsewhere.
 */
async function fetchJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url);
  return res.ok ? res.json() : null;
}

export const getToc = query(async (locale: Locale = "vi"): Promise<Toc> => {
  if (import.meta.env.SSR) {
    return (await import("./content.server")).loadToc(locale);
  }
  const toc = await fetchJson<Toc>(dataUrl.toc(locale));
  if (!toc) throw new Error(locale === "en" ? "Could not load table of contents" : "Không tải được mục lục");
  return toc;
}, "toc");

/** null: no such chapter, or not yet written in this locale. */
export const getChapter = query(
  async (slug: string, number: number, locale: Locale = "vi"): Promise<ChapterView | null> => {
    if (import.meta.env.SSR) {
      return (await import("./content.server")).loadChapter({ slug, number, locale });
    }
    return fetchJson<ChapterView>(dataUrl.chapter({ slug, number, locale }));
  },
  "chapter",
);

export const getMoodIndex = query(async (locale: Locale = "vi"): Promise<MoodIndex> => {
  if (import.meta.env.SSR) {
    return (await import("./content.server")).loadMoodIndex(locale);
  }
  const index = await fetchJson<MoodIndex>(dataUrl.moodIndex(locale));
  if (!index) {
    throw new Error(locale === "en" ? "Could not load mood guides" : "Không tải được danh sách chuyên mục cảm xúc");
  }
  return index;
}, "mood-index");

/** null: no mood guide with this slug. */
export const getMood = query(async (slug: string, locale: Locale = "vi"): Promise<MoodView | null> => {
  if (import.meta.env.SSR) {
    return (await import("./content.server")).loadMood(slug, locale);
  }
  return fetchJson<MoodView>(dataUrl.mood(slug, locale));
}, "mood");

export const getThanhCa = query(async (): Promise<ThanhCaDataset> => {
  if (import.meta.env.SSR) return (await import("./content.server")).loadThanhCa();
  const d = await fetchJson<ThanhCaDataset>(dataUrl.worship("thanh-ca"));
  if (!d) throw new Error("Không tải được dữ liệu Thánh ca");
  return d;
}, "worship-thanh-ca");

export const getTvchh = query(async (): Promise<TvchhDataset> => {
  if (import.meta.env.SSR) return (await import("./content.server")).loadTvchh();
  const d = await fetchJson<TvchhDataset>(dataUrl.worship("tvchh"));
  if (!d) throw new Error("Không tải được dữ liệu Biệt thánh ca (TVCHH)");
  return d;
}, "worship-tvchh");

export const getKtdd = query(async (): Promise<KtddDataset> => {
  if (import.meta.env.SSR) return (await import("./content.server")).loadKtdd();
  const d = await fetchJson<KtddDataset>(dataUrl.worship("ktdd"));
  if (!d) throw new Error("Không tải được dữ liệu Kinh Thánh đối đáp");
  return d;
}, "worship-ktdd");

export const getTinDieu = query(async (): Promise<TinDieuDataset> => {
  if (import.meta.env.SSR) return (await import("./content.server")).loadTinDieu();
  const d = await fetchJson<TinDieuDataset>(dataUrl.worship("tin-dieu"));
  if (!d) throw new Error("Không tải được dữ liệu Tín điều Các Sứ Đồ");
  return d;
}, "worship-tin-dieu");
