/*
  Warnings:

  - You are about to drop the column `invited_id` on the `Invite` table. All the data in the column will be lost.
  - Added the required column `inviter_id` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stream_id` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_invited_id_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "invited_id",
ADD COLUMN     "inviter_id" TEXT NOT NULL,
ADD COLUMN     "stream_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Invite" ADD FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD FOREIGN KEY ("inviter_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
