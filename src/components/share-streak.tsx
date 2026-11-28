import { createSignal, For } from "solid-js";
import { localDateKey } from "../../lib/history/types";
import { flameFor } from "../../lib/streak/flames";
import { drawShareCard, last30Days, shareOrDownload, type ShareSize } from "../lib/share-card";
import { useLocale } from "./locale-context";
import { useStreak } from "./streak-context";

/** "Chia sẻ thẻ N ngày": pick post (4:5) or story (9:16); shares the PNG or downloads it. */
export function ShareStreak(props: { days: number }) {
  const streak = useStreak();
  const { t } = useLocale();
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);

  const share = async (size: ShareSize) => {
    setBusy(true);
    setFailed(false);
    try {
      const today = localDateKey(streak.now());
      const blob = await drawShareCard({
        size,
        days: props.days,
        flame: flameFor(props.days).kind,
        last30: last30Days(streak.readDays(), today),
        date: today.split("-").reverse().join("."),
        text: {
          site: t().seo.siteName.split(" — ")[0],
          tagline: t().streak.cardTagline,
          verse: t().streak.cardVerse,
          verseRef: t().streak.cardVerseRef,
        },
      });
      await shareOrDownload(blob, `moingaymotdoan-${props.days}-ngay.png`);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="space-y-2">
      <p class="text-sm font-medium text-ink">{t().streak.share(props.days)}</p>
      <div class="grid grid-cols-2 gap-2">
        <For each={["post", "story"] as const}>
          {(size) => (
            <button
              type="button"
              disabled={busy()}
              onClick={() => void share(size)}
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
    </div>
  );
}
