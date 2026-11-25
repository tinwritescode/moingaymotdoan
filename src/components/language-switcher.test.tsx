import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { LanguageSwitcher } from "./language-switcher";
import { LocaleProvider } from "./locale-context";

afterEach(cleanup);

describe("LanguageSwitcher", () => {
  it("marks Vietnamese active on a Vietnamese chapter and links English to its equivalent URL", () => {
    render(() => (
      <LocaleProvider locale="vi" pathname="/thi-thien/23">
        <LanguageSwitcher />
      </LocaleProvider>
    ));

    expect(screen.getByText("Tiếng Việt").getAttribute("aria-current")).toBe("true");
    const enLink = screen.getByRole("link", { name: "English" });
    expect(enLink.getAttribute("href")).toBe("/en/psalms/23");
    expect(enLink.getAttribute("hreflang")).toBe("en");
  });

  it("marks English active on an English mood page and links Vietnamese to its equivalent URL", () => {
    render(() => (
      <LocaleProvider locale="en" pathname="/en/moods/anxiety-about-the-future">
        <LanguageSwitcher />
      </LocaleProvider>
    ));

    expect(screen.getByText("English").getAttribute("aria-current")).toBe("true");
    const viLink = screen.getByRole("link", { name: "Tiếng Việt" });
    expect(viLink.getAttribute("href")).toBe("/cam-xuc/lo-au-tuong-lai");
    expect(viLink.getAttribute("hreflang")).toBe("vi");
  });
});
