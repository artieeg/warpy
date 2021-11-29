/*
  Warnings:

  - You are about to drop the column `code` on the `AppliedAppInvite` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AppliedAppInvite.code_unique";

-- AlterTable
ALTER TABLE "AppliedAppInvite" DROP COLUMN "code";
