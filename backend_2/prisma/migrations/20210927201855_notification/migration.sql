-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "invite_id" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("invite_id") REFERENCES "Invite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
