import { describe, expect, it } from "vitest";
import type { ReadingLog } from "../history/types";
import { addDays, computeStreak, readDaysFromLogs, weekStrip, type StreakInput } from "./streak";

const TODAY = "2026-11-29"; // Sunday

/** Days back from TODAY → đoạn read that day. */
function input(read: Record<number, number>, extra: Partial<StreakInput> = {}): StreakInput {
  const readDays = new Map<string, number>();
  for (const [back, n] of Object.entries(read)) readDays.set(addDays(TODAY, -Number(back)), n);
  return { readDays, restDays: new Set(), restartedOn: null, today: TODAY, ...extra };
}

/** Reads one đoạn on each of `count` days ending `endBack` days before TODAY. */
function run(count: number, endBack: number): Record<number, number> {
  const out: Record<number, number> = {};
  for (let i = 0; i < count; i += 1) out[endBack + i] = 1;
  return out;
}

describe("computeStreak", () => {
  it("counts three days in a row", () => {
    expect(computeStreak(input({ 0: 1, 1: 1, 2: 1 }))).toEqual({ kind: "done", days: 3, record: 3 });
  });

  it("keeps today open when it is not read yet", () => {
    expect(computeStreak(input(run(3, 1)))).toEqual({ kind: "today", days: 3, record: 3 });
  });

  it("starts at 0 for a new reader", () => {
    expect(computeStreak(input({}))).toEqual({ kind: "today", days: 0, record: 0 });
  });

  it("bridges a rest day without counting it", () => {
    const state = computeStreak(input({ 0: 1, 2: 1 }, { restDays: new Set([addDays(TODAY, -1)]) }));
    expect(state).toEqual({ kind: "done", days: 2, record: 2 });
  });

  it("rekindles a missed day when 2 different đoạn are read the next day", () => {
    expect(computeStreak(input({ 0: 2, ...run(23, 2) }))).toEqual({ kind: "done", days: 24, record: 24 });
  });

  it("stays in rescue needing 1 more đoạn after reading 1 the day after a miss", () => {
    expect(computeStreak(input({ 0: 1, ...run(23, 2) }))).toEqual({
      kind: "rescue",
      days: 23,
      record: 23,
      needed: 1,
      missed: addDays(TODAY, -1),
      restAvailable: true,
    });
  });

  it("is in rescue the morning after a miss", () => {
    expect(computeStreak(input(run(23, 2)))).toEqual({
      kind: "rescue",
      days: 23,
      record: 23,
      needed: 2,
      missed: addDays(TODAY, -1),
      restAvailable: true,
    });
  });

  it("offers no rest day when one was used in the missed day's week", () => {
    // Yesterday is Saturday 2026-11-28; Monday 2026-11-23 was a rest day.
    const state = computeStreak(input(run(23, 2), { restDays: new Set(["2026-11-23"]) }));
    expect(state).toMatchObject({ kind: "rescue", restAvailable: false });
  });

  it("allows a rest day when the last one was in an earlier week", () => {
    const state = computeStreak(input(run(23, 2), { restDays: new Set(["2026-11-22"]) }));
    expect(state).toMatchObject({ kind: "rescue", restAvailable: true });
  });

  it("breaks the chain after two missed days even with 2 đoạn today", () => {
    expect(computeStreak(input({ 0: 2, ...run(23, 3) }))).toEqual({ kind: "done", days: 1, record: 23 });
  });

  it("closes the rescue window when a further day passes", () => {
    expect(computeStreak(input(run(23, 3)))).toEqual({ kind: "today", days: 0, record: 23 });
  });

  it("counts only from today after starting over", () => {
    const state = computeStreak(input({ 0: 1, ...run(23, 2) }, { restartedOn: TODAY }));
    expect(state).toEqual({ kind: "done", days: 1, record: 23 });
  });

  it("does not rekindle across a restart", () => {
    const state = computeStreak(input({ 0: 2, ...run(23, 2) }, { restartedOn: TODAY }));
    expect(state).toEqual({ kind: "done", days: 1, record: 23 });
  });

  it("shows no rescue after starting over today", () => {
    expect(computeStreak(input(run(23, 2), { restartedOn: TODAY }))).toEqual({ kind: "today", days: 0, record: 23 });
  });

  it("keeps the record after a break", () => {
    expect(computeStreak(input({ 0: 1, 1: 1, 2: 1, ...run(40, 10) }))).toEqual({ kind: "done", days: 3, record: 40 });
  });
});

describe("weekStrip", () => {
  it("marks Monday to Sunday as read, rest, rekindled, missed, today and future", () => {
    // Wednesday 2026-11-25 is today; Monday read, Tuesday rest. Thursday onward is still to come.
    const today = "2026-11-25";
    const readDays = new Map([["2026-11-23", 1]]);
    expect(weekStrip({ readDays, restDays: new Set(["2026-11-24"]), restartedOn: null, today })).toEqual([
      { date: "2026-11-23", mark: "read" },
      { date: "2026-11-24", mark: "rest" },
      { date: "2026-11-25", mark: "today" },
      { date: "2026-11-26", mark: "future" },
      { date: "2026-11-27", mark: "future" },
      { date: "2026-11-28", mark: "future" },
      { date: "2026-11-29", mark: "future" },
    ]);
  });

  it("marks a rekindled day and a missed day", () => {
    const readDays = new Map([
      ["2026-11-23", 1],
      ["2026-11-25", 2],
    ]);
    const marks = weekStrip({ readDays, restDays: new Set(), restartedOn: null, today: "2026-11-27" }).map((d) => d.mark);
    expect(marks).toEqual(["read", "rekindled", "read", "missed", "today", "future", "future"]);
  });
});

describe("readDaysFromLogs", () => {
  const log = (readDate: string, kind: ReadingLog["kind"], itemKey: string): ReadingLog => ({
    id: `${readDate}:${itemKey}`,
    kind,
    itemKey,
    bookSlug: null,
    chapter: null,
    title: "",
    subtitle: "",
    readDate,
    readAt: `${readDate}T08:00:00Z`,
  });

  it("counts distinct đoạn per day and ignores mood guides", () => {
    const days = readDaysFromLogs([
      log("2026-11-29", "chapter", "giang/3"),
      log("2026-11-29", "chapter", "giang/4"),
      log("2026-11-29", "mood", "lo-au"),
      log("2026-11-28", "mood", "lo-au"),
    ]);
    expect([...days]).toEqual([["2026-11-29", 2]]);
  });
});
