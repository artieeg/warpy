/*
  Warnings:

  - A unique constraint covering the columns `[bot_id]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bot_id` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "bot_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant.bot_id_unique" ON "Participant"("bot_id");

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("bot_id") REFERENCES "BotInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
