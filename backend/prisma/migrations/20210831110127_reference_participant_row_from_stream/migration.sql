-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_owner_id_fkey";

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Stream" ADD FOREIGN KEY ("owner_id") REFERENCES "Participant"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
