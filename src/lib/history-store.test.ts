import { describe, expect, it } from "vitest";
import {
  applyCompleteToSnapshot,
  applyVisitToSnapshot,
  buildSyncItems,
  EMPTY_HISTORY,
} from "./history-store";

describe("history store snapshot operations", () => {
  it("records a visit once per calendar day while incrementing readCount", () => {
    const t1 = new Date(2026, 10, 25, 9, 10);
    const t2 = new Date(2026, 10, 25, 11, 30);
    const t3 = new Date(2026, 10, 26, 8, 0);

    const input = {
      kind: "chapter" as const,
      itemKey: "sang-the-ky/1",
      bookSlug: "sang-the-ky",
      chapter: 1,
      title: "Chúa dựng nên trời đất",
      subtitle: "Sáng-thế Ký 1",
    };

    const s1 = applyVisitToSnapshot(EMPTY_HISTORY, input, t1);
    expect(s1.progress).toHaveLength(1);
    expect(s1.progress[0].readCount).toBe(1);
    expect(s1.logs).toHaveLength(1);
    expect(s1.logs[0].readDate).toBe("2026-11-25");

    // Re-reading on the same day updates time and readCount, keeps 1 daily log row.
    const s2 = applyVisitToSnapshot(s1, input, t2);
    expect(s2.progress[0].readCount).toBe(2);
    expect(s2.progress[0].firstReadAt).toBe(t1.toISOString());
    expect(s2.progress[0].lastReadAt).toBe(t2.toISOString());
    expect(s2.logs).toHaveLength(1);
    expect(s2.logs[0].readAt).toBe(t2.toISOString());

    // Reading again on the next day adds a second daily log row.
    const s3 = applyVisitToSnapshot(s2, input, t3);
    expect(s3.progress[0].readCount).toBe(3);
    expect(s3.logs).toHaveLength(2);
    expect(s3.logs.map((l) => l.readDate)).toEqual(["2026-11-26", "2026-11-25"]);
  });

  it("toggles completed status and builds sync payload with completed state", () => {
    const t1 = new Date(2026, 10, 25, 9, 10);
    const input = {
      kind: "chapter" as const,
      itemKey: "thi-thien/23",
      bookSlug: "thi-thien",
      chapter: 23,
      title: "Chúa là Đấng chăn giữ tôi",
      subtitle: "Thi-thiên 23",
    };

    const s1 = applyVisitToSnapshot(EMPTY_HISTORY, input, t1);
    const s2 = applyCompleteToSnapshot(s1, { ...input, completed: true }, t1);
    expect(s2.progress[0].completed).toBe(true);
    expect(s2.progress[0].completedAt).toBe(t1.toISOString());

    const syncItems = buildSyncItems(s2);
    expect(syncItems).toHaveLength(1);
    expect(syncItems[0].completed).toBe(true);
    expect(syncItems[0].readDate).toBe("2026-11-25");

    const s3 = applyCompleteToSnapshot(s2, { ...input, completed: false }, t1);
    expect(s3.progress[0].completed).toBe(false);
    expect(s3.progress[0].completedAt).toBeNull();
  });
});
