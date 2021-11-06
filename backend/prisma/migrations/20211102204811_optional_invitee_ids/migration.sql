-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "bot_invitee_id" DROP NOT NULL,
ALTER COLUMN "user_invitee_id" DROP NOT NULL;
