/*
  Warnings:

  - You are about to drop the column `audioEnalbed` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "audioEnalbed",
ADD COLUMN     "audioEnabled" BOOLEAN NOT NULL DEFAULT false;
