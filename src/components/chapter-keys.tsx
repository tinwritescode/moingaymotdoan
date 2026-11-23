import { useNavigate } from "@solidjs/router";
import { onSettled } from "solid-js";

type KeyPress = Pick<KeyboardEvent, "key" | "altKey" | "ctrlKey" | "metaKey" | "shiftKey" | "defaultPrevented">;

/**
 * Where ← or → leads from this đoạn, or null when the key belongs to the browser.
 * `typing`: focus is in a text field, where the arrows move the caret.
 */
export function chapterKeyTarget(args: {
  event: KeyPress;
  typing: boolean;
  prev: string | null;
  next: string | null;
}): string | null {
  const e = args.event;
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented || args.typing) return null;
  if (e.key === "ArrowLeft") return args.prev;
  if (e.key === "ArrowRight") return args.next;
  return null;
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));

/** ← and → open the đoạn before and after, like the pager buttons in the top bar. */
export function ChapterKeys(props: { prev: string | null; next: string | null }) {
  const navigate = useNavigate();
  onSettled(() => {
    // Reads props when the key is pressed, so the links follow the đoạn on screen.
    const onKey = (e: KeyboardEvent) => {
      const href = chapterKeyTarget({ event: e, typing: isTyping(e.target), prev: props.prev, next: props.next });
      if (href === null) return;
      e.preventDefault();
      navigate(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return null;
}
