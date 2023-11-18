-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "adminUsers" ADD COLUMN     "roles" "role"[];
