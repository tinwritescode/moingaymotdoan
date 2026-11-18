// Imports Bản Truyền Thống (eBible.org "vie1934", public domain) into data/bible/<CODE>.json.
// Re-runnable: the same download always produces the same files.
// Usage: node scripts/import-bible.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL = "https://ebible.org/Scriptures/vie1934_vpl.zip";
const OUT = join(import.meta.dirname, "..", "data", "bible");

// The eBible text keeps some capitals in the old VNI encoding: "Aùp-ra-ham" is Áp-ra-ham, "Oâng" is Ông.
// The second character carries the marks: a tone, a hat (â, the circumflex), or both.
const TONE = { "́": "ùáéú", "̀": "øàè", "̉": "ûå", "̃": "õãü", "̣": "ïäë" };
const HAT = { "̂": "âáàåãä", "̆": "êéèúüë" };
const markOf = (table, ch) => Object.keys(table).find((m) => table[m].includes(ch)) ?? "";
const VNI_CAPITAL = /(?<!\p{L})([AEIOUY])([ùøûõïâáàåãäêéèüë])/gu;
// Four verses came through in a second broken encoding; these are decoded by hand.
const BROKEN = {
  "GEN 40:12": "Giô-sép nói: Ý-nghĩa chiêm bao đó là thể nầy: Ba nhánh nho tức là ba ngày.",
  "GEN 40:18": "Giô-sép đáp rằng: Ý-nghĩa chiêm bao nầy là, ba giỏ tức là ba ngày.",
  "ISA 55:8": "Đức Giê-hô-va phán: Ý tưởng ta chẳng phải ý tưởng các ngươi, đường lối các ngươi chẳng phải đường lối ta.",
  "MAT 6:10": "Nước Cha được đến; ý Cha được nên, ở đất như trời!",
};

function repair(ref, verse) {
  if (BROKEN[ref]) return BROKEN[ref];
  return verse
    .replace(VNI_CAPITAL, (_, base, mark) => (base + markOf(HAT, mark) + markOf(TONE, mark)).normalize("NFC"))
    .replace(/(?<!\p{L})ỗ/gu, "Í");
}

const VIETNAMESE = new Set("aàáảãạăằắẳẵặâầấẩẫậbcdđeèéẻẽẹêềếểễệfghiìíỉĩịjklmnoòóỏõọôồốổỗộơờớởỡợpqrstuùúủũụưừứửữựvwxyỳýỷỹỵz");
/** Self-check: no letter outside Vietnamese and no VNI capital left in the output. */
function assertClean(ref, verse) {
  const odd = [...verse].find((ch) => /\p{L}/u.test(ch) && !VIETNAMESE.has(ch.toLowerCase()));
  if (odd || VNI_CAPITAL.test(verse)) throw new Error(`Still broken: ${ref} ${verse}`);
  VNI_CAPITAL.lastIndex = 0;
}

const work = mkdtempSync(join(tmpdir(), "vie1934-"));
try {
  const zip = join(work, "vpl.zip");
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${URL}`);
  writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  const text = execFileSync("unzip", ["-p", zip, "vie1934_vpl.txt"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  /** @type {Map<string, string[][]>} */
  const books = new Map();
  for (const raw of text.split("\n")) {
    const line = raw.replace(/^﻿/, "").trim();
    if (line === "") continue;
    const m = /^(\S+) (\d+):(\d+) (.*)$/.exec(line);
    if (!m) throw new Error(`Unparsed line: ${line}`);
    const [, code, c, v, verse] = m;
    const chapters = books.get(code) ?? [];
    books.set(code, chapters);
    const chapter = Number(c);
    const number = Number(v);
    // Chapters and verses must arrive in order with no gaps, so arrays index them directly.
    if (chapter === chapters.length + 1) chapters.push([]);
    const verses = chapters[chapter - 1];
    if (chapter !== chapters.length || number !== verses.length + 1) {
      throw new Error(`Out of order: ${code} ${c}:${v}`);
    }
    const ref = `${code} ${c}:${v}`;
    const fixed = repair(ref, verse.trim());
    assertClean(ref, fixed);
    verses.push(fixed);
  }
  if (books.size !== 66) throw new Error(`Expected 66 books, got ${books.size}`);

  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  for (const [code, chapters] of books) {
    writeFileSync(join(OUT, `${code}.json`), JSON.stringify({ code, chapters }) + "\n");
  }
  console.log(`Wrote ${books.size} books to ${OUT}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
