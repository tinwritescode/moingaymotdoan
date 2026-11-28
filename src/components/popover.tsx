import type { JSX } from "@solidjs/web";
import { createSignal, createUniqueId, onCleanup, Show } from "solid-js";

const EXIT_MS = 180;

/**
 * A button and the popover it opens, on the platform Popover API: light dismiss, Esc and the top
 * layer come from the browser. The popup's content renders only while it is open (plus the brief
 * exit fade), so a page with many chỗ dẫn carries no hidden verse text.
 */
export function Popover(props: {
  trigger: JSX.Element;
  triggerClass: string | (string | Record<string, boolean> | false | undefined)[];
  triggerLabel?: string;
  title: JSX.Element;
  titleClass: string;
  class: string;
  onOpenChange?: (open: boolean) => void;
  /** `close` hides the popover, for a link inside it that navigates without leaving the page. */
  children: (close: () => void) => JSX.Element;
}) {
  const id = createUniqueId();
  const [open, setOpen] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  let popup!: HTMLSpanElement;
  let exitTimer: ReturnType<typeof setTimeout> | undefined;

  const clearExit = () => {
    if (exitTimer !== undefined) {
      clearTimeout(exitTimer);
      exitTimer = undefined;
    }
  };
  onCleanup(clearExit);

  return (
    <>
      <button
        type="button"
        popovertarget={id}
        aria-label={props.triggerLabel}
        title={props.triggerLabel}
        class={props.triggerClass}
        style={{ "anchor-name": `--${id}` }}
      >
        {props.trigger}
      </button>
      <span
        ref={popup}
        id={id}
        popover
        role="dialog"
        aria-labelledby={`${id}-title`}
        onBeforeToggle={(e) => {
          const next = e.newState === "open";
          clearExit();
          setOpen(next);
          if (next) {
            setMounted(true);
          } else {
            exitTimer = setTimeout(() => setMounted(false), EXIT_MS);
          }
          props.onOpenChange?.(next);
        }}
        onTransitionEnd={(e) => {
          if (e.target === popup && !open()) {
            clearExit();
            setMounted(false);
          }
        }}
        // oxlint-disable-next-line solid/style-prop -- CSS anchor positioning; the rule's property list predates it.
        style={{ "position-anchor": `--${id}` }}
        class={[
          "anchored whitespace-normal rounded-2xl border border-rule bg-card text-ink shadow-xl outline-none",
          props.class,
        ]}
      >
        <Show when={mounted()}>
          <span id={`${id}-title`} class={["block", props.titleClass]}>
            {props.title}
          </span>
          {props.children(() => popup.hidePopover())}
        </Show>
      </span>
    </>
  );
}
