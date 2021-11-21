-- CreateTable
CREATE TABLE "CoinBalance" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoinBalance.user_id_unique" ON "CoinBalance"("user_id");

-- AddForeignKey
ALTER TABLE "CoinBalance" ADD FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
