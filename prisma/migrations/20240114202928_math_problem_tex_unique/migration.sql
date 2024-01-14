/*
  Warnings:

  - A unique constraint covering the columns `[tex]` on the table `mathProblems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mathProblems_tex_key" ON "mathProblems"("tex");
