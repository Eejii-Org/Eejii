-- AlterEnum
ALTER TYPE "PermitType" ADD VALUE 'BANNER';

-- AlterTable
ALTER TABLE "Permit" ADD COLUMN     "bannerPositionId" TEXT;

-- CreateIndex
CREATE INDEX "Permit_bannerPositionId_idx" ON "Permit"("bannerPositionId");

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_bannerPositionId_fkey" FOREIGN KEY ("bannerPositionId") REFERENCES "BannerPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
