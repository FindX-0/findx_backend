-- AlterTable
ALTER TABLE "mathBattleAnswers" RENAME CONSTRAINT "MathBattleAnswer_pkey" TO "mathBattleAnswers_pkey";

-- RenameForeignKey
ALTER TABLE "mathBattleAnswers" RENAME CONSTRAINT "MathBattleAnswer_matchId_fkey" TO "mathBattleAnswers_matchId_fkey";

-- RenameForeignKey
ALTER TABLE "mathBattleAnswers" RENAME CONSTRAINT "MathBattleAnswer_mathProblemId_fkey" TO "mathBattleAnswers_mathProblemId_fkey";

-- RenameForeignKey
ALTER TABLE "mathBattleAnswers" RENAME CONSTRAINT "MathBattleAnswer_userId_fkey" TO "mathBattleAnswers_userId_fkey";
