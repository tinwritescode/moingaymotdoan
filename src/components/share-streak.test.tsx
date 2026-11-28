import { fireEvent, waitFor } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cardVerse } from "../../lib/streak/card-verses";
import { drawShareCard, SHARE_TEMPLATE_STORAGE_KEY, shareOrDownload } from "../lib/share-card";
import { CARD_IDENTITY_STORAGE_KEY, PROFILE_STORAGE_KEY } from "./profile-context";
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
  localStorage.clear();
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

  test("clicking outside on the backdrop closes the preview", async () => {
    const view = await open("Story");
    const dialog = view.getByRole("dialog", { name: "Xem trước ảnh chia sẻ" });
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    await waitFor(() => expect(view.queryByRole("dialog")).toBeNull());
    expect(shareOrDownload).not.toHaveBeenCalled();
  });

  const lastIdentity = () => vi.mocked(drawShareCard).mock.lastCall?.[0].identity;

  test("the card carries the reader's name and photo, and can leave them off", async () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ name: "Bé Na", avatar: null }));
    const view = await open("Story");
    expect(lastIdentity()).toEqual({ name: "Bé Na", avatar: null });
    fireEvent.click(view.getByRole("switch", { name: /Hiện tên và ảnh của tôi/ }));
    await waitFor(() => expect(lastIdentity()).toBeNull());
    expect(vi.mocked(drawShareCard).mock.lastCall?.[0].size).toBe("story");
    expect(localStorage.getItem(CARD_IDENTITY_STORAGE_KEY)).toBe("off");
  });

  test("a guest adds a name from the preview and the card redraws with it", async () => {
    const view = await open("Bài đăng");
    expect(lastIdentity()).toBeNull();
    fireEvent.click(view.getByRole("button", { name: "Thêm tên và ảnh của bạn" }));
    flush();
    fireEvent.input(view.getByLabelText("Tên hiện trên thẻ"), { target: { value: "Bé Na" } });
    flush();
    fireEvent.click(view.getByRole("button", { name: "Lưu" }));
    await waitFor(() => expect(lastIdentity()).toEqual({ name: "Bé Na", avatar: null }));
    view.getByRole("button", { name: "Sửa tên và ảnh" });
  });

  test("switching templates redraws the card and remembers the chosen template", async () => {
    const view = await open("Story");
    expect(vi.mocked(drawShareCard).mock.lastCall?.[0].template).toBe("paper");
    fireEvent.click(view.getByRole("radio", { name: "Đêm tĩnh" }));
    await waitFor(() => expect(vi.mocked(drawShareCard).mock.lastCall?.[0].template).toBe("night"));
    expect(vi.mocked(drawShareCard).mock.lastCall?.[0].size).toBe("story");
    expect(localStorage.getItem(SHARE_TEMPLATE_STORAGE_KEY)).toBe("night");

    view.unmount();
    const reopened = await open("Bài đăng");
    expect(vi.mocked(drawShareCard).mock.lastCall?.[0].template).toBe("night");
    expect(reopened.getByRole("radio", { name: "Đêm tĩnh" }).getAttribute("aria-checked")).toBe("true");
  });
});
