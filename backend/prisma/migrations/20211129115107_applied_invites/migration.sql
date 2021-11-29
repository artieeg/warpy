-- CreateTable
CREATE TABLE "AppliedAppInvite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" TEXT,
    "invite_id" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppliedAppInvite.code_unique" ON "AppliedAppInvite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AppliedAppInvite.user_id_unique" ON "AppliedAppInvite"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AppliedAppInvite.invite_id_unique" ON "AppliedAppInvite"("invite_id");

-- AddForeignKey
ALTER TABLE "AppliedAppInvite" ADD FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedAppInvite" ADD FOREIGN KEY ("invite_id") REFERENCES "AppInvite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
