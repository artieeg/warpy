/*
  Warnings:

  - You are about to drop the column `claps` on the `Stream` table. All the data in the column will be lost.
  - Added the required column `reactions` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_stream_id_fkey";

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "claps",
ADD COLUMN     "reactions" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
