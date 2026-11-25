import { createMemo, createSignal, For } from "solid-js";
import { bundles, ebookFile } from "../../lib/ebook/bundles";
import { ariaState } from "../components/aria";
import { FloatingDock } from "../components/floating-dock";
import { useLocale } from "../components/locale-context";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { getToc } from "../data";
import { ebookFileHref, ebookHref } from "../router";

const CHOICE =
  "min-h-10 cursor-pointer rounded-full px-4 text-xs font-medium text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper";

/** Shared EPUB download page for Vietnamese (/ebook) and English (/en/ebook). */
export function EbookPageView() {
  const { locale, t } = useLocale();
  const toc = createMemo(() => getToc(locale()));
  const groups = createMemo(() =>
    bundles(toc().books, locale()).map((b) => ({
      slug: b.slug,
      name: b.name,
      info: t().ebook.bundleInfo(
        b.books.length,
        b.books.reduce((n, x) => n + x.chapters.length, 0),
      ),
    })),
  );
  const [full, setFull] = createSignal(false);

  return (
    <>
      <Seo title={t().seo.ebookTitle} description={t().seo.ebookDescription} path={ebookHref(locale())} />
      <SiteHeader />
      <main class="mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
        <p class="font-sans text-xs font-medium text-accent">{t().ebook.kicker}</p>
        <h1 class="mt-1 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
          {t().ebook.heading}
        </h1>
        <p class="mt-2.5 text-base leading-relaxed text-muted">{t().ebook.intro}</p>

        <div
          role="group"
          aria-label={t().ebook.editionGroupLabel}
          class="mt-6 inline-flex gap-1 rounded-full border border-rule bg-card p-1 font-sans"
        >
          <button type="button" aria-pressed={ariaState(!full())} onClick={() => setFull(false)} class={CHOICE}>
            {t().ebook.conciseEdition}
          </button>
          <button type="button" aria-pressed={ariaState(full())} onClick={() => setFull(true)} class={CHOICE}>
            {t().ebook.fullTextEdition}
          </button>
        </div>
        <p class="mt-2 font-sans text-xs text-muted">
          {full() ? t().ebook.fullTextHint : t().ebook.conciseHint}
        </p>

        <section aria-labelledby="bo" class="mt-8">
          <h2 id="bo" class="font-display text-lg font-normal text-ink">
            {t().ebook.bundlesHeading}
          </h2>
          {/* Both editions are in the page, so the build finds every file to write; the toggle shows one. */}
          <For each={[false, true]}>
            {(fullText) => (
              <ul hidden={fullText !== full()} class="mt-3 space-y-2">
                <For each={groups()}>
                  {(b) => {
                    const file = () => ebookFile({ slug: b.slug, fullText, locale: locale() });
                    return (
                      <li>
                        <a
                          href={ebookFileHref(file(), locale())}
                          download={`${t().ebook.downloadPrefix}${file()}`}
                          class="group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-rule bg-card px-5 py-3.5 transition-colors hover:border-accent"
                        >
                          <span class="font-serif text-xl font-semibold text-ink group-hover:text-accent">
                            {b.name}
                          </span>
                          <span class="font-sans text-xs text-muted">{b.info} ↓</span>
                        </a>
                      </li>
                    );
                  }}
                </For>
              </ul>
            )}
          </For>
        </section>

        <section aria-labelledby="kindle" class="mt-8 rounded-3xl bg-side p-5 sm:p-6">
          <h2 id="kindle" class="font-display text-base font-medium text-accent">
            {t().ebook.kindleHeading}
          </h2>
          <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink/90">
            <li>{t().ebook.kindleSteps.step1}</li>
            <li>
              {t().ebook.kindleSteps.step2Before}
              <span class="font-semibold">amazon.com/sendtokindle</span>
              {t().ebook.kindleSteps.step2After}
              <em>{t().ebook.kindleSteps.step2Path}</em>).
            </li>
            <li>{t().ebook.kindleSteps.step3}</li>
          </ol>
          <p class="mt-4 font-sans text-xs leading-relaxed text-muted">{t().aiNotice}</p>
        </section>
      </main>
      <FloatingDock active="home" />
    </>
  );
}
