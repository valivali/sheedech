-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "onboardingId" TEXT NOT NULL,
    "dietaryRestrictions" TEXT[],
    "dietaryRestrictionsOther" TEXT,
    "strongDislikes" TEXT,
    "alcoholStance" TEXT,
    "smokingAsHost" TEXT[],
    "smokingAsHostOther" TEXT,
    "smokingAsGuest" TEXT[],
    "smokingAsGuestOther" TEXT,
    "spiceLevel" TEXT,
    "eventTypes" TEXT[],
    "preferredAgeRange" TEXT,
    "noiseLevel" TEXT,
    "petsBotherYou" BOOLEAN,
    "kidsOkay" BOOLEAN,
    "byobPotluckOkay" BOOLEAN,
    "contributionPreference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_onboardingId_key" ON "UserPreferences"("onboardingId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "UserOnboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

