/*
  Warnings:

  - You are about to drop the column `eventPermit` on the `PartnerPermit` table. All the data in the column will be lost.
  - You are about to drop the column `projectPermit` on the `PartnerPermit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PartnerPermit" DROP COLUMN "eventPermit",
DROP COLUMN "projectPermit",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "permitId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "eventPermit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "projectPermit" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "PartnerPermit_permitId_userId_idx" ON "PartnerPermit"("permitId", "userId");

-- AddForeignKey
ALTER TABLE "PartnerPermit" ADD CONSTRAINT "PartnerPermit_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "Permit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
