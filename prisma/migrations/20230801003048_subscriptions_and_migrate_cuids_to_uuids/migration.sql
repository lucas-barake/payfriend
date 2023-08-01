-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('BASIC');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('SUCCESS', 'PENDING', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ActiveSubscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "nextDueDate" TIMESTAMPTZ(6) NOT NULL,
    "externalReference" TEXT NOT NULL,

    CONSTRAINT "ActiveSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "nextDueDate" TIMESTAMPTZ(6) NOT NULL,
    "externalReference" TEXT NOT NULL,

    CONSTRAINT "SubscriptionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveSubscription_userId_key" ON "ActiveSubscription"("userId");

-- AddForeignKey
ALTER TABLE "ActiveSubscription" ADD CONSTRAINT "ActiveSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionHistory" ADD CONSTRAINT "SubscriptionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
