-- CreateTable
CREATE TABLE "MediaFile" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" VARCHAR(255) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(255) NOT NULL,

    CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);
