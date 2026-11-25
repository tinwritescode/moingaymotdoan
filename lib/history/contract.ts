import {
  canonicalItemKey,
  localDateKey,
  normalizeVisitInput,
  progressMapKey,
  syntheticLogId,
  type CompletePayload,
  type HistoryKind,
  type HistorySnapshot,
  type ReadingLog,
  type ReadingProgress,
  type VisitInput,
  type VisitMutationResult,
  type VisitPayload,
} from "./types";

export const MAX_LOGS = 250;
export const MAX_SYNC_ITEMS = 200;
export const MAX_PROGRESS = 2000;
export const MAX_CHAPTER = 200;
export const MAX_READ_COUNT = 100_000;

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/u;
export const KEY_RE = /^[a-z0-9/-]{1,120}$/u;
export const NUMERIC_ID_RE = /^\d+$/u;

/** Validates and normalizes a raw visit payload on both client and server seams. */
export function normalizeVisitPayload(raw: unknown): VisitPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const kind: HistoryKind | null = r.kind === "chapter" || r.kind === "mood" ? r.kind : null;
  const rawKey = typeof r.itemKey === "string" ? r.itemKey.trim() : "";
  const title = typeof r.title === "string" ? r.title.trim().slice(0, 200) : "";
  const subtitle = typeof r.subtitle === "string" ? r.subtitle.trim().slice(0, 120) : "";
  const readDate = typeof r.readDate === "string" ? r.readDate.trim() : "";

  if (!kind || !KEY_RE.test(rawKey) || !title || !subtitle || !DATE_RE.test(readDate)) return null;

  let bookSlug: string | null = null;
  let chapter: number | null = null;
  if (kind === "chapter") {
    if (typeof r.bookSlug !== "string" || !KEY_RE.test(r.bookSlug.trim())) return null;
    const ch = typeof r.chapter === "number" ? r.chapter : Number(r.chapter);
    if (!Number.isInteger(ch) || ch < 1 || ch > MAX_CHAPTER) return null;
    bookSlug = r.bookSlug.trim();
    chapter = ch;
  }

  let readAt: string | undefined;
  if (typeof r.readAt === "string") {
    const parsed = Date.parse(r.readAt);
    if (!Number.isNaN(parsed)) readAt = new Date(parsed).toISOString();
  }

  const completed = typeof r.completed === "boolean" ? r.completed : undefined;

  let readCount: number | undefined;
  if (r.readCount !== undefined && r.readCount !== null) {
    const count = typeof r.readCount === "number" ? r.readCount : Number(r.readCount);
    if (!Number.isInteger(count) || count < 1) return null;
    readCount = Math.min(count, MAX_READ_COUNT);
  }

  return { kind, itemKey: rawKey, bookSlug, chapter, title, subtitle, readDate, readAt, completed, readCount };
}

export type NormalizedCompleteRequest = {
  kind: HistoryKind;
  itemKey: string;
  completed: boolean;
  fallbackVisit: VisitPayload | null;
};

/** Validates a completion toggle payload (and extracts optional fallback visit fields). */
export function normalizeCompletePayload(raw: unknown): NormalizedCompleteRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const kind: HistoryKind | null = r.kind === "chapter" || r.kind === "mood" ? r.kind : null;
  if (!kind || typeof r.completed !== "boolean") return null;

  const itemKey = typeof r.itemKey === "string" ? r.itemKey.trim() : "";
  if (!KEY_RE.test(itemKey)) return null;

  const fallbackVisit = normalizeVisitPayload({ ...r, completed: r.completed });
  return { kind, itemKey, completed: r.completed, fallbackVisit };
}

export type NormalizedSyncResult =
  | { ok: true; items: VisitPayload[] }
  | { ok: false; error: string };

/** Strictly validates a batch sync payload; rejects malformed items instead of silently dropping them. */
export function normalizeSyncPayload(raw: unknown): NormalizedSyncResult {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid sync payload" };
  const body = raw as { items?: unknown };
  if (!Array.isArray(body.items)) return { ok: false, error: "Invalid sync payload" };

  const items: VisitPayload[] = [];
  for (let i = 0; i < Math.min(body.items.length, MAX_SYNC_ITEMS); i++) {
    const normalized = normalizeVisitPayload(body.items[i]);
    if (!normalized) {
      return { ok: false, error: `Invalid sync item at index ${i}` };
    }
    items.push(normalized);
  }
  return { ok: true, items };
}

/** Builds a wire VisitPayload from a normalized VisitInput. */
export function toVisitPayload(rawInput: VisitInput, now: Date = new Date()): VisitPayload {
  const input = normalizeVisitInput(rawInput);
  return {
    kind: input.kind,
    itemKey: input.itemKey,
    bookSlug: input.kind === "chapter" ? (input.bookSlug ?? null) : null,
    chapter: input.kind === "chapter" ? (input.chapter ?? null) : null,
    title: input.title,
    subtitle: input.subtitle,
    readDate: localDateKey(now),
    readAt: now.toISOString(),
    completed: input.completed,
  };
}

/** Builds a wire CompletePayload from a VisitInput + completed flag. */
export function toCompletePayload(
  rawInput: VisitInput & { completed: boolean },
  now: Date = new Date(),
): CompletePayload {
  const visit = toVisitPayload(rawInput, now);
  return {
    ...visit,
    completed: rawInput.completed,
  };
}

/** Prepares validated wire items to sync guest history up to the server, preserving read counts. */
export function buildSyncItems(guest: HistorySnapshot): VisitPayload[] {
  const progressByKey = new Map<string, ReadingProgress>();
  for (const p of guest.progress) {
    progressByKey.set(progressMapKey(p.kind, p.itemKey), p);
  }

  const items: VisitPayload[] = [];
  const seenKeys = new Set<string>();

  for (const log of guest.logs) {
    const key = progressMapKey(log.kind, log.itemKey);
    const prog = progressByKey.get(key);
    const normalized = normalizeVisitPayload({
      kind: log.kind,
      itemKey: canonicalItemKey(log.kind, log.itemKey),
      bookSlug: log.kind === "chapter" ? (prog?.bookSlug ?? log.bookSlug) : null,
      chapter: log.kind === "chapter" ? (prog?.chapter ?? log.chapter) : null,
      title: log.title,
      subtitle: log.subtitle,
      readDate: log.readDate,
      readAt: log.readAt,
      completed: prog?.completed ?? false,
      readCount: prog?.readCount ?? 1,
    });
    if (normalized) {
      items.push(normalized);
      seenKeys.add(key);
    }
  }

  // Include progress entries whose older daily logs aged past MAX_LOGS.
  for (const p of guest.progress) {
    const key = progressMapKey(p.kind, p.itemKey);
    if (seenKeys.has(key)) continue;
    const d = new Date(p.lastReadAt);
    const normalized = normalizeVisitPayload({
      kind: p.kind,
      itemKey: canonicalItemKey(p.kind, p.itemKey),
      bookSlug: p.kind === "chapter" ? p.bookSlug : null,
      chapter: p.kind === "chapter" ? p.chapter : null,
      title: p.title,
      subtitle: p.subtitle,
      readDate: Number.isNaN(d.getTime()) ? localDateKey() : localDateKey(d),
      readAt: p.lastReadAt,
      completed: p.completed,
      readCount: p.readCount,
    });
    if (normalized) {
      items.push(normalized);
      seenKeys.add(key);
    }
  }

  return items.slice(0, MAX_SYNC_ITEMS);
}

function sameItem(a: { kind: HistoryKind; itemKey: string }, b: { kind: HistoryKind; itemKey: string }): boolean {
  return progressMapKey(a.kind, a.itemKey) === progressMapKey(b.kind, b.itemKey);
}

/** Records a reading visit into an in-memory snapshot (used for guest storage and optimistic updates). */
export function applyVisitToSnapshot(
  current: HistorySnapshot,
  rawInput: VisitInput,
  now: Date = new Date(),
): HistorySnapshot {
  const input = normalizeVisitInput(rawInput);
  const iso = now.toISOString();
  const readDate = localDateKey(now);
  const completedFlag = input.completed ?? false;

  const existing = current.progress.find((p) => sameItem(p, input));
  const nextProgressRow: ReadingProgress = existing
    ? {
        ...existing,
        title: input.title,
        subtitle: input.subtitle,
        lastReadAt: iso,
        readCount: existing.readCount + 1,
        completed: existing.completed || completedFlag,
        completedAt: existing.completedAt ?? (completedFlag ? iso : null),
      }
    : {
        kind: input.kind,
        itemKey: input.itemKey,
        bookSlug: input.bookSlug ?? null,
        chapter: input.chapter ?? null,
        title: input.title,
        subtitle: input.subtitle,
        firstReadAt: iso,
        lastReadAt: iso,
        readCount: 1,
        completed: completedFlag,
        completedAt: completedFlag ? iso : null,
      };

  const progress = [nextProgressRow, ...current.progress.filter((p) => !sameItem(p, input))];

  const existingLog = current.logs.find((l) => sameItem(l, input) && l.readDate === readDate);
  const nextLogRow: ReadingLog = {
    id: existingLog?.id ?? syntheticLogId(readDate, input.kind, input.itemKey),
    kind: input.kind,
    itemKey: input.itemKey,
    bookSlug: input.bookSlug ?? null,
    chapter: input.chapter ?? null,
    title: input.title,
    subtitle: input.subtitle,
    readDate,
    readAt: iso,
  };

  const logs = [
    nextLogRow,
    ...current.logs.filter((l) => !(sameItem(l, input) && l.readDate === readDate)),
  ].slice(0, MAX_LOGS);

  return { progress, logs };
}

/** Toggles completion status inside an in-memory snapshot. */
export function applyCompleteToSnapshot(
  current: HistorySnapshot,
  rawInput: VisitInput & { completed: boolean },
  now: Date = new Date(),
): HistorySnapshot {
  const input = normalizeVisitInput(rawInput);
  const iso = now.toISOString();
  const exists = current.progress.some((p) => sameItem(p, input));
  if (!exists) {
    return applyVisitToSnapshot(current, input, now);
  }
  return {
    progress: current.progress.map((p) =>
      sameItem(p, input)
        ? { ...p, completed: input.completed, completedAt: input.completed ? (p.completedAt ?? iso) : null }
        : p,
    ),
    logs: current.logs,
  };
}

/** Reconciles a server visit response into the current snapshot without clobbering other entries. */
export function reconcileVisitInSnapshot(
  current: HistorySnapshot,
  saved: VisitMutationResult,
  options: { skipLog?: boolean } = {},
): HistorySnapshot {
  const progress = [saved.progress, ...current.progress.filter((p) => !sameItem(p, saved.progress))];
  const logs = options.skipLog
    ? current.logs.filter((l) => !(sameItem(l, saved.log) && l.readDate === saved.log.readDate))
    : [
        saved.log,
        ...current.logs.filter((l) => !(sameItem(l, saved.log) && l.readDate === saved.log.readDate)),
      ].slice(0, MAX_LOGS);
  return { progress, logs };
}

/** Reconciles a server completion response into the current snapshot. */
export function reconcileProgressInSnapshot(
  current: HistorySnapshot,
  savedProgress: ReadingProgress,
): HistorySnapshot {
  return {
    ...current,
    progress: [savedProgress, ...current.progress.filter((p) => !sameItem(p, savedProgress))],
  };
}

/** Removes a single log row by id from the snapshot. */
export function removeLogFromSnapshot(current: HistorySnapshot, id: string): HistorySnapshot {
  return {
    ...current,
    logs: current.logs.filter((l) => l.id !== id),
  };
}
