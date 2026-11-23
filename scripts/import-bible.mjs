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
// "Yên" is already proper Unicode, not VNI for "Y̆n".
const VNI_CAPITAL = /(?<!\p{L})(?!Yên)([AEIOUY])([ùøûõïâáàåãäêéèüë])/gu;
// Four verses came through in a second broken encoding; these are decoded by hand.
const BROKEN = {
  "GEN 40:12": "Giô-sép nói: Ý-nghĩa chiêm bao đó là thể nầy: Ba nhánh nho tức là ba ngày.",
  "GEN 40:18": "Giô-sép đáp rằng: Ý-nghĩa chiêm bao nầy là, ba giỏ tức là ba ngày.",
  "ISA 55:8": "Đức Giê-hô-va phán: Ý tưởng ta chẳng phải ý tưởng các ngươi, đường lối các ngươi chẳng phải đường lối ta.",
  "MAT 6:10": "Nước Cha được đến; ý Cha được nên, ở đất như trời!",
};

// A third broken encoding left capital Ớ, Ở, Ồ, À, Ừ, Ổ as a lone lowercase letter ("ù Đa-vít!" is "Ớ Đa-vít!").
// Checked word by word against the SWORD "Kinh Thánh Tiếng Việt (1934)" text.
const LONE = { "ù": "Ớ", "ỳ": "Ở", "è": "Ồ", "ĩ": "À", "ã": "Ừ", "ì": "Ổ" };
const SENTENCE_START = /(^|[.!?:;]["“”]?\s+)$/u;
// Typing slips in single verses, each checked against the SWORD text. Every "from" must still be there.
const TYPOS = {
  "GEN 20:13": [["cco tôi pưu lạc", "cho tôi phải lưu lạc"]],
  "NUM 7:37": [["thánhhh", "thánh"]],
  "NUM 30:13": [["có thế", "có thể"]],
  "DEU 3:6": [["connnnn", "con"]],
  "DEU 3:8": [["Ạt-nnôn", "Ạt-nôn"]],
  "JOS 8:35": [["dặng", "dặn"]],
  "JOS 11:15": [["dặng", "dặn"]],
  "JOS 20:9": [["có thế", "có thể"]],
  "JDG 7:11": [["cóóóóóómạnh", "có sức mạnh"]],
  "1SA 16:2": [["g: àm sao tôi đii", "Làm sao tôi đi"], ["ngggggggơi", "ngươi"]],
  "2SA 12:5": [["đđng", "đáng"]],
  "2SA 12:6": [["chiên conkhông", "chiên con, vì đã làm như vậy, và vì không"]],
  "1KI 11:1": [["người n Ê-đôm", "người nữ Mô-áp, Am-môn, Ê-đôm"]],
  "2KI 11:12": [["đếu", "đầu"]],
  "2KI 11:15": [["Giêiêô-gia-đa", "Giê-hô-gia-đa"]],
  "1CH 12:8": [["có ó ững", "có những"]],
  "JOB 29:24": [["mỉn", "mỉm"]],
  "JOB 29:25": [["giữu", "giữa"]],
  "JOB 30:12": [["nố", "hố"]],
  "PSA 106:47": [["Chúa, úa, Và khoe mình về sự ngợ hen Chúaa.", "Chúa, Và khoe mình về sự ngợi khen Chúa."]],
  "PSA 135:11": [["Từc", "Tức"]],
  "PRO 8:24": [["s sh", "sanh"]],
  "ECC 7:24": [["có thế", "có thể"]],
  "ISA 23:16": [["mầyầyy", "mầy!"]],
  "JER 38:7": [["quănăng", "quăng"]],
  "JER 43:6": [["gá i", "gái"]],
  "MAR 3:22": [["nhờờờờờờ chúa quỉ mà ttttttrừ", "nhờ phép chúa quỉ mà trừ"]],
  "MAR 16:20": [["v????", "vững đạo."]],
  "LUK 17:6": [["trộng", "trông"]],
  "JOH 11:22": [["cụng", "cũng"]],
  "JOH 19:19": [["JÊSUS NGƯùI NA-XA-RẵT, Là VUA DĂN GIU-ĐA.", "JÊSUS NGƯỜI NA-XA-RÉT, LÀ VUA DÂN GIU-ĐA."]],
  "ACT 17:23": [["THù CHúA KHÔNG BIôT.", "THỜ CHÚA KHÔNG BIẾT."]],
};

function fixTypos(ref, verse) {
  return (TYPOS[ref] ?? []).reduce((v, [from, to]) => {
    if (!v.includes(from)) throw new Error(`Typo fix no longer applies: ${ref} "${from}"`);
    return v.replace(from, to);
  }, verse);
}

function repair(ref, verse) {
  if (BROKEN[ref]) return BROKEN[ref];
  const decoded = verse
    .replace(VNI_CAPITAL, (_, base, mark) => (base + markOf(HAT, mark) + markOf(TONE, mark)).normalize("NFC"))
    .replace(/(?<!\p{L})ỗ/gu, "Í")
    .replace(/\(\d+-\d+\)\s*/g, "")
    .replace(/([kK])”/g, "$1ỳ")
    .replace(/hu”nh/g, "huỳnh")
    .replace(/(?<!\p{L})[ùỳèĩãì](?!\p{L})/gu, (ch, at, v) =>
      SENTENCE_START.test(v.slice(0, at)) ? LONE[ch] : LONE[ch].toLowerCase(),
    );
  return fixTypos(ref, decoded);
}

const VIETNAMESE = new Set("aàáảãạăằắẳẵặâầấẩẫậbcdđeèéẻẽẹêềếểễệfghiìíỉĩịjklmnoòóỏõọôồốổỗộơờớởỡợpqrstuùúủũụưừứửữựvwxyỳýỷỹỵz");
// Leftovers of the broken encodings: a lone accented vowel or consonant, "k”" for "kỳ",
// a stray "(1-2)" verse-range marker, a letter typed three times, a loose combining mark.
const GARBAGE = /(?<!\p{L})[ùỳèĩãìgn](?!\p{L})|k”|\(\d+-\d+\)|(\p{L})\1\1|\p{M}/iu;
/** Self-check: no letter outside Vietnamese, no VNI capital and no garbage left in the output. */
function assertClean(ref, verse) {
  const odd = [...verse].find((ch) => /\p{L}/u.test(ch) && !VIETNAMESE.has(ch.toLowerCase()));
  if (odd || VNI_CAPITAL.test(verse) || GARBAGE.test(verse)) throw new Error(`Still broken: ${ref} ${verse}`);
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
