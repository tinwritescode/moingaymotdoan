// Tools for writing chapter notes against Bản Truyền Thống (vi) or Berean Standard Bible (en).
//   node scripts/doan.mjs [--en] <slug> <chapter>     print the chapter, one numbered verse per line
//   node scripts/doan.mjs [--en] cau "Giăng 1:1; ..." print verses of references with full book names
//   node scripts/doan.mjs [--en] kiem <file.md>       check every "…" quote against the Bible text
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

process.removeAllListeners("warning"); // Node notes it is parsing books.ts as ESM; harmless here.
const { bookByName, bookBySlug } = await import("../lib/content/books.ts");

const rawArgs = process.argv.slice(2);
const isEn = rawArgs[0] === "--en";
const locale = isEn ? "en" : "vi";
const [cmd, arg] = isEn ? rawArgs.slice(1) : rawArgs;

const BIBLE = join(import.meta.dirname, "..", "data", isEn ? "bible-en" : "bible");
const chaptersIn = (file) => JSON.parse(readFileSync(join(BIBLE, file), "utf8")).chapters;
const chaptersOf = (slug) => {
  const book = bookBySlug(slug, locale);
  if (!book) throw new Error(isEn ? `Unknown book slug "${slug}"` : `Không có sách với slug "${slug}"`);
  return chaptersIn(`${book.code}.json`);
};

if (cmd === "cau") {
  for (const part of arg.split(";")) {
    const m = /^\s*(.+?) (\d+):(\d+)(?:[–-](\d+))?\s*$/.exec(part);
    const book = m && bookByName(m[1], locale);
    if (!book) {
      throw new Error(
        isEn
          ? `Cannot parse reference "${part.trim()}" (use full book name, e.g. "John 1:1")`
          : `Không hiểu chỗ dẫn "${part.trim()}" (cần tên sách đủ, vd. "Giăng 1:1")`,
      );
    }
    const [c, from, to] = [Number(m[2]), Number(m[3]), Number(m[4] ?? m[3])];
    const verses = chaptersOf(book.slug)[c - 1] ?? [];
    for (let v = from; v <= to; v++) {
      console.log(`${book.name} ${c}:${v} ${verses[v - 1] || (isEn ? "(omitted/missing)" : "(không có câu này)")}`);
    }
  }
} else if (cmd === "kiem") {
  const norm = (s) =>
    s
      .normalize("NFC")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .toLowerCase();
  const text = norm(chaptersOf(basename(dirname(arg))).flat().join(" "));
  const all = norm(readdirSync(BIBLE).map((f) => chaptersIn(f).flat().join(" ")).join(" "));
  const src = readFileSync(arg, "utf8").replace(/[“”]/g, '"');
  const quotes = [...src.matchAll(/"([^"\n]+)"/g)].map((m) => m[1]);
  let missing = 0;
  for (const q of quotes) {
    const pieces = norm(q)
      .split(/…|\.\.\./)
      .map((p) => p.trim().replace(/^[.,;:!?—-]+|[.,;:!?—-]+$/g, "").trim());
    const inText = (t) => pieces.filter(Boolean).every((p) => t.includes(p));
    const where = inText(text) ? (isEn ? "OK    " : "CÓ   ") : inText(all) ? (isEn ? "OTHER " : "SÁCH KHÁC") : isEn ? "MISS  " : "KHÔNG";
    if (where.trim() === "KHÔNG" || where.trim() === "MISS") missing++;
    console.log(`${where}  "${q}"`);
  }
  console.log(
    isEn
      ? `\n${quotes.length} quotes, ${missing} not verbatim in BSB.`
      : `\n${quotes.length} trích dẫn, ${missing} không có nguyên văn trong Kinh Thánh.`,
  );
} else {
  const n = Number(arg);
  const verses = chaptersOf(cmd)[n - 1];
  if (!verses) throw new Error(isEn ? `No chapter ${arg}` : `Không có đoạn ${arg}`);
  verses.forEach((v, i) => {
    if (v) console.log(`${n}:${i + 1} ${v}`);
  });
}
