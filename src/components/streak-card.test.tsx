import { flush } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";
import { chapterLog, historyOf, renderStreakAt } from "./streak-fixtures";
import { StreakCard } from "./streak-card";

vi.mock("lottie-web/build/player/lottie_light", () => ({ default: { loadAnimation: vi.fn() } }));

const NEXT = { href: "/giang/4", label: "Giăng 4" };
const TODAY = "2026-11-29";
const card = () => <StreakCard next={NEXT} />;

describe("<StreakCard />", () => {
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  test("a new reader is invited to light the first candle", async () => {
    const view = renderStreakAt(`${TODAY}T10:00:00`, { progress: [], logs: [] }, card);
    await view.findByText("Thắp ngọn nến hôm nay");
    expect(view.getByRole("link", { name: "Đọc Giăng 4" }).getAttribute("href")).toBe("/giang/4");
  });

  test("from the reminder hour, the countdown and two short psalms", async () => {
    const view = renderStreakAt(`${TODAY}T21:30:00`, historyOf(TODAY, 23, 1), card);
    await view.findByText("Đèn 23 ngày sẽ tắt lúc nửa đêm");
    view.getByText("Còn 2 giờ 30 phút");
    expect(view.getByRole("link", { name: /Thi-thiên 117/u }).getAttribute("href")).toBe("/thi-thien/117");
    view.getByRole("link", { name: /Thi-thiên 23/u });
  });

  test("after a missed day: rekindle, rest or restart, and the record is kept", async () => {
    const view = renderStreakAt(`${TODAY}T08:00:00`, historyOf(TODAY, 23, 2), card);
    await view.findByText("Hôm qua đèn chưa được thắp");
    view.getByText(/Đọc 2 đoạn hôm nay/u);
    view.getByText("Kỷ lục 23 ngày vẫn được lưu dù bạn chọn gì.");
    view.getByRole("button", { name: /Dùng ngày Sa-bát/u }).click();
    flush();
    await view.findByText("Hôm nay: một đoạn để giữ lửa");
  });

  test("restarting drops the streak to zero", async () => {
    const view = renderStreakAt(`${TODAY}T08:00:00`, historyOf(TODAY, 23, 2), card);
    (await view.findByRole("button", { name: "Bắt đầu lại từ ngày 1" })).click();
    flush();
    await view.findByText("Thắp ngọn nến hôm nay");
  });

  test("done today: the next flame and the share buttons", async () => {
    const history = historyOf(TODAY, 6, 0);
    const view = renderStreakAt(`${TODAY}T10:00:00`, history, card);
    await view.findByText("Hôm nay đèn đã được thắp");
    view.getByText("Mốc 7 ngày: Đèn dầu");
    view.getByText("Còn 1 ngày để thắp ngọn lửa mới.");
    view.getByRole("button", { name: "Bài đăng" });
    view.getByRole("button", { name: "Story" });
  });

  test("a milestone day shows its new flame", async () => {
    const history = { progress: [], logs: [...historyOf(TODAY, 6, 1).logs, chapterLog(TODAY)] };
    const view = renderStreakAt(`${TODAY}T10:00:00`, history, card);
    await view.findByText("Mốc mới: Đèn dầu");
  });
});
