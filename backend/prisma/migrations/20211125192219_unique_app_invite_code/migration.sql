/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `AppInvite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AppInvite.code_unique" ON "AppInvite"("code");
