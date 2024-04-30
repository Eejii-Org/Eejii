/*
  Warnings:

  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('AWAITING_PAYMENT', 'CANCELLED', 'PAID');

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT';
