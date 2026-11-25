import { For, Show } from "solid-js";
import {
  preloadAllReadingFonts,
  READING_FONTS,
  SCALE_OPTIONS,
  THEME_OPTIONS,
  type ReadingScale,
} from "../lib/preferences";
import { ariaState } from "./aria";
import { useLocale } from "./locale-context";
import { Popover } from "./popover";
import { usePreferences } from "./preferences-context";

const PREVIEW_SCALE_CLASS: Record<ReadingScale, string> = {
  sm: "text-[0.94rem] leading-[1.7]",
  md: "text-[1.03rem] leading-[1.75]",
  lg: "text-[1.12rem] leading-[1.8]",
};

function SunIcon(props: { class?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class={props.class ?? "h-[17px] w-[17px]"}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </svg>
  );
}

function MoonIcon(props: { class?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class={props.class ?? "h-[17px] w-[17px]"}
    >
      <path d="M20.2 14.4A8.2 8.2 0 1 1 9.6 3.8a6.6 6.6 0 0 0 10.6 10.6Z" />
    </svg>
  );
}

function SystemIcon(props: { class?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class={props.class ?? "h-3.5 w-3.5"}
    >
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
      <path d="M8.5 20h7M12 16.5V20" />
    </svg>
  );
}

/** One-click dark mode toggle in the top bar. */
export function ThemeToggle(props: { compact?: boolean }) {
  const { ready, resolvedTheme, toggleTheme } = usePreferences();
  const { t } = useLocale();
  const isDark = () => ready() && resolvedTheme() === "dark";
  const label = () => (isDark() ? t().display.switchToLight : t().display.switchToDark);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label()}
      aria-label={label()}
      aria-pressed={ariaState(isDark())}
      class={[
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-rule bg-card text-muted transition-colors hover:border-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        props.compact ? "h-9 w-9" : "h-9 w-9 sm:h-10 sm:w-10",
      ]}
    >
      <Show when={isDark()} fallback={<MoonIcon />}>
        <SunIcon />
      </Show>
    </button>
  );
}

/** Popover menu for color mode (light/dark/system), reading size, and reading font. */
export function DisplayMenu(props: { compact?: boolean }) {
  const { theme, font, scale, setTheme, setFont } = usePreferences();
  const { t } = useLocale();

  return (
    <Popover
      trigger="Aa"
      triggerLabel={t().display.triggerLabel}
      triggerClass={[
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-rule bg-card font-serif text-sm text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        props.compact ? "h-9 px-3" : "h-9 px-3 sm:h-10 sm:px-3.5",
      ]}
      title={t().display.title}
      titleClass="text-xs font-medium tracking-wide text-accent"
      class="kt-display-menu w-[min(22.5rem,calc(100vw-1.5rem))] p-4 font-sans"
      onOpenChange={(open) => {
        if (open) preloadAllReadingFonts();
      }}
    >
      {() => (
        <div class="mt-3 space-y-4">
          <div class="space-y-1.5">
            <p class="text-[11px] font-medium text-muted">{t().display.colorMode}</p>
            <div
              role="group"
              aria-label={t().display.colorMode}
              class="grid grid-cols-3 gap-1 rounded-full border border-rule bg-paper/70 p-1 text-xs"
            >
              <For each={THEME_OPTIONS}>
                {(opt) => (
                  <button
                    type="button"
                    aria-pressed={ariaState(theme() === opt.id)}
                    onClick={() => setTheme(opt.id)}
                    class="inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 text-muted transition-colors hover:text-ink aria-pressed:bg-accent aria-pressed:font-medium aria-pressed:text-paper"
                  >
                    <Show
                      when={opt.id === "dark"}
                      fallback={
                        <Show when={opt.id === "light"} fallback={<SystemIcon class="h-3.5 w-3.5" />}>
                          <SunIcon class="h-3.5 w-3.5" />
                        </Show>
                      }
                    >
                      <MoonIcon class="h-3.5 w-3.5" />
                    </Show>
                    <span>{t().display.themes[opt.id]}</span>
                  </button>
                )}
              </For>
            </div>
          </div>

          <div class="space-y-1.5">
            <p class="text-[11px] font-medium text-muted">{t().display.readingSize}</p>
            <ScalePicker />
          </div>

          <div class="space-y-1.5">
            <p class="text-[11px] font-medium text-muted">{t().display.readingFont}</p>
            <div role="group" aria-label={t().display.readingFont} class="grid grid-cols-2 gap-1.5">
              <For each={READING_FONTS}>
                {(item) => {
                  const selected = () => font() === item.id;
                  const meta = () => t().display.fonts[item.id];
                  return (
                    <button
                      type="button"
                      aria-pressed={ariaState(selected())}
                      onClick={() => setFont(item.id)}
                      title={meta().description}
                      class={[
                        "flex min-h-14 cursor-pointer flex-col justify-between rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                        selected()
                          ? "border-accent bg-side text-ink"
                          : "border-rule bg-paper/50 text-ink hover:border-accent/60 hover:bg-paper",
                      ]}
                    >
                      <span class="flex items-center justify-between gap-1.5">
                        <span
                          class="truncate text-[15px] leading-snug font-semibold"
                          style={{ "font-family": item.cssFamily }}
                        >
                          {item.name}
                        </span>
                        <Show when={selected()}>
                          <span aria-hidden="true" class="shrink-0 text-xs font-semibold text-accent">
                            ✓
                          </span>
                        </Show>
                      </span>
                      <span class="mt-0.5 truncate text-[11px] text-muted">{meta().tag}</span>
                    </button>
                  );
                }}
              </For>
            </div>
          </div>

          <p
            aria-label={t().display.previewLabel}
            class={[
              "rounded-xl border border-rule bg-paper/70 px-3.5 py-2.5 font-serif text-ink",
              PREVIEW_SCALE_CLASS[scale()],
            ]}
          >
            {t().display.previewVerse}
          </p>
        </div>
      )}
    </Popover>
  );
}

/** Nhỏ / Vừa / Lớn: the reading size picker, in the display menu and the tour. */
export function ScalePicker() {
  const { scale, setScale } = usePreferences();
  const { t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t().display.readingSize}
      class="grid grid-cols-3 gap-1 rounded-full border border-rule bg-paper/70 p-1 text-xs"
    >
      <For each={SCALE_OPTIONS}>
        {(opt) => (
          <button
            type="button"
            aria-pressed={ariaState(scale() === opt.id)}
            onClick={() => setScale(opt.id)}
            class="inline-flex min-h-8 cursor-pointer items-center justify-center gap-1 rounded-full px-2.5 text-muted transition-colors hover:text-ink aria-pressed:bg-accent aria-pressed:font-medium aria-pressed:text-paper"
          >
            <span aria-hidden="true" class={["font-serif leading-none", opt.sampleClass]}>
              A
            </span>
            <span>{t().display.scales[opt.id]}</span>
          </button>
        )}
      </For>
    </div>
  );
}
