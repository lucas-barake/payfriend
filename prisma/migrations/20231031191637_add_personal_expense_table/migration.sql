/*
  Warnings:

  - The primary key for the `Borrower` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Borrower` table. All the data in the column will be lost.
  - The `archived` column on the `Debt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `balance` to the `Borrower` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'MISSED', 'PENDING_CONFIRMATION');

-- DropIndex
DROP INDEX "Borrower_userId_debtId_key";

-- AlterTable
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_pkey",
DROP COLUMN "id",
DROP COLUMN "status",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "Borrower_pkey" PRIMARY KEY ("userId", "debtId");

-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "processedAt" TIMESTAMPTZ(6),
DROP COLUMN "archived",
ADD COLUMN     "archived" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" TEXT;

-- DropEnum
DROP TYPE "BorrowerStatus";

-- CreateTable
CREATE TABLE "PersonalExpense" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "currency" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PersonalExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "debtId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PersonalExpense_userId_createdAt_idx" ON "PersonalExpense"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PersonalExpense_userId_amount_idx" ON "PersonalExpense"("userId", "amount");

-- CreateIndex
CREATE INDEX "Borrower_debtId_idx" ON "Borrower"("debtId");

-- CreateIndex
CREATE INDEX "Debt_lenderId_archived_idx" ON "Debt"("lenderId", "archived");

-- CreateIndex
CREATE INDEX "Debt_createdAt_idx" ON "Debt"("createdAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PersonalExpense" ADD CONSTRAINT "PersonalExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_borrowerId_debtId_fkey" FOREIGN KEY ("borrowerId", "debtId") REFERENCES "Borrower"("userId", "debtId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
