import { createSignal, onCleanup } from "solid-js";
import { copyText } from "./copy-verse-button";
import { useLocale } from "./locale-context";

/** Shares the current page via Web Share API, falling back to copying the URL. */
export function ShareButton(props: { title: string; text: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (timer !== undefined) clearTimeout(timer);
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: props.title, text: props.text, url });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    if (!(await copyText(url))) return;
    setCopied(true);
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      class="inline-flex min-h-9 shrink-0 cursor-pointer items-center rounded-full border border-rule bg-card px-3.5 whitespace-nowrap font-sans text-xs text-muted transition-[color,border-color,transform] duration-150 ease-[var(--ease-quiet)] hover:border-accent hover:text-accent active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:active:scale-100"
    >
      <span aria-live="polite">{copied() ? t().share.copiedLink : t().share.share}</span>
    </button>
  );
}
