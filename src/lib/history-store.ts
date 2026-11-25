import {
  localDateKey,
  type HistoryKind,
  type HistorySnapshot,
  type ReadingLog,
  type ReadingProgress,
  type VisitInput,
} from "../../lib/history/types";
import { getAccessToken, getHistoryApiUrl } from "./auth";

const GUEST_STORAGE_KEY = "kt:guest-history:v1";

export const EMPTY_HISTORY: HistorySnapshot = { progress: [], logs: [] };

export function readGuestHistory(): HistorySnapshot {
  if (typeof window === "undefined") return EMPTY_HISTORY;
  try {
    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return EMPTY_HISTORY;
    const parsed = JSON.parse(raw) as Partial<HistorySnapshot>;
    return {
      progress: Array.isArray(parsed.progress) ? parsed.progress : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
    };
  } catch {
    return EMPTY_HISTORY;
  }
}

export function writeGuestHistory(snapshot: HistorySnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Bỏ qua khi trình duyệt chặn storage hoặc hết dung lượng.
  }
}

export function clearGuestHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Ghi nhận một lượt đọc vào snapshot trong bộ nhớ (dùng cho khách và optimistic update). */
export function applyVisitToSnapshot(
  current: HistorySnapshot,
  input: VisitInput,
  now: Date = new Date(),
): HistorySnapshot {
  const iso = now.toISOString();
  const readDate = localDateKey(now);
  const completedFlag = input.completed ?? false;

  const existing = current.progress.find((p) => p.kind === input.kind && p.itemKey === input.itemKey);
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

  const progress = [
    nextProgressRow,
    ...current.progress.filter((p) => !(p.kind === input.kind && p.itemKey === input.itemKey)),
  ];

  const existingLog = current.logs.find(
    (l) => l.kind === input.kind && l.itemKey === input.itemKey && l.readDate === readDate,
  );
  const nextLogRow: ReadingLog = {
    id: existingLog?.id ?? `local:${readDate}:${input.kind}:${input.itemKey}`,
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
    ...current.logs.filter(
      (l) => !(l.kind === input.kind && l.itemKey === input.itemKey && l.readDate === readDate),
    ),
  ].slice(0, 250);

  return { progress, logs };
}

/** Đổi trạng thái "Đã đọc xong" trong snapshot. */
export function applyCompleteToSnapshot(
  current: HistorySnapshot,
  input: VisitInput & { completed: boolean },
  now: Date = new Date(),
): HistorySnapshot {
  const iso = now.toISOString();
  const exists = current.progress.some((p) => p.kind === input.kind && p.itemKey === input.itemKey);
  if (!exists) {
    return applyVisitToSnapshot(current, input, now);
  }
  return {
    progress: current.progress.map((p) =>
      p.kind === input.kind && p.itemKey === input.itemKey
        ? { ...p, completed: input.completed, completedAt: input.completed ? (p.completedAt ?? iso) : null }
        : p,
    ),
    logs: current.logs,
  };
}

/** Chuẩn bị danh sách item cần đồng bộ từ lịch sử khách lên máy chủ. */
export function buildSyncItems(guest: HistorySnapshot) {
  const completedKeys = new Set(
    guest.progress.filter((p) => p.completed).map((p) => `${p.kind}:${p.itemKey}`),
  );
  const items: {
    kind: HistoryKind;
    itemKey: string;
    bookSlug: string | null;
    chapter: number | null;
    title: string;
    subtitle: string;
    readDate: string;
    readAt: string;
    completed: boolean;
  }[] = [];

  for (const log of guest.logs) {
    items.push({
      kind: log.kind,
      itemKey: log.itemKey,
      bookSlug: log.bookSlug,
      chapter: log.chapter,
      title: log.title,
      subtitle: log.subtitle,
      readDate: log.readDate,
      readAt: log.readAt,
      completed: completedKeys.has(`${log.kind}:${log.itemKey}`),
    });
  }

  // Bổ sung những mục có trong progress nhưng log cũ đã bị cắt bớt.
  const seenKey = new Set(items.map((i) => `${i.kind}:${i.itemKey}`));
  for (const p of guest.progress) {
    if (seenKey.has(`${p.kind}:${p.itemKey}`)) continue;
    const d = new Date(p.lastReadAt);
    items.push({
      kind: p.kind,
      itemKey: p.itemKey,
      bookSlug: p.bookSlug,
      chapter: p.chapter,
      title: p.title,
      subtitle: p.subtitle,
      readDate: Number.isNaN(d.getTime()) ? localDateKey() : localDateKey(d),
      readAt: p.lastReadAt,
      completed: p.completed,
    });
  }

  return items.slice(0, 200);
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = getHistoryApiUrl();
  if (!base) throw new Error("Chưa cấu hình VITE_HISTORY_API_URL");

  const exec = async (forceRefresh: boolean) => {
    const token = await getAccessToken(forceRefresh);
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn");
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(`${base}${path}`, { ...init, headers });
  };

  let res = await exec(false);
  if (res.status === 401) {
    res = await exec(true);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function fetchCloudHistory(): Promise<HistorySnapshot> {
  return apiRequest<HistorySnapshot>("/history");
}

export async function postCloudVisit(input: VisitInput, now: Date = new Date()) {
  return apiRequest<{ progress: ReadingProgress; log: ReadingLog }>("/history/visit", {
    method: "POST",
    body: JSON.stringify({
      kind: input.kind,
      itemKey: input.itemKey,
      bookSlug: input.bookSlug ?? null,
      chapter: input.chapter ?? null,
      title: input.title,
      subtitle: input.subtitle,
      readDate: localDateKey(now),
      readAt: now.toISOString(),
      completed: input.completed,
    }),
  });
}

export async function patchCloudComplete(input: VisitInput & { completed: boolean }, now: Date = new Date()) {
  return apiRequest<{ progress: ReadingProgress }>("/history/complete", {
    method: "PATCH",
    body: JSON.stringify({
      kind: input.kind,
      itemKey: input.itemKey,
      bookSlug: input.bookSlug ?? null,
      chapter: input.chapter ?? null,
      title: input.title,
      subtitle: input.subtitle,
      readDate: localDateKey(now),
      readAt: now.toISOString(),
      completed: input.completed,
    }),
  });
}

export async function syncCloudHistory(guest: HistorySnapshot): Promise<HistorySnapshot> {
  const items = buildSyncItems(guest);
  if (items.length === 0) return fetchCloudHistory();
  return apiRequest<HistorySnapshot>("/history/sync", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function deleteCloudLog(id: string): Promise<void> {
  await apiRequest(`/history/log/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function deleteCloudItem(kind: HistoryKind, itemKey: string): Promise<void> {
  await apiRequest("/history/item", {
    method: "DELETE",
    body: JSON.stringify({ kind, itemKey }),
  });
}

export async function clearCloudHistory(): Promise<void> {
  await apiRequest("/history", { method: "DELETE" });
}
