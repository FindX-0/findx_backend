-- Alter
ALTER TABLE "MathBattleAnswer" RENAME TO "mathBattleAnswers";

-- CreateTable
CREATE TABLE "mathBattleResults" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL,
    "isWinner" BOOLEAN NOT NULL,
    "matchId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "mathBattleResults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mathBattleResults" ADD CONSTRAINT "mathBattleResults_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mathBattleResults" ADD CONSTRAINT "mathBattleResults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
