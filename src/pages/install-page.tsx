import { createSignal, For, Match, onSettled, Show, Switch } from "solid-js";
import type { InstallPlatformId } from "../../lib/i18n";
import { FloatingDock } from "../components/floating-dock";
import { cornerHidden, loadCornerHidden, setCornerHidden } from "../components/install-corner";
import { useLocale } from "../components/locale-context";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { installPrompt, isStandalone, platformOf, promptInstall } from "../lib/install";
import { installHref } from "../router";

const PLATFORMS: readonly InstallPlatformId[] = ["ios", "android", "desktop", "mac"];

function Icon(props: { d: string; class?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      role={props.label ? "img" : undefined}
      aria-label={props.label}
      aria-hidden={props.label ? undefined : "true"}
      class={props.class ?? "h-5 w-5"}
    >
      <path d={props.d} />
    </svg>
  );
}

const ICONS = {
  phone: "M9 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
  offline: "M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M3 3l18 18",
  check: "M20 6 9 17l-5-5",
  back: "M15 18l-6-6 6-6",
  forward: "M9 18l6-6-6-6",
  share: "M12 3v12M8 7l4-4 4 4M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8",
  bookmarks: "M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z",
  tabs: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  addSquare: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8v8M8 12h8",
  book: "M2 5c3-1 7-1 10 1v14c-3-2-7-2-10-1zM22 5c-3-1-7-1-10 1v14c3-2 7-2 10-1z",
  download: "M12 3v12M7 10l5 5 5-5M5 21h14",
};

/** The iPhone pictures under steps 2–4: Safari's bottom bar, its share menu, the icon on the home screen. */
function IosFigure(props: { step: number }) {
  const { t } = useLocale();
  return (
    <Switch>
      <Match when={props.step === 1}>
        <div class="flex h-13 items-center justify-around rounded-xl bg-rule px-3 text-muted">
          <Icon d={ICONS.back} />
          <Icon d={ICONS.forward} />
          <span class="flex h-10 w-11 items-center justify-center rounded-[10px] bg-card text-accent ring-2 ring-accent">
            <Icon d={ICONS.share} label={t().install.shareButton} />
          </span>
          <Icon d={ICONS.bookmarks} />
          <Icon d={ICONS.tabs} />
        </div>
      </Match>
      <Match when={props.step === 2}>
        <div aria-hidden="true" class="flex flex-col rounded-xl border border-rule bg-card font-sans text-[15px]">
          <span class="border-b border-rule px-3.5 py-3 text-muted">{t().install.shareMenu[0]}</span>
          <span class="flex items-center justify-between bg-side px-3.5 py-3 font-medium text-ink">
            {t().install.shareMenu[1]}
            <Icon d={ICONS.addSquare} />
          </span>
          <span class="px-3.5 py-3 text-muted">{t().install.shareMenu[2]}</span>
        </div>
      </Match>
      <Match when={props.step === 3}>
        <div aria-hidden="true" class="flex items-center gap-3">
          <span class="flex h-14 w-14 items-center justify-center rounded-[14px] bg-accent text-paper">
            <Icon d={ICONS.book} class="h-8 w-8" />
          </span>
          <span class="font-sans text-[13px] text-muted">{t().install.appName}</span>
        </div>
      </Match>
    </Switch>
  );
}

/** How to add the site to the home screen or dock, one tab per platform, opening on the reader's own. */
export function InstallPage() {
  const { locale, t } = useLocale();
  // The server renders the iPhone guide; the reader's platform replaces it once the page runs.
  const [platform, setPlatform] = createSignal<InstallPlatformId>("ios");
  const [detected, setDetected] = createSignal<InstallPlatformId | null>(null);
  const [standalone, setStandalone] = createSignal(false);

  onSettled(() => {
    loadCornerHidden();
    const own = platformOf(navigator);
    setDetected(own);
    setPlatform(own);
    setStandalone(isStandalone());
  });

  const tabs: HTMLButtonElement[] = [];
  const onTabKey = (e: KeyboardEvent, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (index + step + PLATFORMS.length) % PLATFORMS.length;
    setPlatform(PLATFORMS[next]!);
    tabs[next]?.focus();
  };

  return (
    <>
      <Seo title={t().seo.installTitle} description={t().seo.installDescription} path={installHref(locale())} />
      <SiteHeader />
      <main class="mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
        <p class="font-sans text-xs font-medium text-accent">{t().install.kicker}</p>
        <h1 class="mt-1 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
          {t().install.heading}
        </h1>
        <p class="mt-2.5 text-base leading-relaxed text-muted">{t().install.intro}</p>
        <Show when={standalone()}>
          <p class="mt-4 rounded-xl bg-side px-3.5 py-3 font-sans text-sm text-ink">{t().install.installed}</p>
        </Show>
        <ul class="mt-5 space-y-2.5 font-sans text-sm text-ink">
          <For each={t().install.benefits}>
            {(benefit, i) => (
              <li class="flex items-center gap-2.5">
                <span class="text-accent">
                  <Icon d={[ICONS.phone, ICONS.offline, ICONS.check][i()]!} />
                </span>
                {benefit}
              </li>
            )}
          </For>
        </ul>

        <section aria-labelledby="install-platform" class="mt-8">
          <div class="flex items-baseline justify-between gap-2 font-sans">
            <h2 id="install-platform" class="text-[15px] font-medium text-ink">
              {t().install.choosePlatform}
            </h2>
            <Show when={detected()}>
              {(own) => <span class="text-xs text-muted">{t().install.detected(t().install.platforms[own()])}</span>}
            </Show>
          </div>
          <div role="tablist" aria-label={t().install.tabsLabel} class="mt-3.5 grid grid-cols-2 gap-2 font-sans">
            <For each={PLATFORMS}>
              {(id, i) => (
                <button
                  ref={(el) => (tabs[PLATFORMS.indexOf(id)] = el)}
                  type="button"
                  role="tab"
                  id={`install-tab-${id}`}
                  aria-selected={platform() === id ? "true" : "false"}
                  aria-controls="install-guide"
                  tabindex={platform() === id ? 0 : -1}
                  onClick={() => setPlatform(id)}
                  onKeyDown={(e) => onTabKey(e, i())}
                  class={[
                    "min-h-11 cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    platform() === id ? "border-accent bg-accent text-paper" : "border-rule bg-card text-ink",
                  ]}
                >
                  {t().install.platforms[id]}
                </button>
              )}
            </For>
          </div>
        </section>

        <section
          id="install-guide"
          role="tabpanel"
          aria-labelledby={`install-tab-${platform()}`}
          class="mt-6 rounded-2xl border border-rule bg-card p-5"
        >
          <h2 class="font-sans text-[17px] font-semibold text-ink">{t().install.guides[platform()].heading}</h2>
          <Show when={installPrompt() && platform() !== "ios"}>
            <button
              type="button"
              onClick={() => void promptInstall()}
              class="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent font-sans text-[15px] font-medium text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Icon d={ICONS.download} />
              {t().install.installButton}
            </button>
            <p class="mt-2 text-center font-sans text-[13px] text-muted">{t().install.orByHand}</p>
          </Show>
          <ol class="mt-4 space-y-[18px]">
            <For each={t().install.guides[platform()].steps}>
              {(step, i) => (
                <li class="flex gap-3.5">
                  <span class="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-side font-sans text-sm font-semibold text-accent">
                    {i() + 1}
                  </span>
                  <div class="flex min-w-0 flex-1 flex-col gap-2.5">
                    <p class="text-base leading-relaxed text-ink">{step}</p>
                    <Show when={platform() === "ios"}>
                      <IosFigure step={i()} />
                    </Show>
                  </div>
                </li>
              )}
            </For>
          </ol>
          <Show when={platform() === "ios"}>
            <p class="mt-4 rounded-xl bg-mark px-3.5 py-3 font-sans text-[13px] leading-normal text-ink">
              {t().install.iosChromeNote}
            </p>
          </Show>
        </section>

        <label class="mt-6 flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-[14px] border border-rule px-4 py-3 font-sans text-sm">
          <span class="flex flex-col gap-0.5">
            <span class="font-medium text-ink">{t().install.cornerToggle}</span>
            <span class="text-xs text-muted">{t().install.cornerToggleHint}</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            checked={!cornerHidden()}
            onChange={(e) => setCornerHidden(!e.currentTarget.checked)}
            class="h-5.5 w-5.5 flex-none accent-accent"
          />
        </label>

        <section aria-labelledby="install-faq" class="mt-8 space-y-3.5 font-sans">
          <h2 id="install-faq" class="text-[15px] font-medium text-ink">
            {t().install.faqHeading}
          </h2>
          <For each={t().install.faq}>
            {(item) => (
              <div class="space-y-1">
                <h3 class="text-sm font-medium text-ink">{item.q}</h3>
                <p class="text-sm leading-relaxed text-muted">{item.a}</p>
              </div>
            )}
          </For>
        </section>
      </main>
      <FloatingDock />
    </>
  );
}
