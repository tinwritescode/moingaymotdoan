import { describe, expect, it } from "vitest";
import {
  chapterItemKey,
  computeReadingStats,
  formatDateHeading,
  formatDateKeyDMY,
  groupLogsByDate,
  itemHref,
  localDateKey,
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

  it("groups logs by date newest first, canonicalizes chapter keys, and derives stats", () => {
    const now = new Date(2026, 10, 25, 9, 30);
    const logs = [
      makeLog("2026-11-24", "2026-11-24T08:00:00Z", "sang-the-ky/1"),
      makeLog("2026-11-25", "2026-11-25T07:00:00Z", "sang-the-ky/2"),
      makeLog("2026-11-25", "2026-11-25T09:00:00Z", "sang-the-ky/3"),
    ];
    const groups = groupLogsByDate(logs, now);
    expect(groups.map((g) => g.dateKey)).toEqual(["2026-11-25", "2026-11-24"]);
    expect(groups[0].items.map((i) => i.itemKey)).toEqual(["sang-the-ky/3", "sang-the-ky/2"]);

    expect(chapterItemKey("genesis", 1)).toBe("sang-the-ky/1");
    expect(chapterItemKey("sang-the-ky", 1)).toBe("sang-the-ky/1");
    expect(itemHref({ kind: "chapter", itemKey: "thi-thien/23", bookSlug: "thi-thien", chapter: 23 })).toBe(
      "/thi-thien/23",
    );
    expect(itemHref({ kind: "mood", itemKey: "buon-ba", bookSlug: null, chapter: null })).toBe("/cam-xuc/buon-ba");

    const stats = computeReadingStats(
      {
        progress: [
          {
            kind: "chapter",
            itemKey: "sang-the-ky/1",
            bookSlug: "sang-the-ky",
            chapter: 1,
            title: "Ban đầu",
            subtitle: "Sáng-thế Ký 1",
            firstReadAt: "2026-11-24T08:00:00Z",
            lastReadAt: "2026-11-25T09:00:00Z",
            readCount: 2,
            completed: true,
            completedAt: "2026-11-25T09:00:00Z",
          },
        ],
        logs,
      },
    );
    expect(stats).toEqual({
      chaptersRead: 1,
      chaptersCompleted: 1,
      booksOpened: 1,
      moodsRead: 0,
      readingDays: 2,
    });
  });
});
