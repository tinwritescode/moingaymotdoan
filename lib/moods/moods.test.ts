import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createContent } from "../content";
import { MOOD_SLUG_PAIRS } from "../i18n/mood-slugs";
import {
  auditMoods,
  createMoodCatalog,
  matchesMood,
  MOOD_DEFINITIONS,
  MOOD_DEFINITIONS_EN,
  MOOD_GROUPS,
  MOOD_GROUPS_EN,
  normalizeSearch,
} from "./index";

const ROOT = join(import.meta.dirname, "..", "..");
const content = createContent({
  contentDir: join(ROOT, "content"),
  bibleDir: join(ROOT, "data", "bible"),
  locale: "vi",
});
const catalog = createMoodCatalog({ content, locale: "vi" });

const contentEn = createContent({
  contentDir: join(ROOT, "content-en"),
  bibleDir: join(ROOT, "data", "bible-en"),
  locale: "en",
});
const catalogEn = createMoodCatalog({ content: contentEn, locale: "en" });

describe("chuyên mục đọc Kinh Thánh theo cảm xúc (VI)", () => {
  it("có đủ 100 chuyên mục thuộc 8 nhóm, mỗi chuyên mục có ít nhất 4 câu Kinh Thánh hợp lệ", () => {
    const idx = catalog.index();
    expect(idx.groups).toHaveLength(8);
    expect(idx.moods).toHaveLength(100);
    expect(MOOD_DEFINITIONS).toHaveLength(100);

    for (const g of MOOD_GROUPS) {
      const inGroup = idx.moods.filter((m) => m.groupId === g.id);
      expect(inGroup.length).toBeGreaterThanOrEqual(10);
    }

    for (const summary of idx.moods) {
      expect(summary.passageCount).toBeGreaterThanOrEqual(4);
      expect(summary.books.length).toBeGreaterThan(0);
      const view = catalog.mood(summary.slug);
      expect(view).not.toBeNull();
      expect(view?.passages.length).toBe(summary.passageCount);
      for (const p of view?.passages ?? []) {
        expect(p.ref.verses.length).toBeGreaterThan(0);
        for (const v of p.ref.verses) {
          expect(v.text.trim().length).toBeGreaterThan(0);
        }
        expect(p.hasChapter).toBe(true);
        expect(p.chapterTitle).toBeTruthy();
      }
      expect(view?.related.length).toBe(4);
    }
  });

  it("slug không tồn tại trả về null", () => {
    expect(catalog.mood("khong-ton-tai")).toBeNull();
  });

  it("tìm kiếm không dấu khớp cả cảm xúc lẫn tên sách Kinh Thánh", () => {
    expect(normalizeSearch("Đang bị cám dỗ mạnh mẽ")).toBe("dang bi cam do manh me");
    expect(normalizeSearch("Buồn   bã")).toBe("buon ba");
    const buon = catalog.index().moods.find((m) => m.slug === "buon-ba");
    expect(buon).toBeDefined();
    expect(matchesMood(buon!, normalizeSearch("thi-thien"))).toBe(true);
    expect(matchesMood(buon!, normalizeSearch("buon"))).toBe(true);
  });
});

// Cổng chất lượng nội dung: chạy riêng một nhóm bằng `pnpm vitest run lib/moods -t "<groupId>"`.
describe("chuẩn chất lượng nội dung (VI)", () => {
  const views = catalog.index().moods.flatMap((m) => catalog.mood(m.slug) ?? []);
  const issues = auditMoods(views, "vi");

  it.each(MOOD_GROUPS.map((g) => g.id))("nhóm %s đạt chuẩn (6 đoạn, cầu nguyện, trích đúng nguyên văn)", (groupId) => {
    expect(issues.filter((i) => i.groupId === groupId).map((i) => `${i.slug}: ${i.message}`)).toEqual([]);
  });
});

describe("English mood guides (BSB)", () => {
  it("has all 100 moods across 8 groups aligned 1-to-1 with MOOD_SLUG_PAIRS and valid BSB verses", () => {
    const idx = catalogEn.index();
    expect(idx.groups).toHaveLength(8);
    expect(idx.moods).toHaveLength(100);
    expect(MOOD_DEFINITIONS_EN).toHaveLength(100);
    expect(idx.moods.map((m) => m.slug)).toEqual(MOOD_SLUG_PAIRS.map(([, en]) => en));

    for (const summary of idx.moods) {
      const view = catalogEn.mood(summary.slug);
      expect(view).not.toBeNull();
      expect(view?.passages).toHaveLength(6);
      for (const p of view?.passages ?? []) {
        expect(p.ref.verses.length).toBeGreaterThan(0);
        for (const v of p.ref.verses) {
          expect(v.text.trim().length).toBeGreaterThan(0);
        }
      }
      expect(view?.related).toHaveLength(4);
    }

    const sadness = idx.moods.find((m) => m.slug === "sadness");
    expect(sadness).toBeDefined();
    expect(matchesMood(sadness!, normalizeSearch("psalms"))).toBe(true);
    expect(matchesMood(sadness!, normalizeSearch("sad"))).toBe(true);
  });

  const viewsEn = catalogEn.index().moods.flatMap((m) => catalogEn.mood(m.slug) ?? []);
  const issuesEn = auditMoods(viewsEn, "en");

  it.each(MOOD_GROUPS_EN.map((g) => g.id))(
    "English group %s passes full mood audit (6 passages, prayer, exact BSB quotes)",
    (groupId) => {
      expect(issuesEn.filter((i) => i.groupId === groupId).map((i) => `${i.slug}: ${i.message}`)).toEqual([]);
    },
  );
});
