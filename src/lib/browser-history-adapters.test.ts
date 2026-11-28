import { describe, expect, it } from "vitest";
import { classifyAuthError } from "../../lib/auth/types";
import { formatAuthError, formatSyncError } from "./auth-messages";
import {
  createHttpProfileRemote,
  createHttpStreakMarksRemote,
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

describe("createHttpStreakMarksRemote", () => {
  const marks = { restDays: ["2026-11-28"], restartedOn: null, remindHour: 21 };
  const remoteAnswering = (body: unknown, calls: RequestInit[] = []) =>
    createHttpStreakMarksRemote({
      baseUrl: "https://api.test/",
      getAccessToken: async () => "token",
      fetchImpl: async (_url, init) => {
        calls.push(init ?? {});
        return new Response(JSON.stringify(body), { status: 200 });
      },
    });

  it("sends the marks with the token and returns the server's merge", async () => {
    const calls: RequestInit[] = [];
    expect(await remoteAnswering({ marks }, calls).merge(marks)).toEqual(marks);
    expect(calls[0].method).toBe("PUT");
    expect(new Headers(calls[0].headers).get("Authorization")).toBe("Bearer token");
    expect(await remoteAnswering({ marks: null }).fetch()).toBeNull();
  });

  it("never trusts malformed marks from the server", async () => {
    expect(await remoteAnswering({ marks: { restDays: "all" } }).fetch()).toBeNull();
    await expect(remoteAnswering({ marks: { restDays: "all" } }).merge(marks)).rejects.toThrow();
  });
});


describe("createHttpProfileRemote", () => {
  const profile = { name: "Tin", avatar: null };
  const remoteAnswering = (body: unknown, calls: RequestInit[] = []) =>
    createHttpProfileRemote({
      baseUrl: "https://api.test/",
      getAccessToken: async () => "token",
      fetchImpl: async (_url, init) => {
        calls.push(init ?? {});
        return new Response(JSON.stringify(body), { status: 200 });
      },
    });

  it("puts the profile and returns the server's copy", async () => {
    const calls: RequestInit[] = [];
    expect(await remoteAnswering({ profile }, calls).save(profile)).toEqual(profile);
    expect(calls[0].method).toBe("PUT");
    expect(calls[0].body).toBe(JSON.stringify(profile));
    expect(await remoteAnswering({ profile: null }).fetch()).toBeNull();
  });

  it("never trusts a malformed profile from the server", async () => {
    expect(await remoteAnswering({ profile: { name: "" } }).fetch()).toBeNull();
    await expect(remoteAnswering({ profile: { name: "" } }).save(profile)).rejects.toThrow();
  });
});
