import { attachDatabasePool } from "@neon/functions";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import type { OriginPolicy } from "../../lib/history/ports";
import { createHistoryApp } from "./app";
import { PrismaClient } from "./generated/prisma/client";
import { createJwksTokenVerifier, createWorkosTokenVerifier } from "./jwks-verifier";
import { createPostgresHistoryRepository } from "./postgres-repository";
import { createPostgresPushStore, createWebPushSender } from "./push-adapters";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://moingaymotdoan.xyz",
  "https://www.moingaymotdoan.xyz",
  "https://bible.tyvn.online",
  "https://www.bible.tyvn.online",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const VERCEL_PREVIEW_RE = /^https:\/\/kinh-thanh(?:-[a-z0-9-]+)?\.vercel\.app$/u;

function createOriginPolicyFromEnv(extraCsv?: string): OriginPolicy {
  const allowed = new Set(DEFAULT_ALLOWED_ORIGINS);
  if (extraCsv) {
    for (const part of extraCsv.split(",")) {
      const trimmed = part.trim().replace(/\/+$/u, "");
      if (trimmed) allowed.add(trimmed);
    }
  }
  return (origin) => allowed.has(origin) || VERCEL_PREVIEW_RE.test(origin);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const jwksUrl = process.env.JWKS_URL?.trim();
const jwtIssuers = process.env.JWT_ISSUERS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const workosClientId = process.env.WORKOS_CLIENT_ID?.trim();

const verifyToken =
  jwksUrl && jwtIssuers && jwtIssuers.length > 0
    ? createJwksTokenVerifier({ jwksUrl, issuers: jwtIssuers })
    : (() => {
        if (!workosClientId) throw new Error("WORKOS_CLIENT_ID is required");
        return createWorkosTokenVerifier({
          clientId: workosClientId,
          apiHostname: process.env.WORKOS_API_HOSTNAME,
        });
      })();

const pool = new Pool({ connectionString: databaseUrl, max: 5 });
attachDatabasePool(pool);
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY?.trim();
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY?.trim();
const vapidSubject = process.env.VAPID_SUBJECT?.trim() || "https://moingaymotdoan.xyz";

const app = createHistoryApp({
  repository: createPostgresHistoryRepository(prisma),
  verifyToken,
  isOriginAllowed: createOriginPolicyFromEnv(process.env.ALLOWED_ORIGINS),
  push:
    vapidPublicKey && vapidPrivateKey
      ? {
          store: createPostgresPushStore(prisma),
          send: createWebPushSender({ subject: vapidSubject, publicKey: vapidPublicKey, privateKey: vapidPrivateKey }),
        }
      : undefined,
});

export default app;
