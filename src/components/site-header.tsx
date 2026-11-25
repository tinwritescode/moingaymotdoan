import { Show, type ParentProps } from "solid-js";
import { accountHref, homeHref, moodsHref } from "../router";
import { useAuth } from "./auth-context";
import { BookPicker } from "./book-picker";
import { DisplayMenu, ThemeToggle } from "./display-controls";
import { LanguageToggle } from "./language-switcher";
import { useLocale } from "./locale-context";

type HeaderSection = "cam-xuc" | "lich-su" | "tai-khoan";

/**
 * Minimal quiet top bar: moss dot + site name on the left;
 * Books picker, theme toggle, display menu, mood search, and account on the right.
 */
export function SiteHeader(props: ParentProps<{ book?: string; section?: HeaderSection }>) {
  const { locale, t } = useLocale();
  const { user, initialized } = useAuth();

  return (
    <header class="kt-header sticky top-0 z-20 border-b border-rule/70 bg-paper/88 backdrop-blur-md">
      <div class="mx-auto flex w-full max-w-[40rem] items-center justify-between gap-2 px-4 py-3 font-sans sm:gap-3 sm:px-5">
        <a
          href={homeHref(locale())}
          class="kt-brand inline-flex shrink-0 items-center gap-2 text-[15px] font-medium tracking-tight text-ink sm:gap-2.5"
        >
          <span aria-hidden="true" class="h-2.5 w-2.5 rounded-full bg-accent" />
          <span class="max-[379px]:sr-only">{t().header.brand}</span>
        </a>

        <div class="flex items-center gap-1.5 sm:gap-2">
          <BookPicker current={props.book} />
          <ThemeToggle />
          <DisplayMenu />
          <LanguageToggle />

          <a
            href={moodsHref(locale())}
            aria-label={t().header.searchByMood}
            aria-current={props.section === "cam-xuc" ? "page" : undefined}
            class={[
              "hidden h-10 w-10 items-center justify-center rounded-full border transition-colors sm:inline-flex",
              props.section === "cam-xuc"
                ? "border-accent bg-side text-accent"
                : "border-rule bg-card text-muted hover:border-accent hover:text-ink",
            ]}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              aria-hidden="true"
              class="h-[17px] w-[17px]"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.5-4.5" />
            </svg>
          </a>

          <a
            href={accountHref(locale())}
            aria-label={initialized() && user() ? t().header.accountLabel(user()!.name) : t().header.signInLabel}
            aria-current={props.section === "tai-khoan" ? "page" : undefined}
            class={[
              "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border text-sm font-medium transition-colors sm:h-10 sm:w-10",
              props.section === "tai-khoan"
                ? "border-accent bg-accent text-paper"
                : initialized() && user()
                  ? "border-accent/30 bg-side text-accent hover:border-accent"
                  : "border-rule bg-card text-muted hover:border-accent hover:text-ink",
            ]}
          >
            <Show
              when={initialized() && user()}
              fallback={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  aria-hidden="true"
                  class="h-[17px] w-[17px]"
                >
                  <circle cx="12" cy="9" r="3.5" />
                  <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
                </svg>
              }
            >
              {(u) => (
                <Show when={u().avatarUrl} fallback={<span>{u().name.slice(0, 1).toUpperCase()}</span>}>
                  {(url) => <img src={url()} alt={u().name} class="h-full w-full object-cover" />}
                </Show>
              )}
            </Show>
          </a>
        </div>
      </div>
      <Show when={props.children}>
        <div class="mx-auto flex w-full max-w-[40rem] flex-wrap items-center gap-2 border-t border-rule/60 px-5 py-2 font-sans">
          {props.children}
        </div>
      </Show>
    </header>
  );
}
