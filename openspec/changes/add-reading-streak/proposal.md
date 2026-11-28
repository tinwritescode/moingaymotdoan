# Proposal

## Why

The site's promise is "Mỗi ngày một đoạn" (one đoạn a day), but nothing pulls a reader back tomorrow. The home page shows a bare "ngày liên tiếp" number that resets silently, so a reader who misses one day loses everything with no way back. A visible daily streak, with a little pressure before midnight and a fair way to recover from one missed day, turns the promise into a habit.

## What Changes

- A daily reading streak: a day counts when the reader opens at least one đoạn (chapter). Mood guides no longer count toward the streak. **BREAKING** for the existing "ngày liên tiếp" number, which counted mood guides.
- Recovery from one missed day, each kept without losing the record:
  - **Thắp lại** (rekindle): read 2 đoạn the day after the miss and the missed day is bridged.
  - **Ngày Sa-bát** (rest day): mark the missed day as rest, at most once per week.
  - **Bắt đầu lại** (start over): dismiss the rescue and start from day 1.
- A record ("kỷ lục"): the longest streak ever, kept across restarts.
- Six flames that change at milestones 1, 7, 30, 100, 200 and 365 days: Ngọn nến, Đèn dầu, Ngọn đuốc, Chân đèn bảy nhánh, Bụi gai cháy, Trụ lửa. Each has a static drawing and Lottie animations (lit loop, ignite, guttering, going out).
- A streak card on the home page with four states: today (not read yet), at risk (after 21:00), rescue (missed yesterday) and done. It also has a week strip and links to short readings for days with little time (Thi-thiên 117, Thi-thiên 23).
- A "Đọc xong" (done) sheet when a reader marks a đoạn complete for the first time in a day. It shows the ignite animation, the count, a badge when a milestone is reached, progress to the next flame, and a share button.
- Share cards exported as PNG in two sizes, 1080×1350 (post) and 1080×1920 (story), shared through the system share sheet or downloaded.
- Reading reminders by Web Push. The reader opts in by tapping a button and can pick the time or turn reminders off. The server sends at most one notification a day: at the chosen time if the reader has not read today, or the morning after a missed day while it can still be rescued. These work without signing in.

## Capabilities

### New Capabilities

- `reading-streak`: the rules. Which days count, the streak length, rest days, rekindling, restart, the record, and milestones and flames.
- `streak-experience`: what the reader sees and does. The home streak card states, the week strip, short readings, the done sheet, and the flame animations with reduced motion.
- `streak-share-card`: the PNG share cards and how they leave the device.
- `streak-reminders`: Web Push opt-in, settings, the reminder schedule, the server rules for sending, and the notification click.

### Modified Capabilities

None. The project has no specs yet.

## Impact

- New pure modules under `lib/streak/` (rules, flames, reminder decisions), shared by the browser and the Neon function.
- `lib/history/types.ts`: `computeStreak` and `ReadingStats.streak` move to the new rules.
- New UI in `src/components/` (streak card, flame, done sheet, share card) and on the home page and chapter page. New messages in `lib/i18n/messages.ts` (vi and en).
- `public/lottie/`: 24 Lottie files. New dependency `lottie-web`, loaded only in the browser.
- `src/sw.js`: `push` and `notificationclick` handlers; Lottie files cached.
- Neon function `history`: new `/push/subscription` and `/push/cron` routes, and a new `push_subscriptions` table in `db/schema.sql`. New dependency `web-push`. A schedule trigger every 15 minutes is declared in `neon.ts`.
- New secrets: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT` on the function, and `VITE_VAPID_PUBLIC_KEY` for the site build. Reminders stay hidden while they are unset.
