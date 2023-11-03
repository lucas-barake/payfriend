/*
  Warnings:

  - You are about to drop the column `currency` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currency",
ADD COLUMN     "preferences" JSONB;
