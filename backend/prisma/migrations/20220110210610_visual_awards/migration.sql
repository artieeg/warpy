/*
  Warnings:

  - You are about to drop the column `award_id` on the `Award` table. All the data in the column will be lost.
  - You are about to drop the `AwardItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `visual` to the `Award` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Award" DROP CONSTRAINT "Award_award_id_fkey";

-- AlterTable
ALTER TABLE "Award" DROP COLUMN "award_id",
ADD COLUMN     "visual" TEXT NOT NULL;

-- DropTable
DROP TABLE "AwardItem";
