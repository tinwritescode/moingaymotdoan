import type { MoodSummary } from "./types";

/** Bỏ dấu tiếng Việt và đưa về chữ thường để tìm kiếm nhanh không phân biệt dấu. */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Kiểm tra một chuyên mục có khớp từ khóa người dùng gõ không (khớp từng từ, không phân biệt dấu). */
export function matchesMood(mood: MoodSummary, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  const haystack = normalizeSearch(`${mood.title} ${mood.prompt} ${mood.keywords.join(" ")}`);
  return normalizedQuery.split(" ").every((term) => haystack.includes(term));
}
