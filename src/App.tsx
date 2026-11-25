import { Loading } from "solid-js";
import { AuthProvider } from "./components/auth-context";
import { HistoryProvider } from "./components/history-context";
import { LanguageSwitcher } from "./components/language-switcher";
import { RouterLocaleProvider, useLocale } from "./components/locale-context";
import { PreferencesProvider } from "./components/preferences-context";
import { PageSkeleton } from "./components/skeleton";
import { ebookHref, privacyHref, Router, termsHref } from "./router";
import "./app.css";

const posthogKey = (import.meta.env.VITE_POSTHOG_KEY ?? "").trim();
if (!import.meta.env.SSR && posthogKey) {
  // Browser only: the dynamic import keeps posthog-js out of SSR/prerender and the first bundle.
  // Cookieless and no replay: anonymous counts only, as the privacy policy promises.
  void import("posthog-js").then(({ default: posthog }) =>
    posthog.init(posthogKey, {
      api_host: "https://us.i.posthog.com",
      defaults: "2026-05-30",
      cookieless_mode: "always",
      disable_session_recording: true,
    }),
  );
}

function SiteFooter() {
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
        </p>
        <p>
          <LanguageSwitcher />
        </p>
      </div>
    </footer>
  );
}

/** The layout every page shares: the page itself, then the source line. */
export default function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <HistoryProvider>
          <Router>
            {(props) => (
              <RouterLocaleProvider>
                <div class="flex flex-1 flex-col">
                  <Loading fallback={<PageSkeleton />}>{props.children}</Loading>
                </div>
                <SiteFooter />
              </RouterLocaleProvider>
            )}
          </Router>
        </HistoryProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}
