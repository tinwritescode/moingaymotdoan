import { Loading } from "solid-js";
import { AuthProvider } from "./components/auth-context";
import { HistoryProvider } from "./components/history-context";
import { InstallCorner } from "./components/install-corner";
import { RouterLocaleProvider } from "./components/locale-context";
import { PreferencesProvider } from "./components/preferences-context";
import { SiteFooter } from "./components/site-footer";
import { StreakProvider } from "./components/streak-context";
import { PageSkeleton } from "./components/skeleton";
import { isStandalone } from "./lib/install";
import { Router } from "./router";
import "./app.css";

const posthogKey = (import.meta.env.VITE_POSTHOG_KEY ?? "").trim();
if (!import.meta.env.SSR && posthogKey) {
  // Browser only: the dynamic import keeps posthog-js out of SSR/prerender and the first bundle.
  // Cookieless and no replay: anonymous counts only, as the privacy policy promises.
  void import("posthog-js").then(({ default: posthog }) => {
    posthog.init(posthogKey, {
      // Same-origin path proxied to PostHog (vercel.json rewrites, vite server.proxy in dev),
      // so ad blockers that block *.posthog.com let the events through.
      api_host: "/k7q",
      ui_host: "https://us.posthog.com",
      defaults: "2026-05-30",
      cookieless_mode: "always",
      disable_session_recording: true,
    });
    // Installed-app sessions and installs, to tell whether the PWA is used.
    posthog.register({ display_mode: isStandalone() ? "standalone" : "browser" });
    window.addEventListener("appinstalled", () => posthog.capture("app_installed"));
  });
}

// Offline reading. Production only: dev serves no sw.js (scripts/prerender.mjs writes it).
if (!import.meta.env.SSR && import.meta.env.PROD && "serviceWorker" in navigator) {
  void navigator.serviceWorker.register("/sw.js");
}

/** The layout every page shares: the page itself, then the footer. */
export default function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <HistoryProvider>
          <StreakProvider>
            <Router>
              {(props) => (
                <RouterLocaleProvider>
                  <div class="flex flex-1 flex-col">
                    <Loading fallback={<PageSkeleton />}>{props.children}</Loading>
                  </div>
                  <SiteFooter />
                  <InstallCorner />
                </RouterLocaleProvider>
              )}
            </Router>
          </StreakProvider>
        </HistoryProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}
