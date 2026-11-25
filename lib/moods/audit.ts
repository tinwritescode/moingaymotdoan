import { testamentOf } from "../content/books";
import { normalizeSearch } from "./search";
import type { MoodView } from "./types";

/** Chuẩn nội dung mỗi chuyên mục: đủ dày, đa dạng, trích đúng nguyên văn Bản Truyền Thống. */
export const MOOD_STANDARD = {
  passages: 6,
  minBooks: 4,
  maxVersesPerPassage: 10,
  maxMoodsPerVerse: 3,
  note: { min: 50, max: 220 },
  prayer: { min: 80, max: 320 },
} as const;

export type MoodIssue = { slug: string; groupId: string; message: string };

/** Bỏ dấu, bỏ dấu câu, gom khoảng trắng: so trích dẫn với nguyên văn không vấp vì dấu câu. */
const plain = (text: string) =>
  normalizeSearch(text)
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Các cụm người viết đặt trong ngoặc kép hoặc ngoặc đơn, tách theo dấu "…" nếu trích lược. */
export function quotedPieces(note: string): string[] {
  const pieces: string[] = [];
  for (const re of [/“([^”]+)”/g, /"([^"]+)"/g, /'([^']+)'/g]) {
    for (const m of note.matchAll(re)) {
      for (const piece of m[1].split(/…|\.\.\./)) {
        if (plain(piece)) pieces.push(piece.trim());
      }
    }
  }
  return pieces;
}

/** Kiểm tra từng chuyên mục và cả kho: trả về danh sách lỗi, rỗng nghĩa là đạt chuẩn. */
export function auditMoods(views: readonly MoodView[]): MoodIssue[] {
  const issues: MoodIssue[] = [];
  const moodsByVerse = new Map<string, Set<string>>();

  for (const view of views) {
    const add = (message: string) => issues.push({ slug: view.slug, groupId: view.group.id, message });
    const s = MOOD_STANDARD;

    if (view.passages.length !== s.passages) {
      add(`cần đúng ${s.passages} đoạn, đang có ${view.passages.length}`);
    }
    if (!view.prayer) {
      add("thiếu lời cầu nguyện (prayer)");
    } else if (view.prayer.length < s.prayer.min || view.prayer.length > s.prayer.max) {
      add(`lời cầu nguyện dài ${view.prayer.length} ký tự, cần ${s.prayer.min}–${s.prayer.max}`);
    }

    const books = new Set(view.passages.map((p) => p.ref.book.code));
    if (books.size < s.minBooks) add(`chỉ lấy từ ${books.size} sách, cần ít nhất ${s.minBooks}`);
    const testaments = new Set(view.passages.map((p) => testamentOf(p.ref.book)));
    if (testaments.size < 2) add("cần có cả Cựu Ước lẫn Tân Ước");

    view.passages.forEach((p, i) => {
      const label = p.ref.label;
      if (p.ref.verses.length > s.maxVersesPerPassage) {
        add(`${label}: ${p.ref.verses.length} câu, tối đa ${s.maxVersesPerPassage}`);
      }
      if (p.note.length < s.note.min || p.note.length > s.note.max) {
        add(`${label}: lời gợi ý dài ${p.note.length} ký tự, cần ${s.note.min}–${s.note.max}`);
      }
      // Bọc khoảng trắng để so nguyên từ: "co" không được khớp nhầm vào "con".
      const verseText = ` ${plain(p.ref.verses.map((v) => v.text).join(" "))} `;
      for (const piece of quotedPieces(p.note)) {
        if (!verseText.includes(` ${plain(piece)} `)) {
          add(`${label}: trích "${piece}" không khớp nguyên văn Bản Truyền Thống`);
        }
      }
      for (const other of view.passages.slice(i + 1)) {
        const sameChapter = other.ref.book.code === p.ref.book.code && other.ref.chapter === p.ref.chapter;
        const last = (ref: typeof p.ref) => ref.verses[ref.verses.length - 1].number;
        const overlaps =
          sameChapter && other.ref.verses[0].number <= last(p.ref) && p.ref.verses[0].number <= last(other.ref);
        if (overlaps) add(`${label} và ${other.ref.label} chồng câu lên nhau`);
      }
      for (const v of p.ref.verses) {
        const key = `${p.ref.book.code} ${p.ref.chapter}:${v.number}`;
        const set = moodsByVerse.get(key) ?? new Set<string>();
        set.add(view.slug);
        moodsByVerse.set(key, set);
      }
    });
  }

  const groupOf = new Map(views.map((v) => [v.slug, v.group.id]));
  for (const [verse, slugs] of moodsByVerse) {
    if (slugs.size <= MOOD_STANDARD.maxMoodsPerVerse) continue;
    for (const slug of slugs) {
      issues.push({
        slug,
        groupId: groupOf.get(slug) ?? "",
        message: `câu ${verse} dùng ở ${slugs.size} chuyên mục (${[...slugs].join(", ")}), tối đa ${MOOD_STANDARD.maxMoodsPerVerse}`,
      });
    }
  }
  return issues;
}
