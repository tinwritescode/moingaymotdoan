import { createMemo } from "solid-js";
import { alternatePath } from "../../lib/i18n";
import { useLocale } from "./locale-context";

/** Quiet footer language switcher: shows Tiếng Việt · English with the alternate locale linked to the equivalent page. */
export function LanguageSwitcher() {
  const { locale, pathname } = useLocale();
  const viHref = createMemo(() => alternatePath(pathname(), "vi"));
  const enHref = createMemo(() => alternatePath(pathname(), "en"));

  return (
    <span class="inline-flex items-center gap-1.5" role="group" aria-label="Language / Ngôn ngữ">
      {locale() === "vi" ? (
        <span aria-current="true" class="font-medium text-ink">
          Tiếng Việt
        </span>
      ) : (
        <a href={viHref()} hreflang="vi" class="underline hover:text-accent">
          Tiếng Việt
        </a>
      )}
      <span aria-hidden="true">/</span>
      {locale() === "en" ? (
        <span aria-current="true" class="font-medium text-ink">
          English
        </span>
      ) : (
        <a href={enHref()} hreflang="en" class="underline hover:text-accent">
          English
        </a>
      )}
    </span>
  );
}

/** "EN" / "VI" in the top bar: the same page in the other language, one tap away. */
export function LanguageToggle() {
  const { locale, pathname, t } = useLocale();
  const other = () => (locale() === "vi" ? "en" : "vi");

  return (
    <a
      href={alternatePath(pathname(), other())}
      hreflang={other()}
      aria-label={t().header.switchLanguageLabel}
      class="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-rule bg-card px-2 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-ink sm:h-10 sm:min-w-10"
    >
      {t().header.switchLanguageShort}
    </a>
  );
}
