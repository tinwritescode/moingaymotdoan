import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CARD_VERSES, cardVerse } from "./card-verses";

const bible = (dir: string, code: string): string[][] =>
  JSON.parse(readFileSync(join(import.meta.dirname, "..", "..", "data", dir, `${code}.json`), "utf8")).chapters;
// Case, quote marks and a closing stop may differ from the printed verse; the words may not.
const words = (s: string) =>
  s
    .toLocaleLowerCase("vi")
    .replace(/[“”"‘’]/g, "")
    .replace(/[.;:,!?\s]+$/, "")
    .trim();

describe("card verses", () => {
  it.each(CARD_VERSES.map((v) => [`${v.code} ${v.chapter}:${v.verse}`, v] as const))(
    "%s is (part of) that verse in both Bibles, short enough for two lines",
    (_, v) => {
      expect(words(bible("bible", v.code)[v.chapter - 1][v.verse - 1])).toContain(words(v.vi));
      expect(words(bible("bible-en", v.code)[v.chapter - 1][v.verse - 1])).toContain(words(v.en));
      expect(v.vi.length).toBeLessThanOrEqual(86);
      expect(v.en.length).toBeLessThanOrEqual(86);
    },
  );

  it("prints the reference in the reader's language, a single psalm as Psalm", () => {
    const day = Array.from({ length: 400 }, (_, i) => `2026-01-01+${i}`).find((d) => cardVerse("vi", null, d).ref === "Thi-thiên 119:105");
    expect(day).toBeDefined();
    expect(cardVerse("en", null, day ?? "")).toEqual({ text: CARD_VERSES[0].en, ref: "Psalm 119:105" });
  });

  it("keeps one verse for a reader all day, and changes it across days and readers", () => {
    expect(cardVerse("vi", "user_a", "2026-11-28")).toEqual(cardVerse("vi", "user_a", "2026-11-28"));
    const month = Array.from({ length: 30 }, (_, i) => `2026-11-${String(i + 1).padStart(2, "0")}`);
    const a = month.map((d) => cardVerse("vi", "user_a", d).ref);
    const b = month.map((d) => cardVerse("vi", "user_b", d).ref);
    expect(new Set(a).size).toBeGreaterThanOrEqual(15);
    expect(a.filter((ref, i) => ref !== b[i]).length).toBeGreaterThanOrEqual(20);
    expect(new Set(month.map((d) => cardVerse("vi", null, d).ref)).size).toBeGreaterThanOrEqual(15);
  });
});
