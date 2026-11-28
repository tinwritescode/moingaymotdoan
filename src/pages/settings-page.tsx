import { createMemo, onSettled } from "solid-js";
import { booksFor } from "../../lib/content/books";
import { alternatePath } from "../../lib/i18n";
import { DisplayControls } from "../components/display-controls";
import { FloatingDock } from "../components/floating-dock";
import { useLocale } from "../components/locale-context";
import { ReminderControls } from "../components/reminder-controls";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { preloadAllReadingFonts } from "../lib/preferences";
import { tourHref } from "../lib/tour";
import { accountHref, chapterHref, installHref, settingsHref } from "../router";

/** Dedicated quiet settings page for Vietnamese (/tuy-chinh) and English (/en/settings). */
export function SettingsPage() {
  const { locale, pathname, t } = useLocale();
  const viHref = createMemo(() => alternatePath(pathname(), "vi"));
  const enHref = createMemo(() => alternatePath(pathname(), "en"));

  onSettled(() => {
    preloadAllReadingFonts();
  });

  const rowClass =
    "flex min-h-16 items-center gap-3.5 rounded-[20px] border border-rule bg-card px-[18px] font-sans text-ink transition-colors hover:border-accent";

  return (
    <>
      <Seo
        title={t().seo.settingsTitle}
        description={t().seo.settingsDescription}
        path={settingsHref(locale())}
        noindex
      />
      <SiteHeader section="tuy-chinh" />

      <main class="mx-auto w-full max-w-[34rem] animate-reveal px-5 pt-7 pb-12 motion-reduce:animate-none">
        <header class="mb-6">
          <p class="font-sans text-xs font-medium text-accent">{t().settings.kicker}</p>
          <h1 class="mt-1 font-display text-3xl font-light tracking-tight text-ink sm:text-[2.1rem]">
            {t().settings.heading}
          </h1>
          <p class="mt-1.5 font-sans text-sm leading-relaxed text-muted">{t().settings.intro}</p>
        </header>

        <div class="space-y-4 font-sans">
          <section
            aria-labelledby="settings-display"
            class="rounded-3xl border border-rule bg-card p-5 sm:p-6"
          >
            <h2 id="settings-display" class="mb-3.5 text-xs font-medium tracking-wide text-accent">
              {t().settings.displayHeading}
            </h2>
            <DisplayControls />
          </section>

          <section
            aria-labelledby="settings-language"
            class="rounded-3xl border border-rule bg-card p-5 sm:p-6"
          >
            <h2 id="settings-language" class="text-xs font-medium tracking-wide text-accent">
              {t().settings.languageHeading}
            </h2>
            <p class="mt-1 text-xs leading-relaxed text-muted">{t().settings.languageHint}</p>
            <div
              role="group"
              aria-label={t().settings.languageHeading}
              class="mt-3.5 grid grid-cols-2 gap-1.5 rounded-full border border-rule bg-paper/70 p-1 text-sm"
            >
              <a
                href={viHref()}
                hreflang="vi"
                aria-current={locale() === "vi" ? "page" : undefined}
                class={[
                  "inline-flex min-h-10 items-center justify-center rounded-full px-4 transition-colors",
                  locale() === "vi" ? "bg-accent font-medium text-paper" : "text-muted hover:text-ink",
                ]}
              >
                Tiếng Việt
              </a>
              <a
                href={enHref()}
                hreflang="en"
                aria-current={locale() === "en" ? "page" : undefined}
                class={[
                  "inline-flex min-h-10 items-center justify-center rounded-full px-4 transition-colors",
                  locale() === "en" ? "bg-accent font-medium text-paper" : "text-muted hover:text-ink",
                ]}
              >
                English
              </a>
            </div>
            <p class="mt-3 text-xs text-muted">
              <a href={t().footer.contributeLanguageUrl} class="underline underline-offset-4 hover:text-accent">
                {t().footer.contributeLanguage}
              </a>
            </p>
          </section>

          <section
            aria-labelledby="settings-reminder"
            class="rounded-3xl border border-rule bg-card p-5 sm:p-6"
          >
            <h2 id="settings-reminder" class="text-xs font-medium tracking-wide text-accent">
              {t().settings.reminderHeading}
            </h2>
            <p class="mt-1 mb-3.5 text-xs leading-relaxed text-muted">{t().settings.reminderHint}</p>
            <ReminderControls standalone />
          </section>

          <section aria-labelledby="settings-more" class="space-y-2.5 pt-1">
            <h2 id="settings-more" class="px-1 text-xs font-medium tracking-wide text-muted">
              {t().settings.moreHeading}
            </h2>

            <a
              href={tourHref(chapterHref({ slug: booksFor(locale())[0].slug, number: 1, locale: locale() }))}
              class={rowClass}
            >
              <span
                aria-hidden="true"
                class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-side text-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" class="h-[18px] w-[18px]">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
                  <path d="M12 17h.01" />
                </svg>
              </span>
              <span class="flex flex-1 flex-col gap-0.5">
                <span class="text-[15px] font-medium">{t().tour.replay}</span>
                <span class="text-xs text-muted">{t().tour.replayHint}</span>
              </span>
              <span aria-hidden="true" class="text-muted">›</span>
            </a>

            <a href={installHref(locale())} class={rowClass}>
              <span
                aria-hidden="true"
                class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-side text-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-[18px] w-[18px]">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 19h14" />
                </svg>
              </span>
              <span class="flex flex-1 flex-col gap-0.5">
                <span class="text-[15px] font-medium">{t().settings.installRowTitle}</span>
                <span class="text-xs text-muted">{t().settings.installRowHint}</span>
              </span>
              <span aria-hidden="true" class="text-muted">›</span>
            </a>

            <a href={accountHref(locale())} class={rowClass}>
              <span
                aria-hidden="true"
                class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-side text-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" class="h-[18px] w-[18px]">
                  <circle cx="12" cy="9" r="3.5" />
                  <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
                </svg>
              </span>
              <span class="flex flex-1 flex-col gap-0.5">
                <span class="text-[15px] font-medium">{t().settings.accountRowTitle}</span>
                <span class="text-xs text-muted">{t().settings.accountRowHint}</span>
              </span>
              <span aria-hidden="true" class="text-muted">›</span>
            </a>
          </section>
        </div>
      </main>

      <FloatingDock />
    </>
  );
}
