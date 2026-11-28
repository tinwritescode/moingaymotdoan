import { flush } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createMemoryHistoryRepository, createMemoryStreakMarksRemote } from "../../lib/history/memory-adapters";
import type { HistorySnapshot } from "../../lib/history/types";
import { STREAK_STORAGE_KEY, useStreak } from "./streak-context";
import { historyOf, renderStreakAt } from "./streak-fixtures";

function Probe() {
  const s = useStreak();
  return (
    <p>
      {s.ready() ? `${s.state().kind} ${s.state().days}${s.atRisk() ? " at-risk" : ""}` : "loading"}
      <button onClick={() => s.rest()}>rest</button>
    </p>
  );
}

const renderAt = (time: string, history: HistorySnapshot) => renderStreakAt(time, history, () => <Probe />);

describe("<StreakProvider />", () => {
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  test("puts an unread day at risk from 21:00", async () => {
    const before = await renderAt("2026-11-29T20:59:00", historyOf("2026-11-29", 23, 1));
    await before.findByText("today 23");
    before.unmount();
    const after = await renderAt("2026-11-29T21:00:00", historyOf("2026-11-29", 23, 1));
    await after.findByText("today 23 at-risk");
  });

  test("uses the reminder hour the reader chose", async () => {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify({ remindHour: 20 }));
    const view = await renderAt("2026-11-29T20:30:00", historyOf("2026-11-29", 3, 1));
    await view.findByText("today 3 at-risk");
  });

  test("resting the missed day keeps the streak and is remembered", async () => {
    const view = await renderAt("2026-11-29T08:00:00", historyOf("2026-11-29", 23, 2));
    await view.findByText("rescue 23");
    view.getByText("rest").click();
    flush();
    await view.findByText("today 23");
    expect(JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY) ?? "{}").restDays).toEqual(["2026-11-28"]);
  });

  test("a rest taken on one device keeps the streak on the reader's other devices", async () => {
    const server = createMemoryHistoryRepository();
    const signedIn = { userId: "user_alice", remoteFor: (id: string) => createMemoryStreakMarksRemote(server, id) };
    const history = historyOf("2026-11-29", 23, 2);

    const phone = renderStreakAt("2026-11-29T08:00:00", history, () => <Probe />, signedIn);
    (await phone.findByRole("button", { name: "rest" })).click();
    flush();
    await phone.findByText("today 23");
    await vi.waitFor(async () => expect((await server.fetchStreakMarks("user_alice"))?.restDays).toEqual(["2026-11-28"]));
    phone.unmount();

    localStorage.clear(); // another device: nothing kept locally
    const laptop = renderStreakAt("2026-11-29T08:00:00", history, () => <Probe />, signedIn);
    await laptop.findByText("today 23");
  });

  test("a guest's rest day joins the account on sign-in", async () => {
    const server = createMemoryHistoryRepository();
    await server.mergeStreakMarks("user_alice", { restDays: ["2026-11-10"], restartedOn: null, remindHour: 20 });
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify({ restDays: ["2026-11-28"], restartedOn: null, remindHour: 21 }));
    const signedIn = { userId: "user_alice", remoteFor: (id: string) => createMemoryStreakMarksRemote(server, id) };
    renderStreakAt("2026-11-29T08:00:00", historyOf("2026-11-29", 23, 2), () => <Probe />, signedIn);
    await vi.waitFor(async () =>
      expect(await server.fetchStreakMarks("user_alice")).toEqual({
        restDays: ["2026-11-10", "2026-11-28"],
        restartedOn: null,
        remindHour: 20,
      }),
    );
    expect(JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY) ?? "{}").remindHour).toBe(20);
  });
});
