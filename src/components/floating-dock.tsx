import { Show } from "solid-js";
import { accountHref, historyHref, homeHref, moodsHref, worshipHref } from "../router";
import { useHistory } from "./history-context";
import { useLocale } from "./locale-context";

export type DockSection = "home" | "cam-xuc" | "lich-su" | "tho-phuong" | "tai-khoan";

/** Floating bottom thumb navigation dock. */
export function FloatingDock(props: { active?: DockSection }) {
  const { hydrated, stats } = useHistory();
  const { locale, t } = useLocale();

  const itemClass = (key: DockSection) => [
    "relative flex min-w-[3.75rem] flex-col items-center gap-0.5 rounded-full px-2 py-1.5 font-sans text-[11px] font-medium whitespace-nowrap transition-[color,background-color,transform] duration-150 ease-[var(--ease-quiet)] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:active:scale-100 sm:min-w-[4.25rem] sm:px-3",
    props.active === key ? "bg-side text-accent" : "text-muted hover:text-ink",
  ];

  return (
    <nav
      aria-label={t().dock.navLabel}
      class="fixed bottom-3.5 left-1/2 z-30 flex w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1 rounded-full border border-rule bg-card/88 p-1.5 shadow-lg backdrop-blur-md"
    >
      <a href={homeHref(locale())} aria-current={props.active === "home" ? "page" : undefined} class={itemClass("home")}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[19px] w-[19px]"
        >
          <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
          <path d="M5 17a3 3 0 0 1 3-3h11" />
        </svg>
        <span>{t().dock.read}</span>
      </a>

      <a
        href={moodsHref(locale())}
        aria-current={props.active === "cam-xuc" ? "page" : undefined}
        class={itemClass("cam-xuc")}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[19px] w-[19px]"
        >
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        </svg>
        <span>{t().dock.moods}</span>
      </a>

      <a
        href={historyHref(locale())}
        aria-current={props.active === "lich-su" ? "page" : undefined}
        class={itemClass("lich-su")}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          aria-hidden="true"
          class="h-[19px] w-[19px]"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
        <span>
          {t().dock.history}
          <Show when={hydrated() && stats().chaptersRead > 0}>
            <span class="ml-0.5 text-[10px] opacity-80">·{stats().chaptersRead}</span>
          </Show>
        </span>
      </a>

      <a
        href={worshipHref(locale())}
        aria-current={props.active === "tho-phuong" ? "page" : undefined}
        class={itemClass("tho-phuong")}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[19px] w-[19px]"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span>{t().dock.worship}</span>
      </a>

      <a
        href={accountHref(locale())}
        aria-current={props.active === "tai-khoan" ? "page" : undefined}
        class={itemClass("tai-khoan")}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          aria-hidden="true"
          class="h-[19px] w-[19px]"
        >
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
        </svg>
        <span>{t().dock.me}</span>
      </a>
    </nav>
  );
}
