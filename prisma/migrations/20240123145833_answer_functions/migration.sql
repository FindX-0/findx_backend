-- CreateTable
CREATE TABLE "answerFunctions" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "func" TEXT NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "condition" TEXT,

    CONSTRAINT "answerFunctions_pkey" PRIMARY KEY ("id")
);
