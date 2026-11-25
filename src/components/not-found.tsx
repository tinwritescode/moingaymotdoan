import { homeHref } from "../router";
import { FloatingDock } from "./floating-dock";
import { useLocale } from "./locale-context";
import { Seo } from "./seo";
import { SiteHeader } from "./site-header";

export function NotFound() {
  const { locale, t } = useLocale();
  return (
    <>
      <Seo title={t().seo.notFoundTitle} description={t().seo.notFoundDescription} noindex />
      <SiteHeader />
      <main class="mx-auto w-full max-w-[40rem] px-5 pt-12 pb-8">
        <div class="rounded-3xl border border-rule bg-card p-7 text-center shadow-[var(--shadow-soft)]">
          <p class="text-[0.72rem] uppercase tracking-[0.08em] text-muted">404</p>
          <h1 class="mt-2 font-display text-2xl font-normal tracking-tight text-ink">{t().notFound.heading}</h1>
          <p class="mt-3 text-sm leading-relaxed text-muted">{t().notFound.description}</p>
          <a
            href={homeHref(locale())}
            class="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            {t().notFound.backHome}
          </a>
        </div>
      </main>
      <FloatingDock />
    </>
  );
}
