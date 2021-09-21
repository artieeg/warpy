/*
  Warnings:

  - Made the column `recvNodeId` on table `Participant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "hasLeftStream" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "recvNodeId" SET NOT NULL;
