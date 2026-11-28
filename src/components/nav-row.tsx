import type { JSX } from "@solidjs/web";

/** Shared quiet navigation row card (icon badge, title, subtitle, chevron) used on Account and Settings. */
export function NavRow(props: {
  href: string;
  icon: JSX.Element;
  title: string;
  description: string;
  class?: string;
}) {
  return (
    <a
      href={props.href}
      class={[
        "group flex min-h-16 items-center gap-3.5 rounded-2xl border border-rule bg-card px-4 py-3.5 font-sans text-ink transition-colors hover:border-accent sm:px-5",
        props.class,
      ]}
    >
      <span
        aria-hidden="true"
        class="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-side text-accent transition-colors group-hover:bg-accent group-hover:text-paper"
      >
        {props.icon}
      </span>
      <span class="flex min-w-0 flex-1 flex-col gap-0.5">
        <span class="text-[15px] leading-snug font-medium text-ink">{props.title}</span>
        <span class="text-xs leading-relaxed text-muted">{props.description}</span>
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4 flex-none text-muted transition-transform duration-[var(--dur-micro)] ease-[var(--ease-quiet)] group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
      >
        <path d="m7.5 4.5 5 5.5-5 5.5" />
      </svg>
    </a>
  );
}
