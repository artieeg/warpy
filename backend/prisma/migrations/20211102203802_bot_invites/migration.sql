/*
  Warnings:

  - You are about to drop the column `invitee_id` on the `Invite` table. All the data in the column will be lost.
  - Added the required column `bot_invitee_id` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_invitee_id` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_invitee_id_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "invitee_id",
ADD COLUMN     "bot_invitee_id" TEXT NOT NULL,
ADD COLUMN     "user_invitee_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Invite" ADD FOREIGN KEY ("user_invitee_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD FOREIGN KEY ("bot_invitee_id") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
