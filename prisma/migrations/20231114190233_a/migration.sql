/*
  Warnings:

  - Added the required column `mathFieldId` to the `mathSubFields` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mathSubFields" ADD COLUMN     "mathFieldId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "mathSubFields" ADD CONSTRAINT "mathSubFields_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
