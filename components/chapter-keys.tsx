"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type KeyPress = Pick<KeyboardEvent, "key" | "altKey" | "ctrlKey" | "metaKey" | "shiftKey" | "defaultPrevented">;

/**
 * Where ← or → leads from this đoạn, or null when the key belongs to the browser.
 * `typing`: focus is in a text field, where the arrows move the caret.
 */
export function chapterKeyTarget(props: {
  event: KeyPress;
  typing: boolean;
  prev: string | null;
  next: string | null;
}): string | null {
  const e = props.event;
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented || props.typing) return null;
  if (e.key === "ArrowLeft") return props.prev;
  if (e.key === "ArrowRight") return props.next;
  return null;
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));

/** ← and → open the đoạn before and after, like the pager buttons in the top bar. */
export function ChapterKeys(props: { prev: string | null; next: string | null }) {
  const router = useRouter();
  const { prev, next } = props;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const href = chapterKeyTarget({ event: e, typing: isTyping(e.target), prev, next });
      if (href === null) return;
      e.preventDefault();
      router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev, next]);

  return null;
}
