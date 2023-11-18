-- DropForeignKey
ALTER TABLE "refreshTokens" DROP CONSTRAINT "refreshTokens_userId_fkey";

-- AlterTable
ALTER TABLE "refreshTokens" ADD COLUMN     "adminUserId" BIGINT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "adminUsers" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userName" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,

    CONSTRAINT "adminUsers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "adminUsers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
