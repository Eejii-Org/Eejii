/*
  Warnings:

  - You are about to drop the column `permitId` on the `InvoiceItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_permitId_fkey";

-- AlterTable
ALTER TABLE "InvoiceItem" DROP COLUMN "permitId";
