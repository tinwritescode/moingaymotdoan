import type { JSX } from "@solidjs/web";
import { createSignal, createUniqueId, Show } from "solid-js";

/**
 * A button and the popover it opens, on the platform Popover API: light dismiss, Esc and the top
 * layer come from the browser. The popup's content renders only while it is open, so a page with
 * many chỗ dẫn carries no hidden verse text.
 */
export function Popover(props: {
  trigger: JSX.Element;
  triggerClass: string;
  title: JSX.Element;
  titleClass: string;
  class: string;
  /** `close` hides the popover, for a link inside it that navigates without leaving the page. */
  children: (close: () => void) => JSX.Element;
}) {
  const id = createUniqueId();
  const [open, setOpen] = createSignal(false);
  let popup!: HTMLSpanElement;
  return (
    <>
      <button type="button" popovertarget={id} class={props.triggerClass} style={{ "anchor-name": `--${id}` }}>
        {props.trigger}
      </button>
      <span
        ref={popup}
        id={id}
        popover
        role="dialog"
        aria-labelledby={`${id}-title`}
        onBeforeToggle={(e) => setOpen(e.newState === "open")}
        // oxlint-disable-next-line solid/style-prop -- CSS anchor positioning; the rule's property list predates it.
        style={{ "position-anchor": `--${id}` }}
        class={[
          "anchored whitespace-normal rounded-2xl border border-rule bg-card text-ink shadow-xl outline-none",
          "transition-[opacity,scale] duration-150 starting:open:scale-[0.98] starting:open:opacity-0 motion-reduce:transition-none",
          props.class,
        ]}
      >
        <Show when={open()}>
          <span id={`${id}-title`} class={["block", props.titleClass]}>
            {props.title}
          </span>
          {props.children(() => popup.hidePopover())}
        </Show>
      </span>
    </>
  );
}
