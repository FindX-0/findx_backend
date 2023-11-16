/*
  Warnings:

  - You are about to drop the column `mathConceptId` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `mathFieldId` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mathFieldId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "mathFieldId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "mathConceptId",
ADD COLUMN     "mathFieldId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
