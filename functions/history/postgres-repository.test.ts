import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { VisitPayload } from "../../lib/history/types";
import { PrismaClient } from "./generated/prisma/client";
import { createPostgresHistoryRepository, fromDateKey, toDateKey } from "./postgres-repository";

// A DATE column comes back as midnight UTC; the key must not shift with the server's time zone.
it("a day key survives the trip through a DATE column in any time zone", () => {
  expect(fromDateKey("2026-11-28").toISOString()).toBe("2026-11-28T00:00:00.000Z");
  expect(toDateKey(fromDateKey("2026-01-01"))).toBe("2026-01-01");
});

// Runs against a real Postgres with the Prisma migrations applied: TEST_DATABASE_URL=postgres://… pnpm test
const url = process.env.TEST_DATABASE_URL;

const iso = (t: string | null) => (t === null ? null : new Date(t).toISOString());

describe.skipIf(!url)("Postgres history repository", () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  const repo = createPostgresHistoryRepository(prisma);
  const user = "user_pg_history_test";
  const visit = (over: Partial<VisitPayload> = {}): VisitPayload => ({
    kind: "chapter",
    itemKey: "giang/3",
    bookSlug: "giang",
    chapter: 3,
    title: "Sinh lại",
    subtitle: "Giăng 3",
    readDate: "2026-11-28",
    readAt: "2026-11-28T08:00:00.000Z",
    ...over,
  });
  beforeEach(() => repo.clearUserHistory(user));
  afterAll(() => prisma.$disconnect());

  it("counts a second visit, keeps one log a day, and returns local days as written", async () => {
    await repo.upsertVisit(user, visit(), { isSync: false });
    const second = await repo.upsertVisit(user, visit({ readAt: "2026-11-28T09:30:00.000Z", title: "Mới" }), { isSync: false });
    expect(second.progress).toMatchObject({ readCount: 2, title: "Mới", completed: false, completedAt: null });
    expect(iso(second.progress.firstReadAt)).toBe("2026-11-28T08:00:00.000Z");
    expect(iso(second.progress.lastReadAt)).toBe("2026-11-28T09:30:00.000Z");
    expect(second.log).toMatchObject({ readDate: "2026-11-28", itemKey: "giang/3", title: "Mới" });
    const history = await repo.fetchUserHistory(user);
    expect(history.logs).toHaveLength(1);
    expect(history.logs[0].id).toBe(second.log.id);
    expect(history.logs[0].readDate).toBe("2026-11-28");
  });

  it("merges a sync: earlier first read, latest last read, larger count, completion kept", async () => {
    await repo.upsertVisit(user, visit({ readAt: "2026-11-28T10:00:00.000Z" }), { isSync: false });
    const history = await repo.syncVisits(user, [
      visit({ readAt: "2026-11-28T07:00:00.000Z", readCount: 5, completed: true }),
      visit({ itemKey: "giang/4", chapter: 4, subtitle: "Giăng 4", readDate: "2026-11-27", readAt: "2026-11-27T20:00:00.000Z" }),
    ]);
    const g3 = history.progress.find((p) => p.itemKey === "giang/3");
    expect(g3).toMatchObject({ readCount: 5, completed: true });
    expect(iso(g3?.firstReadAt ?? null)).toBe("2026-11-28T07:00:00.000Z");
    expect(iso(g3?.lastReadAt ?? null)).toBe("2026-11-28T10:00:00.000Z");
    expect(iso(g3?.completedAt ?? null)).toBe("2026-11-28T07:00:00.000Z");
    expect(history.progress.map((p) => p.itemKey)).toEqual(["giang/3", "giang/4"]);
    expect(history.logs.map((l) => l.readDate)).toEqual(["2026-11-28", "2026-11-27"]);
  });

  it("sets and clears completion, and creates the đoạn from the fallback visit", async () => {
    expect(await repo.setCompleted(user, { kind: "chapter", itemKey: "giang/3", completed: true, fallbackVisit: null })).toBeNull();
    const made = await repo.setCompleted(user, { kind: "chapter", itemKey: "giang/3", completed: true, fallbackVisit: visit() });
    expect(made?.progress).toMatchObject({ itemKey: "giang/3", completed: true });
    expect(made?.progress.completedAt).not.toBeNull();
    const cleared = await repo.setCompleted(user, { kind: "chapter", itemKey: "giang/3", completed: false, fallbackVisit: null });
    expect(cleared?.progress).toMatchObject({ completed: false, completedAt: null });
  });

  it("deletes only the reader's own log", async () => {
    const { log } = await repo.upsertVisit(user, visit(), { isSync: false });
    expect(await repo.deleteLog("someone_else", log.id)).toBe(false);
    expect(await repo.deleteLog(user, log.id)).toBe(true);
    expect((await repo.fetchUserHistory(user)).logs).toEqual([]);
  });

  describe("streak marks", () => {
    beforeAll(() => repo.clearUserHistory(user));

    it("merges concurrent devices without losing a rest day, and forgets on clear", async () => {
      expect(await repo.fetchStreakMarks(user)).toBeNull();
      await Promise.all([
        repo.mergeStreakMarks(user, { restDays: ["2026-11-17"], restartedOn: null, remindHour: 21 }),
        repo.mergeStreakMarks(user, { restDays: ["2026-11-24"], restartedOn: "2026-11-01", remindHour: 21 }),
      ]);
      expect(await repo.fetchStreakMarks(user)).toEqual({
        restDays: ["2026-11-17", "2026-11-24"],
        restartedOn: "2026-11-01",
        remindHour: 21,
      });
      await repo.clearUserHistory(user);
      expect(await repo.fetchStreakMarks(user)).toBeNull();
    });
  });
});
