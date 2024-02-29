/*
  Warnings:

  - You are about to alter the column `weight` on the `answerFunctions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Real`.

*/
-- AlterTable
ALTER TABLE "answerFunctions" ALTER COLUMN "weight" SET DATA TYPE REAL;

-- AlterTable
ALTER TABLE "mathProblems" ALTER COLUMN "difficulty" SET DATA TYPE REAL;
