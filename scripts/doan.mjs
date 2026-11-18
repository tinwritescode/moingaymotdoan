// Tools for writing a ghi chú against Bản Truyền Thống.
//   node scripts/doan.mjs <slug> <đoạn>     print the đoạn, one numbered câu per line
//   node scripts/doan.mjs cau "Giăng 1:1; Hê-bơ-rơ 11:4–6"   print the câu of chỗ dẫn written with full book names
//   node scripts/doan.mjs kiem <file.md>    check every "…" quote in a ghi chú against Bản Truyền Thống
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

process.removeAllListeners("warning"); // Node notes it is parsing books.ts as ESM; harmless here.
const { bookByName, bookBySlug } = await import("../lib/content/books.ts");

const BIBLE = join(import.meta.dirname, "..", "data", "bible");
const chaptersIn = (file) => JSON.parse(readFileSync(join(BIBLE, file), "utf8")).chapters;
const chaptersOf = (slug) => {
  const book = bookBySlug(slug);
  if (!book) throw new Error(`Không có sách với slug "${slug}"`);
  return chaptersIn(`${book.code}.json`);
};

const [cmd, arg] = process.argv.slice(2);

if (cmd === "cau") {
  for (const part of arg.split(";")) {
    const m = /^\s*(.+?) (\d+):(\d+)(?:[–-](\d+))?\s*$/.exec(part);
    const book = m && bookByName(m[1]);
    if (!book) throw new Error(`Không hiểu chỗ dẫn "${part.trim()}" (cần tên sách đủ, vd. "Giăng 1:1")`);
    const [c, from, to] = [Number(m[2]), Number(m[3]), Number(m[4] ?? m[3])];
    const verses = chaptersOf(book.slug)[c - 1] ?? [];
    for (let v = from; v <= to; v++) console.log(`${book.name} ${c}:${v} ${verses[v - 1] ?? "(không có câu này)"}`);
  }
} else if (cmd === "kiem") {
  // A quote that is not in the book is either the writer's own phrase in quotes (fine) or a misquote (fix it).
  const norm = (s) => s.normalize("NFC").toLowerCase();
  const text = norm(chaptersOf(basename(dirname(arg))).flat().join(" "));
  const all = norm(readdirSync(BIBLE).map((f) => chaptersIn(f).flat().join(" ")).join(" "));
  const quotes = [...readFileSync(arg, "utf8").matchAll(/"([^"\n]+)"/g)].map((m) => m[1]);
  let missing = 0;
  for (const q of quotes) {
    // "…" marks words left out, so each piece must be in the text on its own.
    const pieces = norm(q).split("…").map((p) => p.trim().replace(/^[.,;:!?]+|[.,;:!?]+$/g, "").trim());
    const inText = (t) => pieces.filter(Boolean).every((p) => t.includes(p));
    const where = inText(text) ? "CÓ   " : inText(all) ? "SÁCH KHÁC" : "KHÔNG";
    if (where === "KHÔNG") missing++;
    console.log(`${where}  "${q}"`);
  }
  console.log(`\n${quotes.length} trích dẫn, ${missing} không có nguyên văn trong Kinh Thánh.`);
} else {
  const n = Number(arg);
  const verses = chaptersOf(cmd)[n - 1];
  if (!verses) throw new Error(`Không có đoạn ${arg}`);
  verses.forEach((v, i) => console.log(`${n}:${i + 1} ${v}`));
}
