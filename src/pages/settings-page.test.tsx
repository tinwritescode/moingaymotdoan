import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { LocaleProvider } from "../components/locale-context";
import { PreferencesProvider } from "../components/preferences-context";
import { READING_FONTS } from "../lib/preferences";
import { SettingsPage } from "./settings-page";

beforeEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.font;
  document.head.querySelectorAll("link[data-kt-font], meta[data-kt-theme-color]").forEach((el) => el.remove());
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.font;
  document.head.querySelectorAll("link[data-kt-font], meta[data-kt-theme-color]").forEach((el) => el.remove());
});

describe("<SettingsPage />", () => {
  test("renders display, language, reminder and quick links in Vietnamese with no Solid diagnostics", async () => {
    const { artifact } = await captureArtifact(
      () => {
        const view = render(() => (
          <LocaleProvider locale="vi" pathname="/tuy-chinh">
            <PreferencesProvider>
              <SettingsPage />
            </PreferencesProvider>
          </LocaleProvider>
        ));
        flush();

        // Preloads on-demand reading fonts so font cards render in their actual faces.
        const onDemandCount = READING_FONTS.filter((f) => f.stylesheetUrl !== null).length;
        expect(document.head.querySelectorAll("link[data-kt-font]")).toHaveLength(onDemandCount);

        // Header links to /tuy-chinh as the active settings item and omits separate Aa / EN / theme toggles.
        const headerSettings = view.getByRole("link", { name: "Tùy chỉnh" });
        expect(headerSettings.getAttribute("href")).toBe("/tuy-chinh");
        expect(headerSettings.getAttribute("aria-current")).toBe("page");
        expect(view.queryByRole("button", { name: "Tùy chỉnh phông chữ, cỡ chữ và chế độ tối" })).toBeNull();
        expect(view.queryByRole("link", { name: "Switch to English" })).toBeNull();

        // Display controls update theme and font directly on the page.
        fireEvent.click(view.getByRole("button", { name: "Tối" }));
        fireEvent.click(view.getByRole("button", { name: /Literata/ }));
        flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(document.documentElement.dataset.font).toBe("literata");

        // Language switcher links symmetrically to /en/settings.
        expect(view.getByRole("link", { name: "Tiếng Việt" }).getAttribute("aria-current")).toBe("page");
        expect(view.getByRole("link", { name: "English" }).getAttribute("href")).toBe("/en/settings");
      },
      { scenario: "settings-page-vi" },
    );
    expectNoDiagnostics(artifact);
  });

  test("renders English copy and links back to /tuy-chinh", async () => {
    const { artifact } = await captureArtifact(
      () => {
        const view = render(() => (
          <LocaleProvider locale="en" pathname="/en/settings">
            <PreferencesProvider>
              <SettingsPage />
            </PreferencesProvider>
          </LocaleProvider>
        ));
        flush();

        expect(view.getByRole("heading", { level: 1 }).textContent).toBe("Read at your own pace");
        expect(view.getByRole("link", { name: "Settings" }).getAttribute("href")).toBe("/en/settings");
        expect(view.getByRole("link", { name: "English" }).getAttribute("aria-current")).toBe("page");
        expect(view.getByRole("link", { name: "Tiếng Việt" }).getAttribute("href")).toBe("/tuy-chinh");
      },
      { scenario: "settings-page-en" },
    );
    expectNoDiagnostics(artifact);
  });
});
