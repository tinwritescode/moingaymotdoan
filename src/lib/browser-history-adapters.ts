import type { LocalHistoryStore, RemoteHistoryAdapter, StreakMarksRemote } from "../../lib/history/ports";
import { parseMarks, type StreakMarks } from "../../lib/streak/marks";
import {
  EMPTY_HISTORY,
  type CompleteMutationResult,
  type HistorySnapshot,
  type VisitMutationResult,
} from "../../lib/history/types";

export const DEFAULT_GUEST_STORAGE_KEY = "kt:guest-history:v1";

/** Returns the configured cloud reading-history endpoint base URL (empty string if unset). */
export function getHistoryApiUrl(): string {
  return (import.meta.env.VITE_HISTORY_API_URL ?? "").trim().replace(/\/+$/u, "");
}

/** Browser localStorage implementation of the LocalHistoryStore seam. */
export function createBrowserLocalHistoryStore(
  storageKey = DEFAULT_GUEST_STORAGE_KEY,
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem"> | null,
): LocalHistoryStore {
  const resolveStorage = () => {
    if (storage !== undefined) return storage;
    return typeof window === "undefined" ? null : window.localStorage;
  };

  return {
    read(): HistorySnapshot {
      const store = resolveStorage();
      if (!store) return EMPTY_HISTORY;
      try {
        const raw = store.getItem(storageKey);
        if (!raw) return EMPTY_HISTORY;
        const parsed = JSON.parse(raw) as Partial<HistorySnapshot>;
        return {
          progress: Array.isArray(parsed.progress) ? parsed.progress : [],
          logs: Array.isArray(parsed.logs) ? parsed.logs : [],
        };
      } catch {
        return EMPTY_HISTORY;
      }
    },
    write(snapshot: HistorySnapshot): void {
      const store = resolveStorage();
      if (!store) return;
      try {
        store.setItem(storageKey, JSON.stringify(snapshot));
      } catch {
        // Ignore storage quota or private-mode restrictions.
      }
    },
    clear(): void {
      const store = resolveStorage();
      if (!store) return;
      try {
        store.removeItem(storageKey);
      } catch {
        // ignore
      }
    },
  };
}

export type HttpHistoryAdapterOptions = {
  baseUrl: string;
  getAccessToken: (forceRefresh?: boolean) => Promise<string | null>;
  fetchImpl?: typeof fetch;
};

/** Authorized JSON requests to the history API, retrying once with a fresh token on 401. */
function createAuthorizedRequest(options: HttpHistoryAdapterOptions) {
  const base = options.baseUrl.trim().replace(/\/+$/u, "");
  const fetchFn = options.fetchImpl ?? ((...args: Parameters<typeof fetch>) => fetch(...args));

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const exec = async (forceRefresh: boolean) => {
      const token = await options.getAccessToken(forceRefresh);
      if (!token) throw new Error("Session expired");
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);
      if (init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      return fetchFn(`${base}${path}`, { ...init, headers });
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

  return request;
}

/** HTTP implementation of the RemoteHistoryAdapter seam with automatic 401 token-refresh retry. */
export function createHttpHistoryAdapter(options: HttpHistoryAdapterOptions): RemoteHistoryAdapter {
  const request = createAuthorizedRequest(options);
  return {
    fetchHistory: () => request<HistorySnapshot>("/history"),
    recordVisit: (payload) =>
      request<VisitMutationResult>("/history/visit", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    setCompleted: (payload) =>
      request<CompleteMutationResult>("/history/complete", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    syncGuest: (items) =>
      items.length === 0
        ? request<HistorySnapshot>("/history")
        : request<HistorySnapshot>("/history/sync", {
            method: "POST",
            body: JSON.stringify({ items }),
          }),
    async deleteLog(id) {
      await request(`/history/log/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
    async clearAll() {
      await request("/history", { method: "DELETE" });
    },
  };
}

function marksFromResponse(body: { marks?: unknown }): StreakMarks | null {
  return body.marks === null ? null : parseMarks(body.marks);
}

/** HTTP implementation of the StreakMarksRemote seam; answers are parsed, never trusted. */
export function createHttpStreakMarksRemote(options: HttpHistoryAdapterOptions): StreakMarksRemote {
  const request = createAuthorizedRequest(options);
  return {
    fetch: async () => marksFromResponse(await request<{ marks?: unknown }>("/history/streak")),
    async merge(marks) {
      const merged = marksFromResponse(
        await request<{ marks?: unknown }>("/history/streak", { method: "PUT", body: JSON.stringify(marks) }),
      );
      if (!merged) throw new Error("Invalid streak marks from server");
      return merged;
    },
  };
}
