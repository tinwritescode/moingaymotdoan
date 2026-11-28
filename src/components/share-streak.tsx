import { createEffect, createSignal, flush, For, onCleanup, Show } from "solid-js";
import { localDateKey } from "../../lib/history/types";
import { cardVerse } from "../../lib/streak/card-verses";
import { flameFor } from "../../lib/streak/flames";
import { canSharePng, drawShareCard, last30Days, shareOrDownload, type ShareSize } from "../lib/share-card";
import { useAuth } from "./auth-context";
import { useLocale } from "./locale-context";
import { useProfile } from "./profile-context";
import { Avatar, ProfileEditor } from "./profile-editor";
import { useStreak } from "./streak-context";

type Preview = { size: ShareSize; blob: Blob; url: string };

/**
 * "Chia sẻ thẻ N ngày": pick post (4:5) or story (9:16), see the PNG, then share or download it.
 * Sharing from the preview's own tap also keeps iOS happy: navigator.share needs a fresh user gesture.
 */
export function ShareStreak(props: { days: number }) {
  const streak = useStreak();
  const auth = useAuth();
  const me = useProfile();
  const { locale, t } = useLocale();
  const [editing, setEditing] = createSignal(false);
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  const [preview, setPreview] = createSignal<Preview | null>(null);
  const filename = () => `moingaymotdoan-${props.days}-ngay.png`;
  let dialog: HTMLDialogElement | undefined;

  const draw = async (size: ShareSize) => {
    // Apply a toggle or a save made just before, so the card reads the name and photo as they now are.
    flush();
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
          tagline: t().streak.cardTagline(props.days),
          verse: `“${verse.text}”`,
          verseRef: verse.ref,
        },
        identity: me.onCard() ? me.profile() : null,
      });
      const old = preview();
      setPreview({ size, blob, url: URL.createObjectURL(blob) });
      if (old) URL.revokeObjectURL(old.url);
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
    setEditing(false);
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
                alt={`${props.days} ${t().streak.cardTagline(props.days)}`}
                class={[
                  "mx-auto block h-auto w-auto max-w-full rounded-2xl border border-rule",
                  editing() ? "max-h-[32dvh]" : "max-h-[58dvh]",
                ]}
              />
              <div class="mt-3 rounded-2xl border border-rule p-3">
                <Show
                  when={!editing()}
                  fallback={
                    <ProfileEditor
                      onClose={() => {
                        setEditing(false);
                        void draw(p().size);
                      }}
                    />
                  }
                >
                  <Show
                    when={me.profile()}
                    fallback={
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        class="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full text-sm font-medium text-accent hover:bg-side"
                      >
                        {t().profile.add}
                      </button>
                    }
                  >
                    {(profile) => (
                      <div class="flex items-center gap-2">
                        <label class="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3">
                          <Avatar profile={profile()} class="h-10 w-10 text-lg" />
                          <span class="min-w-0 flex-1">
                            <span class="block truncate text-sm font-medium text-ink">{t().profile.showOnCard}</span>
                            <span class="block truncate text-xs text-muted">{profile().name}</span>
                          </span>
                          <input
                            type="checkbox"
                            role="switch"
                            checked={me.onCard()}
                            onChange={(e) => {
                              me.setOnCard(e.currentTarget.checked);
                              void draw(p().size);
                            }}
                            class="h-5.5 w-5.5 flex-none accent-accent"
                          />
                        </label>
                        <button
                          type="button"
                          aria-label={t().profile.editLong}
                          onClick={() => setEditing(true)}
                          class="inline-flex min-h-11 cursor-pointer items-center rounded-full px-3 text-sm font-medium text-accent hover:bg-side"
                        >
                          {t().profile.edit}
                        </button>
                      </div>
                    )}
                  </Show>
                </Show>
              </div>
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
