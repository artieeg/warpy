/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `UsernameClaim` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `UsernameClaim` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UsernameClaim.phone_unique" ON "UsernameClaim"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "UsernameClaim.username_unique" ON "UsernameClaim"("username");
