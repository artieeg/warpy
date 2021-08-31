/*
  Warnings:

  - You are about to drop the column `owner` on the `Stream` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_user_id_fkey";

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "owner",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD FOREIGN KEY ("owner_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
