# Design

## Context

The history function (`functions/history/`) is a Hono app on Neon Functions. It reaches Postgres through a `pg` Pool registered with `attachDatabasePool`. Every route depends on two ports, `HistoryRepository` (lib/history/ports.ts) and `PushStore` (lib/streak/reminders.ts). Both have a memory adapter for tests and a Postgres adapter for production. Swapping the Postgres adapters is the entire change. Nothing above the ports moves.

## Decisions

### Schema mirrors the tables, not the domain

`schema.prisma` is first produced by `prisma db pull` against a fresh database built from today's `db/schema.sql`, and then tidied by hand:

- Model names are PascalCase (`ReadingProgress`, `PushSubscription`, …), with `@@map` to the snake_case table names.
- Fields are camelCase, with `@map` to the column names.
- `date` columns are `DateTime @db.Date`, and `rest_days` is `DateTime[] @db.Date`.
- `updated_at` columns get `@updatedAt`.
- The `kind` and `locale` columns stay `String`. A Prisma enum would create a Postgres enum type, which is a schema change. The CHECK constraints stay in the migration SQL.

A table must look the same before and after this change, compared with `prisma migrate diff --from-url <old> --to-schema prisma/schema.prisma`, which must come out empty.

### Baseline, then Migrate

1. Generate `0_init/migration.sql` with `prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`.
2. Hand-add the CHECK constraints and the descending indexes that Prisma does not model.
3. Mark it applied on the Neon `main` branch with `prisma migrate resolve --applied 0_init`. This writes only `_prisma_migrations`.
4. From then on, run `prisma migrate deploy` everywhere: production, preview branches, and the throwaway test databases.

`db/schema.sql` and `scripts/db-migrate.mjs` are deleted in the same commit, so there is one way to build a database.

### Client where it fits, TypedSQL where it does not

| Operation | Today | With Prisma |
|---|---|---|
| fetch progress and logs | 2 SELECTs | `findMany` with `orderBy` and `take` |
| visit upsert (progress and log in one statement) | CTE, GREATEST/LEAST, `row_to_json` | TypedSQL `upsertVisit.sql` |
| bulk sync | `unnest` INSERT … ON CONFLICT ×2 in a transaction | TypedSQL ×2 inside `$transaction` |
| set completed | UPDATE … COALESCE(completed_at, now()) RETURNING | TypedSQL `setCompleted.sql` |
| clear user | 3 DELETEs in a transaction | `$transaction([deleteMany ×3])` |
| marks fetch | SELECT | `findUnique` |
| marks merge | INSERT DO NOTHING, then SELECT FOR UPDATE, then UPDATE, in a transaction | interactive `$transaction`: `createMany({skipDuplicates})`, TypedSQL `lockMarks.sql`, `update` |
| push upsert | INSERT … ON CONFLICT DO UPDATE | `upsert` (keeps `lastSentDate` by leaving it out of `update`) |
| push claim | UPDATE … IS DISTINCT FROM, rowCount | `updateMany` where `OR: [{lastSentDate: null}, {lastSentDate: {not: date}}]`, `count === 1` |
| push remove | DELETE | `deleteMany` (no error when already gone) |
| reminder page | SELECT … `AT TIME ZONE tz` … `ORDER BY endpoint LIMIT` | TypedSQL `listDuePushSubscriptions.sql` |

Prisma's query API cannot express GREATEST/LEAST merging on conflict, `unnest` bulk upserts, `FOR UPDATE` or per-row time zones. Rewriting any of those as read-then-write in JavaScript would lose atomicity. They stay as SQL, but typed by `prisma generate --sql`.

### Dates stay strings at the port

The ports use `YYYY-MM-DD` strings for local dates. Prisma returns `@db.Date` values as `Date` at UTC midnight. The adapters convert with one pair of helpers, `toDateKey(d)` (`d.toISOString().slice(0, 10)`) and `fromDateKey(s)` (`new Date(s + "T00:00:00Z")`). Nothing outside `functions/history/` sees a `Date` for a local day.

### One Pool, one client

`index.ts` keeps `attachDatabasePool(pool)` and builds `new PrismaClient({ adapter: new PrismaPg(pool) })` once per function instance. The Rust-free client (the default in 7.x) needs no engine binary in the deploy bundle.

## Risks / Trade-offs

- **Most write paths stay SQL.** Prisma pays off in the schema, the migrations and typed results, not in shorter queries. That cost is accepted: the gain is that a column change is now possible and checked.
- **CHECK constraints are invisible to Prisma.** `migrate diff` will not notice one being dropped. The Postgres adapter tests insert an out-of-range `remind_hour` and expect a rejection.
- **Bundling on Neon Functions.** The generated client must land in the function bundle. Deploy to a Neon preview branch first and probe `/health`, `/history/streak` and `/push/cron` before touching `main`.
- **Baseline on production is a one-way door.** If `0_init` is resolved against a database that does not match it, later migrations build on a wrong picture. Run `migrate diff` against a fresh branch of `main` first and require an empty diff.
- **TypedSQL preview status.** If TypedSQL is still a preview feature in the pinned version, enable it in the generator, and keep the `.sql` files simple enough to fall back to `$queryRaw` with a hand-written row type.
