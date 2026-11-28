#!/usr/bin/env node
/**
 * Imports Vietnamese worship datasets into data/worship/*.json:
 *  - thanh-ca.json : 903 Thánh Ca (HTTLVN) with categories, lyrics, YouTube karaoke IDs & audio URLs
 *  - tvchh.json    : 387 Biệt Thánh Ca (Tôn Vinh Chúa Hằng Hữu) with lyrics & YouTube karaoke IDs
 *  - ktdd.json     : 100 Kinh Thánh Đối Đáp with responsive leader/congregation turns & citations
 *  - tin-dieu.json : Bài Tín Điều Các Sứ Đồ (12 clauses) + Cầu Nguyện Chung + Lời Chúc Phước
 *
 * Sources:
 *  - Metadata & Creed/Liturgy: https://www.sivn.app/thanh-ca (public static bundle)
 *  - Thánh Ca & KTĐĐ lyrics:   https://thanhca.httlvn.org
 *  - TVCHH lyrics (.pptx):     https://github.com/httlgiadinh/powerpoint (TON VINH CHUA HANG HUU)
 *
 * Usage: node scripts/import-worship.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { inflateRawSync } from "node:zlib";

const OUT_DIR = join(import.meta.dirname, "..", "data", "worship");

// ---------------------------------------------------------------------------
// 1. VNI-Windows -> Unicode converter (for legacy VNI fonts in TVCHH .pptx)
// ---------------------------------------------------------------------------
const VNI_PAIRS = new Map([
  // Lowercase a
  ["a\u00f9", "á"], ["a\u00f8", "à"], ["a\u00fb", "ả"], ["a\u00f5", "ã"], ["a\u00ef", "ạ"],
  ["a\u00e2", "â"], ["a\u00e1", "ấ"], ["a\u00e0", "ầ"], ["a\u00e5", "ẩ"], ["a\u00e3", "ẫ"], ["a\u00e4", "ậ"],
  ["a\u00ea", "ă"], ["a\u00e9", "ắ"], ["a\u00e8", "ằ"], ["a\u00fa", "ẳ"], ["a\u00fc", "ẵ"], ["a\u00eb", "ặ"],
  // Uppercase A
  ["A\u00d9", "Á"], ["A\u00d8", "À"], ["A\u00db", "Ả"], ["A\u00d5", "Ã"], ["A\u00cf", "Ạ"],
  ["A\u00c2", "Â"], ["A\u00c1", "Ấ"], ["A\u00c0", "Ầ"], ["A\u00c5", "Ẩ"], ["A\u00c3", "Ẫ"], ["A\u00c4", "Ậ"],
  ["A\u00ca", "Ă"], ["A\u00c9", "Ắ"], ["A\u00c8", "Ằ"], ["A\u00da", "Ẳ"], ["A\u00dc", "Ẵ"], ["A\u00cb", "Ặ"],
  // Mixed case A + lowercase diacritic (sometimes occurs in PPTX)
  ["A\u00f9", "Á"], ["A\u00f8", "À"], ["A\u00fb", "Ả"], ["A\u00f5", "Ã"], ["A\u00ef", "Ạ"],
  ["A\u00e2", "Â"], ["A\u00e1", "Ấ"], ["A\u00e0", "Ầ"], ["A\u00e5", "Ẩ"], ["A\u00e3", "Ẫ"], ["A\u00e4", "Ậ"],
  ["A\u00ea", "Ă"], ["A\u00e9", "Ắ"], ["A\u00e8", "Ằ"], ["A\u00fa", "Ẳ"], ["A\u00fc", "Ẵ"], ["A\u00eb", "Ặ"],
  // Lowercase e
  ["e\u00f9", "é"], ["e\u00f8", "è"], ["e\u00fb", "ẻ"], ["e\u00f5", "ẽ"], ["e\u00ef", "ẹ"],
  ["e\u00e2", "ê"], ["e\u00e1", "ế"], ["e\u00e0", "ề"], ["e\u00e5", "ể"], ["e\u00e3", "ễ"], ["e\u00e4", "ệ"],
  // Uppercase E
  ["E\u00d9", "É"], ["E\u00d8", "È"], ["E\u00db", "Ẻ"], ["E\u00d5", "Ẽ"], ["E\u00cf", "Ẹ"],
  ["E\u00c2", "Ê"], ["E\u00c1", "Ế"], ["E\u00c0", "Ề"], ["E\u00c5", "Ể"], ["E\u00c3", "Ễ"], ["E\u00c4", "Ệ"],
  ["E\u00f9", "É"], ["E\u00f8", "È"], ["E\u00fb", "Ẻ"], ["E\u00f5", "Ẽ"], ["E\u00ef", "Ẹ"],
  ["E\u00e2", "Ê"], ["E\u00e1", "Ế"], ["E\u00e0", "Ề"], ["E\u00e5", "Ể"], ["E\u00e3", "Ễ"], ["E\u00e4", "Ệ"],
  // Lowercase o
  ["o\u00f9", "ó"], ["o\u00f8", "ò"], ["o\u00fb", "ỏ"], ["o\u00f5", "õ"], ["o\u00ef", "ọ"],
  ["o\u00e2", "ô"], ["o\u00e1", "ố"], ["o\u00e0", "ồ"], ["o\u00e5", "ổ"], ["o\u00e3", "ỗ"], ["o\u00e4", "ộ"],
  ["\u00f4\u00f9", "ớ"], ["\u00f4\u00f8", "ờ"], ["\u00f4\u00fb", "ở"], ["\u00f4\u00f5", "ỡ"], ["\u00f4\u00ef", "ợ"],
  // Uppercase O
  ["O\u00d9", "Ó"], ["O\u00d8", "Ò"], ["O\u00db", "Ỏ"], ["O\u00d5", "Õ"], ["O\u00cf", "Ọ"],
  ["O\u00c2", "Ô"], ["O\u00c1", "Ố"], ["O\u00c0", "Ồ"], ["O\u00c5", "Ổ"], ["O\u00c3", "Ỗ"], ["O\u00c4", "Ộ"],
  ["O\u00f9", "Ó"], ["O\u00f8", "Ò"], ["O\u00fb", "Ỏ"], ["O\u00f5", "Õ"], ["O\u00ef", "Ọ"],
  ["O\u00e2", "Ô"], ["O\u00e1", "Ố"], ["O\u00e0", "Ồ"], ["O\u00e5", "Ổ"], ["O\u00e3", "Ỗ"], ["O\u00e4", "Ộ"],
  ["\u00d4\u00d9", "Ớ"], ["\u00d4\u00d8", "Ờ"], ["\u00d4\u00db", "Ở"], ["\u00d4\u00d5", "Ỡ"], ["\u00d4\u00cf", "Ợ"],
  ["\u00d4\u00f9", "Ớ"], ["\u00d4\u00f8", "Ờ"], ["\u00d4\u00fb", "Ở"], ["\u00d4\u00f5", "Ỡ"], ["\u00d4\u00ef", "Ợ"],
  // Lowercase u
  ["u\u00f9", "ú"], ["u\u00f8", "ù"], ["u\u00fb", "ủ"], ["u\u00f5", "ũ"], ["u\u00ef", "ụ"],
  ["\u00f6\u00f9", "ứ"], ["\u00f6\u00f8", "ừ"], ["\u00f6\u00fb", "ử"], ["\u00f6\u00f5", "ữ"], ["\u00f6\u00ef", "ự"],
  // Uppercase U
  ["U\u00d9", "Ú"], ["U\u00d8", "Ù"], ["U\u00db", "Ủ"], ["U\u00d5", "Ũ"], ["U\u00cf", "Ụ"],
  ["U\u00f9", "Ú"], ["U\u00f8", "Ù"], ["U\u00fb", "Ủ"], ["U\u00f5", "Ũ"], ["U\u00ef", "Ụ"],
  ["\u00d6\u00d9", "Ứ"], ["\u00d6\u00d8", "Ừ"], ["\u00d6\u00db", "Ử"], ["\u00d6\u00d5", "Ữ"], ["\u00d6\u00cf", "Ự"],
  ["\u00d6\u00f9", "Ứ"], ["\u00d6\u00f8", "Ừ"], ["\u00d6\u00fb", "Ử"], ["\u00d6\u00f5", "Ữ"], ["\u00d6\u00ef", "Ự"],
  // Lowercase y
  ["y\u00f9", "ý"], ["y\u00f8", "ỳ"], ["y\u00fb", "ỷ"], ["y\u00f5", "ỹ"],
  // Uppercase Y
  ["Y\u00d9", "Ý"], ["Y\u00d8", "Ỳ"], ["Y\u00db", "Ỷ"], ["Y\u00d5", "Ỹ"],
  ["Y\u00f9", "Ý"], ["Y\u00f8", "Ỳ"], ["Y\u00fb", "Ỷ"], ["Y\u00f5", "Ỹ"],
]);

const VNI_SINGLES = new Map([
  ["\u00f1", "đ"], ["\u00d1", "Đ"],
  ["\u00f4", "ơ"], ["\u00d4", "Ơ"],
  ["\u00f6", "ư"], ["\u00d6", "Ư"],
  ["\u00ed", "í"], ["\u00ec", "ì"], ["\u00e6", "ỉ"], ["\u00f3", "ĩ"], ["\u00f2", "ị"],
  ["\u00cd", "Í"], ["\u00cc", "Ì"], ["\u00c6", "Ỉ"], ["\u00d3", "Ĩ"], ["\u00d2", "Ị"],
  ["\u00ee", "ỵ"], ["\u00ce", "Ỵ"],
  ["\u00cf", "Ị"], // fallback if standalone
]);

function vniToUnicode(str) {
  let out = "";
  for (let i = 0; i < str.length; i++) {
    if (i + 1 < str.length) {
      const pair = str[i] + str[i + 1];
      const mapped = VNI_PAIRS.get(pair);
      if (mapped) {
        out += mapped;
        i++;
        continue;
      }
    }
    const single = VNI_SINGLES.get(str[i]);
    // Skip stray duplicate VNI tone mark typed after an already-accented vowel (e.g. "maëït" -> "mặt")
    if (single === undefined && /[\u00ef\u00f9\u00f8\u00fb\u00f5]/.test(str[i])) continue;
    out += single ?? str[i];
  }
  return out;
}

const VNI_FONT_RE = /^(?:vni|hp-)/i;
const VNI_SIGNAL_RE =
  /[aAeEoOuUyY][\u00f9\u00f8\u00fb\u00f5\u00ef\u00e2\u00e1\u00e0\u00e5\u00e3\u00e4\u00ea\u00e9\u00e8\u00fa\u00fc\u00eb\u00d9\u00d8\u00db\u00d5\u00cf\u00c2\u00c1\u00c0\u00c5\u00c3\u00c4\u00ca\u00c9\u00c8\u00da\u00dc\u00cb]|[\u00f4\u00d4][\u00f9\u00f8\u00fb\u00f5\u00ef\u00d9\u00d8\u00db\u00d5\u00cf]|[\u00f6\u00d6\u00f1\u00d1\u00e6\u00c6\u00ee\u00ce]/;
const UNICODE_ONLY_VI_RE =
  /[ăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;

function isLikelyVni(text, hasVniFont) {
  if (UNICODE_ONLY_VI_RE.test(text)) return false;
  if (hasVniFont) return true;
  return VNI_SIGNAL_RE.test(text);
}

// ---------------------------------------------------------------------------
// 2. Minimal ZIP reader (for .pptx) using Node's built-in inflateRawSync
// ---------------------------------------------------------------------------
function readZipEntries(buf) {
  // Find End of Central Directory (PK\x05\x06)
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65558); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error("Invalid ZIP: EOCD not found");
  const entryCount = buf.readUInt16LE(eocd + 10);
  let offset = buf.readUInt32LE(eocd + 16);
  const files = new Map();
  for (let i = 0; i < entryCount; i++) {
    if (buf.readUInt32LE(offset) !== 0x02014b50) break;
    const method = buf.readUInt16LE(offset + 10);
    const compSize = buf.readUInt32LE(offset + 20);
    const nameLen = buf.readUInt16LE(offset + 28);
    const extraLen = buf.readUInt16LE(offset + 30);
    const commentLen = buf.readUInt16LE(offset + 32);
    const localHeaderOff = buf.readUInt32LE(offset + 42);
    const name = buf.subarray(offset + 46, offset + 46 + nameLen).toString("utf8");
    offset += 46 + nameLen + extraLen + commentLen;
    if (!/^ppt\/slides\/slide\d+\.xml$/.test(name)) continue;
    const localNameLen = buf.readUInt16LE(localHeaderOff + 26);
    const localExtraLen = buf.readUInt16LE(localHeaderOff + 28);
    const dataStart = localHeaderOff + 30 + localNameLen + localExtraLen;
    const raw = buf.subarray(dataStart, dataStart + compSize);
    const data = method === 0 ? raw : method === 8 ? inflateRawSync(raw) : null;
    if (data) files.set(name, data.toString("utf8"));
  }
  return files;
}

function decodeXmlEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

function stripDiacritics(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function extractPptxLyrics(buf, songTitle) {
  const slidesMap = readZipEntries(buf);
  const slideNames = [...slidesMap.keys()].sort(
    (a, b) => Number(/slide(\d+)\.xml/.exec(a)[1]) - Number(/slide(\d+)\.xml/.exec(b)[1]),
  );
  const normTitle = stripDiacritics(songTitle);
  const slides = [];

  for (const name of slideNames) {
    const xml = slidesMap.get(name);
    const slideFonts = [...xml.matchAll(/<a:latin\b[^>]*typeface="([^"]+)"/g)].map((m) => m[1]);
    const slideHasVniFont = slideFonts.some((f) => VNI_FONT_RE.test(f));
    const slideLines = [];
    for (const pMatch of xml.matchAll(/<a:p\b[^>]*>([\s\S]*?)<\/a:p>/g)) {
      const pXml = pMatch[1];
      const paraFonts = [...pXml.matchAll(/<a:latin\b[^>]*typeface="([^"]+)"/g)].map((m) => m[1]);
      const rawParts = [...pXml.matchAll(/<a:t(?:\s+[^>/]*)?>([^<]*)<\/a:t>/g)].map((m) => decodeXmlEntities(m[1]));
      if (rawParts.length === 0) continue;
      const rawLine = rawParts.join("");
      const paraHasVniFont =
        paraFonts.length > 0 ? paraFonts.some((f) => VNI_FONT_RE.test(f)) : slideHasVniFont;
      const decoded = isLikelyVni(rawLine, paraHasVniFont) ? vniToUnicode(rawLine) : rawLine;
      const cleaned = decoded.replace(/\s+/g, " ").trim();
      if (cleaned) slideLines.push(cleaned);
    }
    slides.push(slideLines);
  }

  // Filter out slide 1 title cover & per-slide repeated title/header banners
  const lyricLines = [];
  for (let idx = 0; idx < slides.length; idx++) {
    const lines = slides[idx];
    const filtered = lines.filter((line) => {
      const n = stripDiacritics(line);
      if (!n) return false;
      if (n === normTitle) return false;
      if (/^(?:ton vinh chua|biet thanh ca|thanh ca|tvchh)\b/.test(n)) {
        // Pure header banner if short or ends with title
        if (n.includes(normTitle) || n.length < 48) return false;
      }
      if (/^(?:nhac|loi|nhac va loi|sang tac|phong dich|bien soan)\s*:/i.test(n)) return false;
      if (/^trang \d+$/.test(n) || /^\d+$/.test(n)) return false;
      return true;
    });
    // Skip cover slide if it has nothing left or is purely title + metadata
    if (idx === 0 && filtered.length === 0) continue;
    if (filtered.length > 0) {
      lyricLines.push(filtered.join("\n"));
    }
  }

  // Group into stanzas (split at "1.", "2.", "Điệp khúc", "ĐK:", or combine consecutive 2-4 line slides)
  if (lyricLines.length === 0) return [];
  const allLines = lyricLines.join("\n").split("\n").map((l) => l.trim()).filter(Boolean);
  const stanzas = [];
  let curLabel = "";
  let curLines = [];

  const flushStanza = () => {
    if (curLines.length === 0) return;
    stanzas.push({ label: curLabel || `Lời ${stanzas.length + 1}`, text: curLines.join("\n") });
    curLabel = "";
    curLines = [];
  };

  for (const rawLine of allLines) {
    // Fix minor missing space after punctuation in VNI slides (e.g. "Chúa!Xin" -> "Chúa! Xin")
    const line = rawLine
      .replace(/([,;!?])([^\s\d"'”’)\]])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim();

    const dkMatch = /^(?:ĐK|Điệp\s*khúc)\s*[:.]?\s*(.*)$/i.exec(line);
    if (dkMatch) {
      flushStanza();
      curLabel = "Điệp khúc";
      if (dkMatch[1].trim()) curLines.push(dkMatch[1].trim());
      continue;
    }
    const verseMatch = /^(\d+)\s*[.)]\s*(.+)$/.exec(line);
    if (verseMatch && Number(verseMatch[1]) <= 10) {
      flushStanza();
      curLabel = `Câu ${verseMatch[1]}`;
      curLines.push(verseMatch[2].trim());
      continue;
    }
    curLines.push(line);
  }
  flushStanza();

  // If everything landed in one huge stanza (> 8 lines), split evenly into 4-line stanzas for comfortable reading
  if (stanzas.length === 1 && stanzas[0].text.split("\n").length > 8) {
    const lines = stanzas[0].text.split("\n");
    const chunked = [];
    for (let i = 0; i < lines.length; i += 4) {
      chunked.push({ label: `Phần ${chunked.length + 1}`, text: lines.slice(i, i + 4).join("\n") });
    }
    return chunked;
  }

  return stanzas;
}

// ---------------------------------------------------------------------------
// 3. HTTP helper with retries + bounded concurrency
// ---------------------------------------------------------------------------
async function fetchWithRetry(url, asBuffer = false, retries = 3) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "moingaymotdoan-importer/1.0 (+https://moingaymotdoan.xyz)" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return asBuffer ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
  throw lastErr;
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

// ---------------------------------------------------------------------------
// 4. HTML parsers for thanhca.httlvn.org
// ---------------------------------------------------------------------------
function cleanHtmlText(html) {
  return decodeXmlEntities(html.replace(/<[^>]+>/g, ""))
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseThanhCaHtml(html) {
  const blockMatch = /<div id="lyric-content"[^>]*>([\s\S]*?)<\/div>/i.exec(html);
  if (!blockMatch) return [];
  const inner = blockMatch[1];
  const stanzas = [];
  let currentLabel = "";
  let currentLines = [];

  const flush = () => {
    if (currentLines.length === 0) return;
    stanzas.push({
      label: currentLabel || `Câu ${stanzas.length + 1}`,
      text: currentLines.join("\n"),
    });
    currentLabel = "";
    currentLines = [];
  };

  for (const pMatch of inner.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const raw = pMatch[1].trim();
    if (!raw) {
      flush();
      continue;
    }
    const boldHeader = /^<b>([^<]+)<\/b>$/i.exec(raw);
    if (boldHeader) {
      flush();
      currentLabel = cleanHtmlText(boldHeader[1]);
      continue;
    }
    // Strip leading verse digit like "1.Cúi xin" -> "Cúi xin" when label already says Câu 1
    const text = cleanHtmlText(raw).replace(/^\d+\.\s*(?=\S)/, "");
    if (text) currentLines.push(text);
  }
  flush();
  return stanzas;
}

function parseKtddHtml(html) {
  const blockMatch = /<div id="lyric-content"[^>]*>([\s\S]*?)<\/div>/i.exec(html);
  if (!blockMatch) return { turns: [], htmlRefs: [] };
  const inner = blockMatch[1];
  const turns = [];
  const htmlRefs = [];

  const tokenRe = /<p\b([^>]*)>([\s\S]*?)<\/p>|<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi;
  let m;
  while ((m = tokenRe.exec(inner)) !== null) {
    if (m[3] !== undefined) {
      const text = cleanHtmlText(m[3]);
      if (text) turns.push({ role: "congregation", text });
    } else {
      const attrs = m[1] ?? "";
      const body = m[2] ?? "";
      const text = cleanHtmlText(body);
      if (!text) continue;
      if (/align\s*=\s*["']?right/i.test(attrs) || /^<em>[\s\S]*<\/em>$/i.test(body.trim())) {
        // Citation paragraph belonging to the previous turns
        const cleanedRef = text.replace(/\.$/, "").trim();
        htmlRefs.push(cleanedRef);
        if (turns.length > 0 && !turns[turns.length - 1].ref) {
          turns[turns.length - 1].ref = cleanedRef;
        }
      } else {
        turns.push({ role: "leader", text });
      }
    }
  }
  return { turns, htmlRefs };
}

// ---------------------------------------------------------------------------
// 5. Load sivn.app public static bundle (9566)
// ---------------------------------------------------------------------------
async function loadSivnBundle() {
  const html = await fetchWithRetry("https://www.sivn.app/thanh-ca?tab=thanh-ca");
  const chunkMatches = [...html.matchAll(/\/_next\/static\/chunks\/(9566-[a-f0-9]+\.js)/g)];
  const chunkPath = chunkMatches[0]?.[0] ?? "/_next/static/chunks/9566-74c0213df145ac3c.js";
  const js = await fetchWithRetry(`https://www.sivn.app${chunkPath}`);
  const chunks = [];
  const sandboxSelf = { webpackChunk_N_E: { push: (c) => chunks.push(c) } };
  new Function("self", js)(sandboxSelf);
  const mod = chunks[0]?.[1]?.[59566];
  if (!mod) throw new Error("Module 59566 not found in sivn.app chunk");
  const exp = {};
  mod({}, exp, {
    d: (o, getters) => {
      for (const [k, fn] of Object.entries(getters)) {
        Object.defineProperty(o, k, { get: fn, enumerable: true });
      }
    },
  });
  return exp;
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------
async function main() {
  const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
  await mkdir(OUT_DIR, { recursive: true });
  console.log("1/4 Loading metadata, categories & Apostles' Creed from sivn.app public bundle...");
  const sivn = await loadSivnBundle();

  // ---- 1. Tín điều CSĐ ----
  if (!only || only === "tin-dieu") {
    const tinDieu = {
      creed: sivn.mc,
      liturgy: sivn.Ux,
    };
    await writeFile(join(OUT_DIR, "tin-dieu.json"), JSON.stringify(tinDieu, null, 2) + "\n", "utf8");
    console.log(`   Wrote tin-dieu.json (${tinDieu.creed.clauses.length} clauses + Cầu Nguyện Chung + Chúc Phước)`);
  }

  // ---- 2. Kinh Thánh Đối Đáp (100) ----
  if (!only || only === "ktdd") {
    console.log("2/4 Fetching 100 Kinh Thánh Đối Đáp from thanhca.httlvn.org...");
    const ktddMeta = sivn.Xd;
    const ktddReadings = await mapPool(ktddMeta, 16, async (meta) => {
      const html = await fetchWithRetry(`https://thanhca.httlvn.org/kinh-thanh-doi-dap-${meta.number}`);
      const { turns, htmlRefs } = parseKtddHtml(html);
      return {
        number: meta.number,
        code: meta.code,
        title: meta.title,
        category: meta.category,
        scriptureRefs: meta.scriptureRefs?.length ? meta.scriptureRefs : htmlRefs,
        turns,
      };
    });
    const ktddCategories = [...new Set(ktddReadings.map((r) => r.category))];
    await writeFile(
      join(OUT_DIR, "ktdd.json"),
      JSON.stringify({ categories: ktddCategories, readings: ktddReadings }) + "\n",
      "utf8",
    );
    const emptyKtdd = ktddReadings.filter((r) => r.turns.length === 0).length;
    console.log(`   Wrote ktdd.json (${ktddReadings.length} readings, ${emptyKtdd} empty)`);
  }

  // ---- 3. Thánh Ca (903) ----
  if (!only || only === "thanh-ca") {
    console.log("3/4 Fetching 903 Thánh Ca lyrics from thanhca.httlvn.org...");
    const fullByNum = new Map(
      sivn.Ms.filter((h) => h.collection === "thanh-ca").map((h) => [h.number, h]),
    );
    const tcMeta = sivn.Gb.filter((h) => h.collection === "thanh-ca").sort((a, b) => a.number - b.number);
    let tcDone = 0;
    const tcSongs = await mapPool(tcMeta, 20, async (meta) => {
      const html = await fetchWithRetry(`https://thanhca.httlvn.org/thanh-ca-${meta.number}`);
      let stanzas = parseThanhCaHtml(html);
      const curated = fullByNum.get(meta.number);
      if (stanzas.length === 0 && curated?.stanzas?.length) {
        stanzas = curated.stanzas.map((text, idx) => ({ label: `Câu ${idx + 1}`, text }));
      }
      const romanMatch = /^([IVX]+)\.\s*/.exec(meta.category ?? "");
      tcDone++;
      if (tcDone % 150 === 0 || tcDone === tcMeta.length) {
        console.log(`   Thánh Ca progress: ${tcDone}/${tcMeta.length}`);
      }
      return {
        number: meta.number,
        code: meta.code,
        title: meta.title,
        categoryRoman: romanMatch?.[1] ?? "XIII",
        category: meta.category,
        scriptureRef: curated?.scriptureRef || undefined,
        karaokeId: meta.karaokeId || undefined,
        mp3Url: meta.mp3Url || `https://audio.httlvn.org/TC/thanh-ca/mp3/${meta.number}.mp3`,
        sheetUrl: `https://thanhca.httlvn.org/thanh-ca-${meta.number}?op=sheet`,
        stanzas,
      };
    });
    await writeFile(
      join(OUT_DIR, "thanh-ca.json"),
      JSON.stringify({ categories: sivn.UR, songs: tcSongs }) + "\n",
      "utf8",
    );
    const emptyTc = tcSongs.filter((s) => s.stanzas.length === 0).length;
    console.log(`   Wrote thanh-ca.json (${tcSongs.length} songs, ${emptyTc} empty)`);
  }

  // ---- 4. Biệt Thánh Ca — TVCHH (387) ----
  if (!only || only === "tvchh") {
    console.log("4/4 Fetching 387 TVCHH .pptx lyrics from httlgiadinh/powerpoint...");
    const rootContents = JSON.parse(
      await fetchWithRetry("https://api.github.com/repos/httlgiadinh/powerpoint/contents"),
    );
    const tvchhDir = rootContents.find((x) => x.name === "TON VINH CHUA HANG HUU");
    if (!tvchhDir) throw new Error("TON VINH CHUA HANG HUU folder not found");
    const tree = JSON.parse(await fetchWithRetry(`${tvchhDir.git_url}?recursive=1`)).tree;
    const pptxByNumber = new Map();
    for (const item of tree) {
      if (!item.path.endsWith(".pptx") || item.path.startsWith("~$")) continue;
      const m = /^TVCHH\s+(\d+)/i.exec(item.path);
      if (m) pptxByNumber.set(Number(m[1]), item.path);
    }
    const tvchhMeta = sivn.Gb.filter((h) => h.collection === "tvchh").sort((a, b) => a.number - b.number);
    let tvDone = 0;
    const tvchhSongs = await mapPool(tvchhMeta, 16, async (meta) => {
      const file = pptxByNumber.get(meta.number);
      let stanzas = [];
      let tcRef;
      if (file) {
        const tcMatch = /\(TC\s*(\d+)\)/i.exec(file);
        if (tcMatch) tcRef = Number(tcMatch[1]);
        const url = `https://raw.githubusercontent.com/httlgiadinh/powerpoint/master/TON%20VINH%20CHUA%20HANG%20HUU/${encodeURIComponent(file)}`;
        try {
          const buf = await fetchWithRetry(url, true);
          stanzas = extractPptxLyrics(buf, meta.title);
        } catch (err) {
          console.warn(`   Warn TVCHH #${meta.number}: ${err.message}`);
        }
      }
      tvDone++;
      if (tvDone % 100 === 0 || tvDone === tvchhMeta.length) {
        console.log(`   TVCHH progress: ${tvDone}/${tvchhMeta.length}`);
      }
      return {
        number: meta.number,
        code: meta.code,
        title: meta.title,
        tcRef,
        karaokeId: meta.karaokeId || undefined,
        stanzas,
      };
    });
    await writeFile(
      join(OUT_DIR, "tvchh.json"),
      JSON.stringify({ songs: tvchhSongs }) + "\n",
      "utf8",
    );
    const emptyTv = tvchhSongs.filter((s) => s.stanzas.length === 0).length;
    console.log(`   Wrote tvchh.json (${tvchhSongs.length} songs, ${emptyTv} empty)`);
  }
  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
