/*
  Warnings:

  - A unique constraint covering the columns `[id,inviter_id]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inviter_index" ON "Invite"("id", "inviter_id");
