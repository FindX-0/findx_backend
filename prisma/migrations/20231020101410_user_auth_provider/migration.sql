-- CreateEnum
CREATE TYPE "authProvider" AS ENUM ('EMAIL', 'GOOGLE', 'APPLE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authProvider" "authProvider" NOT NULL DEFAULT 'EMAIL';
