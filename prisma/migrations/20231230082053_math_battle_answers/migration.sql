-- CreateTable
CREATE TABLE "MathBattleAnswer" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCorrect" BOOLEAN NOT NULL,
    "userId" BIGINT NOT NULL,
    "mathProblemId" BIGINT NOT NULL,
    "matchId" BIGINT NOT NULL,

    CONSTRAINT "MathBattleAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MathBattleAnswer" ADD CONSTRAINT "MathBattleAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MathBattleAnswer" ADD CONSTRAINT "MathBattleAnswer_mathProblemId_fkey" FOREIGN KEY ("mathProblemId") REFERENCES "mathProblems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MathBattleAnswer" ADD CONSTRAINT "MathBattleAnswer_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
