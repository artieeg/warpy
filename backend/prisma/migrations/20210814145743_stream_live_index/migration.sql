/*
  Warnings:

  - A unique constraint covering the columns `[owner,live]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "live_index" ON "Stream"("owner", "live");
