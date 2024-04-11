-- CreateEnum
CREATE TYPE "friendshipStatus" AS ENUM ('REQUESTED', 'ACCEPTED');

-- CreateTable
CREATE TABLE "friends" (
    "userId" BIGINT NOT NULL,
    "friendId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "friendshipStatus" NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("userId","friendId")
);

-- CreateIndex
CREATE UNIQUE INDEX "friends_userId_friendId_key" ON "friends"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
