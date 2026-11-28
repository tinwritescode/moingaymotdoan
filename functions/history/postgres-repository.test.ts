import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createPostgresHistoryRepository } from "./postgres-repository";

// Runs against a real Postgres with db/schema.sql applied: TEST_DATABASE_URL=postgres://… pnpm test
const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("Postgres streak marks", () => {
  const pool = new Pool({ connectionString: url });
  const repo = createPostgresHistoryRepository(pool);
  const user = "user_pg_marks_test";
  beforeAll(() => repo.clearUserHistory(user));
  afterAll(() => pool.end());

  it("merges concurrent devices without losing a rest day, and forgets on clear", async () => {
    expect(await repo.fetchStreakMarks(user)).toBeNull();
    await Promise.all([
      repo.mergeStreakMarks(user, { restDays: ["2026-11-17"], restartedOn: null, remindHour: 21 }),
      repo.mergeStreakMarks(user, { restDays: ["2026-11-24"], restartedOn: "2026-11-01", remindHour: 21 }),
    ]);
    expect(await repo.fetchStreakMarks(user)).toEqual({
      restDays: ["2026-11-17", "2026-11-24"],
      restartedOn: "2026-11-01",
      remindHour: 21,
    });
    await repo.clearUserHistory(user);
    expect(await repo.fetchStreakMarks(user)).toBeNull();
  });
});
