// Imports the Berean Standard Bible (eBible.org "engbsb", CC0 public domain) into data/bible-en/<CODE>.json.
// Re-runnable: the same download always produces the same files.
// Usage: node scripts/import-bible-en.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL = "https://ebible.org/Scriptures/engbsb_vpl.zip";
const OUT = join(import.meta.dirname, "..", "data", "bible-en");

// BSB follows the modern critical Greek text and omits 16 traditional verses.
// Keeping "" at their 1-based slot preserves direct chapters[c - 1][v - 1] indexing.
const EXPECTED_GAPS = new Set([
  "MAT 17:21",
  "MAT 18:11",
  "MAT 23:14",
  "MAR 7:16",
  "MAR 9:44",
  "MAR 9:46",
  "MAR 11:26",
  "MAR 15:28",
  "LUK 17:36",
  "LUK 23:17",
  "JOH 5:4",
  "ACT 8:37",
  "ACT 15:34",
  "ACT 24:7",
  "ACT 28:29",
  "ROM 16:24",
]);

const work = mkdtempSync(join(tmpdir(), "engbsb-"));
try {
  const zip = join(work, "vpl.zip");
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${URL}`);
  writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  const text = execFileSync("unzip", ["-p", zip, "engbsb_vpl.txt"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  /** @type {Map<string, string[][]>} */
  const books = new Map();
  const seenGaps = new Set();

  for (const raw of text.split("\n")) {
    const line = raw.replace(/^\uFEFF/, "").trim();
    if (line === "") continue;
    const m = /^(\S+) (\d+):(\d+) (.*)$/.exec(line);
    if (!m) throw new Error(`Unparsed line: ${line}`);
    const [, code, c, v, verse] = m;
    const chapters = books.get(code) ?? [];
    books.set(code, chapters);
    const chapter = Number(c);
    const number = Number(v);

    if (chapter === chapters.length + 1) chapters.push([]);
    if (chapter !== chapters.length) {
      throw new Error(`Chapter out of order: ${code} ${c}:${v}`);
    }
    const verses = chapters[chapter - 1];
    while (verses.length + 1 < number) {
      const gapRef = `${code} ${chapter}:${verses.length + 1}`;
      if (!EXPECTED_GAPS.has(gapRef)) {
        throw new Error(`Unexpected verse gap: ${gapRef}`);
      }
      seenGaps.add(gapRef);
      verses.push("");
    }
    if (number !== verses.length + 1) {
      throw new Error(`Verse out of order: ${code} ${c}:${v}`);
    }
    const cleaned = verse.trim();
    if (!cleaned) throw new Error(`Empty verse text: ${code} ${c}:${v}`);
    verses.push(cleaned);
  }

  if (books.size !== 66) throw new Error(`Expected 66 books, got ${books.size}`);
  for (const gap of EXPECTED_GAPS) {
    if (!seenGaps.has(gap)) throw new Error(`Expected gap no longer present: ${gap}`);
  }

  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  for (const [code, chapters] of books) {
    writeFileSync(join(OUT, `${code}.json`), JSON.stringify({ code, chapters }) + "\n");
  }
  console.log(`Wrote ${books.size} books to ${OUT} (${seenGaps.size} critical-text verse gaps preserved)`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
