// Canonical book names follow Bản Truyền Thống. The owner reviews this table once (see spec).
// `code` is the eBible VPL book code used by data/bible/<code>.json.
const TABLE = [
  ["GEN", "Sáng-thế Ký"],
  ["EXO", "Xuất Ê-díp-tô Ký"],
  ["LEV", "Lê-vi Ký"],
  ["NUM", "Dân-số Ký"],
  ["DEU", "Phục-truyền Luật-lệ Ký"],
  ["JOS", "Giô-suê"],
  ["JDG", "Các Quan Xét"],
  ["RUT", "Ru-tơ"],
  ["1SA", "1 Sa-mu-ên"],
  ["2SA", "2 Sa-mu-ên"],
  ["1KI", "1 Các Vua"],
  ["2KI", "2 Các Vua"],
  ["1CH", "1 Sử-ký"],
  ["2CH", "2 Sử-ký"],
  ["EZR", "E-xơ-ra"],
  ["NEH", "Nê-hê-mi"],
  ["EST", "Ê-xơ-tê"],
  ["JOB", "Gióp"],
  ["PSA", "Thi-thiên"],
  ["PRO", "Châm-ngôn"],
  ["ECC", "Truyền-đạo"],
  ["SOL", "Nhã-ca"],
  ["ISA", "Ê-sai"],
  ["JER", "Giê-rê-mi"],
  ["LAM", "Ca-thương"],
  ["EZE", "Ê-xê-chi-ên"],
  ["DAN", "Đa-ni-ên"],
  ["HOS", "Ô-sê"],
  ["JOE", "Giô-ên"],
  ["AMO", "A-mốt"],
  ["OBA", "Áp-đia"],
  ["JON", "Giô-na"],
  ["MIC", "Mi-chê"],
  ["NAH", "Na-hum"],
  ["HAB", "Ha-ba-cúc"],
  ["ZEP", "Sô-phô-ni"],
  ["HAG", "A-ghê"],
  ["ZEC", "Xa-cha-ri"],
  ["MAL", "Ma-la-chi"],
  ["MAT", "Ma-thi-ơ"],
  ["MAR", "Mác"],
  ["LUK", "Lu-ca"],
  ["JOH", "Giăng"],
  ["ACT", "Công-vụ các Sứ-đồ"],
  ["ROM", "Rô-ma"],
  ["1CO", "1 Cô-rinh-tô"],
  ["2CO", "2 Cô-rinh-tô"],
  ["GAL", "Ga-la-ti"],
  ["EPH", "Ê-phê-sô"],
  ["PHI", "Phi-líp"],
  ["COL", "Cô-lô-se"],
  ["1TH", "1 Tê-sa-lô-ni-ca"],
  ["2TH", "2 Tê-sa-lô-ni-ca"],
  ["1TI", "1 Ti-mô-thê"],
  ["2TI", "2 Ti-mô-thê"],
  ["TIT", "Tít"],
  ["PHM", "Phi-lê-môn"],
  ["HEB", "Hê-bơ-rơ"],
  ["JAM", "Gia-cơ"],
  ["1PE", "1 Phi-e-rơ"],
  ["2PE", "2 Phi-e-rơ"],
  ["1JO", "1 Giăng"],
  ["2JO", "2 Giăng"],
  ["3JO", "3 Giăng"],
  ["JUD", "Giu-đe"],
  ["REV", "Khải-huyền"],
] as const;

export type Book = { code: string; name: string; slug: string; order: number };

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[\s-]+/g, "-");
}

export const BOOKS: readonly Book[] = TABLE.map(([code, name], i) => ({
  code,
  name,
  slug: slugify(name),
  order: i + 1,
}));

const byName = new Map(BOOKS.map((b) => [b.name, b]));
const bySlug = new Map(BOOKS.map((b) => [b.slug, b]));

export const bookByName = (name: string): Book | undefined => byName.get(name);
export const bookBySlug = (slug: string): Book | undefined => bySlug.get(slug);
