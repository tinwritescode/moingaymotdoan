import { useNavigate } from "@solidjs/router";
import { createMemo } from "solid-js";
import { FloatingDock } from "../components/floating-dock";
import { useLocale } from "../components/locale-context";
import { MoodBrowser } from "../components/mood-browser";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { getMoodIndex } from "../data";
import { moodHref, moodsHref } from "../router";

/** Shared 100-mood browser page for Vietnamese (/cam-xuc) and English (/en/moods). */
export function MoodsPageView() {
  const { locale, t } = useLocale();
  const index = createMemo(() => getMoodIndex(locale()));
  const navigate = useNavigate();

  return (
    <>
      <Seo title={t().seo.moodsTitle} description={t().seo.moodsDescription} path={moodsHref(locale())} />
      <SiteHeader section="cam-xuc" />
      <MoodBrowser index={index()} onRandom={(slug) => navigate(moodHref(slug, locale()))} />
      <FloatingDock active="cam-xuc" />
    </>
  );
}
