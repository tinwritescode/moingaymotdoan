import { describe, expect, it } from "vitest";
import {
  computeStreak,
  formatDateHeading,
  formatDateKeyDMY,
  groupLogsByDate,
  itemHref,
  localDateKey,
  safeNextPath,
  type ReadingLog,
} from "./types";

function makeLog(readDate: string, readAt: string, itemKey = "sang-the-ky/1"): ReadingLog {
  return {
    id: `${readDate}-${itemKey}`,
    kind: "chapter",
    itemKey,
    bookSlug: "sang-the-ky",
    chapter: 1,
    title: "Chúa dựng nên trời đất",
    subtitle: "Sáng-thế Ký 1",
    readDate,
    readAt,
  };
}

describe("history helpers", () => {
  it("formats local date headings for today, yesterday, and older dates", () => {
    const now = new Date(2026, 10, 25, 9, 30); // 25/11/2026 (Thứ Tư)
    expect(localDateKey(now)).toBe("2026-11-25");
    expect(formatDateKeyDMY("2026-11-25")).toBe("25/11/2026");
    expect(formatDateHeading("2026-11-25", now)).toBe("Hôm nay · Thứ Tư, 25/11/2026");
    expect(formatDateHeading("2026-11-24", now)).toBe("Hôm qua · Thứ Ba, 24/11/2026");
    expect(formatDateHeading("2026-11-20", now)).toBe("Thứ Sáu, 20/11/2026");
  });

  it("computes consecutive reading streak including yesterday grace", () => {
    const now = new Date(2026, 10, 25, 9, 30);
    expect(computeStreak([], now)).toBe(0);
    expect(
      computeStreak(
        [
          makeLog("2026-11-25", "2026-11-25T02:00:00Z"),
          makeLog("2026-11-24", "2026-11-24T02:00:00Z"),
          makeLog("2026-11-23", "2026-11-23T02:00:00Z"),
          makeLog("2026-11-20", "2026-11-20T02:00:00Z"),
        ],
        now,
      ),
    ).toBe(3);
    // Yesterday active, today not yet read -> streak still preserved.
    expect(
      computeStreak(
        [makeLog("2026-11-24", "2026-11-24T02:00:00Z"), makeLog("2026-11-23", "2026-11-23T02:00:00Z")],
        now,
      ),
    ).toBe(2);
    // Gap of 2 days -> streak resets.
    expect(computeStreak([makeLog("2026-11-22", "2026-11-22T02:00:00Z")], now)).toBe(0);
  });

  it("groups logs by date newest first and builds safe paths", () => {
    const now = new Date(2026, 10, 25, 9, 30);
    const groups = groupLogsByDate(
      [
        makeLog("2026-11-24", "2026-11-24T08:00:00Z", "sang-the-ky/1"),
        makeLog("2026-11-25", "2026-11-25T07:00:00Z", "sang-the-ky/2"),
        makeLog("2026-11-25", "2026-11-25T09:00:00Z", "sang-the-ky/3"),
      ],
      now,
    );
    expect(groups.map((g) => g.dateKey)).toEqual(["2026-11-25", "2026-11-24"]);
    expect(groups[0].items.map((i) => i.itemKey)).toEqual(["sang-the-ky/3", "sang-the-ky/2"]);
    expect(itemHref({ kind: "chapter", itemKey: "thi-thien/23", bookSlug: "thi-thien", chapter: 23 })).toBe(
      "/thi-thien/23",
    );
    expect(itemHref({ kind: "mood", itemKey: "buon-ba", bookSlug: null, chapter: null })).toBe("/cam-xuc/buon-ba");

    expect(safeNextPath("/thi-thien/23")).toBe("/thi-thien/23");
    expect(safeNextPath("//evil.example")).toBe("/lich-su");
    expect(safeNextPath("https://evil.example")).toBe("/lich-su");
    expect(safeNextPath(null)).toBe("/lich-su");
  });
});
