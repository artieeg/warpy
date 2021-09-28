/*
  Warnings:

  - A unique constraint covering the columns `[invite_id]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification.invite_id_unique" ON "Notification"("invite_id");
