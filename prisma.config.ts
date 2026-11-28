import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Variables already in the environment win over .env.local.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

// Migrations need a direct connection on Neon (DATABASE_URL_UNPOOLED); `prisma generate` needs none.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  typedSql: { path: "prisma/sql" },
  datasource: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "" },
});
