/*
  Warnings:

  - Made the column `owner_id` on table `Stream` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "audioEnalbed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "videoEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Stream" ALTER COLUMN "owner_id" SET NOT NULL;
