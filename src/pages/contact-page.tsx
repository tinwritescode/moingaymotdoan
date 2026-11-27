import { createMemo, createSignal, For, Match, onCleanup, Show, Switch } from "solid-js";
import {
  communityContactChannels,
  DIRECT_CONTACT_CHANNELS,
  type ContactChannel,
  type ContactIcon,
} from "../../lib/i18n/contact";
import { copyText } from "../components/copy-verse-button";
import { FloatingDock } from "../components/floating-dock";
import { useLocale } from "../components/locale-context";
import { Seo } from "../components/seo";
import { SiteHeader } from "../components/site-header";
import { contactHref } from "../router";

function ContactChannelIcon(props: { kind: ContactIcon }) {
  return (
    <Switch>
      <Match when={props.kind === "email"}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[18px] w-[18px]"
        >
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </Match>
      <Match when={props.kind === "zalo"}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[18px] w-[18px]"
        >
          <path d="M5 18.5 3.5 21l3.7-.9A8.5 8.5 0 1 0 5 18.5Z" />
          <path d="M9 9.5h6l-6 5h6" />
        </svg>
      </Match>
      <Match when={props.kind === "facebook"}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[18px] w-[18px]"
        >
          <path d="M15 4h-2.5A3.5 3.5 0 0 0 9 7.5V10H7v3h2v7h3v-7h2.6l.4-3H12V7.8c0-.5.3-.8.8-.8H15V4Z" />
        </svg>
      </Match>
      <Match when={props.kind === "instagram"}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[18px] w-[18px]"
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="3.75" />
          <circle cx="17.25" cy="6.75" r="0.6" fill="currentColor" />
        </svg>
      </Match>
      <Match when={props.kind === "github"}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[18px] w-[18px]"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </Match>
      <Match when={props.kind === "guide"}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="h-[18px] w-[18px]"
        >
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
          <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v17h5.5a2.5 2.5 0 0 1 2.5 2V5.5Z" />
        </svg>
      </Match>
    </Switch>
  );
}

function CopyContactButton(props: { value: string; label: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (timer !== undefined) clearTimeout(timer);
  });

  const handleCopy = async () => {
    const ok = await copyText(props.value);
    if (!ok) return;
    setCopied(true);
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label={t().contact.copyAriaLabel(props.label)}
      class={[
        "inline-flex min-h-9 shrink-0 cursor-pointer items-center rounded-full px-3.5 font-sans text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        copied() ? "bg-accent text-paper" : "bg-side text-accent hover:bg-accent hover:text-paper",
      ]}
    >
      <span aria-live="polite">{copied() ? t().contact.copied : t().contact.copy}</span>
    </button>
  );
}

function ContactChannelItem(props: { channel: ContactChannel }) {
  const { t } = useLocale();
  const copy = createMemo(() => t().contact.channels[props.channel.id]);

  return (
    <li
      class={[
        "flex items-center gap-2 rounded-2xl border border-rule bg-card transition-colors hover:border-accent",
        props.channel.copyValue && "pr-3",
      ]}
    >
      <a
        href={props.channel.href}
        target={props.channel.external ? "_blank" : undefined}
        rel={props.channel.external ? "noopener noreferrer" : undefined}
        class="group flex min-h-16 min-w-0 flex-1 items-center gap-3.5 rounded-2xl px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
      >
        <span
          aria-hidden="true"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-side text-accent transition-colors group-hover:bg-accent group-hover:text-paper"
        >
          <ContactChannelIcon kind={props.channel.icon} />
        </span>
        <span class="flex min-w-0 flex-1 flex-col gap-0.5 font-sans">
          <span class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span class="text-[15px] font-medium text-ink transition-colors group-hover:text-accent">
              {copy().label}
            </span>
            <Show when={props.channel.handle}>
              {(handle) => <span class="break-all text-xs font-medium text-accent">{handle()}</span>}
            </Show>
          </span>
          <span class="text-xs leading-relaxed text-muted">{copy().description}</span>
        </span>
        <Show when={!props.channel.copyValue}>
          <span aria-hidden="true" class="shrink-0 font-sans text-sm text-muted transition-colors group-hover:text-accent">
            ↗
          </span>
        </Show>
      </a>
      <Show when={props.channel.copyValue}>
        {(value) => <CopyContactButton value={value()} label={copy().label} />}
      </Show>
    </li>
  );
}

/** Shared contact page for Vietnamese (/lien-he) and English (/en/contact). */
export function ContactPage() {
  const { locale, t } = useLocale();
  const communityChannels = createMemo(() => communityContactChannels(t().footer.contributeLanguageUrl));

  return (
    <>
      <Seo title={t().seo.contactTitle} description={t().seo.contactDescription} path={contactHref(locale())} />
      <SiteHeader />
      <main class="mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
        <p class="font-sans text-xs font-medium text-accent">{t().contact.kicker}</p>
        <h1 class="mt-1 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
          {t().contact.heading}
        </h1>
        <p class="mt-2.5 text-base leading-relaxed text-muted">{t().contact.intro}</p>

        <section aria-labelledby="direct-contact" class="mt-8">
          <h2 id="direct-contact" class="font-display text-lg font-normal text-ink">
            {t().contact.directHeading}
          </h2>
          <ul class="mt-3 space-y-2.5">
            <For each={DIRECT_CONTACT_CHANNELS}>{(channel) => <ContactChannelItem channel={channel} />}</For>
          </ul>
        </section>

        <section aria-labelledby="community-contact" class="mt-8">
          <h2 id="community-contact" class="font-display text-lg font-normal text-ink">
            {t().contact.communityHeading}
          </h2>
          <ul class="mt-3 space-y-2.5">
            <For each={communityChannels()}>{(channel) => <ContactChannelItem channel={channel} />}</For>
          </ul>
        </section>

        <section aria-labelledby="contact-note" class="mt-8 rounded-3xl bg-side p-5 sm:p-6">
          <h2 id="contact-note" class="font-display text-base font-medium text-accent">
            {t().contact.noteHeading}
          </h2>
          <p class="mt-2.5 text-sm leading-relaxed text-ink/90">{t().contact.noteBody}</p>
          <p class="mt-3 font-sans text-xs leading-relaxed text-muted">{t().contact.noteFootnote}</p>
        </section>
      </main>
      <FloatingDock />
    </>
  );
}
