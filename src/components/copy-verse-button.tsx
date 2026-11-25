import { createSignal, onCleanup } from "solid-js";
import type { Verse } from "../../lib/content";
import { useLocale } from "./locale-context";

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback if Clipboard API is unavailable or blocked.
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** One-tap button to copy formatted Scripture verses with citation. */
export function CopyVerseButton(props: { label: string; verses: Verse[] }) {
  const { t } = useLocale();
  const [copied, setCopied] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (timer !== undefined) clearTimeout(timer);
  });

  const handleCopy = async () => {
    const body = props.verses.map((v) => v.text.trim()).join(" ");
    const ok = await copyText(t().copyVerse.formatPassage(props.label, body));
    if (!ok) return;
    setCopied(true);
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label={t().copyVerse.ariaLabel(props.label)}
      class={[
        "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 font-sans text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        copied() ? "bg-accent text-paper" : "bg-side text-accent hover:bg-accent hover:text-paper",
      ]}
    >
      <span aria-live="polite">{copied() ? t().copyVerse.copied : t().copyVerse.copy}</span>
    </button>
  );
}
