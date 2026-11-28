import { describe, expect, it, vi } from "vitest";
import { localClock, type PushRow, type PushSender, type PushStore } from "../../lib/streak/reminders";
import { createMemoryHistoryRepository } from "../../lib/history/memory-adapters";
import { createHistoryApp } from "./app";

const ENDPOINT = "https://fcm.googleapis.com/fcm/send/abc";
const KEY = "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQ";
const SUBSCRIBE = {
  subscription: { endpoint: ENDPOINT, keys: { p256dh: KEY, auth: "tBHItJI5svbpez7KI4CCXg" } },
  tz: "Asia/Ho_Chi_Minh",
  remindHour: 21,
  locale: "vi",
  lastReadDate: "2026-11-28",
  streak: 23,
};
// 21:05 on 2026-11-29 in Ho Chi Minh City.
const EVENING = new Date("2026-11-29T14:05:00Z");

function createMemoryPushStore(): PushStore & { rows: Map<string, PushRow> } {
  const rows = new Map<string, PushRow>();
  return {
    rows,
    async upsert(row) {
      rows.set(row.endpoint, { ...row, lastSentDate: rows.get(row.endpoint)?.lastSentDate ?? null });
    },
    async remove(endpoint) {
      rows.delete(endpoint);
    },
    async listDue(now, after, limit) {
      return [...rows.values()]
        .filter((r) => after === null || r.endpoint > after)
        .filter((r) => {
          const today = localClock(now, r.tz).date;
          return r.lastSentDate !== today && r.lastReadDate !== today;
        })
        .sort((a, b) => (a.endpoint < b.endpoint ? -1 : 1))
        .slice(0, limit);
    },
    async claim(endpoint, date) {
      const row = rows.get(endpoint);
      if (!row || row.lastSentDate === date) return false;
      rows.set(endpoint, { ...row, lastSentDate: date });
      return true;
    },
  };
}

function createTestServer(send: PushSender = vi.fn(async () => "sent" as const)) {
  const store = createMemoryPushStore();
  const app = createHistoryApp({
    repository: createMemoryHistoryRepository(),
    verifyToken: async () => null,
    isOriginAllowed: () => true,
    push: { store, send, now: () => EVENING },
  });
  const put = (body: unknown) =>
    app.request("/push/subscription", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const cron = (id = "inv_1") =>
    app.request("/push/cron", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-neon-trigger-invocation-id": id },
      body: JSON.stringify({
        version: 1,
        invocation_id: id,
        trigger: { type: "schedule", id: "trg_1", name: "streak-reminders" },
        data: { scheduled_at: EVENING.toISOString() },
      }),
    });
  return { app, store, send, put, cron };
}

describe("push routes", () => {
  it("stores a subscription and updates it in place", async () => {
    const { store, put } = createTestServer();
    expect((await put(SUBSCRIBE)).status).toBe(204);
    expect((await put({ ...SUBSCRIBE, streak: 24, lastReadDate: "2026-11-29" })).status).toBe(204);
    expect(store.rows.size).toBe(1);
    expect(store.rows.get(ENDPOINT)).toMatchObject({ streak: 24, lastReadDate: "2026-11-29", remindHour: 21 });
  });

  it("refuses an endpoint that is not a push service", async () => {
    const { store, put } = createTestServer();
    const res = await put({ ...SUBSCRIBE, subscription: { ...SUBSCRIBE.subscription, endpoint: "https://evil.test/x" } });
    expect(res.status).toBe(400);
    expect(store.rows.size).toBe(0);
  });

  it("deletes a subscription by endpoint", async () => {
    const { app, store, put } = createTestServer();
    await put(SUBSCRIBE);
    const res = await app.request("/push/subscription", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: ENDPOINT }),
    });
    expect(res.status).toBe(204);
    expect(store.rows.size).toBe(0);
  });

  it("the cron sends the at-risk reminder once a local day", async () => {
    const { send, put, cron } = createTestServer();
    await put(SUBSCRIBE);
    expect(await (await cron("inv_1")).json()).toEqual({ checked: 1, sent: 1, gone: 0 });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: ENDPOINT }),
      expect.objectContaining({ title: "Đèn 23 ngày sắp tắt", url: "/", tag: "streak" }),
    );
    expect(await (await cron("inv_2")).json()).toEqual({ checked: 0, sent: 0, gone: 0 });
    expect(send).toHaveBeenCalledOnce();
  });

  it("the cron pages through many devices with a cap on sends in flight", async () => {
    let inFlight = 0;
    let most = 0;
    const send: PushSender = async () => {
      inFlight++;
      most = Math.max(most, inFlight);
      await new Promise((r) => setTimeout(r, 1));
      inFlight--;
      return "sent";
    };
    const { put, cron } = createTestServer(send);
    for (let i = 0; i < 250; i++) {
      await put({ ...SUBSCRIBE, subscription: { ...SUBSCRIBE.subscription, endpoint: `${ENDPOINT}${String(i).padStart(3, "0")}` } });
    }
    await put({ ...SUBSCRIBE, subscription: { ...SUBSCRIBE.subscription, endpoint: `${ENDPOINT}read` }, lastReadDate: "2026-11-29" });
    expect(await (await cron()).json()).toEqual({ checked: 250, sent: 250, gone: 0 });
    expect(most).toBeGreaterThan(1);
    expect(most).toBeLessThanOrEqual(100);
  });

  it("the cron drops a subscription the push service no longer knows", async () => {
    const { store, put, cron } = createTestServer(async () => "gone");
    await put(SUBSCRIBE);
    expect(await (await cron()).json()).toEqual({ checked: 1, sent: 0, gone: 1 });
    expect(store.rows.size).toBe(0);
  });

  it("the cron answers only the schedule trigger", async () => {
    const { app, send, put } = createTestServer();
    await put(SUBSCRIBE);
    const res = await app.request("/push/cron", { method: "POST" });
    expect(res.status).toBe(401);
    expect(send).not.toHaveBeenCalled();
  });

  it("allows PUT from the site in CORS", async () => {
    const { app } = createTestServer();
    const res = await app.request("/push/subscription", {
      method: "OPTIONS",
      headers: { Origin: "https://moingaymotdoan.xyz", "Access-Control-Request-Method": "PUT" },
    });
    expect(res.headers.get("access-control-allow-methods")).toContain("PUT");
  });
});
