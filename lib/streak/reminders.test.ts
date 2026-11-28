import { describe, expect, it } from "vitest";
import { messagesFor } from "../i18n";
import { decideReminder, localClock, reportFor, sampleReminder, type PushRow } from "./reminders";

const row = (over: Partial<PushRow> = {}): PushRow => ({
  endpoint: "https://fcm.googleapis.com/fcm/send/abc",
  p256dh: "k",
  auth: "a",
  tz: "Asia/Ho_Chi_Minh",
  remindHour: 21,
  locale: "vi",
  lastReadDate: "2026-11-28",
  streak: 23,
  lastSentDate: null,
  ...over,
});

// 21:05 in Ho Chi Minh City (UTC+7) on 2026-11-29.
const EVENING = new Date("2026-11-29T14:05:00Z");

describe("localClock", () => {
  it("reads the date and minutes in the subscription's time zone", () => {
    expect(localClock(EVENING, "Asia/Ho_Chi_Minh")).toEqual({ date: "2026-11-29", minutes: 21 * 60 + 5 });
    expect(localClock(EVENING, "America/Los_Angeles")).toEqual({ date: "2026-11-29", minutes: 6 * 60 + 5 });
  });
});

describe("decideReminder", () => {
  it("warns at the reminder hour that the streak goes out at midnight", () => {
    expect(decideReminder(row(), EVENING)).toEqual({
      date: "2026-11-29",
      payload: {
        title: "Đèn 23 ngày sắp tắt",
        body: "Đèn 23 ngày của bạn sẽ tắt lúc nửa đêm. Một đoạn ngắn là đủ giữ nó.",
        url: "/",
        tag: "streak",
      },
    });
  });

  it("waits until the reminder hour", () => {
    expect(decideReminder(row(), new Date("2026-11-29T13:55:00Z"))).toBeNull();
  });

  it("sends nothing twice in a local day", () => {
    expect(decideReminder(row({ lastSentDate: "2026-11-29" }), EVENING)).toBeNull();
  });

  it("sends nothing once today is read", () => {
    expect(decideReminder(row({ lastReadDate: "2026-11-29" }), EVENING)).toBeNull();
  });

  it("invites a reader without a streak to read today", () => {
    const d = decideReminder(row({ lastReadDate: "2026-11-20", streak: 0, locale: "en" }), EVENING);
    expect(d?.payload).toMatchObject({ title: "One chapter a day", url: "/en" });
  });

  it("offers the rescue in the morning after a missed day", () => {
    const morning = new Date("2026-11-29T01:00:00Z"); // 08:00 local
    const d = decideReminder(row({ lastReadDate: "2026-11-27" }), morning);
    expect(d?.payload.title).toBe("Hôm qua đèn chưa được thắp");
    expect(d?.payload.body).toContain("Chuỗi 23 ngày");
    expect(decideReminder(row({ lastReadDate: "2026-11-27" }), new Date("2026-11-29T00:30:00Z"))).toBeNull();
  });
});

describe("reportFor", () => {
  it("reports the last day the streak covers", () => {
    expect(reportFor({ kind: "done", days: 24, record: 30 }, "2026-11-29")).toEqual({ lastReadDate: "2026-11-29", streak: 24 });
    expect(reportFor({ kind: "today", days: 23, record: 30 }, "2026-11-29")).toEqual({ lastReadDate: "2026-11-28", streak: 23 });
    expect(reportFor({ kind: "today", days: 0, record: 30 }, "2026-11-29")).toEqual({ lastReadDate: null, streak: 0 });
    expect(
      reportFor({ kind: "rescue", days: 23, record: 30, needed: 2, missed: "2026-11-28", restAvailable: true }, "2026-11-29"),
    ).toEqual({ lastReadDate: "2026-11-27", streak: 23 });
  });
});

describe("sampleReminder", () => {
  it("is the reminder the reader's streak would get, in their language", () => {
    const en = messagesFor("en").streak;
    expect(sampleReminder({ kind: "today", days: 0, record: 0 }, "en")).toEqual({ ...en.notifyStart, url: "/en", tag: "streak" });
    expect(sampleReminder({ kind: "done", days: 4, record: 4 }, "en")).toEqual({ ...en.notifyAtRisk(4), url: "/en", tag: "streak" });
    const rescue = { kind: "rescue", days: 6, record: 6, needed: 2, missed: "2026-11-28", restAvailable: true } as const;
    expect(sampleReminder(rescue, "vi")).toEqual({ ...messagesFor("vi").streak.notifyRescue(6), url: "/", tag: "streak" });
  });
});
