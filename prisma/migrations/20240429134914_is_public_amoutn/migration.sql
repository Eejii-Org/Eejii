/*
  Warnings:

  - You are about to drop the column `isPublicName` on the `Donation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "isPublicName",
ADD COLUMN     "isPublicAmount" BOOLEAN NOT NULL DEFAULT false;
