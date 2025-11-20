/*
  Warnings:

  - You are about to drop the column `address` on the `UserOnboarding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserOnboarding" DROP COLUMN "address";

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "onboardingId" TEXT NOT NULL,
    "lon" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "postalCode" TEXT,
    "confidenceStreetLevel" DOUBLE PRECISION,
    "confidenceCityLevel" DOUBLE PRECISION,
    "formattedAddress" TEXT NOT NULL,
    "streetName" TEXT,
    "houseNumber" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_onboardingId_key" ON "Address"("onboardingId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "UserOnboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;
