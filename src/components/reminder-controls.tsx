import { createEffect, createMemo, createSignal, For, onSettled, Show } from "solid-js";
import { localDateKey } from "../../lib/history/types";
import { reportFor } from "../../lib/streak/reminders";
import { isStandalone, platformOf } from "../lib/install";
import {
  loadSubscription,
  pushSupported,
  putSubscription,
  subscribe,
  subscription,
  unsubscribe,
  type SubscriptionReport,
} from "../lib/reminders";
import { installHref } from "../router";
import { useLocale } from "./locale-context";
import { useStreak } from "./streak-context";

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

/** The report this device sends with its subscription; null until the streak is known. */
function useReport() {
  const streak = useStreak();
  const { locale } = useLocale();
  return createMemo((): SubscriptionReport | null => {
    if (!streak.ready()) return null;
    return {
      ...reportFor(streak.state(), localDateKey(streak.now())),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      remindHour: streak.remindHour(),
      locale: locale(),
    };
  });
}

/** Keeps the server's copy of this device's streak current, on every page, so reminders skip a day already read. */
export function ReminderSync() {
  const report = useReport();
  onSettled(() => {
    void loadSubscription();
  });
  createEffect(
    () => {
      const sub = subscription();
      const r = report();
      return sub && r ? { sub, r } : null;
    },
    (v) => {
      if (v) void putSubscription(v.sub, v.r);
    },
  );
  return null;
}

type Status = "idle" | "busy" | "blocked" | "failed";

/** Opt-in to the daily reminder, its hour, and turning it off. */
export function ReminderControls() {
  const streak = useStreak();
  const report = useReport();
  const { locale, t } = useLocale();
  const [mounted, setMounted] = createSignal(false);
  const [status, setStatus] = createSignal<Status>("idle");
  onSettled(() => {
    setMounted(true);
    if (pushSupported() && Notification.permission === "denied") setStatus("blocked");
  });

  const iosInBrowser = () => !pushSupported() && platformOf(navigator) === "ios" && !isStandalone();

  const turnOn = async () => {
    const r = report();
    if (!r) return;
    setStatus("busy");
    const result = await subscribe(r);
    setStatus(result === "on" ? "idle" : result);
  };

  return (
    <Show when={mounted()}>
      <div class="mt-4 border-t border-rule pt-4 text-sm">
        <Show
          when={pushSupported()}
          fallback={
            <Show when={iosInBrowser()}>
              <a href={installHref(locale())} class="text-muted underline underline-offset-4 hover:text-ink">
                {t().streak.remindInstall}
              </a>
            </Show>
          }
        >
          <Show
            when={subscription()}
            fallback={
              <button
                type="button"
                disabled={status() === "busy" || status() === "blocked"}
                onClick={() => void turnOn()}
                class="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-rule px-4 text-ink transition-colors hover:border-accent disabled:cursor-default disabled:opacity-60"
              >
                {t().streak.remindMe(streak.remindHour())}
              </button>
            }
          >
            <div class="flex flex-wrap items-center gap-3">
              <label class="flex items-center gap-2 text-ink">
                <span>{t().streak.remindHourLabel}</span>
                <select
                  class="min-h-11 rounded-lg border border-rule bg-paper px-2 text-ink"
                  value={streak.remindHour()}
                  onChange={(e) => streak.setRemindHour(Number(e.currentTarget.value))}
                >
                  <For each={HOURS}>{(h) => <option value={h}>{`${h}:00`}</option>}</For>
                </select>
              </label>
              <button
                type="button"
                onClick={() => void unsubscribe()}
                class="min-h-11 cursor-pointer text-muted underline underline-offset-4 hover:text-ink"
              >
                {t().streak.remindOff}
              </button>
            </div>
          </Show>
          <p aria-live="polite" class="mt-2 text-xs text-muted">
            <Show when={status() === "blocked"}>{t().streak.remindBlocked}</Show>
            <Show when={status() === "failed"}>{t().streak.remindFailed}</Show>
          </p>
        </Show>
      </div>
    </Show>
  );
}
