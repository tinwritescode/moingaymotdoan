-- Baseline: the tables as db/schema.sql made them, so production is marked applied, not changed.
-- Hand-added: CHECK constraints, rest_days NOT NULL and the reading_logs UNIQUE constraint,
-- which Prisma's generated SQL leaves out or writes as an index.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "reading_progress" (
    "user_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "item_key" TEXT NOT NULL,
    "book_slug" TEXT,
    "chapter" INTEGER,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "first_read_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "last_read_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "read_count" INTEGER NOT NULL DEFAULT 1,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "reading_progress_pkey" PRIMARY KEY ("user_id","kind","item_key"),
    CONSTRAINT "reading_progress_kind_check" CHECK ("kind" IN ('chapter', 'mood'))
);

-- CreateTable
CREATE TABLE "reading_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "item_key" TEXT NOT NULL,
    "book_slug" TEXT,
    "chapter" INTEGER,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "read_date" DATE NOT NULL,
    "read_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "reading_logs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "reading_logs_user_id_kind_item_key_read_date_key" UNIQUE ("user_id", "kind", "item_key", "read_date"),
    CONSTRAINT "reading_logs_kind_check" CHECK ("kind" IN ('chapter', 'mood'))
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "tz" TEXT NOT NULL,
    "remind_hour" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "last_read_date" DATE,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_sent_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("endpoint"),
    CONSTRAINT "push_subscriptions_remind_hour_check" CHECK ("remind_hour" BETWEEN 6 AND 23),
    CONSTRAINT "push_subscriptions_locale_check" CHECK ("locale" IN ('vi', 'en')),
    CONSTRAINT "push_subscriptions_streak_check" CHECK ("streak" >= 0)
);

-- CreateTable
CREATE TABLE "streak_marks" (
    "user_id" TEXT NOT NULL,
    "rest_days" DATE[] NOT NULL DEFAULT '{}',
    "restarted_on" DATE,
    "remind_hour" INTEGER NOT NULL DEFAULT 21,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "streak_marks_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "streak_marks_remind_hour_check" CHECK ("remind_hour" BETWEEN 6 AND 23)
);

-- CreateIndex
CREATE INDEX "reading_progress_user_last_read_idx" ON "reading_progress"("user_id", "last_read_at" DESC);

-- CreateIndex
CREATE INDEX "reading_logs_user_date_idx" ON "reading_logs"("user_id", "read_date" DESC, "read_at" DESC);

