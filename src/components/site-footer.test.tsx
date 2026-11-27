import { cleanup, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { REPO_URL } from "../../lib/i18n";
import { LocaleProvider } from "./locale-context";
import { SiteFooter } from "./site-footer";

afterEach(cleanup);

describe("SiteFooter", () => {
  it("renders open-source GitHub and contribute-another-language links in Vietnamese", () => {
    render(() => (
      <LocaleProvider locale="vi" pathname="/">
        <SiteFooter />
      </LocaleProvider>
    ));

    const contributeLink = screen.getByRole("link", { name: "Đóng góp ngôn ngữ khác" });
    expect(contributeLink.getAttribute("href")).toBe(`${REPO_URL}/blob/main/CONTRIBUTING.md`);

    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink.getAttribute("href")).toBe(REPO_URL);

    const contactLink = screen.getByRole("link", { name: "Liên hệ" });
    expect(contactLink.getAttribute("href")).toBe("/lien-he");
  });

  it("renders open-source GitHub and contribute-another-language links in English", () => {
    render(() => (
      <LocaleProvider locale="en" pathname="/en">
        <SiteFooter />
      </LocaleProvider>
    ));

    const contributeLink = screen.getByRole("link", { name: "Contribute another language" });
    expect(contributeLink.getAttribute("href")).toBe(`${REPO_URL}#adding-another-language`);

    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink.getAttribute("href")).toBe(REPO_URL);

    const contactLink = screen.getByRole("link", { name: "Contact" });
    expect(contactLink.getAttribute("href")).toBe("/en/contact");
  });
});
