/*
  Warnings:

  - You are about to drop the column `bannerPositionId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `partnerPlanId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PartnerPermit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartnerPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('PREMIUM', 'BASIC');

-- DropForeignKey
ALTER TABLE "PartnerPermit" DROP CONSTRAINT "PartnerPermit_permitId_fkey";

-- DropForeignKey
ALTER TABLE "PartnerPermit" DROP CONSTRAINT "PartnerPermit_userId_fkey";

-- DropForeignKey
ALTER TABLE "PartnerPlan" DROP CONSTRAINT "PartnerPlan_planId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bannerPositionId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_planId_fkey";

-- DropForeignKey
ALTER TABLE "PlanImage" DROP CONSTRAINT "PlanImage_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_partnerPlanId_fkey";

-- DropIndex
DROP INDEX "Payment_planId_bannerPositionId_permitId_donationId_payment_idx";

-- DropIndex
DROP INDEX "Permit_bannerPositionId_idx";

-- DropIndex
DROP INDEX "User_partnerPlanId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "bannerPositionId",
DROP COLUMN "planId";

-- AlterTable
ALTER TABLE "Permit" ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "partnerPlanId",
ADD COLUMN     "mediaPermit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionId" TEXT;

-- DropTable
DROP TABLE "PartnerPermit";

-- DropTable
DROP TABLE "PartnerPlan";

-- DropTable
DROP TABLE "PlanImage";

-- DropTable
DROP TABLE "UserPlan";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maxProjects" INTEGER NOT NULL,
    "maxEvents" INTEGER NOT NULL,
    "maxMedia" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_permitId_donationId_paymentMethodId_idx" ON "Payment"("permitId", "donationId", "paymentMethodId");

-- CreateIndex
CREATE INDEX "Permit_bannerPositionId_subscriptionId_idx" ON "Permit"("bannerPositionId", "subscriptionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
