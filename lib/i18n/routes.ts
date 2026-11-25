import { translateBookSlug } from "../content/books";
import { localeFromPath, type Locale } from "./locale";
import { moodSlugFor } from "./mood-slugs";

export const homeHref = (locale: Locale = "vi"): string => (locale === "en" ? "/en" : "/");

export const chapterHref = (args: { slug: string; number: number; locale?: Locale }): string =>
  args.locale === "en" ? `/en/${args.slug}/${args.number}` : `/${args.slug}/${args.number}`;

export const moodsHref = (locale: Locale = "vi"): string => (locale === "en" ? "/en/moods" : "/cam-xuc");

export const moodHref = (slug: string, locale: Locale = "vi"): string =>
  locale === "en" ? `/en/moods/${slug}` : `/cam-xuc/${slug}`;

export const historyHref = (locale: Locale = "vi"): string => (locale === "en" ? "/en/history" : "/lich-su");

export const accountHref = (locale: Locale = "vi", next?: string): string => {
  const base = locale === "en" ? "/en/account" : "/tai-khoan";
  return next ? `${base}?next=${encodeURIComponent(next)}` : base;
};

export const ebookHref = (locale: Locale = "vi"): string => (locale === "en" ? "/en/ebook" : "/ebook");

export const ebookFileHref = (file: string, locale: Locale = "vi"): string =>
  locale === "en" ? `/en/ebook/${file}` : `/ebook/${file}`;

/** Maps any route pathname to its exact counterpart in `targetLocale`. */
export function alternatePath(pathname: string, targetLocale: Locale): string {
  const clean = pathname === "/" ? "/" : pathname.replace(/\/+$/u, "");
  const sourceLocale = localeFromPath(clean);
  if (sourceLocale === targetLocale) return clean;

  // Strip /en prefix to normalize segments.
  const rest = sourceLocale === "en" ? (clean === "/en" ? "/" : clean.slice(3)) : clean;

  if (rest === "/" || rest === "") return homeHref(targetLocale);
  if (rest === "/cam-xuc" || rest === "/moods") return moodsHref(targetLocale);
  if (rest === "/lich-su" || rest === "/history") return historyHref(targetLocale);
  if (rest === "/tai-khoan" || rest === "/account") return accountHref(targetLocale);
  if (rest === "/ebook") return ebookHref(targetLocale);

  const moodMatch = /^\/(?:cam-xuc|moods)\/([a-z0-9-]+)$/u.exec(rest);
  if (moodMatch) {
    const mapped = moodSlugFor(moodMatch[1], targetLocale);
    return mapped ? moodHref(mapped, targetLocale) : moodsHref(targetLocale);
  }

  const chapterMatch = /^\/([a-z0-9-]+)\/(\d+)$/u.exec(rest);
  if (chapterMatch) {
    const mappedBook = translateBookSlug(chapterMatch[1], targetLocale);
    if (mappedBook) return chapterHref({ slug: mappedBook, number: Number(chapterMatch[2]), locale: targetLocale });
  }

  return homeHref(targetLocale);
}
