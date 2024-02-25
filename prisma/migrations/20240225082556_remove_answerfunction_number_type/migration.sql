/*
  Warnings:

  - You are about to drop the column `numberType` on the `answerFunctions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "answerFunctions" DROP COLUMN "numberType",
ALTER COLUMN "mathSubFieldId" DROP DEFAULT;
