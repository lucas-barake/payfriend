/*
  Warnings:

  - Added the required column `endDate` to the `ActiveSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `ActiveSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `SubscriptionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `SubscriptionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveSubscription" ADD COLUMN     "endDate" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionHistory" ADD COLUMN     "endDate" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMPTZ(6) NOT NULL;
