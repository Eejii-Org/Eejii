/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Certificate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_organizationId_fkey";

-- DropIndex
DROP INDEX "Certificate_volunteerId_organizationId_idx";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "organizationId",
ADD COLUMN     "eventId" TEXT;

-- CreateIndex
CREATE INDEX "Certificate_volunteerId_eventId_idx" ON "Certificate"("volunteerId", "eventId");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
