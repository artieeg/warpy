/*
  Warnings:

  - A unique constraint covering the columns `[owner]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Candidate.owner_unique" ON "Candidate"("owner");
