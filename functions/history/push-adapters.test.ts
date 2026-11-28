import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createPostgresPushStore } from "./push-adapters";

// Runs against a real Postgres with db/schema.sql applied: TEST_DATABASE_URL=postgres://… pnpm test
const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("Postgres push store", () => {
  const pool = new Pool({ connectionString: url });
  const store = createPostgresPushStore(pool);
  const row = {
    endpoint: "https://fcm.googleapis.com/fcm/send/pg-test",
    p256dh: "p256dh-key",
    auth: "auth-key",
    tz: "Asia/Ho_Chi_Minh",
    remindHour: 21,
    locale: "vi" as const,
    lastReadDate: "2026-11-28",
    streak: 23,
  };
  beforeAll(() => pool.query("DELETE FROM push_subscriptions WHERE endpoint = $1", [row.endpoint]));
  afterAll(() => pool.end());

  it("upserts, claims a day once, keeps the claim across upserts, and removes", async () => {
    await store.upsert(row);
    expect(await store.claim(row.endpoint, "2026-11-29")).toBe(true);
    expect(await store.claim(row.endpoint, "2026-11-29")).toBe(false);
    await store.upsert({ ...row, streak: 24, lastReadDate: null });
    expect((await store.list()).find((r) => r.endpoint === row.endpoint)).toEqual({
      ...row,
      streak: 24,
      lastReadDate: null,
      lastSentDate: "2026-11-29",
    });
    await store.remove(row.endpoint);
    expect((await store.list()).some((r) => r.endpoint === row.endpoint)).toBe(false);
  });
});
