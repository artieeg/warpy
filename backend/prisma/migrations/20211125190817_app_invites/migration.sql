-- CreateTable
CREATE TABLE "AppInvite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppInvite.user_id_unique" ON "AppInvite"("user_id");

-- AddForeignKey
ALTER TABLE "AppInvite" ADD FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
