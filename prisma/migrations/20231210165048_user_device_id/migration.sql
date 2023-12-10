/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "authProvider" ADD VALUE 'NONE';

-- DropIndex
DROP INDEX "users_email_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deviceId" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "passwordHash" DROP NOT NULL,
ALTER COLUMN "authProvider" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "users_deviceId_key" ON "users"("deviceId");

-- CreateIndex
CREATE INDEX "users_email_deviceId_idx" ON "users"("email", "deviceId");
