-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "Stream" ADD FOREIGN KEY ("owner_id") REFERENCES "Participant"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
