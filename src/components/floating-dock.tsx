import { Show } from "solid-js";
import { useUser } from "./user-context";

export type DockSection = "home" | "cam-xuc" | "lich-su" | "tai-khoan";

/** Thanh điều hướng nổi đáy màn hình dành cho ngón cái (phong cách Tĩnh Lặng). */
export function FloatingDock(props: { active?: DockSection }) {
  const { ready, stats } = useUser();

  const itemClass = (key: DockSection) => [
    "relative flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-full px-3 py-1.5 font-sans text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    props.active === key ? "bg-side text-accent" : "text-muted hover:text-ink",
  ];

  return (
    <nav
      aria-label="Điều hướng chính"
      class="fixed bottom-3.5 left-1/2 z-30 flex w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1 rounded-full border border-rule bg-card/88 p-1.5 shadow-lg backdrop-blur-md"
    >
      <a href="/" aria-current={props.active === "home" ? "page" : undefined} class={itemClass("home")}>
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
        <span>Đọc</span>
      </a>

      <a href="/cam-xuc" aria-current={props.active === "cam-xuc" ? "page" : undefined} class={itemClass("cam-xuc")}>
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
        <span>Cảm xúc</span>
      </a>

      <a href="/lich-su" aria-current={props.active === "lich-su" ? "page" : undefined} class={itemClass("lich-su")}>
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
          Lịch sử
          <Show when={ready() && stats().chaptersRead > 0}>
            <span class="ml-0.5 text-[10px] opacity-80">·{stats().chaptersRead}</span>
          </Show>
        </span>
      </a>

      <a
        href="/tai-khoan"
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
        <span>Tôi</span>
      </a>
    </nav>
  );
}
