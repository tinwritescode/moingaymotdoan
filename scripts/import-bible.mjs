// Imports Bản Truyền Thống (eBible.org "vie1934", public domain) into data/bible/<CODE>.json.
// Re-runnable: the same download always produces the same files.
// Usage: node scripts/import-bible.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL = "https://ebible.org/Scriptures/vie1934_vpl.zip";
const OUT = join(import.meta.dirname, "..", "data", "bible");

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
    verses.push(verse.trim());
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
