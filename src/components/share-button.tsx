import { createSignal, onCleanup } from "solid-js";
import { copyText } from "./copy-verse-button";

/** Nút chia sẻ trang hiện tại: mở bảng chia sẻ của điện thoại, máy không hỗ trợ thì chép link. */
export function ShareButton(props: { title: string; text: string }) {
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
        // Người dùng tự đóng bảng chia sẻ thì thôi, lỗi khác mới chuyển sang chép link.
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
      class="inline-flex min-h-9 shrink-0 cursor-pointer items-center rounded-full border border-rule bg-card px-3.5 whitespace-nowrap font-sans text-xs text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span aria-live="polite">{copied() ? "Đã chép link ✓" : "Chia sẻ"}</span>
    </button>
  );
}
