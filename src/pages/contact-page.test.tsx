import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { REPO_URL } from "../../lib/i18n";
import { CONTACT_EMAIL, CONTACT_FACEBOOK, CONTACT_INSTAGRAM, CONTACT_ZALO } from "../../lib/i18n/contact";
import { LocaleProvider } from "../components/locale-context";
import { ContactPage } from "./contact-page";
import { LegalPage } from "./legal-page";

afterEach(cleanup);

describe("ContactPage", () => {
  it("renders all direct and community contact channels in Vietnamese without diagnostics", async () => {
    const { artifact } = await captureArtifact(
      () => {
        render(() => (
          <LocaleProvider locale="vi" pathname="/lien-he">
            <ContactPage />
          </LocaleProvider>
        ));
        flush();

        expect(screen.getByRole("heading", { level: 1, name: "Liên hệ" })).toBeTruthy();

        const emailLink = screen.getByRole("link", { name: /Email/ });
        expect(emailLink.getAttribute("href")).toBe(`mailto:${CONTACT_EMAIL}`);

        const zaloLink = screen.getByRole("link", { name: /Zalo/ });
        expect(zaloLink.getAttribute("href")).toBe(`https://zalo.me/${CONTACT_ZALO}`);

        const fbLink = screen.getByRole("link", { name: /Facebook/ });
        expect(fbLink.getAttribute("href")).toBe(`https://www.facebook.com/${CONTACT_FACEBOOK}`);

        const igLink = screen.getByRole("link", { name: /Instagram/ });
        expect(igLink.getAttribute("href")).toBe(`https://www.instagram.com/${CONTACT_INSTAGRAM}`);

        const issuesLink = screen.getByRole("link", { name: /GitHub Issues/ });
        expect(issuesLink.getAttribute("href")).toBe(`${REPO_URL}/issues`);

        const contributingLink = screen.getByRole("link", { name: /Hướng dẫn đóng góp/ });
        expect(contributingLink.getAttribute("href")).toBe(`${REPO_URL}/blob/main/CONTRIBUTING.md`);
      },
      { scenario: "contact-page-vi" },
    );

    expectNoDiagnostics(artifact);
  });

  it("renders localized English copy and links", () => {
    render(() => (
      <LocaleProvider locale="en" pathname="/en/contact">
        <ContactPage />
      </LocaleProvider>
    ));
    flush();

    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeTruthy();

    const contributingLink = screen.getByRole("link", { name: /Contributing guide/ });
    expect(contributingLink.getAttribute("href")).toBe(`${REPO_URL}#adding-another-language`);
  });

  it("copies email address and Zalo number on button click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(() => (
      <LocaleProvider locale="vi" pathname="/lien-he">
        <ContactPage />
      </LocaleProvider>
    ));
    flush();

    const copyEmailBtn = screen.getByRole("button", { name: "Sao chép Email" });
    fireEvent.click(copyEmailBtn);
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(CONTACT_EMAIL);
      expect(copyEmailBtn.textContent).toBe("Đã chép ✓");
    });

    const copyZaloBtn = screen.getByRole("button", { name: "Sao chép Zalo" });
    fireEvent.click(copyZaloBtn);
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(CONTACT_ZALO);
      expect(copyZaloBtn.textContent).toBe("Đã chép ✓");
    });
  });

  it("links privacy and terms pages to the localized contact page", () => {
    render(() => (
      <LocaleProvider locale="vi" pathname="/quyen-rieng-tu">
        <LegalPage kind="privacy" />
      </LocaleProvider>
    ));
    flush();
    expect(screen.getByRole("link", { name: "trang Liên hệ" }).getAttribute("href")).toBe("/lien-he");

    cleanup();

    render(() => (
      <LocaleProvider locale="en" pathname="/en/terms">
        <LegalPage kind="terms" />
      </LocaleProvider>
    ));
    flush();
    expect(screen.getByRole("link", { name: "visit our Contact page" }).getAttribute("href")).toBe("/en/contact");
  });
});
