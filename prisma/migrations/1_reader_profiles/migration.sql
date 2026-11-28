-- CreateTable
CREATE TABLE "reader_profiles" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reader_profiles_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "reader_profiles_name_check" CHECK (char_length("name") BETWEEN 1 AND 40),
    CONSTRAINT "reader_profiles_avatar_check" CHECK ("avatar" IS NULL OR ("avatar" LIKE 'data:image/jpeg;base64,%' AND char_length("avatar") <= 100000))
);
