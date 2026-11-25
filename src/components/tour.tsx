import type { JSX } from "@solidjs/web";
import { createSignal, For, onSettled, Show } from "solid-js";
import { cardPlacement, TOUR_STEPS, TOUR_STORAGE_KEY, tourHref, type TourStepId } from "../lib/tour";
import { ScalePicker } from "./display-controls";
import { useHistory } from "./history-context";
import { useLocale } from "./locale-context";
import { readStorage, writeStorage } from "./preferences-context";

const markTourSeen = () => writeStorage(TOUR_STORAGE_KEY, "done");

const SCRIM = "rgb(17 19 18 / 0.55)";

function WelcomePoint(props: { icon: JSX.Element; title: string; body: string }) {
  return (
    <li class="flex items-start gap-3">
      <span
        aria-hidden="true"
        class="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-side text-[11px] font-medium text-accent"
      >
        {props.icon}
      </span>
      <span>
        <strong class="font-medium text-ink">{props.title}</strong> <span class="text-muted">{props.body}</span>
      </span>
    </li>
  );
}

/** First visit on the home page: a short welcome that leads into the guided first chapter. */
export function WelcomeSheet(props: { startHref: string }) {
  const { t } = useLocale();
  const { hydrated, stats } = useHistory();
  // null until the browser has read storage, so prerendered HTML never holds the sheet.
  const [seen, setSeen] = createSignal<boolean | null>(null);
  const open = () => seen() === false && hydrated() && stats().chaptersRead === 0;
  const dismiss = () => {
    markTourSeen();
    setSeen(true);
  };

  onSettled(() => {
    setSeen(readStorage(TOUR_STORAGE_KEY) !== null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open()) dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <Show when={open()}>
      <div aria-hidden="true" class="fixed inset-0 z-40" style={{ background: SCRIM }} onClick={dismiss} />
      <section
        role="dialog"
        aria-labelledby="kt-welcome-title"
        class="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[34rem] animate-reveal flex-col gap-4 rounded-t-[28px] bg-card px-6 pt-3 pb-7 font-sans shadow-2xl motion-reduce:animate-none"
      >
        <span aria-hidden="true" class="h-1 w-10 self-center rounded-full bg-rule" />
        <div>
          <p class="text-xs font-medium text-accent">{t().tour.welcomeKicker}</p>
          <h2 id="kt-welcome-title" class="mt-1 font-display text-[1.6rem] leading-tight font-light tracking-tight text-ink">
            {t().tour.welcomeTitle}
          </h2>
        </div>
        <ul class="space-y-3.5 text-sm leading-relaxed">
          <WelcomePoint
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="h-[17px] w-[17px]">
                <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
                <path d="M5 17a3 3 0 0 1 3-3h11" />
              </svg>
            }
            {...t().tour.welcomePoints[0]}
          />
          <WelcomePoint icon="1:3" {...t().tour.welcomePoints[1]} />
          <WelcomePoint
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" class="h-[17px] w-[17px]">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l3 2" />
              </svg>
            }
            {...t().tour.welcomePoints[2]}
          />
        </ul>
        <div class="mt-1 flex flex-col gap-2 text-sm">
          <a
            href={tourHref(props.startHref)}
            onClick={markTourSeen}
            class="flex min-h-12 items-center justify-center rounded-full bg-accent px-5 font-medium text-paper transition-opacity hover:opacity-90"
          >
            {t().tour.welcomeStart}
          </a>
          <button
            type="button"
            onClick={dismiss}
            class="flex min-h-11 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
          >
            {t().tour.welcomeLater}
          </button>
        </div>
      </section>
    </Show>
  );
}

type Tour = { steps: { id: TourStepId; el: Element }[]; index: number };

/** On a chapter opened with `?tour`: lights up each part of the page in turn, with a card that explains it. */
export function ChapterTour() {
  const { t } = useLocale();
  const [tour, setTour] = createSignal<Tour | null>(null);
  const [rect, setRect] = createSignal<DOMRect | null>(null);
  let card: HTMLElement | undefined;

  const show = (next: Tour) => {
    const el = next.steps[next.index].el;
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    setTour(next);
    setRect(el.getBoundingClientRect());
    card?.focus();
  };

  const go = (delta: number) => {
    const tr = tour();
    if (tr) show({ ...tr, index: tr.index + delta });
  };

  const end = () => {
    markTourSeen();
    setTour(null);
    // Drop ?tour so a reload does not start it again.
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.hash);
  };

  onSettled(() => {
    if (!new URLSearchParams(window.location.search).has("tour")) return;
    const steps = TOUR_STEPS.flatMap((s) => {
      const el = document.querySelector(s.selector);
      return el ? [{ id: s.id, el }] : [];
    });
    if (steps.length === 0) return;
    show({ steps, index: 0 });

    const measure = () => {
      const tr = tour();
      if (tr) setRect(tr.steps[tr.index].el.getBoundingClientRect());
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && tour()) end();
    };
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", onKey);
    };
  });

  const cardStyle = (r: DOMRect) => {
    const at = cardPlacement(r, window.innerHeight);
    return "top" in at ? { top: `${at.top}px` } : { bottom: `${at.bottom}px` };
  };

  return (
    <Show when={tour()}>
      {(tr) => (
        <Show when={rect()}>
          {(r) => (
            <>
              <div
                aria-hidden="true"
                class="pointer-events-none fixed z-40 rounded-2xl ring-2 ring-accent"
                style={{
                  top: `${r().top - 6}px`,
                  left: `${r().left - 6}px`,
                  width: `${r().width + 12}px`,
                  height: `${r().height + 12}px`,
                  "box-shadow": `0 0 0 9999px ${SCRIM}`,
                }}
              />
              <section
                ref={(el) => (card = el)}
                role="dialog"
                aria-labelledby="kt-tour-title"
                tabindex="-1"
                class="fixed inset-x-4 z-50 mx-auto flex max-w-[26rem] flex-col gap-2.5 rounded-[20px] bg-card px-[18px] pt-[18px] pb-3.5 font-sans shadow-2xl outline-none"
                style={cardStyle(r())}
              >
                <p class="text-[11px] font-medium text-accent">
                  {t().tour.stepOf(tr().index + 1, tr().steps.length)}
                </p>
                <h2 id="kt-tour-title" class="text-lg leading-snug font-medium text-ink">
                  {t().tour.steps[tr().steps[tr().index].id].title}
                </h2>
                <p class="text-sm leading-relaxed text-muted">{t().tour.steps[tr().steps[tr().index].id].body}</p>
                <Show when={tr().steps[tr().index].id === "display"}>
                  <ScalePicker />
                </Show>
                <Show when={tr().steps[tr().index].id === "next"}>
                  <p class="text-xs text-muted">{t().tour.arrowKeysHint}</p>
                </Show>
                <div class="mt-1 flex items-center justify-between gap-3 text-sm">
                  <Show
                    when={tr().index > 0}
                    fallback={
                      <button type="button" onClick={end} class="min-h-11 cursor-pointer text-[13px] text-muted hover:text-ink">
                        {t().tour.skip}
                      </button>
                    }
                  >
                    <button type="button" onClick={() => go(-1)} class="min-h-11 cursor-pointer text-[13px] text-muted hover:text-ink">
                      {t().tour.back}
                    </button>
                  </Show>
                  <span class="flex items-center gap-3">
                    <span aria-hidden="true" class="flex gap-[5px]">
                      <For each={tr().steps}>
                        {(_, i) => (
                          <i
                            class={[
                              "h-1.5 rounded-full",
                              i() === tr().index ? "w-4 bg-accent" : "w-1.5",
                              i() < tr().index ? "bg-accent" : i() > tr().index ? "bg-rule" : "",
                            ]}
                          />
                        )}
                      </For>
                    </span>
                    <Show
                      when={tr().index < tr().steps.length - 1}
                      fallback={
                        <button
                          type="button"
                          onClick={end}
                          class="min-h-11 cursor-pointer rounded-full bg-accent px-[18px] font-medium text-paper hover:opacity-90"
                        >
                          {t().tour.done}
                        </button>
                      }
                    >
                      <button
                        type="button"
                        onClick={() => go(1)}
                        class="min-h-11 cursor-pointer rounded-full bg-side px-[18px] font-medium text-accent hover:bg-accent hover:text-paper"
                      >
                        {t().tour.next}
                      </button>
                    </Show>
                  </span>
                </div>
              </section>
            </>
          )}
        </Show>
      )}
    </Show>
  );
}
