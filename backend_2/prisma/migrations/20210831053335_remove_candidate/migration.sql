/*
  Warnings:

  - You are about to drop the `Candidate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_stream_id_fkey";

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "preview" TEXT;

-- DropTable
DROP TABLE "Candidate";

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
