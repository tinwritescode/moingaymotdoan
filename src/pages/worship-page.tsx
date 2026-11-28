import { FloatingDock } from "../components/floating-dock";
import { useLocale } from "../components/locale-context";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { WorshipBrowser } from "../components/worship-browser";
import { worshipHref } from "../router";

/** Shared worship library page for Vietnamese (/tho-phuong) and English (/en/worship). */
export function WorshipPageView() {
  const { locale, t } = useLocale();

  return (
    <>
      <Seo title={t().seo.worshipTitle} description={t().seo.worshipDescription} path={worshipHref(locale())} />
      <SiteHeader section="tho-phuong" />
      <WorshipBrowser />
      <FloatingDock active="tho-phuong" />
    </>
  );
}
