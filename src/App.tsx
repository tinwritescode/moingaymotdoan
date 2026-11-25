import { Loading } from "solid-js";
import { AuthProvider } from "./components/auth-context";
import { HistoryProvider } from "./components/history-context";
import { LanguageSwitcher } from "./components/language-switcher";
import { RouterLocaleProvider, useLocale } from "./components/locale-context";
import { PreferencesProvider } from "./components/preferences-context";
import { PageSkeleton } from "./components/skeleton";
import { ebookHref, Router } from "./router";
import "./app.css";

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
