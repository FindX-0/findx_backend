-- AlterTable
ALTER TABLE "accountVerification" ALTER COLUMN "isVerified" DROP DEFAULT;

-- AlterTable
ALTER TABLE "mathFields" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "isCompleted" DROP DEFAULT,
ALTER COLUMN "isOnline" DROP DEFAULT,
ALTER COLUMN "socketId" DROP DEFAULT;
