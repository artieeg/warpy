/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "StreamBlock" (
    "id" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreamBlock.user_id_unique" ON "StreamBlock"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Participant.user_id_unique" ON "Participant"("user_id");

-- AddForeignKey
ALTER TABLE "StreamBlock" ADD FOREIGN KEY ("stream_id") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamBlock" ADD FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
