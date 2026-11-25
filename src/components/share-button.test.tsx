import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { ShareButton } from "./share-button";

describe("ShareButton", () => {
  it("chép link trang khi trình duyệt không có bảng chia sẻ", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    window.history.replaceState(null, "", "/cam-xuc/lo-au-tuong-lai");

    render(() => <ShareButton title="Lo âu về tương lai" text="Khi đầu óc quay cuồng." />);
    const btn = screen.getByRole("button", { name: "Chia sẻ" });
    fireEvent.click(btn);

    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/cam-xuc/lo-au-tuong-lai`);
      expect(btn.textContent).toBe("Đã chép link ✓");
    });
  });
});
