import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CORNER_STORAGE_KEY } from "../components/install-corner";
import { LocaleProvider } from "../components/locale-context";
import { InstallPage } from "./install-page";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

function device(ua: string, standalone = false) {
  Object.defineProperty(navigator, "userAgent", { value: ua, configurable: true });
  Object.defineProperty(navigator, "maxTouchPoints", { value: 5, configurable: true });
  window.matchMedia = ((query: string) => ({ matches: standalone && query.includes("standalone") })) as typeof window.matchMedia;
}

function openPage() {
  render(() => (
    <LocaleProvider locale="vi" pathname="/cai-dat">
      <InstallPage />
    </LocaleProvider>
  ));
  flush();
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.dispatchEvent(new Event("appinstalled"));
});

describe("InstallPage", () => {
  it("opens on the reader's platform and switches guides by tab", () => {
    device(IPHONE);
    openPage();
    expect(screen.getByRole("tab", { name: "iPhone / iPad" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Đã nhận ra: iPhone / iPad")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "iPhone và iPad" })).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "Android" }));
    flush();
    expect(screen.getByRole("heading", { name: "Android" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "iPhone và iPad" })).toBeNull();
  });

  it("offers the browser's install dialog when there is one", () => {
    device(ANDROID);
    openPage();
    expect(screen.queryByRole("button", { name: "Cài ứng dụng" })).toBeNull();

    const prompt = vi.fn(async () => {});
    window.dispatchEvent(Object.assign(new Event("beforeinstallprompt"), { prompt }));
    flush();
    fireEvent.click(screen.getByRole("button", { name: "Cài ứng dụng" }));
    expect(prompt).toHaveBeenCalledOnce();
  });

  it("brings a hidden corner button back with its switch", () => {
    device(IPHONE);
    localStorage.setItem(CORNER_STORAGE_KEY, "hidden");
    openPage();
    const toggle = screen.getByRole("switch", { name: /Nút cài nhanh/ }) as HTMLInputElement;
    expect(toggle.checked).toBe(false);

    fireEvent.click(toggle);
    flush();
    expect(toggle.checked).toBe(true);
    expect(localStorage.getItem(CORNER_STORAGE_KEY)).toBeNull();
  });

  it("thanks a reader who already runs the installed app", () => {
    device(IPHONE, true);
    openPage();
    expect(screen.getByText("Bạn đang dùng ứng dụng đã cài. Cảm ơn bạn!")).toBeTruthy();
  });
});
