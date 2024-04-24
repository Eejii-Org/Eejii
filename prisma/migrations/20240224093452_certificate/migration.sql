/*
  Warnings:

  - You are about to drop the column `stampPath` on the `CertificateTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CertificateTemplate` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CertificateTemplate_userId_idx";

-- AlterTable
ALTER TABLE "CertificateTemplate" DROP COLUMN "stampPath",
DROP COLUMN "title",
ADD COLUMN     "eventId" TEXT;

-- CreateIndex
CREATE INDEX "CertificateTemplate_userId_eventId_idx" ON "CertificateTemplate"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "CertificateTemplate" ADD CONSTRAINT "CertificateTemplate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
