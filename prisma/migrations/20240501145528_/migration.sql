/*
  Warnings:

  - You are about to drop the column `commissionFee` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "commissionFee",
ADD COLUMN     "fee" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "feePercentage" INTEGER NOT NULL DEFAULT 3;
