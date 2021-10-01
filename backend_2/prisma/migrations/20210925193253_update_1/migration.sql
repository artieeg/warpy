-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_owner_id_fkey";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "left_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Stream" ADD FOREIGN KEY ("owner_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
