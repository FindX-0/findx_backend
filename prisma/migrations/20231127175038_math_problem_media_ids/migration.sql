/*
  Warnings:

  - You are about to drop the column `imagePaths` on the `mathProblems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mathProblems" DROP COLUMN "imagePaths",
ADD COLUMN     "imageMediaIds" TEXT[];
