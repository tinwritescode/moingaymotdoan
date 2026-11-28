# Tasks

## 1. Schema and baseline

- [ ] 1.1 Add `prisma`, `@prisma/client` and `@prisma/adapter-pg` (7.x stable), `prisma.config.ts`, and a generator writing to a git-ignored folder; `postinstall` runs `prisma generate`; verify that `pnpm install` on a clean clone generates the client
- [ ] 1.2 `prisma db pull` against a fresh local database built from `db/schema.sql`, then name the models and fields (design: "Schema mirrors the tables"); verify that `prisma migrate diff` from that database to the schema is empty
- [ ] 1.3 `prisma/migrations/0_init/migration.sql` from `migrate diff --from-empty`, plus the CHECK constraints and descending indexes by hand; verify that a database built by `migrate deploy` and one built by the old `db/schema.sql` dump identically with `pg_dump --schema-only`
- [ ] 1.4 Replace `db:migrate` with `prisma migrate deploy`; delete `db/schema.sql` and `scripts/db-migrate.mjs`; update the gated tests' setup comment; verify that a second `migrate deploy` is a no-op

## 2. Adapters

- [ ] 2.1 `toDateKey` and `fromDateKey` helpers in `functions/history/`; verify with a unit test run under `TZ=America/Los_Angeles` and `TZ=Asia/Ho_Chi_Minh`
- [ ] 2.2 TypedSQL files in `prisma/sql/`: `upsertVisit`, `syncProgress`, `syncLogs`, `setCompleted`, `lockMarks`, `listDuePushSubscriptions`; verify that `prisma generate --sql` types them against a migrated database
- [ ] 2.3 `createPrismaPushStore`; point `push-adapters.test.ts` at it; verify against a fresh database: claim once, upsert keeps `lastSentDate`, paging, the read-today filter, and `remind_hour` 5 rejected
- [ ] 2.4 `createPrismaHistoryRepository`; point `postgres-repository.test.ts` at it; verify the concurrent marks merge, the visit merge on sync, and `clearUserHistory`
- [ ] 2.5 `index.ts` builds `PrismaClient` on the attached Pool; delete `postgres-repository.ts` and the store half of `push-adapters.ts`; verify that `pnpm typecheck`, `pnpm lint` and `pnpm test` pass, and that `app.test.ts` is untouched

## 3. Rollout

- [ ] 3.1 Create a Neon branch from `main`, run `migrate diff` from it to the schema, and require an empty diff
- [ ] 3.2 On that branch, `migrate resolve --applied 0_init`, then `neon deploy`; probe `/health`, `GET /history/streak` (401 without a token) and `POST /push/cron` (401 without the trigger header); check the function logs for no Prisma errors
- [ ] 3.3 Same on `main`: `migrate resolve --applied 0_init`, `migrate deploy` (no-op), `neon deploy`, the same probes, and one real cron run in the logs with `checked` ≥ 0
- [ ] 3.4 Delete the test branch
