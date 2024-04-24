/*
  Warnings:

  - You are about to drop the column `bannerPermit` on the `PartnerPermit` table. All the data in the column will be lost.
  - You are about to drop the column `bannerPermit` on the `Permit` table. All the data in the column will be lost.
  - You are about to drop the column `eventPermit` on the `Permit` table. All the data in the column will be lost.
  - You are about to drop the column `projectPermit` on the `Permit` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Permit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Permit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PermitType" AS ENUM ('EVENT', 'PROJECT');

-- AlterTable
ALTER TABLE "PartnerPermit" DROP COLUMN "bannerPermit";

-- AlterTable
ALTER TABLE "Permit" DROP COLUMN "bannerPermit",
DROP COLUMN "eventPermit",
DROP COLUMN "projectPermit",
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "type" "PermitType" NOT NULL;
