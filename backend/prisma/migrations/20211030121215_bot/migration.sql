-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "botname" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot.name_unique" ON "Bot"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bot.botname_unique" ON "Bot"("botname");

-- AddForeignKey
ALTER TABLE "Bot" ADD FOREIGN KEY ("creator_id") REFERENCES "DeveloperAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
