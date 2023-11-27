/*
  Warnings:

  - You are about to drop the `MediaFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MediaFile";

-- CreateTable
CREATE TABLE "mediaFiles" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" VARCHAR(255) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(255) NOT NULL,

    CONSTRAINT "mediaFiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mediaFiles_mimeType_idx" ON "mediaFiles"("mimeType");
