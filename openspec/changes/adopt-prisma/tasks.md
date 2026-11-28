# Tasks

## 1. Schema and baseline

- [x] 1.1 Add `prisma`, `@prisma/client` and `@prisma/adapter-pg` (7.x stable), `prisma.config.ts`, and a generator writing to `functions/history/generated/prisma`, committed (design: "Generated client in git"); `pnpm db:generate` rebuilds it; verify that typecheck and tests pass in a worktree with no database URL
- [x] 1.2 `prisma db pull` against a fresh local database built from `db/schema.sql`, then name the models and fields (design: "Schema mirrors the tables"); verify that `prisma migrate diff` from that database to the schema is empty
- [x] 1.3 `prisma/migrations/0_init/migration.sql` from `migrate diff --from-empty`, plus the CHECK constraints and descending indexes by hand; verify that a database built by `migrate deploy` and one built by the old `db/schema.sql` dump identically with `pg_dump --schema-only`
- [x] 1.4 Replace `db:migrate` with `prisma migrate deploy`; delete `db/schema.sql` and `scripts/db-migrate.mjs`; update the gated tests' setup comment; verify that a second `migrate deploy` is a no-op

## 2. Adapters

- [x] 2.1 `toDateKey` and `fromDateKey` helpers in `functions/history/`; verify with a unit test run under `TZ=America/Los_Angeles` and `TZ=Asia/Ho_Chi_Minh`
- [x] 2.2 TypedSQL files in `prisma/sql/`: `upsertVisit`, `syncProgress`, `syncLogs`, `setCompleted`, `lockStreakMarks`, `listDuePushSubscriptions`; verify that `prisma generate --sql` types them against a migrated database
- [x] 2.3 `createPostgresPushStore` on Prisma; point `push-adapters.test.ts` at it; verify against a fresh database: claim once, upsert keeps `lastSentDate`, paging, the read-today filter, and `remind_hour` 5 rejected
- [x] 2.4 `createPostgresHistoryRepository` on Prisma; point `postgres-repository.test.ts` at it; verify the concurrent marks merge, the visit merge on sync, and `clearUserHistory`
- [x] 2.5 `index.ts` builds `PrismaClient` on the attached Pool; the Prisma adapters replace the `pg` code in place, keeping the file and factory names; verify that `pnpm typecheck`, `pnpm lint` and `pnpm test` pass, and that `app.test.ts` is untouched

## 3. Rollout

- [x] 3.1 Create a Neon branch from `main`, run `migrate diff` from it to the schema, and require an empty diff; also require an identical `pg_dump --schema-only -n public` against a database built by `migrate deploy`, since Prisma does not see CHECK constraints
- [x] 3.2 On that branch, `migrate resolve --applied 0_init`, then `neon deploy` without the VAPID keys (the branch holds a copy of production's subscriptions, so its push routes stay off and `POST /push/cron` answers 404); probe `/health` and `GET /history/streak` (401 without a token); run the gated adapter tests against the branch; check the function logs for no Prisma errors
- [x] 3.3 Same on `main`: `migrate resolve --applied 0_init`, `migrate deploy` (no-op), `neon deploy`, the same probes, and one real cron run in the logs with `checked` ≥ 0
- [x] 3.4 Delete the test branch
