-- CreateTable
CREATE TABLE "UserBlock" (
    "id" TEXT NOT NULL,
    "blocked_id" TEXT NOT NULL,
    "blocker_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock.blocked_id_unique" ON "UserBlock"("blocked_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock.blocker_id_unique" ON "UserBlock"("blocker_id");

-- AddForeignKey
ALTER TABLE "UserBlock" ADD FOREIGN KEY ("blocked_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD FOREIGN KEY ("blocked_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
