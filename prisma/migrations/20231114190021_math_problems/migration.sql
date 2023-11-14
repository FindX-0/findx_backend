/*
  Warnings:

  - You are about to drop the `mathConcepts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "mathConcepts";

-- CreateTable
CREATE TABLE "mathFields" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mathFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mathSubFields" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mathSubFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mathProblems" (
    "id" BIGSERIAL NOT NULL,
    "difficulty" SMALLINT NOT NULL,
    "imagePaths" TEXT[],
    "text" TEXT,
    "tex" TEXT,
    "mathFieldId" BIGINT NOT NULL,
    "mathSubFieldId" BIGINT NOT NULL,

    CONSTRAINT "mathProblems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mathProblems" ADD CONSTRAINT "mathProblems_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mathProblems" ADD CONSTRAINT "mathProblems_mathSubFieldId_fkey" FOREIGN KEY ("mathSubFieldId") REFERENCES "mathSubFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
