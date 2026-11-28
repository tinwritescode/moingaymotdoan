import { describe, expect, it } from "vitest";
import { EMPTY_MARKS, mergeMarks, parseMarks } from "./marks";

describe("parseMarks", () => {
  it("accepts the marks a device keeps", () => {
    const marks = { restDays: ["2026-11-24"], restartedOn: "2026-11-01", remindHour: 20 };
    expect(parseMarks(marks)).toEqual(marks);
    expect(parseMarks({ restDays: [], restartedOn: null, remindHour: 21 })).toEqual(EMPTY_MARKS);
  });

  it("refuses anything else", () => {
    expect(parseMarks(null)).toBeNull();
    expect(parseMarks({ restDays: ["tuesday"], restartedOn: null, remindHour: 21 })).toBeNull();
    expect(parseMarks({ restDays: [], restartedOn: "2026-13-45x", remindHour: 21 })).toBeNull();
    expect(parseMarks({ restDays: [], restartedOn: null, remindHour: 5 })).toBeNull();
    expect(parseMarks({ restDays: Array.from({ length: 1001 }, () => "2026-11-24"), restartedOn: null, remindHour: 21 })).toBeNull();
  });
});

describe("mergeMarks", () => {
  it("keeps every rest day, the later restart and the incoming hour", () => {
    expect(
      mergeMarks(
        { restDays: ["2026-11-17", "2026-11-24"], restartedOn: "2026-11-01", remindHour: 21 },
        { restDays: ["2026-11-10", "2026-11-17"], restartedOn: "2026-11-05", remindHour: 20 },
      ),
    ).toEqual({ restDays: ["2026-11-10", "2026-11-17", "2026-11-24"], restartedOn: "2026-11-05", remindHour: 20 });
    expect(mergeMarks({ ...EMPTY_MARKS, restartedOn: "2026-11-05" }, EMPTY_MARKS).restartedOn).toBe("2026-11-05");
  });

  it("keeps only the first rest day of a week when two devices rested apart", () => {
    // Tuesday and Thursday of the week of Monday 2026-11-23.
    const merged = mergeMarks({ ...EMPTY_MARKS, restDays: ["2026-11-26"] }, { ...EMPTY_MARKS, restDays: ["2026-11-24"] });
    expect(merged.restDays).toEqual(["2026-11-24"]);
  });
});
