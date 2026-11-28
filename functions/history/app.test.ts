import { describe, expect, it } from "vitest";
import { createMemoryHistoryRepository } from "../../lib/history/memory-adapters";
import { createHistoryApp } from "./app";
import { aggregateSyncBatch } from "./postgres-repository";

function createTestServer() {
  const repository = createMemoryHistoryRepository();
  const tokens: Record<string, string> = {
    "token-alice": "user_alice",
    "token-bob": "user_bob",
  };
  const app = createHistoryApp({
    repository,
    verifyToken: async (token) => tokens[token] ?? null,
    isOriginAllowed: (origin) => origin === "https://moingaymotdoan.xyz",
  });
  return { app, repository };
}

function authHeaders(token: string, origin = "https://moingaymotdoan.xyz"): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Origin: origin,
  };
}

const VISIT_BODY = {
  kind: "chapter",
  itemKey: "sang-the-ky/1",
  bookSlug: "sang-the-ky",
  chapter: 1,
  title: "Chúa dựng nên trời đất",
  subtitle: "Sáng-thế Ký 1",
  readDate: "2026-11-25",
  readAt: "2026-11-25T09:00:00.000Z",
};

describe("createHistoryApp HTTP interface", () => {
  it("serves /health without auth and enforces CORS origin policy", async () => {
    const { app } = createTestServer();

    const allowed = await app.request("/health", {
      headers: { Origin: "https://moingaymotdoan.xyz" },
    });
    expect(allowed.status).toBe(200);
    expect(await allowed.json()).toEqual({ ok: true });
    expect(allowed.headers.get("access-control-allow-origin")).toBe("https://moingaymotdoan.xyz");

    const denied = await app.request("/health", {
      headers: { Origin: "https://evil.example" },
    });
    expect(denied.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("rejects missing or invalid bearer tokens with 401", async () => {
    const { app } = createTestServer();

    expect((await app.request("/history")).status).toBe(401);
    expect(
      (await app.request("/history", { headers: { Authorization: "Bearer bad-token" } })).status,
    ).toBe(401);
  });

  it("records visits, toggles completion (including fallback create), deletes numeric logs, and isolates users", async () => {
    const { app } = createTestServer();

    // Invalid visit -> 400.
    const badVisit = await app.request("/history/visit", {
      method: "POST",
      headers: authHeaders("token-alice"),
      body: JSON.stringify({ kind: "chapter", itemKey: "bad key!" }),
    });
    expect(badVisit.status).toBe(400);

    // Alice records two visits on the same day -> readCount=2, single daily log row.
    const v1 = await app.request("/history/visit", {
      method: "POST",
      headers: authHeaders("token-alice"),
      body: JSON.stringify(VISIT_BODY),
    });
    expect(v1.status).toBe(200);
    const r1 = (await v1.json()) as { progress: { readCount: number }; log: { id: string } };
    expect(r1.progress.readCount).toBe(1);

    const v2 = await app.request("/history/visit", {
      method: "POST",
      headers: authHeaders("token-alice"),
      body: JSON.stringify({ ...VISIT_BODY, readAt: "2026-11-25T11:00:00.000Z" }),
    });
    const r2 = (await v2.json()) as { progress: { readCount: number }; log: { id: string } };
    expect(r2.progress.readCount).toBe(2);
    expect(r2.log.id).toBe(r1.log.id);

    // Bob cannot see or delete Alice's history.
    const bobHistory = await app.request("/history", { headers: authHeaders("token-bob") });
    expect(await bobHistory.json()).toEqual({ progress: [], logs: [] });

    const bobDelete = await app.request(`/history/log/${r1.log.id}`, {
      method: "DELETE",
      headers: authHeaders("token-bob"),
    });
    expect(await bobDelete.json()).toEqual({ deleted: false });

    // Synthetic local ID (URL-encoded as the browser adapter sends it) rejected with 400.
    const badId = await app.request(
      `/history/log/${encodeURIComponent("local:2026-11-25:chapter:sang-the-ky/1")}`,
      {
        method: "DELETE",
        headers: authHeaders("token-alice"),
      },
    );
    expect(badId.status).toBe(400);

    // PATCH /history/complete updates existing row.
    const complete = await app.request("/history/complete", {
      method: "PATCH",
      headers: authHeaders("token-alice"),
      body: JSON.stringify({ kind: "chapter", itemKey: "sang-the-ky/1", completed: true }),
    });
    expect(complete.status).toBe(200);
    expect((await complete.json()).progress.completed).toBe(true);

    // PATCH /history/complete on missing item without fallback -> 404; with fallback -> 200.
    const missingComplete = await app.request("/history/complete", {
      method: "PATCH",
      headers: authHeaders("token-alice"),
      body: JSON.stringify({ kind: "chapter", itemKey: "thi-thien/23", completed: true }),
    });
    expect(missingComplete.status).toBe(404);

    const fallbackComplete = await app.request("/history/complete", {
      method: "PATCH",
      headers: authHeaders("token-alice"),
      body: JSON.stringify({
        kind: "chapter",
        itemKey: "thi-thien/23",
        bookSlug: "thi-thien",
        chapter: 23,
        title: "Chúa là Đấng chăn giữ tôi",
        subtitle: "Thi-thiên 23",
        readDate: "2026-11-25",
        completed: true,
      }),
    });
    expect(fallbackComplete.status).toBe(200);
    expect((await fallbackComplete.json()).progress.completed).toBe(true);

    // Alice deletes her log and clears all history.
    const del = await app.request(`/history/log/${r1.log.id}`, {
      method: "DELETE",
      headers: authHeaders("token-alice"),
    });
    expect(await del.json()).toEqual({ deleted: true });

    const clear = await app.request("/history", {
      method: "DELETE",
      headers: authHeaders("token-alice"),
    });
    expect(await clear.json()).toEqual({ cleared: true });

    const afterClear = await app.request("/history", { headers: authHeaders("token-alice") });
    expect(await afterClear.json()).toEqual({ progress: [], logs: [] });
  });

  it("syncs batches while preserving guest readCount and strictly rejects malformed sync items with 400", async () => {
    const { app } = createTestServer();

    const invalidSync = await app.request("/history/sync", {
      method: "POST",
      headers: authHeaders("token-alice"),
      body: JSON.stringify({
        items: [VISIT_BODY, { kind: "chapter", itemKey: "missing-fields" }],
      }),
    });
    expect(invalidSync.status).toBe(400);

    // Ensure malformed sync wrote nothing (no silent partial drop).
    const before = await app.request("/history", { headers: authHeaders("token-alice") });
    expect(await before.json()).toEqual({ progress: [], logs: [] });

    const validSync = await app.request("/history/sync", {
      method: "POST",
      headers: authHeaders("token-alice"),
      body: JSON.stringify({
        items: [
          { ...VISIT_BODY, readDate: "2026-11-24", readAt: "2026-11-24T08:00:00.000Z", readCount: 4, completed: true },
          { ...VISIT_BODY, readDate: "2026-11-25", readAt: "2026-11-25T10:00:00.000Z", readCount: 4, completed: true },
        ],
      }),
    });
    expect(validSync.status).toBe(200);
    const snapshot = (await validSync.json()) as {
      progress: { itemKey: string; readCount: number; completed: boolean }[];
      logs: { readDate: string }[];
    };
    expect(snapshot.progress).toHaveLength(1);
    expect(snapshot.progress[0]).toMatchObject({
      itemKey: "sang-the-ky/1",
      readCount: 4,
      completed: true,
    });
    expect(snapshot.logs.map((l) => l.readDate)).toEqual(["2026-11-25", "2026-11-24"]);
  });

  it("deduplicates sync batches per conflict key for single-transaction Postgres UNNEST upserts", () => {
    const batch = aggregateSyncBatch(
      [
        {
          kind: "chapter",
          itemKey: "sang-the-ky/1",
          bookSlug: "sang-the-ky",
          chapter: 1,
          title: "Old title",
          subtitle: "Sáng-thế Ký 1",
          readDate: "2026-11-24",
          readAt: "2026-11-24T08:00:00.000Z",
          readCount: 2,
          completed: false,
        },
        {
          kind: "chapter",
          itemKey: "sang-the-ky/1",
          bookSlug: "sang-the-ky",
          chapter: 1,
          title: "New title",
          subtitle: "Sáng-thế Ký 1",
          readDate: "2026-11-25",
          readAt: "2026-11-25T10:00:00.000Z",
          readCount: 5,
          completed: true,
        },
      ],
      "2026-11-25T12:00:00.000Z",
    );

    expect(batch.progress).toHaveLength(1);
    expect(batch.progress[0]).toMatchObject({
      title: "New title",
      firstReadAt: "2026-11-24T08:00:00.000Z",
      lastReadAt: "2026-11-25T10:00:00.000Z",
      readCount: 5,
      completed: true,
    });
    expect(batch.logs).toHaveLength(2);
  });
});

describe("streak marks", () => {
  const put = (app: ReturnType<typeof createTestServer>["app"], token: string, body: unknown) =>
    app.request("/history/streak", { method: "PUT", headers: authHeaders(token), body: JSON.stringify(body) });

  it("needs a signed-in user", async () => {
    const { app } = createTestServer();
    expect((await app.request("/history/streak")).status).toBe(401);
  });

  it("merges each device's marks into one copy per user", async () => {
    const { app } = createTestServer();
    expect(await (await app.request("/history/streak", { headers: authHeaders("token-alice") })).json()).toEqual({ marks: null });

    await put(app, "token-alice", { restDays: ["2026-11-17"], restartedOn: null, remindHour: 21 });
    const res = await put(app, "token-alice", { restDays: ["2026-11-24"], restartedOn: "2026-11-01", remindHour: 20 });
    const merged = { restDays: ["2026-11-17", "2026-11-24"], restartedOn: "2026-11-01", remindHour: 20 };
    expect(await res.json()).toEqual({ marks: merged });
    expect(await (await app.request("/history/streak", { headers: authHeaders("token-alice") })).json()).toEqual({ marks: merged });
    expect(await (await app.request("/history/streak", { headers: authHeaders("token-bob") })).json()).toEqual({ marks: null });
  });

  it("refuses malformed marks", async () => {
    const { app } = createTestServer();
    expect((await put(app, "token-alice", { restDays: ["soon"], restartedOn: null, remindHour: 21 })).status).toBe(400);
  });

  it("clearing the history forgets the marks", async () => {
    const { app } = createTestServer();
    await put(app, "token-alice", { restDays: ["2026-11-17"], restartedOn: null, remindHour: 21 });
    await app.request("/history", { method: "DELETE", headers: authHeaders("token-alice") });
    expect(await (await app.request("/history/streak", { headers: authHeaders("token-alice") })).json()).toEqual({ marks: null });
  });
});

describe("reader profile", () => {
  const JPEG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ==";
  const get = (app: ReturnType<typeof createTestServer>["app"], token: string) =>
    app.request("/history/profile", { headers: authHeaders(token) });
  const put = (app: ReturnType<typeof createTestServer>["app"], token: string, body: unknown) =>
    app.request("/history/profile", { method: "PUT", headers: authHeaders(token), body: JSON.stringify(body) });

  it("needs a signed-in user", async () => {
    const { app } = createTestServer();
    expect((await app.request("/history/profile")).status).toBe(401);
  });

  it("keeps one name and photo per user, replaced on each save", async () => {
    const { app } = createTestServer();
    expect(await (await get(app, "token-alice")).json()).toEqual({ profile: null });

    await put(app, "token-alice", { name: "Alice", avatar: JPEG });
    const res = await put(app, "token-alice", { name: " Alice N. ", avatar: null });
    expect(await res.json()).toEqual({ profile: { name: "Alice N.", avatar: null } });
    expect(await (await get(app, "token-alice")).json()).toEqual({ profile: { name: "Alice N.", avatar: null } });
    expect(await (await get(app, "token-bob")).json()).toEqual({ profile: null });
  });

  it("refuses a malformed profile", async () => {
    const { app } = createTestServer();
    expect((await put(app, "token-alice", { name: "", avatar: null })).status).toBe(400);
    expect((await put(app, "token-alice", { name: "Alice", avatar: "https://evil.test/x.jpg" })).status).toBe(400);
  });
});
