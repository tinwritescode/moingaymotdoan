import type { JSX } from "@solidjs/web";
import { createMemo, For, Match, Show, Switch } from "solid-js";
import { bookFromAnySlug } from "../../lib/content/books";
import { flameFor, isMilestone, nextMilestone } from "../../lib/streak/flames";
import type { StreakState } from "../../lib/streak/streak";
import { chapterHref } from "../router";
import { Flame, type FlameMode } from "./flame";
import { useLocale } from "./locale-context";
import { ReminderControls } from "./reminder-controls";
import { ShareStreak } from "./share-streak";
import { useStreak } from "./streak-context";

type NextChapter = { href: string; label: string };

/** Short psalms for a day with only a few minutes; each counts like any đoạn. */
const SHORT_READINGS = [
  { chapter: 117, verses: 2, minutes: 1 },
  { chapter: 23, verses: 6, minutes: 2 },
] as const;

const btn = "inline-flex min-h-11 items-center justify-center rounded-full px-5 font-medium transition-opacity";

/** The streak where the reader starts each day: Today, At risk (from the reminder hour), Rescue, or Done. */
export function StreakCard(props: { next: NextChapter | null }) {
  const streak = useStreak();
  const { t } = useLocale();

  const view = createMemo(() => {
    const s = streak.state();
    const mode: FlameMode = s.kind === "rescue" ? "out" : streak.atRisk() ? "dim" : s.kind === "done" ? "lit" : s.days > 0 ? "lit" : "out";
    return { s, mode, flame: flameFor(s.days) };
  });

  const rescue = createMemo(() => {
    const s = streak.state();
    return s.kind === "rescue" ? s : null;
  });

  const timeLeft = () => {
    const n = streak.now();
    const left = 24 * 60 - (n.getHours() * 60 + n.getMinutes());
    return t().streak.timeLeft(Math.floor(left / 60), left % 60);
  };

  return (
    <Show when={streak.ready()}>
      <section aria-label={t().streak.regionLabel} class="rounded-3xl border border-rule bg-card p-5 font-sans">
        <div class="flex items-center gap-4">
          <div class="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-mark/70">
            <Flame kind={view().flame.kind} mode={view().mode} class="h-14 w-14" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="flex items-baseline gap-2">
              <strong class="font-display text-4xl leading-none font-semibold text-ink">{view().s.days}</strong>
              <span class="text-sm text-muted">{t().streak.daysLabel(view().s.days)}</span>
            </p>
            <Show when={view().s.record > 0}>
              <p class="mt-1 text-xs text-muted">{t().streak.record(view().s.record)}</p>
            </Show>
          </div>
        </div>

        <WeekStrip />

        <Switch>
          <Match when={rescue()}>{(s) => <Rescue state={s()} next={props.next} />}</Match>
          <Match when={view().s.kind === "done"}>
            <Done days={view().s.days} />
          </Match>
          <Match when={streak.atRisk()}>
            <div class="mt-4 space-y-3">
              <p class="text-[15px] font-medium text-ink">{t().streak.atRiskTitle(view().s.days)}</p>
              <p class="font-display text-2xl font-semibold text-thap">{timeLeft()}</p>
              <NextLink next={props.next} />
              <ShortReadings />
            </div>
          </Match>
          <Match when={true}>
            <div class="mt-4 space-y-3">
              <p class="text-[15px] font-medium text-ink">
                {view().s.days > 0 ? t().streak.todayTitle : t().streak.startTitle}
              </p>
              <p class="text-sm text-muted">
                {view().s.days > 0 ? t().streak.todayBody(view().s.days) : t().streak.startBody}
              </p>
              <NextLink next={props.next} />
            </div>
          </Match>
        </Switch>

        <ReminderControls />
      </section>
    </Show>
  );
}

function WeekStrip() {
  const streak = useStreak();
  const { t } = useLocale();
  return (
    <ol class="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-muted">
      <For each={streak.week()}>
        {(d, i) => (
          <li class="flex flex-col items-center gap-1" title={t().streak.marks[d.mark]}>
            <span aria-hidden="true">{t().streak.weekdays[i()]}</span>
            <span
              aria-label={`${t().streak.weekdays[i()]}: ${t().streak.marks[d.mark]}`}
              class={[
                "block h-3.5 w-3.5 rounded-full",
                d.mark === "read" && "bg-accent",
                (d.mark === "rest" || d.mark === "rekindled") && "bg-accent/45",
                d.mark === "missed" && "bg-rule",
                d.mark === "today" && "border-2 border-dashed border-accent",
                d.mark === "future" && "border border-rule",
              ]}
            />
          </li>
        )}
      </For>
    </ol>
  );
}

function NextLink(props: { next: NextChapter | null }): JSX.Element {
  const { t } = useLocale();
  return (
    <Show when={props.next}>
      {(n) => (
        <a href={n().href} class={[btn, "w-full bg-accent text-paper hover:opacity-90"]}>
          {t().streak.readNext(n().label)}
        </a>
      )}
    </Show>
  );
}

function ShortReadings() {
  const { locale, t } = useLocale();
  const psalms = () => bookFromAnySlug("thi-thien", locale());
  return (
    <Show when={psalms()}>
      {(book) => (
        <div class="rounded-2xl border border-accent/60 p-4">
          <p class="text-xs font-semibold tracking-wide text-accent uppercase">{t().streak.shortTitle}</p>
          <p class="mt-0.5 text-sm text-ink">{t().streak.shortBody}</p>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <For each={SHORT_READINGS}>
              {(r) => (
                <a
                  href={chapterHref({ slug: book().slug, number: r.chapter, locale: locale() })}
                  class="flex min-h-11 flex-col rounded-xl bg-side px-3 py-2 text-ink transition-colors hover:bg-accent hover:text-paper"
                >
                  <span class="font-display text-base font-semibold">{`${book().name} ${r.chapter}`}</span>
                  <span class="text-xs opacity-80">{t().streak.shortMeta(r.verses, r.minutes)}</span>
                </a>
              )}
            </For>
          </div>
        </div>
      )}
    </Show>
  );
}

type RescueState = Extract<StreakState, { kind: "rescue" }>;

function Rescue(props: { state: RescueState; next: NextChapter | null }) {
  const streak = useStreak();
  const { t } = useLocale();
  return (
    <div class="mt-4 space-y-3">
      <div>
        <p class="font-display text-xl font-semibold text-ink">{t().streak.rescueTitle}</p>
        <p class="mt-1 text-sm text-muted">{t().streak.rescueBody(props.state.days)}</p>
      </div>
      <div class="space-y-3 rounded-2xl border-2 border-accent p-4">
        <p class="flex items-center justify-between gap-2">
          <span class="text-base font-semibold text-ink">{t().streak.rekindleTitle}</span>
          <span class="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-paper">{t().streak.recommended}</span>
        </p>
        <p class="text-sm text-muted">{t().streak.rekindleBody(props.state.needed, props.state.days)}</p>
        <NextLink next={props.next} />
        <ShortReadings />
      </div>
      <Show when={props.state.restAvailable}>
        <button
          type="button"
          onClick={() => streak.rest()}
          class="block w-full cursor-pointer rounded-2xl border border-rule p-4 text-left transition-colors hover:border-accent"
        >
          <span class="block text-base font-semibold text-ink">{t().streak.restTitle}</span>
          <span class="mt-1 block text-sm text-muted">{t().streak.restBody(props.state.days)}</span>
        </button>
      </Show>
      <p class="text-center text-xs text-muted">{t().streak.recordKept(props.state.record)}</p>
      <button
        type="button"
        onClick={() => streak.restart()}
        class="mx-auto flex min-h-11 cursor-pointer items-center text-sm text-muted underline underline-offset-4 hover:text-ink"
      >
        {t().streak.restartBtn}
      </button>
    </div>
  );
}

/** Done today: the next flame's progress and the share button. Also the body of the done sheet. */
export function Done(props: { days: number }) {
  const { locale, t } = useLocale();
  const next = () => nextMilestone(props.days);
  return (
    <div class="mt-4 space-y-3">
      <p class="text-[15px] font-medium text-ink">{t().streak.doneTitle}</p>
      <Show when={isMilestone(props.days)}>
        <p class="inline-block rounded-full bg-accent px-3 py-1 text-sm font-medium text-paper">
          {t().streak.milestoneBadge(flameFor(props.days).name[locale()])}
        </p>
      </Show>
      <Show when={next()} fallback={<p class="text-sm text-muted">{t().streak.allFlames}</p>}>
        {(n) => (
          <div class="flex items-center gap-3 rounded-2xl border border-rule p-3">
            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rule/70">
              <Flame kind={n().flame.kind} mode="out" class="h-9 w-9" />
            </div>
            <div class="min-w-0 flex-1 space-y-1.5">
              <p class="flex justify-between gap-2 text-sm">
                <span class="font-medium text-ink">{t().streak.nextMilestone(n().flame.at, n().flame.name[locale()])}</span>
                <span class="text-muted">{`${props.days} / ${n().flame.at}`}</span>
              </p>
              <div class="h-2 overflow-hidden rounded-full bg-rule">
                <div
                  class="h-2 origin-left animate-bar-grow rounded-full bg-accent transition-[width] duration-500 ease-[var(--ease-quiet)] motion-reduce:animate-none motion-reduce:transition-none"
                  style={{ width: `${Math.round((props.days / n().flame.at) * 100)}%` }}
                />
              </div>
              <p class="text-xs text-muted">{t().streak.daysLeft(n().left)}</p>
            </div>
          </div>
        )}
      </Show>
      <ShareStreak days={props.days} />
    </div>
  );
}
