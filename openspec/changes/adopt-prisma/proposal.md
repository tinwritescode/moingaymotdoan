# Proposal

## Why

The history function talks to Postgres through hand-written SQL on a `pg` Pool. The tables live in `db/schema.sql`, applied by `scripts/db-migrate.mjs` with `CREATE TABLE IF NOT EXISTS`. That works while tables only get added. It cannot change a column, it keeps no record of what ran on which Neon branch, and every row coming back is typed by hand (`PushDbRow`, `ProgressRow`, `MarksRow`). Nothing checks those types against the real columns. Prisma gives one schema file that both the migrations and the TypeScript types come from.

## What Changes

- `prisma/schema.prisma` becomes the source of truth for the four tables: `reading_progress`, `reading_logs`, `push_subscriptions` and `streak_marks`. It maps them under their current table and column names, so no data moves.
- Prisma Migrate replaces `db/schema.sql` and `scripts/db-migrate.mjs`. The first migration is a baseline of today's tables, CHECK constraints included. It is marked as already applied on the production branch. `pnpm db:migrate` runs `prisma migrate deploy`.
- New adapters `createPrismaHistoryRepository` and `createPrismaPushStore` replace the `pg` adapters behind the same ports (`HistoryRepository`, `PushStore`). Routes, the browser and the memory adapters do not change.
- Simple reads and writes use the Prisma client. Statements the client cannot express stay as SQL, through TypedSQL files in `prisma/sql/` with generated types:
  - the visit upsert, with GREATEST, LEAST and COALESCE merging;
  - the bulk sync built on `unnest`;
  - the marks merge, which locks the row with FOR UPDATE;
  - the reminder page filtered by each device's local day.
- Dependencies: `prisma` (dev) and `@prisma/client` with `@prisma/adapter-pg`, pinned to the 7.x stable line. `pg` stays, because the adapter takes the existing Pool that `attachDatabasePool` manages.

## Non-goals

- No change to any table, column, index or constraint.
- No change to the HTTP API or to the browser.
- No ORM for the browser. Prisma runs only inside the Neon function and the scripts.

## Capabilities

### New Capabilities

- `history-storage`: how the history function stores reading history, streak marks and push subscriptions. It covers the schema as code, migrations per Neon branch, and the storage guarantees the routes rely on.

### Modified Capabilities

None.

## Impact

- `functions/history/`: `postgres-repository.ts` and the store half of `push-adapters.ts` are replaced by Prisma adapters, and `index.ts` builds a `PrismaClient` on the attached Pool. The Web Push sender is unchanged.
- New `prisma/` directory with `schema.prisma`, `migrations/` and `sql/`, plus `prisma.config.ts`. The generated client is written to a git-ignored folder and built by `prisma generate` before tests, typecheck and `neon deploy`.
- `package.json`: the `db:migrate` script changes, and `prisma generate` runs on `postinstall`.
- Production: one manual step, `prisma migrate resolve --applied 0_init`, on the Neon `main` branch. Neon preview branches inherit the migration table from `main`.
