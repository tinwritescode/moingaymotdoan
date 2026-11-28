import { BOOKS_VI, bookByCode } from "../content/books";
import type { Locale } from "../i18n/locale";
import { chapterHref } from "../i18n/routes";
import { normalizeSearch } from "../moods/search";
import type {
  Hymn,
  LyricStanza,
  ResponsiveReading,
  TinDieuDataset,
  TvchhSong,
  WorshipSlide,
} from "./types";

const ROMAN_PREFIX: Record<string, string> = {
  "iii ": "3 ",
  "ii ": "2 ",
  "i ": "1 ",
};

const BOOK_BY_NORMALIZED = new Map<string, string>();
for (const b of BOOKS_VI) {
  BOOK_BY_NORMALIZED.set(normalizeSearch(b.name), b.code);
  BOOK_BY_NORMALIZED.set(normalizeSearch(b.name.replace(/-/g, " ")), b.code);
}
BOOK_BY_NORMALIZED.set("cong vu", "ACT");
BOOK_BY_NORMALIZED.set("sang the ky", "GEN");
BOOK_BY_NORMALIZED.set("xuat e dip to ky", "EXO");
BOOK_BY_NORMALIZED.set("phuc truyen luat le ky", "DEU");
BOOK_BY_NORMALIZED.set("phuc truyen", "DEU");

/**
 * Resolves a Vietnamese scripture citation like "Khải-huyền 4:8", "I Cô-rinh-tô 8:6",
 * or "Sáng-thế Ký 1:1-6" into our app's chapter link. Returns null when unrecognized.
 */
export function resolveScriptureChapterHref(citation: string, locale: Locale = "vi"): string | null {
  const m = /^(.+?)\s+(\d+)(?::\d+)?/u.exec(citation.trim());
  if (!m) return null;
  let bookPart = normalizeSearch(m[1].replace(/-/g, " "));
  for (const [roman, digit] of Object.entries(ROMAN_PREFIX)) {
    if (bookPart.startsWith(roman)) {
      bookPart = digit + bookPart.slice(roman.length);
      break;
    }
  }
  const code = BOOK_BY_NORMALIZED.get(bookPart);
  if (!code) return null;
  const book = bookByCode(code, locale);
  if (!book) return null;
  const chapter = Number(m[2]);
  if (!Number.isInteger(chapter) || chapter < 1) return null;
  return chapterHref({ slug: book.slug, number: chapter, locale });
}

/** First non-empty line of a song's lyrics, used as a preview under the title in the song list. */
export function firstLyricLine(stanzas: readonly LyricStanza[]): string {
  for (const s of stanzas) {
    const first = s.text.split("\n").find((l) => l.trim().length > 0);
    if (first) return first.trim();
  }
  return "";
}

/** Accent-insensitive match by song number (e.g. "1", "001", "#1"), title, category, or opening lyrics. */
export function matchesHymn(
  song: Pick<Hymn, "number" | "code" | "title" | "stanzas"> & { category?: string; scriptureRef?: string },
  normalizedQuery: string,
): boolean {
  if (!normalizedQuery) return true;
  const numQuery = normalizedQuery.replace(/^#/, "");
  if (/^\d+$/.test(numQuery)) {
    return song.number === Number(numQuery) || String(song.number).includes(numQuery);
  }
  const opening = firstLyricLine(song.stanzas);
  const haystack = normalizeSearch(
    `${song.number} ${song.code} ${song.title} ${song.category ?? ""} ${song.scriptureRef ?? ""} ${opening}`,
  );
  return normalizedQuery.split(" ").every((term) => haystack.includes(term));
}

export function matchesKtdd(reading: ResponsiveReading, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  const numQuery = normalizedQuery.replace(/^#/, "");
  if (/^\d+$/.test(numQuery)) {
    return reading.number === Number(numQuery) || String(reading.number).includes(numQuery);
  }
  const haystack = normalizeSearch(
    `${reading.number} ${reading.code} ${reading.title} ${reading.category} ${reading.scriptureRefs.join(" ")}`,
  );
  return normalizedQuery.split(" ").every((term) => haystack.includes(term));
}

export function formatSongCopyText(song: Pick<Hymn | TvchhSong, "code" | "title" | "stanzas">): string {
  const parts = [`${song.code} — ${song.title}`];
  for (const s of song.stanzas) {
    parts.push(`${s.label}\n${s.text}`);
  }
  return parts.join("\n\n");
}

export function formatKtddCopyText(reading: ResponsiveReading, labels: { leader: string; congregation: string }): string {
  const parts = [`Kinh Thánh Đối Đáp ${reading.code} — ${reading.title}`];
  for (const turn of reading.turns) {
    const who = turn.role === "leader" ? labels.leader : labels.congregation;
    parts.push(`${who}: ${turn.text}`);
    if (turn.ref) parts.push(`(${turn.ref})`);
  }
  return parts.join("\n\n");
}

export function buildHymnSlides(song: Pick<Hymn | TvchhSong, "code" | "title" | "stanzas">): WorshipSlide[] {
  const titleSlide: WorshipSlide = { badge: song.code, body: song.title };
  return [
    titleSlide,
    ...song.stanzas.map((s) => ({
      badge: `${song.code} · ${s.label}`,
      body: s.text,
      footer: song.title,
    })),
  ];
}

export function buildKtddSlides(
  reading: ResponsiveReading,
  labels: { leader: string; congregation: string },
): WorshipSlide[] {
  const titleSlide: WorshipSlide = {
    badge: `KTĐĐ ${reading.code}`,
    body: reading.title,
    footer: reading.scriptureRefs.join(" · "),
  };
  return [
    titleSlide,
    ...reading.turns.map((turn) => ({
      badge: turn.role === "leader" ? labels.leader : labels.congregation,
      body: turn.text,
      emphasis: turn.role === "congregation",
      footer: turn.ref ?? `${reading.code} · ${reading.title}`,
    })),
  ];
}

/** Official HTTLVN beat (instrumental accompaniment) MP3 URL for Thánh Ca #1–903. */
export function thanhCaBeatUrl(number: number): string {
  return `https://audio.httlvn.org/TC/thanh-ca/beat/${number}.mp3`;
}

export function buildCreedSlides(data: TinDieuDataset): WorshipSlide[] {
  return [
    { badge: data.creed.title, body: data.creed.verbatimText, footer: data.creed.citation },
    ...data.creed.clauses.map((c) => ({
      badge: `${c.trinitySection} · #${c.order}`,
      body: c.clause,
      footer: c.scriptureRefs.join(" · "),
    })),
    {
      badge: data.liturgy.lordsPrayer.title,
      body: data.liturgy.lordsPrayer.verbatimText,
      footer: data.liturgy.lordsPrayer.citation,
    },
    {
      badge: data.liturgy.benediction.title,
      body: data.liturgy.benediction.verbatimText,
      footer: data.liturgy.benediction.citation,
    },
  ];
}
