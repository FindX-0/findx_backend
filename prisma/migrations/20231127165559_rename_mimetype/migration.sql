/*
  Warnings:

  - You are about to drop the column `mimeType` on the `mediaFiles` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `mediaFiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "mediaFiles_mimeType_idx";

-- AlterTable
ALTER TABLE "mediaFiles" DROP COLUMN "mimeType",
ADD COLUMN     "mimetype" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX "mediaFiles_mimetype_idx" ON "mediaFiles"("mimetype");
