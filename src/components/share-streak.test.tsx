import { fireEvent, waitFor } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cardVerse } from "../../lib/streak/card-verses";
import { drawShareCard, shareOrDownload } from "../lib/share-card";
import { ShareStreak } from "./share-streak";
import { historyOf, renderStreakAt } from "./streak-fixtures";

vi.mock("../lib/share-card", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/share-card")>()),
  drawShareCard: vi.fn(async () => new Blob(["png"], { type: "image/png" })),
  shareOrDownload: vi.fn(async () => "downloaded" as const),
}));

// jsdom has no modal dialogs or object URLs.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  URL.createObjectURL = vi.fn(() => "blob:card");
  URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("<ShareStreak />", () => {
  const today = "2026-11-28";
  const open = async (size: "Bài đăng" | "Story", userId?: string) => {
    const signedIn = userId ? { userId, remoteFor: () => null } : undefined;
    const view = renderStreakAt(`${today}T12:00:00`, historyOf(today, 4, 0), () => <ShareStreak days={4} />, signedIn);
    // The session loads the signed-in reader asynchronously.
    await new Promise((r) => setTimeout(r, 0));
    flush();
    fireEvent.click(view.getByRole("button", { name: size }));
    await waitFor(() => view.getByRole("dialog", { name: "Xem trước ảnh chia sẻ" }));
    return view;
  };

  test("a size opens a preview of the card before anything leaves the device", async () => {
    const view = await open("Story");
    expect(drawShareCard).toHaveBeenCalledWith(expect.objectContaining({ size: "story", days: 4 }));
    expect(view.getByRole("img").getAttribute("src")).toBe("blob:card");
    expect(shareOrDownload).not.toHaveBeenCalled();
  });

  test("the card carries the day's verse, picked for the reader", async () => {
    const guest = cardVerse("vi", null, today);
    const reader = cardVerse("vi", "user_share", today);
    expect(reader.ref).not.toBe(guest.ref);
    (await open("Bài đăng")).unmount();
    expect(drawShareCard).toHaveBeenLastCalledWith(expect.objectContaining({ text: expect.objectContaining({ verse: `“${guest.text}”`, verseRef: guest.ref }) }));
    await open("Bài đăng", "user_share");
    expect(drawShareCard).toHaveBeenLastCalledWith(expect.objectContaining({ text: expect.objectContaining({ verse: `“${reader.text}”`, verseRef: reader.ref }) }));
  });

  test("the preview's button shares or downloads that same image, then closes", async () => {
    const view = await open("Bài đăng");
    fireEvent.click(view.getByRole("button", { name: "Tải ảnh" }));
    await waitFor(() => expect(view.queryByRole("dialog")).toBeNull());
    expect(shareOrDownload).toHaveBeenCalledWith(expect.any(Blob), "moingaymotdoan-4-ngay.png");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:card");
  });

  test("closing the preview shares nothing", async () => {
    const view = await open("Bài đăng");
    fireEvent.click(view.getByRole("button", { name: "Đóng" }));
    await waitFor(() => expect(view.queryByRole("dialog")).toBeNull());
    expect(shareOrDownload).not.toHaveBeenCalled();
  });
});
