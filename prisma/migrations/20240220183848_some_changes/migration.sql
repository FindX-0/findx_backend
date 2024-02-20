-- AlterTable
ALTER TABLE "answerFunctions" ADD COLUMN     "mathSubFieldId" BIGINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "mathProblems" ADD COLUMN     "generatedBatchName" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "answerFunctions" ADD CONSTRAINT "answerFunctions_mathSubFieldId_fkey" FOREIGN KEY ("mathSubFieldId") REFERENCES "mathSubFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
