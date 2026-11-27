import { Head, Link, Meta, Title } from "@solidjs/meta";
import { Show } from "solid-js";
import { alternatePath, messagesFor } from "../../lib/i18n";
import { useLocale } from "./locale-context";

export const SITE_URL = "https://moingaymotdoan.xyz";
export const SITE_NAME = messagesFor("vi").seo.siteName;
export const DEFAULT_TITLE = messagesFor("vi").seo.defaultTitle;
export const DEFAULT_DESCRIPTION = messagesFor("vi").seo.defaultDescription;
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
export const OG_IMAGE_ALT = messagesFor("vi").seo.ogImageAlt;

/** Truncates SEO/OG description cleanly (~160 chars) on word boundaries. */
export function truncateMeta(text: string, max = 160): string {
  const clean = text.replace(/\s+/gu, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?—-]+$/u, "")}…`;
}

export function canonicalUrl(path: string): string {
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/gu, "")}`;
  return `${SITE_URL}${clean}`;
}

export type SeoProps = {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

/**
 * Emits <title>, canonical, hreflang alternates, Open Graph, and Twitter/X Card tags
 * for each statically prerendered page via @solidjs/meta.
 */
export function Seo(props: SeoProps) {
  const { locale, t } = useLocale();
  const description = () => truncateMeta(props.description ?? t().seo.defaultDescription);
  const currentPath = () => props.path ?? (locale() === "en" ? "/en" : "/");
  const url = () => canonicalUrl(currentPath());
  const viUrl = () => canonicalUrl(alternatePath(currentPath(), "vi"));
  const enUrl = () => canonicalUrl(alternatePath(currentPath(), "en"));
  const ogType = () => props.type ?? "website";

  return (
    <Head>
      <Title>{props.title}</Title>
      <Meta name="description" content={description()} />
      <Show when={props.noindex}>
        <Meta name="robots" content="noindex, nofollow" />
      </Show>
      <Link rel="canonical" href={url()} key="canonical" />
      <Link rel="manifest" href={locale() === "en" ? "/site.en.webmanifest" : "/site.webmanifest"} key="manifest" />
      <Show when={!props.noindex}>
        <Link rel="alternate" hreflang="vi" href={viUrl()} key="hreflang-vi" />
        <Link rel="alternate" hreflang="en" href={enUrl()} key="hreflang-en" />
        <Link rel="alternate" hreflang="x-default" href={viUrl()} key="hreflang-default" />
      </Show>

      <Meta property="og:type" content={ogType()} />
      <Meta property="og:site_name" content={t().seo.siteName} />
      <Meta property="og:locale" content={t().ogLocale} />
      <Meta property="og:locale:alternate" content={t().ogLocaleAlternate} />
      <Meta property="og:url" content={url()} />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={description()} />
      <Meta property="og:image" content={OG_IMAGE_URL} />
      <Meta property="og:image:secure_url" content={OG_IMAGE_URL} />
      <Meta property="og:image:type" content="image/png" />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta property="og:image:alt" content={t().seo.ogImageAlt} />

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:url" content={url()} />
      <Meta name="twitter:title" content={props.title} />
      <Meta name="twitter:description" content={description()} />
      <Meta name="twitter:image" content={OG_IMAGE_URL} />
      <Meta name="twitter:image:alt" content={t().seo.ogImageAlt} />
    </Head>
  );
}
