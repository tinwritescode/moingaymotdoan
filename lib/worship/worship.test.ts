import { describe, expect, it } from "vitest";
import { normalizeSearch } from "../moods/search";
import {
  buildCreedSlides,
  buildHymnSlides,
  buildKtddSlides,
  buildPptx,
  formatKtddCopyText,
  formatSongCopyText,
  hasProgramItem,
  isWorshipTab,
  loadKtdd,
  loadThanhCa,
  loadTinDieu,
  loadTvchh,
  matchesHymn,
  matchesKtdd,
  moveProgramItem,
  parseProgramStorage,
  pptxFilename,
  programItemId,
  removeProgramItem,
  resolveScriptureChapterHref,
  thanhCaBeatUrl,
  toggleProgramItem,
} from "./index";

const VNI_MOJIBAKE_RE = /[\u00f8\u00d8\u00fb\u00db\u00ef\u00cf\u00e5\u00c5\u00e4\u00c4\u00fc\u00dc\u00eb\u00cb\u00f6\u00d6\u00f1\u00d1\u00e6\u00c6\u00ee\u00ce]/;

describe("worship datasets integrity", () => {
  it("loads complete 903 Thánh Ca with categories and lyrics", () => {
    const tc = loadThanhCa();
    expect(tc.categories).toHaveLength(13);
    expect(tc.songs).toHaveLength(903);
    expect(tc.songs.every((s) => s.stanzas.length > 0)).toBe(true);
    expect(tc.songs[0].title).toBe("Cúi Xin Vua Thánh Ngự Lai");
  });

  it("loads complete 387 TVCHH with decoded Unicode lyrics and no VNI mojibake", () => {
    const tv = loadTvchh();
    expect(tv.songs).toHaveLength(387);
    expect(tv.songs.every((s) => s.stanzas.length > 0)).toBe(true);
    const bad = tv.songs.filter((s) => s.stanzas.some((st) => VNI_MOJIBAKE_RE.test(st.text)));
    expect(bad).toEqual([]);
  });

  it("loads complete 100 Kinh Thánh Đối Đáp with turns", () => {
    const kt = loadKtdd();
    expect(kt.readings).toHaveLength(100);
    expect(kt.readings.every((r) => r.turns.length > 0)).toBe(true);
    expect(kt.categories.length).toBeGreaterThan(0);
  });

  it("loads Bài Tín Điều Các Sứ Đồ with 12 clauses and liturgy prayers", () => {
    const td = loadTinDieu();
    expect(td.creed.clauses).toHaveLength(12);
    expect(td.creed.verbatimText).toContain("Tôi tin Đức Chúa Trời");
    expect(td.liturgy.lordsPrayer.verbatimText).toContain("Lạy Cha chúng con");
    expect(td.liturgy.benediction.verbatimText.length).toBeGreaterThan(20);
  });
});

describe("worship search, citation links, copy formatting, and slides", () => {
  it("validates tab identifiers", () => {
    expect(isWorshipTab("thanh-ca")).toBe(true);
    expect(isWorshipTab("tvchh")).toBe(true);
    expect(isWorshipTab("doi-dap")).toBe(true);
    expect(isWorshipTab("tin-dieu")).toBe(true);
    expect(isWorshipTab("other")).toBe(false);
    expect(isWorshipTab(null)).toBe(false);
  });

  it("matches hymns by number, accent-insensitive title, or opening line", () => {
    const tc = loadThanhCa();
    const first = tc.songs[0];
    expect(matchesHymn(first, normalizeSearch("#1"))).toBe(true);
    expect(matchesHymn(first, normalizeSearch("001"))).toBe(true);
    expect(matchesHymn(first, normalizeSearch("cui xin vua"))).toBe(true);
    expect(matchesHymn(first, normalizeSearch("cung chuc danh ngai"))).toBe(false);
    expect(matchesHymn(first, normalizeSearch("ngu lai"))).toBe(true);
  });

  it("matches KTĐĐ by number, title, or scripture ref", () => {
    const kt = loadKtdd();
    const first = kt.readings[0];
    expect(matchesKtdd(first, normalizeSearch("1"))).toBe(true);
    expect(matchesKtdd(first, normalizeSearch("tao hoa"))).toBe(true);
    expect(matchesKtdd(first, normalizeSearch("e-sai 40"))).toBe(true);
  });

  it("resolves Vietnamese scripture citations (including Roman numerals) to chapter URLs", () => {
    expect(resolveScriptureChapterHref("Khải-huyền 4:8", "vi")).toBe("/khai-huyen/4");
    expect(resolveScriptureChapterHref("Khải-huyền 4:8", "en")).toBe("/en/revelation/4");
    expect(resolveScriptureChapterHref("I Cô-rinh-tô 8:6", "vi")).toBe("/1-co-rinh-to/8");
    expect(resolveScriptureChapterHref("Sáng-thế Ký 1:1-6", "vi")).toBe("/sang-the-ky/1");
    expect(resolveScriptureChapterHref("Unknown 1:1", "vi")).toBeNull();
  });

  it("formats copy text and builds presentation slide decks", () => {
    const tc = loadThanhCa().songs[0];
    expect(formatSongCopyText(tc)).toContain("TC 001 — Cúi Xin Vua Thánh Ngự Lai");
    expect(buildHymnSlides(tc).length).toBe(tc.stanzas.length + 1);

    const kt = loadKtdd().readings[0];
    const ktCopy = formatKtddCopyText(kt, { leader: "Hướng dẫn", congregation: "Hội chúng" });
    expect(ktCopy).toContain("Hướng dẫn:");
    expect(ktCopy).toContain("Hội chúng:");
    expect(buildKtddSlides(kt, { leader: "Hướng dẫn", congregation: "Hội chúng" }).length).toBe(kt.turns.length + 1);

    const td = loadTinDieu();
    expect(buildCreedSlides(td).length).toBe(15);
    expect(thanhCaBeatUrl(1)).toBe("https://audio.httlvn.org/TC/thanh-ca/beat/1.mp3");
  });

  it("generates a valid stored ZIP PPTX archive with escaped Vietnamese XML slides", () => {
    const tc = loadThanhCa().songs[0];
    const slides = [
      ...buildHymnSlides(tc),
      { badge: "Test & <Check>", body: 'Lời "trích" & kiểm tra <tag>', emphasis: true, footer: "Ghi chú" },
    ];
    const bytes = buildPptx(slides);
    // ZIP local file header magic PK\x03\x04 and End of Central Directory PK\x05\x06
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);
    expect(bytes[2]).toBe(0x03);
    expect(bytes[3]).toBe(0x04);
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain("[Content_Types].xml");
    expect(text).toContain("ppt/presentation.xml");
    expect(text).toContain(`ppt/slides/slide${slides.length}.xml`);
    expect(text).toContain("Cúi Xin Vua Thánh Ngự Lai");
    expect(text).toContain("Test &amp; &lt;Check&gt;");
    expect(text).toContain("Lời &quot;trích&quot; &amp; kiểm tra &lt;tag&gt;");
    expect(pptxFilename("thanh-ca-1", tc.title)).toBe("thanh-ca-1-cui-xin-vua-thanh-ngu-lai.pptx");
  });

  it("manages worship program add/remove/reorder and validates storage JSON", () => {
    const a = { kind: "thanh-ca" as const, number: 1, code: "TC 001", title: "Cúi Xin Vua Thánh Ngự Lai" };
    const b = { kind: "tin-dieu" as const, code: "Tín điều CSĐ", title: "Bài Tín Điều Các Sứ Đồ" };
    let list = toggleProgramItem([], a);
    list = toggleProgramItem(list, b);
    expect(list).toHaveLength(2);
    expect(hasProgramItem(list, programItemId(a))).toBe(true);

    list = moveProgramItem(list, 1, -1);
    expect(list.map(programItemId)).toEqual(["tin-dieu", "thanh-ca:1"]);

    list = removeProgramItem(list, "tin-dieu");
    expect(list.map(programItemId)).toEqual(["thanh-ca:1"]);

    // Boundary validation on corrupted / duplicate storage input
    const parsed = parseProgramStorage(
      JSON.stringify([a, a, { kind: "thanh-ca", number: -5, code: "bad", title: "bad" }, { kind: "other" }, b]),
    );
    expect(parsed.map(programItemId)).toEqual(["thanh-ca:1", "tin-dieu"]);
    expect(parseProgramStorage("{invalid-json")).toEqual([]);
  });
});
