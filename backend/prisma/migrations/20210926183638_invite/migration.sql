-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "invitee_id" TEXT NOT NULL,
    "invited_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invite" ADD FOREIGN KEY ("invitee_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD FOREIGN KEY ("invited_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
