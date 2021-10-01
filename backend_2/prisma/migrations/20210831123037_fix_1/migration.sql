/*
  Warnings:

  - You are about to drop the column `userId` on the `Stream` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_userId_fkey";

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "userId";
