# history-storage

## ADDED Requirements

### Requirement: One schema defines the database

The history function's tables SHALL be defined in `prisma/schema.prisma` and created only by Prisma migrations. The schema MUST keep today's table names, column names, types, keys, indexes and CHECK constraints.

#### Scenario: Fresh database from migrations

- **WHEN** `prisma migrate deploy` runs against an empty database
- **THEN** the tables `reading_progress`, `reading_logs`, `push_subscriptions` and `streak_marks` exist
- **AND** `prisma migrate diff` between that database and `prisma/schema.prisma` is empty

#### Scenario: Production keeps its rows

- **WHEN** the baseline migration is marked applied on the production branch and `prisma migrate deploy` runs
- **THEN** no table is created, altered or emptied
- **AND** a second run reports nothing to apply

#### Scenario: Constraint still enforced

- **WHEN** a push subscription is written with `remind_hour` 5
- **THEN** the database rejects the row

### Requirement: Storage behaviour is unchanged behind the ports

The Prisma adapters SHALL satisfy the existing `HistoryRepository` and `PushStore` ports with the same results as the `pg` adapters they replace. Local days MUST cross the port as `YYYY-MM-DD` strings.

#### Scenario: Two devices merge marks at once

- **WHEN** two merges of streak marks for the same reader run at the same time
- **THEN** the stored rest days are the union of both
- **AND** neither merge is lost

#### Scenario: A reminder day is claimed once

- **WHEN** two cron runs claim the same device for the same local day
- **THEN** exactly one claim succeeds

#### Scenario: A re-sent visit merges

- **WHEN** a visit for an đoạn already stored arrives with an earlier `readAt` during sync
- **THEN** `first_read_at` moves earlier, `last_read_at` stays the latest, and `read_count` keeps the larger count

#### Scenario: Reminder pages skip done devices

- **WHEN** the cron lists due devices at 21:05 in Asia/Ho_Chi_Minh
- **THEN** a device whose last read or last sent day is that local day is not listed
- **AND** devices come in endpoint order, at most one page at a time

#### Scenario: Dates round-trip as local days

- **WHEN** a log with `readDate` "2026-11-28" is stored and fetched again
- **THEN** its `readDate` is "2026-11-28", whatever the server's time zone
