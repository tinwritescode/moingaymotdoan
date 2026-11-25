import { describe, expect, it } from "vitest";
import { BOOKS_EN, BOOKS_VI, bookByName, bookBySlug, bookFromAnySlug, canonicalBookSlug } from "../content/books";
import {
  alternatePath,
  canonicalMoodGroupId,
  canonicalMoodId,
  chapterHref,
  localeFromPath,
  messagesFor,
  MOOD_GROUP_IDS,
  MOOD_SLUG_PAIRS,
  moodGroupIdFor,
  moodHref,
  moodSlugFor,
} from "./index";

describe("i18n locale, books, and route mapping", () => {
  it("detects locale from pathname", () => {
    expect(localeFromPath("/")).toBe("vi");
    expect(localeFromPath("/thi-thien/23")).toBe("vi");
    expect(localeFromPath("/cam-xuc")).toBe("vi");
    expect(localeFromPath("/en")).toBe("en");
    expect(localeFromPath("/en/")).toBe("en");
    expect(localeFromPath("/en/psalms/23")).toBe("en");
    expect(localeFromPath("/en/moods/joy")).toBe("en");
    // Paths merely starting with "/en" as a prefix of a word stay Vietnamese
    expect(localeFromPath("/english-book/1")).toBe("vi");
  });

  it("maps all 66 books cleanly between Vietnamese and English", () => {
    expect(BOOKS_VI).toHaveLength(66);
    expect(BOOKS_EN).toHaveLength(66);
    expect(new Set(BOOKS_EN.map((b) => b.slug)).size).toBe(66);
    expect(bookByName("Psalms", "en")?.code).toBe("PSA");
    expect(bookByName("Psalm", "en")?.code).toBe("PSA");
    expect(bookByName("Song of Solomon", "en")?.code).toBe("SOL");
    expect(bookByName("Song of Songs", "en")?.code).toBe("SOL");
    expect(bookBySlug("genesis", "en")?.name).toBe("Genesis");
    expect(bookFromAnySlug("psalms", "vi")?.slug).toBe("thi-thien");
    expect(bookFromAnySlug("thi-thien", "en")?.slug).toBe("psalms");
    expect(canonicalBookSlug("psalms")).toBe("thi-thien");
    expect(canonicalBookSlug("PSA")).toBe("thi-thien");
  });

  it("maps all 100 mood slugs and 8 group IDs 1-to-1", () => {
    expect(MOOD_GROUP_IDS).toHaveLength(8);
    expect(MOOD_SLUG_PAIRS).toHaveLength(100);
    expect(new Set(MOOD_SLUG_PAIRS.map(([vi]) => vi)).size).toBe(100);
    expect(new Set(MOOD_SLUG_PAIRS.map(([, en]) => en)).size).toBe(100);

    for (const [vi, en] of MOOD_SLUG_PAIRS) {
      expect(canonicalMoodId(vi)).toBe(vi);
      expect(canonicalMoodId(en)).toBe(vi);
      expect(moodSlugFor(vi, "en")).toBe(en);
      expect(moodSlugFor(en, "vi")).toBe(vi);
    }

    for (const [vi, en] of MOOD_GROUP_IDS) {
      expect(canonicalMoodGroupId(vi)).toBe(vi);
      expect(canonicalMoodGroupId(en)).toBe(vi);
      expect(moodGroupIdFor(vi, "en")).toBe(en);
      expect(moodGroupIdFor(en, "vi")).toBe(vi);
    }
  });

  it("translates every route path symmetrically between vi and en", () => {
    const pairs: [string, string][] = [
      ["/", "/en"],
      ["/thi-thien/23", "/en/psalms/23"],
      ["/sang-the-ky/1", "/en/genesis/1"],
      ["/1-co-rinh-to/13", "/en/1-corinthians/13"],
      ["/cam-xuc", "/en/moods"],
      ["/cam-xuc/vui-mung", "/en/moods/joy"],
      ["/cam-xuc/lo-au-tuong-lai", "/en/moods/anxiety-about-the-future"],
      ["/lich-su", "/en/history"],
      ["/tai-khoan", "/en/account"],
      ["/ebook", "/en/ebook"],
    ];

    for (const [vi, en] of pairs) {
      expect(alternatePath(vi, "en")).toBe(en);
      expect(alternatePath(en, "vi")).toBe(vi);
      expect(alternatePath(vi, "vi")).toBe(vi);
      expect(alternatePath(en, "en")).toBe(en);
    }

    expect(chapterHref({ slug: "psalms", number: 23, locale: "en" })).toBe("/en/psalms/23");
    expect(moodHref("joy", "en")).toBe("/en/moods/joy");
  });

  it("provides complete localized UI dictionaries for both locales", () => {
    expect(messagesFor("vi").header.brand).toBe("Kinh Thánh");
    expect(messagesFor("en").header.brand).toBe("Bible");
    expect(messagesFor("en").display.previewVerse).toContain("The LORD is my shepherd");
  });
});
