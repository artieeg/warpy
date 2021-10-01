/*
  Warnings:

  - A unique constraint covering the columns `[user_id,stream]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stream_participant_index" ON "Participant"("user_id", "stream");
