import { describe, expect, test } from "vitest";
import {
  DEFAULT_FONT,
  DEFAULT_SCALE,
  DEFAULT_THEME,
  getReadingFont,
  parseReadingFont,
  parseReadingScale,
  parseThemeMode,
  PREFS_INIT_SCRIPT,
  READING_FONTS,
  resolveTheme,
} from "./preferences";

describe("preferences helpers", () => {
  test("parses valid values and falls back safely to defaults", () => {
    expect(parseThemeMode("dark")).toBe("dark");
    expect(parseThemeMode("light")).toBe("light");
    expect(parseThemeMode("system")).toBe("system");
    expect(parseThemeMode("unknown")).toBe(DEFAULT_THEME);
    expect(parseThemeMode(null)).toBe(DEFAULT_THEME);

    expect(parseReadingFont("literata")).toBe("literata");
    expect(parseReadingFont("be-vietnam")).toBe("be-vietnam");
    expect(parseReadingFont("comic-sans")).toBe(DEFAULT_FONT);
    expect(parseReadingFont(undefined)).toBe(DEFAULT_FONT);

    expect(parseReadingScale("sm")).toBe("sm");
    expect(parseReadingScale("lg")).toBe("lg");
    expect(parseReadingScale("xl")).toBe(DEFAULT_SCALE);
  });

  test("resolves theme mode against OS preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  test("curated reading fonts have unique ids and valid Google Fonts URLs when on-demand", () => {
    const ids = new Set(READING_FONTS.map((f) => f.id));
    expect(ids.size).toBe(READING_FONTS.length);
    expect(READING_FONTS.length).toBeGreaterThanOrEqual(6);
    expect(getReadingFont("source-serif").stylesheetUrl).toBeNull();
    expect(getReadingFont("lexend").stylesheetUrl).toBeNull();
    for (const font of READING_FONTS) {
      if (font.stylesheetUrl !== null) {
        expect(font.stylesheetUrl.startsWith("https://fonts.googleapis.com/css2?")).toBe(true);
      }
    }
  });

  test("early init script is valid JS and contains no raw HTML-escapable characters", () => {
    expect(PREFS_INIT_SCRIPT).not.toMatch(/[<>&]/);
    // Compiles without syntax error
    expect(() => new Function(PREFS_INIT_SCRIPT)).not.toThrow();
  });
});
