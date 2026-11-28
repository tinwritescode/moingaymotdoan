# Tasks

## 1. Streak rules

- [ ] 1.1 `lib/streak/streak.ts`: `computeStreak` covering read days, rest days, rekindling, rescue, restart, the record and the week strip; verify with `lib/streak/streak.test.ts` (one test per scenario in specs/reading-streak)
- [ ] 1.2 `lib/streak/flames.ts`: milestones, `flameFor`, `nextMilestone`, and the static SVG for each flame and state; verify with the tests for days 1, 7, 23, 30 and 400
- [ ] 1.3 Make `computeReadingStats().streak` use the new rules (chapters only); verify that `lib/history/history.test.ts` is updated and passes

## 2. Streak state in the app

- [ ] 2.1 `src/lib/streak-store.ts`: rest days and restart in `localStorage` (`kt:streak:v1`), with the week limit enforced; verify with a unit test
- [ ] 2.2 `StreakProvider` with a minute clock and the `rest` and `restart` actions; verify with a component test that 21:00 switches the state to At risk

## 3. Flames

- [ ] 3.1 Copy the 24 Lottie files to `public/lottie/` and the generator to `scripts/flame-lottie.cjs`; verify that the generator reproduces the same files
- [ ] 3.2 `Flame` component: static SVG, a lazy lottie-web player, ignite then loop, reduced motion; verify with a component test that reduced motion keeps the SVG and loads no player
- [ ] 3.3 Service worker caches `/lottie/`; verify with `src/sw.test.ts`

## 4. Screens

- [ ] 4.1 Messages for the streak in vi and en; verify that `lib/i18n/i18n.test.ts` passes (both locales have the same keys)
- [ ] 4.2 `StreakCard` with the Today, At risk, Rescue and Done states, the week strip and the short readings; verify with component tests per state
- [ ] 4.3 Place the card on the home page (vi and en); verify with `src/pages/home-page.test.tsx`
- [ ] 4.4 `DoneSheet` opens on the day's first completion; verify with a component test in `reading-tracker.test.tsx`

## 5. Share card

- [ ] 5.1 `src/lib/share-card.ts`: draw the post and story PNGs; verify with a unit test of the 30-day grid data, then by hand in the browser
- [ ] 5.2 Share or download with the size choice; verify with a component test that it calls `navigator.share` with a file, and downloads when that is unsupported

## 6. Reminders (Web Push)

- [ ] 6.1 `lib/streak/reminders.ts`: `decideReminder` and the notification text; verify with tests for the evening, rescue, already-sent, already-read and time-zone cases
- [ ] 6.2 `push_subscriptions` in `db/schema.sql`; verify that `pnpm db:migrate` succeeds against a local database
- [ ] 6.3 Payload validation in `lib/streak/push-contract.ts`; verify with tests for an unknown host, a bad time zone and a bad hour
- [ ] 6.4 Routes `PUT` and `DELETE /push/subscription` and `POST /push/cron` in `functions/history/app.ts`, with a push repository port and its Postgres adapter, and a sender port backed by `web-push`; verify with `functions/history/app.test.ts` using in-memory adapters, including the 410 deletion
- [ ] 6.5 `neon.ts`: the VAPID env and the `streak-reminders` schedule trigger; verify with `pnpm typecheck`
- [ ] 6.6 Service worker `push` and `notificationclick`; verify with `src/sw.test.ts`
- [ ] 6.7 Browser side: opt in, change the time, turn off, report reads, and the iOS install hint; verify with component tests on the card

## 7. Verification

- [ ] 7.1 `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm build` all pass
- [ ] 7.2 By hand in `pnpm dev`, see each card state (by setting the clock and history), the done sheet, the share PNG and a real push on localhost
