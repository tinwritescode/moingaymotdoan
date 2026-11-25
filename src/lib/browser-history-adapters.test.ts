import { describe, expect, it } from "vitest";
import { classifyAuthError } from "../../lib/auth/types";
import { formatAuthError, formatSyncError } from "./auth-messages";
import {
  createBrowserLocalHistoryStore,
  createHttpHistoryAdapter,
} from "./browser-history-adapters";
import { formatWorkosUser } from "./workos-auth";

describe("browser history & auth adapters", () => {
  it("reads, writes, clears, and recovers from corrupted localStorage snapshots", () => {
    const bag = new Map<string, string>();
    const storage = {
      getItem: (k: string) => bag.get(k) ?? null,
      setItem: (k: string, v: string) => {
        bag.set(k, v);
      },
      removeItem: (k: string) => {
        bag.delete(k);
      },
    };

    const store = createBrowserLocalHistoryStore("test:key", storage);
    expect(store.read()).toEqual({ progress: [], logs: [] });

    bag.set("test:key", "{bad json");
    expect(store.read()).toEqual({ progress: [], logs: [] });

    store.write({
      progress: [
        {
          kind: "mood",
          itemKey: "lo-au",
          bookSlug: null,
          chapter: null,
          title: "Lo âu",
          subtitle: "Lo âu",
          firstReadAt: "2026-11-25T09:00:00.000Z",
          lastReadAt: "2026-11-25T09:00:00.000Z",
          readCount: 1,
          completed: false,
          completedAt: null,
        },
      ],
      logs: [],
    });
    expect(store.read().progress).toHaveLength(1);

    store.clear();
    expect(store.read()).toEqual({ progress: [], logs: [] });
  });

  it("retries HTTP history calls once with forceRefresh=true on 401", async () => {
    const calls: { url: string; auth: string | null }[] = [];
    let attempt = 0;

    const adapter = createHttpHistoryAdapter({
      baseUrl: "https://history.example/",
      getAccessToken: async (forceRefresh) => (forceRefresh ? "fresh-token" : "stale-token"),
      fetchImpl: async (input, init) => {
        attempt += 1;
        const headers = new Headers(init?.headers);
        calls.push({ url: String(input), auth: headers.get("Authorization") });
        if (attempt === 1) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        return new Response(JSON.stringify({ progress: [], logs: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    });

    const snapshot = await adapter.fetchHistory();
    expect(snapshot).toEqual({ progress: [], logs: [] });
    expect(calls).toEqual([
      { url: "https://history.example/history", auth: "Bearer stale-token" },
      { url: "https://history.example/history", auth: "Bearer fresh-token" },
    ]);
  });

  it("formats WorkOS profiles and localizes typed auth and sync errors", () => {
    expect(
      formatWorkosUser({
        id: "user_01",
        email: "anh@example.com",
        firstName: "Minh",
        lastName: "Anh",
        profilePictureUrl: "https://example.com/a.jpg",
      }),
    ).toEqual({
      id: "user_01",
      email: "anh@example.com",
      name: "Minh Anh",
      avatarUrl: "https://example.com/a.jpg",
    });

    expect(
      formatWorkosUser({
        id: "user_02",
        email: "reader@example.com",
        firstName: null,
        lastName: null,
        profilePictureUrl: null,
      }),
    ).toMatchObject({ name: "reader", avatarUrl: null });

    expect(formatAuthError(classifyAuthError("access_denied"), "vi")).toContain("hủy");
    expect(formatAuthError(classifyAuthError("access_denied"), "en")).toContain("canceled");
    expect(formatSyncError("delete_log_failed", "vi")).toBeTruthy();
    expect(formatSyncError("delete_log_failed", "en")).toBeTruthy();
  });
});
