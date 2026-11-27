import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createMemo, createSignal, onCleanup, onSettled, Show } from "solid-js";
import type { InstallPlatformId } from "../../lib/i18n";
import { installPrompt, isStandalone, platformOf, promptInstall } from "../lib/install";
import { TOUR_STORAGE_KEY } from "../lib/tour";
import { homeHref, installHref } from "../router";
import { useLocale } from "./locale-context";
import { readStorage, writeStorage } from "./preferences-context";

export const CORNER_STORAGE_KEY = "kt:install-corner:v1";
const TIP_STORAGE_KEY = "kt:install-tip:v1";
const TIP_MS = 6000;

const [cornerHidden, setHiddenSignal] = createSignal(false);

/** Whether the reader hid the install corner. The install guide's switch reads and sets it too. */
export { cornerHidden };

export function setCornerHidden(hidden: boolean): void {
  setHiddenSignal(hidden);
  writeStorage(CORNER_STORAGE_KEY, hidden ? "hidden" : null);
}

/** Reads the reader's choice from storage. Call after hydration: the server always renders the corner as not hidden. */
export function loadCornerHidden(): void {
  setHiddenSignal(readStorage(CORNER_STORAGE_KEY) === "hidden");
}

/**
 * A small square in the bottom-right corner, above the dock, that installs the app: Chrome's and Edge's own
 * dialog where they offer one, the install guide on iPhone. Its tip opens by itself once; × hides it for good.
 */
export function InstallCorner() {
  const { locale, t } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const [device, setDevice] = createSignal<{ platform: InstallPlatformId; standalone: boolean } | null>(null);
  const [tip, setTip] = createSignal(false);
  const [toast, setToast] = createSignal(false);
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(toastTimer));

  onSettled(() => {
    loadCornerHidden();
    setDevice({ platform: platformOf(navigator), standalone: isStandalone() });
  });

  const visible = createMemo(() => {
    const d = device();
    if (!d || d.standalone || cornerHidden() || location.pathname === installHref(locale())) return false;
    // The welcome sheet and the guided tour have the screen to themselves. The tour flag is read again on each navigation.
    const welcomePending = location.pathname === homeHref(locale()) && readStorage(TOUR_STORAGE_KEY) === null;
    if (welcomePending || new URLSearchParams(location.search).has("tour")) return false;
    // iPhone has no install dialog: the corner opens the guide. Elsewhere, only when the browser can install.
    return d.platform === "ios" || installPrompt() !== null;
  });

  createEffect(
    () => visible(),
    (shown) => {
      if (!shown || readStorage(TIP_STORAGE_KEY) !== null) return;
      writeStorage(TIP_STORAGE_KEY, "seen");
      setTip(true);
      const timer = setTimeout(() => setTip(false), TIP_MS);
      return () => clearTimeout(timer);
    },
  );

  const install = () => {
    setTip(false);
    if (installPrompt()) void promptInstall();
    else navigate(installHref(locale()));
  };

  const dismiss = () => {
    setTip(false);
    setCornerHidden(true);
    setToast(true);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(false), TIP_MS);
  };

  const undo = () => {
    clearTimeout(toastTimer);
    setToast(false);
    setCornerHidden(false);
  };

  return (
    <>
      <Show when={visible()}>
        <div class="fixed right-3.5 bottom-[5.25rem] z-30 flex items-center gap-2.5 font-sans">
          <Show when={tip()}>
            <div class="relative flex animate-reveal items-center gap-0.5 rounded-[14px] border border-rule bg-card py-1 pr-1 pl-1 text-[13px] text-ink shadow-lg motion-reduce:animate-none">
              <button
                type="button"
                onClick={install}
                class="flex min-h-8 cursor-pointer items-center gap-1.5 rounded-[10px] px-2 whitespace-nowrap hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  aria-hidden="true"
                  class="h-3.5 w-3.5 text-vua"
                >
                  <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2" />
                </svg>
                {t().install.corner.tip}
              </button>
              <button
                type="button"
                onClick={dismiss}
                aria-label={t().install.corner.dismiss}
                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" class="h-3.5 w-3.5">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <span
                aria-hidden="true"
                class="absolute top-1/2 -right-[5px] h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-t border-r border-rule bg-card"
              />
            </div>
          </Show>
          <button
            type="button"
            onClick={() => (tip() ? install() : setTip(true))}
            aria-label={t().install.corner.open}
            aria-expanded={tip() ? "true" : "false"}
            class="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-accent text-paper shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-[22px] w-[22px]">
              <path d="M2 5c3-1 7-1 10 1v14c-3-2-7-2-10-1zM22 5c-3-1-7-1-10 1v14c3-2 7-2 10-1z" />
            </svg>
            <span
              aria-hidden="true"
              class="absolute -right-1 -bottom-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-paper bg-mark text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="h-2.5 w-2.5">
                <path d="M12 4v12M7 11l5 5 5-5" />
              </svg>
            </span>
          </button>
        </div>
      </Show>
      <Show when={toast()}>
        <div
          role="status"
          class="fixed inset-x-3.5 bottom-[5.25rem] z-30 mx-auto flex max-w-[26rem] animate-reveal items-center gap-2.5 rounded-[14px] bg-ink py-2.5 pr-2.5 pl-3.5 font-sans text-[13px] leading-snug text-paper shadow-lg motion-reduce:animate-none"
        >
          <span class="flex-1">{t().install.corner.dismissed}</span>
          <button
            type="button"
            onClick={undo}
            class="min-h-9 shrink-0 cursor-pointer rounded-full px-3 font-medium text-side hover:underline focus-visible:outline-2 focus-visible:outline-paper"
          >
            {t().install.corner.undo}
          </button>
        </div>
      </Show>
    </>
  );
}
