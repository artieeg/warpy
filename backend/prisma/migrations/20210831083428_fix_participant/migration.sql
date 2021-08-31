-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_stream_id_fkey";

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
