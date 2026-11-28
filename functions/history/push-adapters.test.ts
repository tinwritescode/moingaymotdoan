import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createPostgresPushStore } from "./push-adapters";

// Runs against a real Postgres with the Prisma migrations applied: TEST_DATABASE_URL=postgres://… pnpm test
const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("Postgres push store", () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  const store = createPostgresPushStore(prisma);
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
  beforeAll(() => prisma.pushSubscription.deleteMany({ where: { endpoint: row.endpoint } }));
  afterAll(() => prisma.$disconnect());

  it("upserts, claims a day once, keeps the claim across upserts, and removes", async () => {
    await store.upsert(row);
    expect(await store.claim(row.endpoint, "2026-11-29")).toBe(true);
    expect(await store.claim(row.endpoint, "2026-11-29")).toBe(false);
    await store.upsert({ ...row, streak: 24, lastReadDate: null });
    // 2026-11-29 21:05 in Ho Chi Minh City: already sent that day, so not due.
    expect(await store.listDue(new Date("2026-11-29T14:05:00Z"), null, 1000)).not.toContainEqual(expect.objectContaining({ endpoint: row.endpoint }));
    expect((await store.listDue(new Date("2026-11-30T14:05:00Z"), null, 1000)).find((r) => r.endpoint === row.endpoint)).toEqual({
      ...row,
      streak: 24,
      lastReadDate: null,
      lastSentDate: "2026-11-29",
    });
    await store.remove(row.endpoint);
    expect((await store.listDue(new Date("2026-11-30T14:05:00Z"), null, 1000)).some((r) => r.endpoint === row.endpoint)).toBe(false);
  });

  it("the database refuses a reminder hour outside 6–23", async () => {
    await expect(store.upsert({ ...row, endpoint: `${row.endpoint}-bad-hour`, remindHour: 5 })).rejects.toThrow();
  });

  it("lists due devices in pages after an endpoint, skipping a device read today", async () => {
    const at = (n: number) => `${row.endpoint}-page-${n}`;
    await prisma.pushSubscription.deleteMany({ where: { endpoint: { startsWith: `${row.endpoint}-page-` } } });
    for (const n of [1, 2, 3]) await store.upsert({ ...row, endpoint: at(n) });
    await store.upsert({ ...row, endpoint: at(4), lastReadDate: "2026-11-29" });
    const now = new Date("2026-11-29T14:05:00Z");
    const mine = (rows: { endpoint: string }[]) => rows.map((r) => r.endpoint).filter((e) => e.startsWith(`${row.endpoint}-page-`));
    const first = await store.listDue(now, at(0), 2);
    expect(mine(first)).toEqual([at(1), at(2)]);
    expect(mine(await store.listDue(now, at(2), 1000))).toEqual([at(3)]);
    await prisma.pushSubscription.deleteMany({ where: { endpoint: { startsWith: `${row.endpoint}-page-` } } });
  });
});
