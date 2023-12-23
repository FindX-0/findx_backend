/*
  Warnings:

  - The `answers` column on the `mathProblems` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "mathProblems" DROP COLUMN "answers",
ADD COLUMN     "answers" JSONB[];
