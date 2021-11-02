-- CreateTable
CREATE TABLE "BotInstance" (
    "id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotInstance" ADD FOREIGN KEY ("bot_id") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
