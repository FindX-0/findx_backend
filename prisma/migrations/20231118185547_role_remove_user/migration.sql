/*
  Warnings:

  - The values [USER] on the enum `role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "role_new" AS ENUM ('SUPER_ADMIN');
ALTER TABLE "adminUsers" ALTER COLUMN "roles" TYPE "role_new"[] USING ("roles"::text::"role_new"[]);
ALTER TYPE "role" RENAME TO "role_old";
ALTER TYPE "role_new" RENAME TO "role";
DROP TYPE "role_old";
COMMIT;
