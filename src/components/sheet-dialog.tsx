import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";

const EXIT_MS = 360;

const isDialogOpen = (el: HTMLDialogElement) => Boolean(el.open || el.hasAttribute("open"));

/**
 * Shared native `<dialog>` sheet modal: opens on the top layer via `showModal()`, closes on Esc or
 * clicking outside on the backdrop (ignoring pointer drags that began inside), and keeps content
 * mounted during the CSS exit transition.
 */
export function SheetDialog(props: {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  /** Padding/layout classes for the inner wrapper so `<dialog>` itself keeps `p-0`. */
  contentClass?: string;
  children: (close: () => void) => JSX.Element;
}) {
  const [closing, setClosing] = createSignal(false);
  let dialog: HTMLDialogElement | undefined;
  let exitTimer: ReturnType<typeof setTimeout> | undefined;
  let pointerDownInside = false;

  const clearExit = () => {
    if (exitTimer !== undefined) {
      clearTimeout(exitTimer);
      exitTimer = undefined;
    }
  };
  onCleanup(clearExit);

  createEffect(
    () => props.open,
    (open) => {
      if (!dialog) return;
      if (open) {
        clearExit();
        if (!isDialogOpen(dialog)) dialog.showModal();
      } else if (isDialogOpen(dialog)) {
        dialog.close();
      }
    },
  );

  const close = () => {
    if (dialog && isDialogOpen(dialog)) dialog.close();
  };

  const handleClose = () => {
    clearExit();
    setClosing(true);
    exitTimer = setTimeout(() => setClosing(false), EXIT_MS);
    props.onClose();
  };

  return (
    <dialog
      ref={dialog}
      aria-label={props.ariaLabel}
      onClose={handleClose}
      onPointerDown={(e) => {
        pointerDownInside = e.target !== dialog;
      }}
      onClick={(e) => {
        const startedInside = pointerDownInside;
        pointerDownInside = false;
        if (!startedInside && e.target === dialog) {
          e.stopPropagation();
          close();
        }
      }}
      onTransitionEnd={(e) => {
        if (e.target === dialog && !props.open) {
          clearExit();
          setClosing(false);
        }
      }}
      class="kt-sheet-dialog m-auto mb-0 w-full max-w-md rounded-t-3xl border border-rule bg-card p-0 font-sans text-ink outline-none backdrop:bg-ink/40 sm:mb-auto sm:rounded-3xl"
    >
      <Show when={props.open || closing()}>
        <div class={props.contentClass ?? "p-6"}>{props.children(close)}</div>
      </Show>
    </dialog>
  );
}
