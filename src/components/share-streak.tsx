import { createEffect, createSignal, flush, For, onCleanup, onSettled, Show } from "solid-js";
import { localDateKey } from "../../lib/history/types";
import { cardVerse } from "../../lib/streak/card-verses";
import { flameFor } from "../../lib/streak/flames";
import {
  canSharePng,
  DEFAULT_SHARE_TEMPLATE,
  drawShareCard,
  isShareTemplate,
  last30Days,
  SHARE_TEMPLATES,
  SHARE_TEMPLATE_STORAGE_KEY,
  shareOrDownload,
  type ShareSize,
  type ShareTemplate,
} from "../lib/share-card";
import { ariaState } from "./aria";
import { useAuth } from "./auth-context";
import { useLocale } from "./locale-context";
import { readStorage, writeStorage } from "./preferences-context";
import { useProfile } from "./profile-context";
import { Avatar, ProfileEditor } from "./profile-editor";
import { useStreak } from "./streak-context";

type Preview = { size: ShareSize; template: ShareTemplate; blob: Blob; url: string };

/**
 * "Chia sẻ thẻ N ngày": pick post (4:5) or story (9:16), switch between card templates, see the PNG, then share or download it.
 * Sharing from the preview's own tap also keeps iOS happy: navigator.share needs a fresh user gesture.
 */
export function ShareStreak(props: { days: number }) {
  const streak = useStreak();
  const auth = useAuth();
  const me = useProfile();
  const { locale, t } = useLocale();
  const [template, setTemplate] = createSignal<ShareTemplate>(DEFAULT_SHARE_TEMPLATE);
  const [editing, setEditing] = createSignal(false);
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  const [preview, setPreview] = createSignal<Preview | null>(null);
  const filename = () => `moingaymotdoan-${props.days}-ngay.png`;
  let dialog: HTMLDialogElement | undefined;
  let drawSeq = 0;

  onSettled(() => {
    const saved = readStorage(SHARE_TEMPLATE_STORAGE_KEY);
    if (isShareTemplate(saved)) setTemplate(saved);
  });

  const draw = async (size: ShareSize, nextTemplate: ShareTemplate = template()) => {
    // Apply a toggle, template switch, or save made just before, so the card reads current state.
    flush();
    const seq = ++drawSeq;
    setBusy(true);
    setFailed(false);
    try {
      const today = localDateKey(streak.now());
      const verse = cardVerse(locale(), auth.user()?.id ?? null, today);
      const blob = await drawShareCard({
        size,
        template: nextTemplate,
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
      if (seq !== drawSeq) return;
      const old = preview();
      setPreview({ size, template: nextTemplate, blob, url: URL.createObjectURL(blob) });
      if (old) URL.revokeObjectURL(old.url);
    } catch {
      if (seq === drawSeq) setFailed(true);
    } finally {
      if (seq === drawSeq) setBusy(false);
    }
  };

  const pickTemplate = (size: ShareSize, next: ShareTemplate) => {
    setTemplate(next);
    writeStorage(SHARE_TEMPLATE_STORAGE_KEY, next === DEFAULT_SHARE_TEMPLATE ? null : next);
    void draw(size, next);
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
    drawSeq++;
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
                  "mx-auto block h-auto w-auto max-w-full rounded-2xl border border-rule transition-opacity",
                  editing() ? "max-h-[30dvh]" : "max-h-[50dvh]",
                  busy() ? "opacity-70" : "opacity-100",
                ]}
              />
              <div
                role="radiogroup"
                aria-label={t().streak.shareTemplateLabel}
                class="mt-3 flex gap-1.5 overflow-x-auto pb-1"
              >
                <For each={SHARE_TEMPLATES}>
                  {(item) => {
                    const selected = () => template() === item.id;
                    return (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={ariaState(selected())}
                        onClick={() => pickTemplate(p().size, item.id)}
                        class={[
                          "inline-flex min-h-9 flex-none cursor-pointer items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors",
                          selected()
                            ? "border-accent bg-side text-ink"
                            : "border-rule bg-card text-muted hover:border-accent/60 hover:text-ink",
                        ]}
                      >
                        <span
                          aria-hidden="true"
                          class="relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-black/15"
                          style={{ background: item.swatch[0] }}
                        >
                          <span class="h-1.5 w-1.5 rounded-full" style={{ background: item.swatch[1] }} />
                        </span>
                        <span>{t().streak.shareTemplates[item.id]}</span>
                      </button>
                    );
                  }}
                </For>
              </div>
              <div class="mt-2.5 rounded-2xl border border-rule p-3">
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
              <div class="mt-3.5 grid grid-cols-2 gap-2">
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
