import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { CopyVerseButton } from "./copy-verse-button";

describe("CopyVerseButton", () => {
  it("copies formatted passage text and shows confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(() => (
      <CopyVerseButton
        label="Thi-thiên 34:18"
        verses={[{ number: 18, text: "Đức Giê-hô-va ở gần những người có lòng đau thương." }]}
      />
    ));

    const btn = screen.getByRole("button", { name: "Sao chép Thi-thiên 34:18" });
    expect(btn.textContent).toBe("Sao chép");

    fireEvent.click(btn);
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "“Đức Giê-hô-va ở gần những người có lòng đau thương.” — Thi-thiên 34:18 (Kinh Thánh Bản Truyền Thống)",
      );
      expect(btn.textContent).toBe("Đã chép ✓");
    });
  });
});
