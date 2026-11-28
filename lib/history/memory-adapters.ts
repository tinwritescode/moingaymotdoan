import { MAX_LOGS, MAX_PROGRESS, normalizeCompletePayload } from "./contract";
import type { ReaderProfile } from "../profile/profile";
import type { HistoryRepository, LocalHistoryStore, ProfileRemote, RemoteHistoryAdapter, StreakMarksRemote } from "./ports";
import {
  EMPTY_HISTORY,
  progressMapKey,
  type CompleteMutationResult,
  type HistorySnapshot,
  type ReadingLog,
  type ReadingProgress,
  type VisitMutationResult,
  type VisitPayload,
} from "./types";
import { mergeMarks, EMPTY_MARKS, type StreakMarks } from "../streak/marks";

function cloneSnapshot(snapshot: HistorySnapshot): HistorySnapshot {
  return {
    progress: snapshot.progress.map((p) => ({ ...p })),
    logs: snapshot.logs.map((l) => ({ ...l })),
  };
}

/** In-memory LocalHistoryStore adapter for deterministic tests. */
export function createMemoryLocalHistoryStore(initial: HistorySnapshot = EMPTY_HISTORY): LocalHistoryStore {
  let stored = cloneSnapshot(initial);
  return {
    read: () => cloneSnapshot(stored),
    write: (snapshot) => {
      stored = cloneSnapshot(snapshot);
    },
    clear: () => {
      stored = EMPTY_HISTORY;
    },
  };
}

/**
 * In-memory HistoryRepository adapter mirroring the Postgres schema & upsert invariants.
 * Supports multi-user isolation, daily log deduplication, and readCount-preserving sync.
 */
export function createMemoryHistoryRepository(
  initial: Record<string, HistorySnapshot> = {},
): HistoryRepository {
  let nextLogId = 1;
  const store = new Map<string, { progress: Map<string, ReadingProgress>; logs: ReadingLog[] }>();
  const marks = new Map<string, StreakMarks>();
  const profiles = new Map<string, ReaderProfile>();

  const ensureUser = (userId: string) => {
    let bucket = store.get(userId);
    if (!bucket) {
      bucket = { progress: new Map(), logs: [] };
      store.set(userId, bucket);
    }
    return bucket;
  };

  for (const [userId, snap] of Object.entries(initial)) {
    const bucket = ensureUser(userId);
    for (const p of snap.progress) {
      bucket.progress.set(progressMapKey(p.kind, p.itemKey), { ...p });
    }
    for (const l of snap.logs) {
      bucket.logs.push({ ...l });
      const n = Number(l.id);
      if (Number.isInteger(n) && n >= nextLogId) nextLogId = n + 1;
    }
  }

  const upsertVisitSync = (
    userId: string,
    item: VisitPayload,
    options: { isSync: boolean },
  ): VisitMutationResult => {
    const bucket = ensureUser(userId);
    const at = item.readAt ?? new Date().toISOString();
    const completed = item.completed ?? false;
    const incomingCount = Math.max(1, item.readCount ?? 1);
    const key = progressMapKey(item.kind, item.itemKey);

    const existing = bucket.progress.get(key);
    const progress: ReadingProgress = existing
      ? {
          ...existing,
          title: item.title,
          subtitle: item.subtitle,
          firstReadAt: existing.firstReadAt < at ? existing.firstReadAt : at,
          lastReadAt: existing.lastReadAt > at ? existing.lastReadAt : at,
          readCount: options.isSync
            ? Math.max(existing.readCount, incomingCount)
            : existing.readCount + 1,
          completed: existing.completed || completed,
          completedAt: existing.completedAt ?? (completed ? at : null),
        }
      : {
          kind: item.kind,
          itemKey: item.itemKey,
          bookSlug: item.bookSlug ?? null,
          chapter: item.chapter ?? null,
          title: item.title,
          subtitle: item.subtitle,
          firstReadAt: at,
          lastReadAt: at,
          readCount: incomingCount,
          completed,
          completedAt: completed ? at : null,
        };
    bucket.progress.set(key, progress);

    const existingLogIndex = bucket.logs.findIndex(
      (l) => progressMapKey(l.kind, l.itemKey) === key && l.readDate === item.readDate,
    );
    let log: ReadingLog;
    if (existingLogIndex >= 0) {
      const prev = bucket.logs[existingLogIndex];
      log = {
        ...prev,
        title: item.title,
        subtitle: item.subtitle,
        readAt: prev.readAt > at ? prev.readAt : at,
      };
      bucket.logs[existingLogIndex] = log;
    } else {
      log = {
        id: String(nextLogId++),
        kind: item.kind,
        itemKey: item.itemKey,
        bookSlug: item.bookSlug ?? null,
        chapter: item.chapter ?? null,
        title: item.title,
        subtitle: item.subtitle,
        readDate: item.readDate,
        readAt: at,
      };
      bucket.logs.push(log);
    }

    return { progress: { ...progress }, log: { ...log } };
  };

  const fetchUserHistory = async (userId: string): Promise<HistorySnapshot> => {
    const bucket = ensureUser(userId);
    const progress = [...bucket.progress.values()]
      .sort((a, b) => b.lastReadAt.localeCompare(a.lastReadAt))
      .slice(0, MAX_PROGRESS)
      .map((p) => ({ ...p }));
    const logs = [...bucket.logs]
      .sort((a, b) =>
        a.readDate !== b.readDate
          ? b.readDate.localeCompare(a.readDate)
          : b.readAt.localeCompare(a.readAt),
      )
      .slice(0, MAX_LOGS)
      .map((l) => ({ ...l }));
    return { progress, logs };
  };

  return {
    fetchUserHistory,
    async upsertVisit(userId, item, options) {
      return upsertVisitSync(userId, item, options);
    },
    async setCompleted(userId, input): Promise<CompleteMutationResult | null> {
      const bucket = ensureUser(userId);
      const key = progressMapKey(input.kind, input.itemKey);
      const existing = bucket.progress.get(key);
      if (existing) {
        const updated: ReadingProgress = {
          ...existing,
          completed: input.completed,
          completedAt: input.completed ? (existing.completedAt ?? new Date().toISOString()) : null,
        };
        bucket.progress.set(key, updated);
        return { progress: { ...updated } };
      }
      if (!input.fallbackVisit) return null;
      const created = upsertVisitSync(userId, { ...input.fallbackVisit, completed: input.completed }, { isSync: false });
      return { progress: created.progress };
    },
    async syncVisits(userId, items) {
      for (const item of items) {
        upsertVisitSync(userId, item, { isSync: true });
      }
      return fetchUserHistory(userId);
    },
    async deleteLog(userId, id) {
      const bucket = ensureUser(userId);
      const before = bucket.logs.length;
      bucket.logs = bucket.logs.filter((l) => l.id !== id);
      return bucket.logs.length < before;
    },
    async clearUserHistory(userId) {
      const bucket = ensureUser(userId);
      bucket.progress.clear();
      bucket.logs = [];
      marks.delete(userId);
    },
    async fetchStreakMarks(userId) {
      return marks.get(userId) ?? null;
    },
    async mergeStreakMarks(userId, incoming) {
      const merged = mergeMarks(marks.get(userId) ?? EMPTY_MARKS, incoming);
      marks.set(userId, merged);
      return merged;
    },
    async fetchProfile(userId) {
      return profiles.get(userId) ?? null;
    },
    async saveProfile(userId, profile) {
      profiles.set(userId, { ...profile });
      return { ...profile };
    },
  };
}

/** Bridges an in-memory HistoryRepository directly into a client RemoteHistoryAdapter for tests. */
export function createMemoryRemoteHistoryAdapter(
  repository: HistoryRepository,
  getUserId: () => string | null,
): RemoteHistoryAdapter {
  const requireUserId = () => {
    const uid = getUserId();
    if (!uid) throw new Error("Unauthorized");
    return uid;
  };

  return {
    fetchHistory: () => repository.fetchUserHistory(requireUserId()),
    recordVisit: (payload) => repository.upsertVisit(requireUserId(), payload, { isSync: false }),
    async setCompleted(payload) {
      const normalized = normalizeCompletePayload(payload);
      if (!normalized) throw new Error("Invalid completion payload");
      const res = await repository.setCompleted(requireUserId(), normalized);
      if (!res) throw new Error("Not found");
      return res;
    },
    syncGuest: (items) => repository.syncVisits(requireUserId(), items),
    async deleteLog(id) {
      if (!/^\d+$/u.test(id)) throw new Error("HTTP 400");
      await repository.deleteLog(requireUserId(), id);
    },
    clearAll: () => repository.clearUserHistory(requireUserId()),
  };
}

/** Bridges an in-memory HistoryRepository into the client's StreakMarksRemote for tests. */
export function createMemoryStreakMarksRemote(repository: HistoryRepository, userId: string): StreakMarksRemote {
  return {
    fetch: () => repository.fetchStreakMarks(userId),
    merge: (marks) => repository.mergeStreakMarks(userId, marks),
  };
}

/** Bridges an in-memory HistoryRepository into the client's ProfileRemote for tests. */
export function createMemoryProfileRemote(repository: HistoryRepository, userId: string): ProfileRemote {
  return {
    fetch: () => repository.fetchProfile(userId),
    save: (profile) => repository.saveProfile(userId, profile),
  };
}
