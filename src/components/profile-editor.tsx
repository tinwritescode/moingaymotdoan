import { createSignal, Show } from "solid-js";
import { initialOf, MAX_NAME_LENGTH, parseProfile, type ReaderProfile } from "../../lib/profile/profile";
import { avatarFromUrl, squareJpeg } from "../lib/avatar";
import { useLocale } from "./locale-context";
import { useProfile } from "./profile-context";

/** The reader's photo, or their initial on a green disc; size and type size come from `class`. */
export function Avatar(props: { profile: ReaderProfile; class: string }) {
  return (
    <Show
      when={props.profile.avatar}
      fallback={
        <span
          aria-hidden="true"
          class={["grid shrink-0 place-items-center rounded-full bg-side font-display font-medium text-accent", props.class]}
        >
          {initialOf(props.profile.name)}
        </span>
      }
    >
      {(src) => <img src={src()} alt="" class={["shrink-0 rounded-full border border-rule object-cover", props.class]} />}
    </Show>
  );
}

const pill =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium disabled:cursor-wait disabled:opacity-60";

/** Name and photo for the share card, seeded from the current profile; `onClose` runs on cancel or after a save. */
export function ProfileEditor(props: { onClose: () => void }) {
  const { profile, save } = useProfile();
  const { t } = useLocale();
  const [name, setName] = createSignal(() => profile()?.name ?? "");
  const [avatar, setAvatar] = createSignal(() => profile()?.avatar ?? null);
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const pick = async (file: File) => {
    setError(null);
    const url = await squareJpeg(file);
    if (url) setAvatar(url);
    else setError(t().profile.photoFailed);
  };

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const current = avatar();
      // The account's own photo lives on another server; keep a copy, or none if that server will not share it.
      const stored = current && !current.startsWith("data:") ? await avatarFromUrl(current) : current;
      const next = parseProfile({ name: name(), avatar: stored });
      if (!next) throw new Error("Invalid profile");
      await save(next);
      props.onClose();
    } catch {
      setError(t().profile.saveFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} class="space-y-3 font-sans">
      <div class="flex items-center gap-3">
        <Avatar profile={{ name: name(), avatar: avatar() }} class="h-14 w-14 text-2xl" />
        <div class="flex flex-wrap gap-2">
          <label class={[pill, "border border-rule text-ink focus-within:border-accent hover:border-accent"]}>
            {avatar() ? t().profile.changePhoto : t().profile.addPhoto}
            <input
              type="file"
              accept="image/*"
              class="sr-only"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = "";
                if (file) void pick(file);
              }}
            />
          </label>
          <Show when={avatar()}>
            <button type="button" onClick={() => setAvatar(null)} class={[pill, "text-muted hover:text-ink"]}>
              {t().profile.removePhoto}
            </button>
          </Show>
        </div>
      </div>
      <label class="block text-sm text-muted">
        {t().profile.nameLabel}
        <input
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          maxlength={MAX_NAME_LENGTH}
          required
          autocomplete="name"
          class="mt-1 block min-h-11 w-full rounded-xl border border-rule bg-paper px-3 text-base text-ink focus:border-accent focus:outline-none"
        />
      </label>
      <p aria-live="polite" class="text-xs text-thap">
        {error() ?? ""}
      </p>
      <div class="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => props.onClose()} class={[pill, "border border-rule text-ink hover:border-accent"]}>
          {t().profile.cancel}
        </button>
        <button type="submit" disabled={busy() || name().trim() === ""} class={[pill, "bg-accent text-paper hover:opacity-90"]}>
          {t().profile.save}
        </button>
      </div>
    </form>
  );
}
