import { createMemo, For } from "solid-js";
import { LEGAL, type LegalKind } from "../../lib/i18n/legal";
import { FloatingDock } from "../components/floating-dock";
import { useLocale } from "../components/locale-context";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { contactHref, privacyHref, termsHref } from "../router";

const HREF = { privacy: privacyHref, terms: termsHref } satisfies Record<LegalKind, unknown>;

/** Privacy policy and terms of use for Vietnamese (/quyen-rieng-tu, /dieu-khoan) and English (/en/privacy, /en/terms). */
export function LegalPage(props: { kind: LegalKind }) {
  const { locale, t } = useLocale();
  const doc = createMemo(() => LEGAL[locale()][props.kind]);
  // UTC so the prerendered date matches the hydrated one in every time zone.
  const updated = createMemo(() =>
    new Date(doc().updated).toLocaleDateString(t().htmlLang, { dateStyle: "long", timeZone: "UTC" }),
  );

  return (
    <>
      <Seo title={doc().title} description={doc().description} path={HREF[props.kind](locale())} />
      <SiteHeader />
      <main class="mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
        <h1 class="font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
          {doc().title}
        </h1>
        <p class="mt-2 font-sans text-xs text-muted">
          {t().legal.updatedLabel} <time datetime={doc().updated}>{updated()}</time>
        </p>

        <For each={doc().sections}>
          {(section) => (
            <section class="mt-8">
              <h2 class="font-display text-lg font-normal text-ink">{section.heading}</h2>
              <For each={section.paragraphs}>
                {(paragraph) => <p class="mt-2.5 text-base leading-relaxed text-ink/90">{paragraph}</p>}
              </For>
            </section>
          )}
        </For>

        <p class="mt-10 border-t border-rule pt-5 font-sans text-sm text-muted">
          {t().legal.contactPrompt}{" "}
          <a href={contactHref(locale())} class="underline hover:text-accent">
            {t().legal.contactLink}
          </a>
        </p>
      </main>
      <FloatingDock />
    </>
  );
}
