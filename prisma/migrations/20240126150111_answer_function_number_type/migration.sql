-- CreateEnum
CREATE TYPE "numberType" AS ENUM ('INTEGER', 'DECIMAL');

-- AlterTable
ALTER TABLE "answerFunctions" ADD COLUMN     "numberType" "numberType" NOT NULL DEFAULT 'INTEGER';
