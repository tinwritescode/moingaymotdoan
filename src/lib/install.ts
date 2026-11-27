import { createSignal } from "solid-js";
import type { InstallPlatformId } from "../../lib/i18n";

/** True when the site runs as an installed app (home screen / dock) rather than in a browser tab. */
export function isStandalone(): boolean {
  // iOS Safari reports an installed app only through navigator.standalone.
  return (
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    ("standalone" in navigator && navigator.standalone === true)
  );
}

export function platformOf(nav: Pick<Navigator, "userAgent" | "maxTouchPoints">): InstallPlatformId {
  const ua = nav.userAgent;
  // iPadOS Safari reports a Mac user agent; a Mac has no touch screen.
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Macintosh/.test(ua) && /Version\/[\d.]+ Safari/.test(ua)) return "mac";
  return "desktop";
}

/** Chrome's and Edge's `beforeinstallprompt` event; not in lib.dom. */
type InstallPromptEvent = Event & { prompt: () => Promise<unknown> };

const isInstallPrompt = (e: Event): e is InstallPromptEvent => "prompt" in e && typeof e.prompt === "function";

const [installPrompt, setInstallPrompt] = createSignal<InstallPromptEvent | null>(null);

/** The browser's own install dialog, when it offers one (Chrome and Edge on Android and desktop); null elsewhere. */
export { installPrompt };

// Listen at load: the browser fires the event once, early, often before any component mounts.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    if (!isInstallPrompt(e)) return;
    // Keep Chrome's own mini-infobar away; the install corner offers the dialog instead.
    e.preventDefault();
    setInstallPrompt(e);
  });
  window.addEventListener("appinstalled", () => setInstallPrompt(null));
}

/** Opens the browser's install dialog. A prompt event works once, so it is dropped after use. */
export async function promptInstall(): Promise<void> {
  const event = installPrompt();
  if (!event) return;
  setInstallPrompt(null);
  await event.prompt();
}
