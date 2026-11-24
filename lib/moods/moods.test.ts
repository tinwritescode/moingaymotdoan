import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createContent } from "../content";
import { createMoodCatalog, MOOD_DEFINITIONS, MOOD_GROUPS, normalizeSearch } from "./index";

const ROOT = join(import.meta.dirname, "..", "..");
const content = createContent({
  contentDir: join(ROOT, "content"),
  bibleDir: join(ROOT, "data", "bible"),
});
const catalog = createMoodCatalog({ content });

describe("chuyên mục đọc Kinh Thánh theo cảm xúc", () => {
  it("có đủ 100 chuyên mục thuộc 8 nhóm, mỗi chuyên mục có ít nhất 4 câu Kinh Thánh hợp lệ", () => {
    const idx = catalog.index("nhap");
    expect(idx.groups).toHaveLength(8);
    expect(idx.moods).toHaveLength(100);
    expect(MOOD_DEFINITIONS).toHaveLength(100);

    for (const g of MOOD_GROUPS) {
      const inGroup = idx.moods.filter((m) => m.groupId === g.id);
      expect(inGroup.length).toBeGreaterThanOrEqual(10);
    }

    for (const summary of idx.moods) {
      expect(summary.passageCount).toBeGreaterThanOrEqual(4);
      const view = catalog.mood({ slug: summary.slug, mode: "nhap" });
      expect(view).not.toBeNull();
      expect(view?.passages.length).toBe(summary.passageCount);
      for (const p of view?.passages ?? []) {
        expect(p.ref.verses.length).toBeGreaterThan(0);
        for (const v of p.ref.verses) {
          expect(v.text.trim().length).toBeGreaterThan(0);
        }
        // Ở chế độ nháp, toàn bộ 1.189 đoạn đã có ghi chú nên mọi chỗ dẫn đều có link đọc đoạn.
        expect(p.hasChapter).toBe(true);
        expect(p.chapterTitle).toBeTruthy();
      }
      expect(view?.related.length).toBe(4);
    }
  });

  it("chế độ công bố chỉ bật liên kết đoạn cho các đoạn đã duyệt", () => {
    const view = catalog.mood({ slug: "vui-mung", mode: "cong-bo" });
    expect(view).not.toBeNull();
    const published = new Set(
      content.toc("cong-bo").flatMap((b) => b.chapters.map((c) => `${b.book.code}:${c.number}`)),
    );
    for (const p of view?.passages ?? []) {
      const key = `${p.ref.book.code}:${p.ref.chapter}`;
      expect(p.hasChapter).toBe(published.has(key));
    }
  });

  it("slug không tồn tại trả về null", () => {
    expect(catalog.mood({ slug: "khong-ton-tai", mode: "nhap" })).toBeNull();
  });

  it("normalizeSearch bỏ dấu tiếng Việt và chữ đ chính xác", () => {
    expect(normalizeSearch("Đang bị cám dỗ mạnh mẽ")).toBe("dang bi cam do manh me");
    expect(normalizeSearch("Buồn   bã")).toBe("buon ba");
  });
});
