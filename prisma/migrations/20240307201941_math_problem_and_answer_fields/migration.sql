-- AlterTable
ALTER TABLE "mathBattleAnswers" ADD COLUMN     "timeSpentInMillis" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "mathProblems" ADD COLUMN     "meanTimeSpentInMillis" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timesAnswered" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "mathProblems_generatedBatchName_difficulty_idx" ON "mathProblems"("generatedBatchName", "difficulty");
