import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import { flameFor } from "../../lib/streak/flames";
import { Flame } from "./flame";
import { useLocale } from "./locale-context";
import { Done } from "./streak-card";
import { useStreak } from "./streak-context";

const EXIT_MS = 360;

/** Opens over the chapter on the day's first completed đoạn: the flame igniting, the streak, the next flame, share. */
export function DoneSheet(props: { open: boolean; onClose: () => void }) {
  const streak = useStreak();
  const { t } = useLocale();
  const days = () => streak.state().days;
  const [closing, setClosing] = createSignal(false);
  let dialog: HTMLDialogElement | undefined;
  let exitTimer: ReturnType<typeof setTimeout> | undefined;

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
        if (!dialog.open) dialog.showModal();
      } else if (dialog.open) {
        dialog.close();
      }
    },
  );

  const handleClose = () => {
    clearExit();
    setClosing(true);
    exitTimer = setTimeout(() => setClosing(false), EXIT_MS);
    props.onClose();
  };

  return (
    <dialog
      ref={dialog}
      aria-label={t().streak.sheetLabel}
      onClose={handleClose}
      onTransitionEnd={(e) => {
        if (e.target === dialog && !props.open) {
          clearExit();
          setClosing(false);
        }
      }}
      class="kt-sheet-dialog m-auto mb-0 w-full max-w-md rounded-t-3xl border border-rule bg-card p-6 font-sans text-ink backdrop:bg-ink/40 sm:mb-auto sm:rounded-3xl"
    >
      <Show when={props.open || closing()}>
        <div class="flex flex-col items-center text-center">
          <Flame kind={flameFor(days()).kind} mode="ignite" class="h-24 w-24" />
          <p class="mt-2 flex items-baseline gap-2">
            <strong class="font-display text-5xl leading-none font-semibold">{days()}</strong>
            <span class="text-sm text-muted">{t().streak.daysLabel(days())}</span>
          </p>
          <p class="mt-2 text-sm text-muted">{t().streak.doneBody(days())}</p>
        </div>
        <Done days={days()} />
        <button
          type="button"
          onClick={() => dialog?.close()}
          class="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-accent px-5 font-medium text-paper transition-opacity hover:opacity-90"
        >
          {t().streak.sheetClose}
        </button>
      </Show>
    </dialog>
  );
}
