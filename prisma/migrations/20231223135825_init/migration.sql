-- CreateEnum
CREATE TYPE "authProvider" AS ENUM ('EMAIL', 'GOOGLE', 'APPLE', 'FACEBOOK', 'NONE');

-- CreateEnum
CREATE TYPE "ticketState" AS ENUM ('PROCESSING', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "matchState" AS ENUM ('PENDING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('SUPER_ADMIN');

-- CreateTable
CREATE TABLE "mediaFiles" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" VARCHAR(255) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "mimetype" VARCHAR(255) NOT NULL,

    CONSTRAINT "mediaFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255),
    "userName" VARCHAR(255),
    "passwordHash" VARCHAR(255),
    "isCompleted" BOOLEAN NOT NULL,
    "authProvider" "authProvider" NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "socketId" VARCHAR(255) NOT NULL,
    "deviceId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adminUsers" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "roles" "role"[],

    CONSTRAINT "adminUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refreshTokens" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" BIGINT,
    "adminUserId" BIGINT,
    "value" TEXT NOT NULL,

    CONSTRAINT "refreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountVerification" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN NOT NULL,
    "oneTimeCode" INTEGER NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "accountVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mathFields" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mathFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mathSubFields" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "mathFieldId" BIGINT NOT NULL,

    CONSTRAINT "mathSubFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mathFieldId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "state" "ticketState" NOT NULL,
    "matchId" BIGINT,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "closeAt" TIMESTAMP(3) NOT NULL,
    "state" "matchState" NOT NULL,
    "mathFieldId" BIGINT NOT NULL,
    "userIds" TEXT[],
    "mathProblemIds" TEXT[],

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mathProblems" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "difficulty" SMALLINT NOT NULL,
    "imageMediaIds" TEXT[],
    "text" TEXT,
    "tex" TEXT,
    "answers" JSONB,
    "mathFieldId" BIGINT NOT NULL,
    "mathSubFieldId" BIGINT NOT NULL,

    CONSTRAINT "mathProblems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mediaFiles_mimetype_idx" ON "mediaFiles"("mimetype");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_deviceId_key" ON "users"("deviceId");

-- CreateIndex
CREATE INDEX "users_email_deviceId_idx" ON "users"("email", "deviceId");

-- CreateIndex
CREATE INDEX "refreshTokens_value_idx" ON "refreshTokens" USING HASH ("value");

-- CreateIndex
CREATE UNIQUE INDEX "accountVerification_userId_key" ON "accountVerification"("userId");

-- AddForeignKey
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "adminUsers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountVerification" ADD CONSTRAINT "accountVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mathSubFields" ADD CONSTRAINT "mathSubFields_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mathProblems" ADD CONSTRAINT "mathProblems_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mathProblems" ADD CONSTRAINT "mathProblems_mathSubFieldId_fkey" FOREIGN KEY ("mathSubFieldId") REFERENCES "mathSubFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
