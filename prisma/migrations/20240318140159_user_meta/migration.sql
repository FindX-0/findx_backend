-- CreateTable
CREATE TABLE "userMeta" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trophies" INTEGER NOT NULL DEFAULT 0,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "userMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userMeta_userId_key" ON "userMeta"("userId");

-- AddForeignKey
ALTER TABLE "userMeta" ADD CONSTRAINT "userMeta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
