/*
  Warnings:

  - A unique constraint covering the columns `[blocked_id,blocker_id]` on the table `UserBlock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "blocked_index" ON "UserBlock"("blocked_id", "blocker_id");
