/*
  Warnings:

  - You are about to drop the column `hub` on the `Stream` table. All the data in the column will be lost.
  - Added the required column `category` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "hub",
ADD COLUMN     "category" TEXT NOT NULL;
