/*
  Warnings:

  - You are about to drop the column `stream` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,stream_id]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stream_id` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "stream_participant_index";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "stream",
ADD COLUMN     "stream_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "stream_participant_index" ON "Participant"("user_id", "stream_id");

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("stream_id") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
