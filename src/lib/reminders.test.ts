import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { putSubscription, subscribe, subscription, type SubscriptionReport } from "./reminders";

const REPORT: SubscriptionReport = { tz: "Asia/Ho_Chi_Minh", remindHour: 21, locale: "vi", lastReadDate: "2026-11-28", streak: 23 };
const fakeSub = (): PushSubscription => {
  const json = { endpoint: "https://fcm.googleapis.com/fcm/send/x", keys: { p256dh: "p", auth: "a" } };
  return Object.assign(Object.create(null), { endpoint: json.endpoint, toJSON: () => json, unsubscribe: vi.fn(async () => true) });
};

describe("browser reminders", () => {
  const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
  beforeEach(() => {
    vi.stubEnv("VITE_HISTORY_API_URL", "https://api.test");
    vi.stubEnv("VITE_VAPID_PUBLIC_KEY", "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQ");
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    });
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockClear();
  });

  it("sends the subscription with the report, then skips an unchanged report", async () => {
    const sub = fakeSub();
    expect(await putSubscription(sub, REPORT)).toBe(true);
    expect(await putSubscription(sub, REPORT)).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.test/push/subscription");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(String(init.body))).toMatchObject({ subscription: { endpoint: sub.endpoint }, streak: 23, remindHour: 21 });
    await putSubscription(sub, { ...REPORT, streak: 24 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("drops the browser subscription when the server refuses it", async () => {
    const sub = fakeSub();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 400 }));
    vi.stubGlobal("Notification", { requestPermission: async () => "granted" });
    vi.stubGlobal("navigator", { serviceWorker: { ready: Promise.resolve({ pushManager: { subscribe: async () => sub } }) } });
    expect(await subscribe(REPORT)).toBe("failed");
    expect(sub.unsubscribe).toHaveBeenCalledOnce();
    expect(subscription()).toBeNull();
  });

  it("reports a denied permission as blocked", async () => {
    vi.stubGlobal("Notification", { requestPermission: async () => "denied" });
    expect(await subscribe(REPORT)).toBe("blocked");
  });
});
