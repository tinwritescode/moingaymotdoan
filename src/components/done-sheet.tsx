import { flameFor } from "../../lib/streak/flames";
import { Flame } from "./flame";
import { useLocale } from "./locale-context";
import { SheetDialog } from "./sheet-dialog";
import { Done } from "./streak-card";
import { useStreak } from "./streak-context";

/** Opens over the chapter on the day's first completed đoạn: the flame igniting, the streak, the next flame, share. */
export function DoneSheet(props: { open: boolean; onClose: () => void }) {
  const streak = useStreak();
  const { t } = useLocale();
  const days = () => streak.state().days;

  return (
    <SheetDialog open={props.open} onClose={props.onClose} ariaLabel={t().streak.sheetLabel} contentClass="p-6">
      {(close) => (
        <>
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
            onClick={close}
            class="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-accent px-5 font-medium text-paper transition-opacity hover:opacity-90"
          >
            {t().streak.sheetClose}
          </button>
        </>
      )}
    </SheetDialog>
  );
}
