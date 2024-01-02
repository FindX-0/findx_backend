/*
  Warnings:

  - Added the required column `isDraw` to the `mathBattleResults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mathBattleResults" ADD COLUMN     "isDraw" BOOLEAN NOT NULL;
