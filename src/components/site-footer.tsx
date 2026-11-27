import { contactHref, ebookHref, installHref, privacyHref, REPO_URL, termsHref } from "../../lib/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale } from "./locale-context";

/** Quiet footer shared across all pages: Scripture source, site links, language switch + translation invite, and GitHub link. */
export function SiteFooter() {
  const { locale, t } = useLocale();
  return (
    <footer class="kt-footer border-t border-rule pb-24">
      <div class="mx-auto max-w-[40rem] space-y-2 px-5 py-5 text-center font-sans text-xs text-muted">
        <p>
          {t().footer.scripturePrefix}{" "}
          <a href={t().bibleSourceUrl} class="underline hover:text-accent">
            {t().footer.sourceWord}
          </a>
          {" · "}
          <a href={ebookHref(locale())} class="underline hover:text-accent">
            {t().footer.downloadEbook}
          </a>
          {" · "}
          <a href={privacyHref(locale())} class="underline hover:text-accent">
            {t().footer.privacy}
          </a>
          {" · "}
          <a href={termsHref(locale())} class="underline hover:text-accent">
            {t().footer.terms}
          </a>
          {" · "}
          <a href={contactHref(locale())} class="underline hover:text-accent">
            {t().footer.contact}
          </a>
          {" · "}
          <a href={installHref(locale())} class="underline hover:text-accent">
            {t().footer.install}
          </a>
        </p>
        <p class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <LanguageSwitcher />
          <span aria-hidden="true">·</span>
          <a href={t().footer.contributeLanguageUrl} class="underline hover:text-accent">
            {t().footer.contributeLanguage}
          </a>
        </p>
        <p>
          {t().footer.openSourcePrefix}{" "}
          <a href={REPO_URL} class="underline hover:text-accent">
            {t().footer.openSourceLink}
          </a>
        </p>
      </div>
    </footer>
  );
}
