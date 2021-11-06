-- AlterTable
ALTER TABLE "BotInstance" ADD COLUMN     "stream_id" TEXT;

-- AddForeignKey
ALTER TABLE "BotInstance" ADD FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
