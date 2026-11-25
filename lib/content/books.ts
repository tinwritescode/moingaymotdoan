import type { Locale } from "../i18n/locale";

// Canonical book names: Vietnamese (Bản Truyền Thống) and English (Berean Standard Bible).
// `code` is the eBible VPL book code used by data/bible/<code>.json and data/bible-en/<code>.json.
const TABLE = [
  ["GEN", "Sáng-thế Ký", "Genesis"],
  ["EXO", "Xuất Ê-díp-tô Ký", "Exodus"],
  ["LEV", "Lê-vi Ký", "Leviticus"],
  ["NUM", "Dân-số Ký", "Numbers"],
  ["DEU", "Phục-truyền Luật-lệ Ký", "Deuteronomy"],
  ["JOS", "Giô-suê", "Joshua"],
  ["JDG", "Các Quan Xét", "Judges"],
  ["RUT", "Ru-tơ", "Ruth"],
  ["1SA", "1 Sa-mu-ên", "1 Samuel"],
  ["2SA", "2 Sa-mu-ên", "2 Samuel"],
  ["1KI", "1 Các Vua", "1 Kings"],
  ["2KI", "2 Các Vua", "2 Kings"],
  ["1CH", "1 Sử-ký", "1 Chronicles"],
  ["2CH", "2 Sử-ký", "2 Chronicles"],
  ["EZR", "E-xơ-ra", "Ezra"],
  ["NEH", "Nê-hê-mi", "Nehemiah"],
  ["EST", "Ê-xơ-tê", "Esther"],
  ["JOB", "Gióp", "Job"],
  ["PSA", "Thi-thiên", "Psalms"],
  ["PRO", "Châm-ngôn", "Proverbs"],
  ["ECC", "Truyền-đạo", "Ecclesiastes"],
  ["SOL", "Nhã-ca", "Song of Solomon"],
  ["ISA", "Ê-sai", "Isaiah"],
  ["JER", "Giê-rê-mi", "Jeremiah"],
  ["LAM", "Ca-thương", "Lamentations"],
  ["EZE", "Ê-xê-chi-ên", "Ezekiel"],
  ["DAN", "Đa-ni-ên", "Daniel"],
  ["HOS", "Ô-sê", "Hosea"],
  ["JOE", "Giô-ên", "Joel"],
  ["AMO", "A-mốt", "Amos"],
  ["OBA", "Áp-đia", "Obadiah"],
  ["JON", "Giô-na", "Jonah"],
  ["MIC", "Mi-chê", "Micah"],
  ["NAH", "Na-hum", "Nahum"],
  ["HAB", "Ha-ba-cúc", "Habakkuk"],
  ["ZEP", "Sô-phô-ni", "Zephaniah"],
  ["HAG", "A-ghê", "Haggai"],
  ["ZEC", "Xa-cha-ri", "Zechariah"],
  ["MAL", "Ma-la-chi", "Malachi"],
  ["MAT", "Ma-thi-ơ", "Matthew"],
  ["MAR", "Mác", "Mark"],
  ["LUK", "Lu-ca", "Luke"],
  ["JOH", "Giăng", "John"],
  ["ACT", "Công-vụ các Sứ-đồ", "Acts"],
  ["ROM", "Rô-ma", "Romans"],
  ["1CO", "1 Cô-rinh-tô", "1 Corinthians"],
  ["2CO", "2 Cô-rinh-tô", "2 Corinthians"],
  ["GAL", "Ga-la-ti", "Galatians"],
  ["EPH", "Ê-phê-sô", "Ephesians"],
  ["PHI", "Phi-líp", "Philippians"],
  ["COL", "Cô-lô-se", "Colossians"],
  ["1TH", "1 Tê-sa-lô-ni-ca", "1 Thessalonians"],
  ["2TH", "2 Tê-sa-lô-ni-ca", "2 Thessalonians"],
  ["1TI", "1 Ti-mô-thê", "1 Timothy"],
  ["2TI", "2 Ti-mô-thê", "2 Timothy"],
  ["TIT", "Tít", "Titus"],
  ["PHM", "Phi-lê-môn", "Philemon"],
  ["HEB", "Hê-bơ-rơ", "Hebrews"],
  ["JAM", "Gia-cơ", "James"],
  ["1PE", "1 Phi-e-rơ", "1 Peter"],
  ["2PE", "2 Phi-e-rơ", "2 Peter"],
  ["1JO", "1 Giăng", "1 John"],
  ["2JO", "2 Giăng", "2 John"],
  ["3JO", "3 Giăng", "3 John"],
  ["JUD", "Giu-đe", "Jude"],
  ["REV", "Khải-huyền", "Revelation"],
] as const;

export type Book = { code: string; name: string; slug: string; order: number };

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[\s-]+/g, "-");
}

export const BOOKS_VI: readonly Book[] = TABLE.map(([code, vi], i) => ({
  code,
  name: vi,
  slug: slugify(vi),
  order: i + 1,
}));

export const BOOKS_EN: readonly Book[] = TABLE.map(([code, , en], i) => ({
  code,
  name: en,
  slug: slugify(en),
  order: i + 1,
}));

/** Default Vietnamese book table (kept for backward compatibility). */
export const BOOKS: readonly Book[] = BOOKS_VI;

export const booksFor = (locale: Locale = "vi"): readonly Book[] => (locale === "en" ? BOOKS_EN : BOOKS_VI);

const byNameVi = new Map(BOOKS_VI.map((b) => [b.name, b]));
const bySlugVi = new Map(BOOKS_VI.map((b) => [b.slug, b]));
const byCodeVi = new Map(BOOKS_VI.map((b) => [b.code, b]));

const byNameEn = new Map(BOOKS_EN.map((b) => [b.name, b]));
// Natural English singular / alternate full forms accepted in citations:
byNameEn.set("Psalm", byCodeVi.has("PSA") ? BOOKS_EN[18] : BOOKS_EN[0]);
byNameEn.set("Song of Songs", BOOKS_EN[21]);

const bySlugEn = new Map(BOOKS_EN.map((b) => [b.slug, b]));
const byCodeEn = new Map(BOOKS_EN.map((b) => [b.code, b]));

export const bookByName = (name: string, locale: Locale = "vi"): Book | undefined =>
  (locale === "en" ? byNameEn : byNameVi).get(name);

export const bookBySlug = (slug: string, locale: Locale = "vi"): Book | undefined =>
  (locale === "en" ? bySlugEn : bySlugVi).get(slug);

export const bookByCode = (code: string, locale: Locale = "vi"): Book | undefined =>
  (locale === "en" ? byCodeEn : byCodeVi).get(code);

/** Looks up a book from either a Vietnamese or English slug and returns it in `targetLocale`. */
export function bookFromAnySlug(slug: string, targetLocale: Locale = "vi"): Book | undefined {
  const found = bySlugVi.get(slug) ?? bySlugEn.get(slug);
  return found ? bookByCode(found.code, targetLocale) : undefined;
}

/** Stable canonical storage slug (Vietnamese slug) used as the history key across locales. */
export function canonicalBookSlug(slugOrCode: string): string | undefined {
  const byCode = byCodeVi.get(slugOrCode);
  if (byCode) return byCode.slug;
  const fromAny = bookFromAnySlug(slugOrCode, "vi");
  return fromAny?.slug;
}

/** Translates a book slug (VI or EN) into the target locale's slug. */
export function translateBookSlug(slug: string, targetLocale: Locale): string | undefined {
  return bookFromAnySlug(slug, targetLocale)?.slug;
}

/** The 39 books up to Ma-la-chi / Malachi are the Old Testament. */
export const testamentOf = (book: Book): "cu-uoc" | "tan-uoc" => (book.order <= 39 ? "cu-uoc" : "tan-uoc");
