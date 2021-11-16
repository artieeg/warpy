/*
  Warnings:

  - A unique constraint covering the columns `[id,user_invitee_id]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invitee_index" ON "Invite"("id", "user_invitee_id");
