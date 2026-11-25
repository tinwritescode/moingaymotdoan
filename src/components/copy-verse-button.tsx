import { createSignal, onCleanup } from "solid-js";
import type { Verse } from "../../lib/content";

function formatPassage(label: string, verses: Verse[]): string {
  const body = verses.map((v) => v.text.trim()).join(" ");
  return `“${body}” — ${label} (Kinh Thánh Bản Truyền Thống)`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Rơi xuống phương án dự phòng nếu trình duyệt chặn clipboard API.
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

/** Nút sao chép nhanh nguyên văn câu Kinh Thánh kèm chỗ dẫn để lưu hoặc gửi cho người khác. */
export function CopyVerseButton(props: { label: string; verses: Verse[] }) {
  const [copied, setCopied] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (timer !== undefined) clearTimeout(timer);
  });

  const handleCopy = async () => {
    const ok = await copyText(formatPassage(props.label, props.verses));
    if (!ok) return;
    setCopied(true);
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label={`Sao chép ${props.label}`}
      class={[
        "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 font-sans text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        copied() ? "bg-accent text-paper" : "bg-side text-accent hover:bg-accent hover:text-paper",
      ]}
    >
      <span aria-live="polite">{copied() ? "Đã chép ✓" : "Sao chép"}</span>
    </button>
  );
}
