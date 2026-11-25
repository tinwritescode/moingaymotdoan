import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { fireEvent, render, within } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
  FONT_STORAGE_KEY,
  PREFS_INIT_SCRIPT,
  READING_FONTS,
  SCALE_STORAGE_KEY,
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
  THEME_STORAGE_KEY,
} from "../lib/preferences";
import { DisplayMenu, ThemeToggle } from "./display-controls";
import { PreferencesProvider, usePreferences } from "./preferences-context";

function openPopover(trigger: HTMLElement): HTMLElement {
  const id = trigger.getAttribute("popovertarget");
  expect(id).toBeTruthy();
  const popup = document.getElementById(id!)!;
  const event = new Event("beforetoggle");
  Object.defineProperty(event, "newState", { value: "open" });
  popup.dispatchEvent(event);
  flush();
  return popup;
}

describe("<ThemeToggle /> & <DisplayMenu />", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.font;
    document.head.querySelectorAll("link[data-kt-font], meta[data-kt-theme-color]").forEach((el) => el.remove());
  });

  afterEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.font;
    document.head.querySelectorAll("link[data-kt-font], meta[data-kt-theme-color]").forEach((el) => el.remove());
  });

  test("bật/tắt chế độ tối, đổi phông chữ và cỡ chữ không phát sinh cảnh báo Solid 2.0", async () => {
    const { artifact } = await captureArtifact(
      () => {
        function ScaleProbe() {
          const { scale } = usePreferences();
          return <output data-testid="scale">{scale()}</output>;
        }

        const { getByRole, getByTestId } = render(() => (
          <PreferencesProvider>
            <ThemeToggle />
            <DisplayMenu />
            <ScaleProbe />
          </PreferencesProvider>
        ));
        flush();

        // 1-click dark mode toggle
        const toggle = getByRole("button", { name: "Chuyển sang chế độ tối" });
        fireEvent.click(toggle);
        flush();

        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
        expect(document.head.querySelector('meta[data-kt-theme-color="override"]')?.getAttribute("content")).toBe(
          THEME_COLOR_DARK,
        );
        expect(toggle.getAttribute("aria-label")).toBe("Chuyển sang chế độ sáng");

        // Toggle back to light
        fireEvent.click(toggle);
        flush();
        expect(document.documentElement.dataset.theme).toBe("light");
        expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
        expect(document.head.querySelector('meta[data-kt-theme-color="override"]')?.getAttribute("content")).toBe(
          THEME_COLOR_LIGHT,
        );

        // Open Aa display menu -> preloads all on-demand fonts once
        const menuTrigger = getByRole("button", { name: "Tùy chỉnh phông chữ, cỡ chữ và chế độ tối" });
        const popup = openPopover(menuTrigger);
        const menu = within(popup);

        const onDemandCount = READING_FONTS.filter((f) => f.stylesheetUrl !== null).length;
        expect(document.head.querySelectorAll("link[data-kt-font]")).toHaveLength(onDemandCount);

        // Choose "Hệ thống" clears explicit override
        fireEvent.click(menu.getByRole("button", { name: "Hệ thống", hidden: true }));
        flush();
        expect(document.documentElement.dataset.theme).toBeUndefined();
        expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
        expect(document.head.querySelector('meta[data-kt-theme-color="override"]')).toBeNull();

        // Choose a reading font
        fireEvent.click(menu.getByRole("button", { name: /Literata/, hidden: true }));
        flush();
        expect(document.documentElement.dataset.font).toBe("literata");
        expect(window.localStorage.getItem(FONT_STORAGE_KEY)).toBe("literata");
        // Stylesheet is not duplicated
        expect(document.head.querySelectorAll('link[data-kt-font="literata"]')).toHaveLength(1);

        // Switch to default font removes data-font attribute
        fireEvent.click(menu.getByRole("button", { name: /Source Serif 4/, hidden: true }));
        flush();
        expect(document.documentElement.dataset.font).toBeUndefined();
        expect(window.localStorage.getItem(FONT_STORAGE_KEY)).toBeNull();

        // Choose reading size
        fireEvent.click(menu.getByRole("button", { name: /Lớn/, hidden: true }));
        flush();
        expect(getByTestId("scale").textContent).toBe("lg");
        expect(window.localStorage.getItem(SCALE_STORAGE_KEY)).toBe("lg");
      },
      { scenario: "display-controls-theme-and-font" },
    );
    expectNoDiagnostics(artifact);
  });

  test("khôi phục tùy chọn đã lưu và chạy init script trước khi vẽ", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    window.localStorage.setItem(FONT_STORAGE_KEY, "be-vietnam");

    // Simulate synchronous head script execution
    new Function(PREFS_INIT_SCRIPT)();

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.font).toBe("be-vietnam");
    const link = document.head.querySelector('link[data-kt-font="be-vietnam"]');
    expect(link?.getAttribute("href")).toContain("Be+Vietnam+Pro");
    expect(link?.getAttribute("href")).toContain("&display=swap");
  });
});
