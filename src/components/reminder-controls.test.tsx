import { fireEvent } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ReminderControls, ReminderSync } from "./reminder-controls";
import { historyOf, renderStreakAt } from "./streak-fixtures";

const TODAY = "2026-11-29";
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1";
const ui = () => (
  <>
    <ReminderControls />
    <ReminderSync />
  </>
);

describe("<ReminderControls />", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test("on an iPhone outside the installed app, points to the install guide", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(IPHONE);
    const view = renderStreakAt(`${TODAY}T10:00:00`, historyOf(TODAY, 3, 1), ui);
    const link = await view.findByRole("link", { name: "Cài app về màn hình chính để nhận lời nhắc trên iPhone" });
    expect(link.getAttribute("href")).toBe("/cai-dat");
  });

  test("opt in, change the hour, turn off", async () => {
    vi.stubEnv("VITE_HISTORY_API_URL", "https://api.test");
    vi.stubEnv("VITE_VAPID_PUBLIC_KEY", "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQ");
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("PushManager", class {});
    vi.stubGlobal("Notification", { permission: "default", requestPermission: async () => "granted" });
    const json = { endpoint: "https://fcm.googleapis.com/fcm/send/x", keys: { p256dh: "p", auth: "a" } };
    const sub = { endpoint: json.endpoint, toJSON: () => json, unsubscribe: vi.fn(async () => true) };
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { getRegistration: async () => undefined, ready: Promise.resolve({ pushManager: { subscribe: async () => sub } }) },
    });
    const bodies = () => fetchMock.mock.calls.map(([, init]) => [init.method, JSON.parse(String(init.body))]);

    const view = renderStreakAt(`${TODAY}T10:00:00`, historyOf(TODAY, 3, 1), ui);
    fireEvent.click(await view.findByRole("button", { name: "Nhắc tôi lúc 21:00" }));
    const select = await view.findByRole("combobox", { name: "Giờ nhắc" });
    expect(bodies()[0]).toEqual([
      "PUT",
      expect.objectContaining({ remindHour: 21, streak: 3, lastReadDate: "2026-11-28", locale: "vi", subscription: json }),
    ]);

    fireEvent.change(select, { target: { value: "20" } });
    flush();
    await vi.waitFor(() => expect(bodies().at(-1)).toEqual(["PUT", expect.objectContaining({ remindHour: 20 })]));

    fireEvent.click(view.getByRole("button", { name: "Tắt nhắc" }));
    await view.findByRole("button", { name: "Nhắc tôi lúc 20:00" });
    expect(bodies().at(-1)).toEqual(["DELETE", { endpoint: json.endpoint }]);
    expect(sub.unsubscribe).toHaveBeenCalled();
  });
});
