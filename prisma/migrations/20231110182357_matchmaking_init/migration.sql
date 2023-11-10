-- CreateEnum
CREATE TYPE "ticketState" AS ENUM ('PROCESSING', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "matchState" AS ENUM ('PENDING', 'IN_PROGRESS', 'FINISHED');

-- CreateTable
CREATE TABLE "MathConcept" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MathConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mathConceptId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "state" "ticketState" NOT NULL,
    "matchId" BIGINT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" "matchState" NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);
