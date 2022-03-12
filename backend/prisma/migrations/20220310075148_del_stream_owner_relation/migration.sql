-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_owner_id_fkey";
