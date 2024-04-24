/*
  Warnings:

  - You are about to drop the column `description` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Certificate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "description",
DROP COLUMN "name";
