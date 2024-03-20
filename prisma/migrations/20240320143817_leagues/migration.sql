-- AlterTable
ALTER TABLE "mathSubFields" ADD COLUMN     "minTrophy" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "leagues" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fromTrophy" INTEGER NOT NULL,
    "mathFieldId" BIGINT NOT NULL,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
