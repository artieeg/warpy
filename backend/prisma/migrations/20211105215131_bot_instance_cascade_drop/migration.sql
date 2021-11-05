-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_bot_id_fkey";

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("bot_id") REFERENCES "BotInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
