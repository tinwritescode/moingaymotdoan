// Áp dụng db/schema.sql lên nhánh Lakebase Postgres hiện tại qua kết nối trực tiếp (DATABASE_URL_UNPOOLED).
// Cách chạy: node --env-file=.env.local scripts/db-migrate.mjs
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) {
  console.error("Thiếu DATABASE_URL_UNPOOLED. Hãy chạy `neon env pull` hoặc truyền --env-file=.env.local.");
  process.exit(1);
}

const sql = await readFile(join(import.meta.dirname, "..", "db", "schema.sql"), "utf8");
const client = new pg.Client({ connectionString });
await client.connect();
try {
  await client.query(sql);
  console.log("Đã áp dụng db/schema.sql thành công.");
} finally {
  await client.end();
}
