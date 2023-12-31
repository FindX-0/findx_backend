/*
  Warnings:

  - The values [PENDING] on the enum `matchState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
UPDATE "matches" SET "state"='IN_PROGRESS' WHERE "state"='PENDING';

CREATE TYPE "matchState_new" AS ENUM ('IN_PROGRESS', 'FINISHED');
ALTER TABLE "matches" ALTER COLUMN "state" TYPE "matchState_new" USING ("state"::text::"matchState_new");
ALTER TYPE "matchState" RENAME TO "matchState_old";
ALTER TYPE "matchState_new" RENAME TO "matchState";
DROP TYPE "matchState_old";

COMMIT;
