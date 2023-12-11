/*
  Warnings:

  - Added the required column `closeAt` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "closeAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userIds" TEXT[];
