import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { localDateKey } from "../../lib/history/types";
import { cardVerse } from "../../lib/streak/card-verses";
import { flameFor } from "../../lib/streak/flames";
import { canSharePng, drawShareCard, last30Days, shareOrDownload, type ShareSize } from "../lib/share-card";
import { useAuth } from "./auth-context";
import { useLocale } from "./locale-context";
import { useStreak } from "./streak-context";

type Preview = { size: ShareSize; blob: Blob; url: string };

/**
 * "Chia sẻ thẻ N ngày": pick post (4:5) or story (9:16), see the PNG, then share or download it.
 * Sharing from the preview's own tap also keeps iOS happy: navigator.share needs a fresh user gesture.
 */
export function ShareStreak(props: { days: number }) {
  const streak = useStreak();
  const auth = useAuth();
  const { locale, t } = useLocale();
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  const [preview, setPreview] = createSignal<Preview | null>(null);
  const filename = () => `moingaymotdoan-${props.days}-ngay.png`;
  let dialog: HTMLDialogElement | undefined;

  const draw = async (size: ShareSize) => {
    setBusy(true);
    setFailed(false);
    try {
      const today = localDateKey(streak.now());
      const verse = cardVerse(locale(), auth.user()?.id ?? null, today);
      const blob = await drawShareCard({
        size,
        days: props.days,
        flame: flameFor(props.days).kind,
        last30: last30Days(streak.readDays(), today),
        date: today.split("-").reverse().join("."),
        text: {
          site: t().seo.siteName.split(" — ")[0],
          tagline: t().streak.cardTagline,
          verse: `“${verse.text}”`,
          verseRef: verse.ref,
        },
      });
      setPreview({ size, blob, url: URL.createObjectURL(blob) });
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const send = async (p: Preview) => {
    try {
      if ((await shareOrDownload(p.blob, filename())) !== "cancelled") dialog?.close();
    } catch {
      setFailed(true);
      dialog?.close();
    }
  };

  const forget = () => {
    const p = preview();
    if (p) URL.revokeObjectURL(p.url);
    setPreview(null);
  };
  onCleanup(forget);

  createEffect(
    () => preview() !== null,
    (open) => {
      if (open && dialog && !dialog.open) dialog.showModal();
    },
  );

  return (
    <div class="space-y-2">
      <p class="text-sm font-medium text-ink">{t().streak.share(props.days)}</p>
      <div class="grid grid-cols-2 gap-2">
        <For each={["post", "story"] as const}>
          {(size) => (
            <button
              type="button"
              disabled={busy()}
              onClick={() => void draw(size)}
              class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
              {size === "post" ? t().streak.sharePost : t().streak.shareStory}
            </button>
          )}
        </For>
      </div>
      <p aria-live="polite" class="text-xs text-thap">
        {failed() ? t().streak.shareFailed : ""}
      </p>
      <dialog
        ref={dialog}
        aria-label={t().streak.sharePreview}
        onClose={forget}
        class="m-auto mb-0 w-full max-w-md rounded-t-3xl border border-rule bg-card p-4 font-sans text-ink backdrop:bg-ink/40 sm:mb-auto sm:rounded-3xl"
      >
        <Show when={preview()}>
          {(p) => (
            <>
              <img
                src={p().url}
                width={1080}
                height={p().size === "post" ? 1350 : 1920}
                alt={`${props.days} ${t().streak.cardTagline}`}
                class="mx-auto block h-auto max-h-[65dvh] w-auto max-w-full rounded-2xl border border-rule"
              />
              <div class="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => dialog?.close()}
                  class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-rule px-4 text-sm font-medium text-ink hover:border-accent"
                >
                  {t().streak.shareClose}
                </button>
                <button
                  type="button"
                  onClick={() => void send(p())}
                  class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-paper hover:opacity-90"
                >
                  {canSharePng(p().blob, filename()) ? t().streak.shareSend : t().streak.shareSave}
                </button>
              </div>
            </>
          )}
        </Show>
      </dialog>
    </div>
  );
}
