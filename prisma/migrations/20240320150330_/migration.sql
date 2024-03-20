-- CreateTable
CREATE TABLE "standardTrophyRangeSystem" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromTrophy" INTEGER NOT NULL,
    "loseChange" INTEGER NOT NULL,
    "winChange" INTEGER NOT NULL,
    "mathFieldId" BIGINT NOT NULL,

    CONSTRAINT "standardTrophyRangeSystem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "standardTrophyRangeSystem" ADD CONSTRAINT "standardTrophyRangeSystem_mathFieldId_fkey" FOREIGN KEY ("mathFieldId") REFERENCES "mathFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
