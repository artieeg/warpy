-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
