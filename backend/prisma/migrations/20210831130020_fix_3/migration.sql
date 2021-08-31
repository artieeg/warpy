-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_stream_id_fkey";

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "stream_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;
