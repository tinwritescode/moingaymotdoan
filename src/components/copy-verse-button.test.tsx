import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { CopyVerseButton } from "./copy-verse-button";
import { LocaleProvider } from "./locale-context";

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

  it("copies English BSB attribution under LocaleProvider('en')", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(() => (
      <LocaleProvider locale="en">
        <CopyVerseButton
          label="Psalms 34:18"
          verses={[{ number: 18, text: "The LORD is near to the brokenhearted;" }]}
        />
      </LocaleProvider>
    ));

    const btn = screen.getByRole("button", { name: "Copy Psalms 34:18" });
    expect(btn.textContent).toBe("Copy");

    fireEvent.click(btn);
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("“The LORD is near to the brokenhearted;” — Psalms 34:18 (BSB)");
      expect(btn.textContent).toBe("Copied ✓");
    });
  });
});
