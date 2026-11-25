import { canonicalBookSlug, translateBookSlug } from "../content/books";
import { canonicalMoodId, chapterHref, moodHref, moodSlugFor, type Locale } from "../i18n";

export type HistoryKind = "chapter" | "mood";

export type ReadingProgress = {
  kind: HistoryKind;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  firstReadAt: string;
  lastReadAt: string;
  readCount: number;
  completed: boolean;
  completedAt: string | null;
};

export type ReadingLog = {
  id: string;
  kind: HistoryKind;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  /** Reader's local calendar date: YYYY-MM-DD */
  readDate: string;
  readAt: string;
};

export type HistorySnapshot = {
  progress: ReadingProgress[];
  logs: ReadingLog[];
};

export const EMPTY_HISTORY: HistorySnapshot = { progress: [], logs: [] };

export type VisitInput = {
  kind: HistoryKind;
  itemKey: string;
  bookSlug?: string | null;
  chapter?: number | null;
  title: string;
  subtitle: string;
  completed?: boolean;
};

/** Wire payload shared by browser sync/visit calls and server handlers. */
export type VisitPayload = {
  kind: HistoryKind;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  readDate: string;
  readAt?: string;
  completed?: boolean;
  readCount?: number;
};

/** Wire payload for toggling completion (with optional visit fields for fallback creation). */
export type CompletePayload = {
  kind: HistoryKind;
  itemKey: string;
  completed: boolean;
  bookSlug?: string | null;
  chapter?: number | null;
  title?: string;
  subtitle?: string;
  readDate?: string;
  readAt?: string;
};

export type VisitMutationResult = {
  progress: ReadingProgress;
  log: ReadingLog;
};

export type CompleteMutationResult = {
  progress: ReadingProgress;
};

export type ReadingStats = {
  chaptersRead: number;
  chaptersCompleted: number;
  booksOpened: number;
  moodsRead: number;
  readingDays: number;
  streak: number;
};

export type BookReadSummary = {
  read: number;
  completed: number;
};

export type DateGroup = {
  dateKey: string;
  label: string;
  items: ReadingLog[];
};

const WEEKDAYS_VI = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"] as const;
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

const LOCAL_LOG_PREFIX = "local:";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Returns the canonical storage key for a chapter across VI and EN slugs. */
export function chapterItemKey(bookSlugOrCode: string, chapter: number): string {
  const canonical = canonicalBookSlug(bookSlugOrCode) ?? bookSlugOrCode;
  return `${canonical}/${chapter}`;
}

/** Returns the canonical storage key for a mood guide across VI and EN slugs. */
export function moodItemKey(slug: string): string {
  return canonicalMoodId(slug) ?? slug;
}

/** Normalizes any VI/EN chapter or mood key to its canonical storage key so locales share unified progress. */
export function canonicalItemKey(kind: HistoryKind, itemKey: string): string {
  if (kind === "chapter") {
    const slash = itemKey.indexOf("/");
    if (slash > 0) {
      const slug = itemKey.slice(0, slash);
      const num = itemKey.slice(slash + 1);
      return `${canonicalBookSlug(slug) ?? slug}/${num}`;
    }
    return itemKey;
  }
  return moodItemKey(itemKey);
}

/** Normalizes a VisitInput's itemKey and bookSlug to canonical storage values. */
export function normalizeVisitInput<T extends VisitInput>(input: T): T {
  const itemKey = canonicalItemKey(input.kind, input.itemKey);
  const bookSlug =
    input.kind === "chapter" && input.bookSlug ? (canonicalBookSlug(input.bookSlug) ?? input.bookSlug) : input.bookSlug;
  return { ...input, itemKey, bookSlug };
}

/** Synthetic ID assigned to local/optimistic logs before server persistence. */
export function syntheticLogId(readDate: string, kind: HistoryKind, itemKey: string): string {
  return `${LOCAL_LOG_PREFIX}${readDate}:${kind}:${itemKey}`;
}

export function isSyntheticLogId(id: string): boolean {
  return id.startsWith(LOCAL_LOG_PREFIX);
}

/** Unique lookup key for a reading progress record. */
export function progressMapKey(kind: HistoryKind, itemKey: string): string {
  return `${kind}:${canonicalItemKey(kind, itemKey)}`;
}

/** Builds a canonical lookup map of progress entries. */
export function buildProgressMap(progress: ReadingProgress[]): Map<string, ReadingProgress> {
  const map = new Map<string, ReadingProgress>();
  for (const item of progress) {
    map.set(progressMapKey(item.kind, item.itemKey), item);
  }
  return map;
}

/** Aggregates chapter read/completed counts per canonical book slug. */
export function buildBookSummaries(progress: ReadingProgress[]): Map<string, BookReadSummary> {
  const map = new Map<string, BookReadSummary>();
  for (const item of progress) {
    if (item.kind !== "chapter" || !item.bookSlug) continue;
    const key = canonicalBookSlug(item.bookSlug) ?? item.bookSlug;
    const cur = map.get(key) ?? { read: 0, completed: 0 };
    cur.read += 1;
    if (item.completed) cur.completed += 1;
    map.set(key, cur);
  }
  return map;
}

/** Finds the most recently opened chapter progress record. */
export function findLatestChapter(progress: ReadingProgress[]): ReadingProgress | null {
  let latest: ReadingProgress | null = null;
  for (const item of progress) {
    if (item.kind !== "chapter") continue;
    if (!latest || item.lastReadAt > latest.lastReadAt) latest = item;
  }
  return latest;
}

/** Computes aggregate reading statistics from a history snapshot. */
export function computeReadingStats(snapshot: HistorySnapshot, now: Date = new Date()): ReadingStats {
  const books = new Set<string>();
  let chaptersRead = 0;
  let chaptersCompleted = 0;
  let moodsRead = 0;
  for (const item of snapshot.progress) {
    if (item.kind === "chapter") {
      chaptersRead += 1;
      if (item.completed) chaptersCompleted += 1;
      if (item.bookSlug) books.add(canonicalBookSlug(item.bookSlug) ?? item.bookSlug);
    } else {
      moodsRead += 1;
    }
  }
  const readingDays = new Set(snapshot.logs.map((l) => l.readDate)).size;
  return {
    chaptersRead,
    chaptersCompleted,
    booksOpened: books.size,
    moodsRead,
    readingDays,
    streak: computeStreak(snapshot.logs, now),
  };
}

/** Returns local calendar date string YYYY-MM-DD (avoids UTC offset drift). */
export function localDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Formats YYYY-MM-DD as DD/MM/YYYY. */
export function formatDateKeyDMY(dateKey: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(dateKey);
  if (!m) return dateKey;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/**
 * Date group heading:
 * - vi: "Hôm nay · Thứ Tư, 25/11/2026"
 * - en: "Today · Wed, Nov 25, 2026"
 */
export function formatDateHeading(dateKey: string, now: Date = new Date(), locale: Locale = "vi"): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(dateKey);
  if (!m) return dateKey;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(year, month - 1, day);

  const todayKey = localDateKey(now);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const isToday = dateKey === todayKey;
  const isYesterday = dateKey === localDateKey(yesterday);

  if (locale === "en") {
    const weekday = WEEKDAYS_EN[d.getDay()];
    const formatted = `${weekday}, ${MONTHS_EN[month - 1]} ${day}, ${year}`;
    if (isToday) return `Today · ${formatted}`;
    if (isYesterday) return `Yesterday · ${formatted}`;
    return formatted;
  }

  const weekday = WEEKDAYS_VI[d.getDay()];
  const dmy = `${m[3]}/${m[2]}/${m[1]}`;
  if (isToday) return `Hôm nay · ${weekday}, ${dmy}`;
  if (isYesterday) return `Hôm qua · ${weekday}, ${dmy}`;
  return `${weekday}, ${dmy}`;
}

/** Short date from ISO string ("DD/MM/YYYY" for vi, "Nov 25, 2026" for en). */
export function formatShortDate(iso: string, locale: Locale = "vi"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  if (locale === "en") {
    return `${MONTHS_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Formats HH:MM (24h) from an ISO string in the reader's local timezone. */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Date + time ("DD/MM/YYYY lúc HH:MM" for vi, "Nov 25, 2026 at HH:MM" for en). */
export function formatDateTime(iso: string, locale: Locale = "vi"): string {
  const date = formatShortDate(iso, locale);
  const time = formatTime(iso);
  if (!date) return "";
  if (!time) return date;
  return locale === "en" ? `${date} at ${time}` : `${date} lúc ${time}`;
}

/** Relative URL to a chapter or mood page in the requested locale. */
export function itemHref(
  item: {
    kind: HistoryKind;
    itemKey: string;
    bookSlug: string | null;
    chapter: number | null;
  },
  locale: Locale = "vi",
): string {
  if (item.kind === "chapter" && item.bookSlug && item.chapter) {
    const slug = translateBookSlug(item.bookSlug, locale) ?? item.bookSlug;
    return chapterHref({ slug, number: item.chapter, locale });
  }
  const slug = moodSlugFor(item.itemKey, locale) ?? item.itemKey;
  return moodHref(slug, locale);
}

/** Groups reading logs by calendar date descending (newest first). */
export function groupLogsByDate(logs: ReadingLog[], now: Date = new Date(), locale: Locale = "vi"): DateGroup[] {
  const map = new Map<string, ReadingLog[]>();
  const sorted = [...logs].sort((a, b) => {
    if (a.readDate !== b.readDate) return b.readDate.localeCompare(a.readDate);
    return b.readAt.localeCompare(a.readAt);
  });
  for (const log of sorted) {
    const list = map.get(log.readDate) ?? [];
    list.push(log);
    map.set(log.readDate, list);
  }
  return [...map.entries()].map(([dateKey, items]) => ({
    dateKey,
    label: formatDateHeading(dateKey, now, locale),
    items,
  }));
}

/** Computes consecutive reading days up to today (or yesterday if today not yet opened). */
export function computeStreak(logs: ReadingLog[], now: Date = new Date()): number {
  const days = new Set(logs.map((l) => l.readDate));
  if (days.size === 0) return 0;

  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(localDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(localDateKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
