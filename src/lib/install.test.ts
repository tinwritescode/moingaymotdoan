import { describe, expect, it } from "vitest";
import { platformOf } from "./install";

const UA = {
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  iphoneChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1",
  // iPadOS Safari reports itself as a Mac; only its touch points give it away.
  ipad: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
  macChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  windowsEdge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};

describe("platformOf", () => {
  it.each([
    ["iPhone Safari", UA.iphoneSafari, 5, "ios"],
    ["iPhone Chrome", UA.iphoneChrome, 5, "ios"],
    ["iPad (desktop-class Safari)", UA.ipad, 5, "ios"],
    ["Android Chrome", UA.android, 5, "android"],
    ["Mac Safari", UA.macSafari, 0, "mac"],
    ["Mac Chrome", UA.macChrome, 0, "desktop"],
    ["Windows Edge", UA.windowsEdge, 0, "desktop"],
  ] as const)("%s → %s", (_name, ua, touchPoints, expected) => {
    expect(platformOf({ userAgent: ua, maxTouchPoints: touchPoints })).toBe(expected);
  });
});
