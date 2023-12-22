/*
  Warnings:

  - You are about to drop the column `answers` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `mathProblemIds` on the `matches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "matches" DROP COLUMN "answers",
DROP COLUMN "mathProblemIds";
