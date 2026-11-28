import { describe, expect, it } from "vitest";
import { parseSubscriptionPayload } from "./push-contract";

const KEY = "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM";
const body = (over: Record<string, unknown> = {}, sub: Record<string, unknown> = {}) => ({
  subscription: { endpoint: "https://fcm.googleapis.com/fcm/send/abc:def", keys: { p256dh: KEY, auth: "tBHItJI5svbpez7KI4CCXg" }, ...sub },
  tz: "Asia/Ho_Chi_Minh",
  remindHour: 21,
  locale: "vi",
  lastReadDate: "2026-11-28",
  streak: 23,
  ...over,
});

describe("parseSubscriptionPayload", () => {
  it("accepts a subscription from a known push service", () => {
    expect(parseSubscriptionPayload(body())).toEqual({
      endpoint: "https://fcm.googleapis.com/fcm/send/abc:def",
      p256dh: KEY,
      auth: "tBHItJI5svbpez7KI4CCXg",
      tz: "Asia/Ho_Chi_Minh",
      remindHour: 21,
      locale: "vi",
      lastReadDate: "2026-11-28",
      streak: 23,
    });
    for (const endpoint of [
      "https://updates.push.services.mozilla.com/wpush/v2/x",
      "https://web.push.apple.com/QGx",
      "https://wns2-par02p.notify.windows.com/w/?token=x",
    ]) {
      expect(parseSubscriptionPayload(body({}, { endpoint }))).not.toBeNull();
    }
  });

  it("rejects an endpoint outside the push services", () => {
    expect(parseSubscriptionPayload(body({}, { endpoint: "https://example.com/push" }))).toBeNull();
    expect(parseSubscriptionPayload(body({}, { endpoint: "http://fcm.googleapis.com/x" }))).toBeNull();
    expect(parseSubscriptionPayload(body({}, { endpoint: "https://fcm.googleapis.com.evil.test/x" }))).toBeNull();
  });

  it("rejects a bad time zone, hour, language, date or streak", () => {
    expect(parseSubscriptionPayload(body({ tz: "Mars/Olympus" }))).toBeNull();
    expect(parseSubscriptionPayload(body({ remindHour: 5 }))).toBeNull();
    expect(parseSubscriptionPayload(body({ remindHour: 21.5 }))).toBeNull();
    expect(parseSubscriptionPayload(body({ locale: "fr" }))).toBeNull();
    expect(parseSubscriptionPayload(body({ lastReadDate: "yesterday" }))).toBeNull();
    expect(parseSubscriptionPayload(body({ streak: -1 }))).toBeNull();
    expect(parseSubscriptionPayload(body({}, { keys: { p256dh: "<script>", auth: "x" } }))).toBeNull();
  });

  it("accepts a device that has never read", () => {
    expect(parseSubscriptionPayload(body({ lastReadDate: null, streak: 0 }))?.lastReadDate).toBeNull();
  });
});
