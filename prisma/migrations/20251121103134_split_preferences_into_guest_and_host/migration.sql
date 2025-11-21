-- CreateTable
CREATE TABLE "UserGuestPreferences" (
    "id" TEXT NOT NULL,
    "onboardingId" TEXT NOT NULL,
    "dietaryRestrictions" TEXT[],
    "dietaryRestrictionsOther" TEXT,
    "strongDislikes" TEXT,
    "alcoholStance" TEXT,
    "smokingAsGuest" TEXT[],
    "smokingAsGuestOther" TEXT,
    "spiceLevel" TEXT,
    "petsBotherYou" BOOLEAN,
    "contributionPreference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGuestPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHostPreferences" (
    "id" TEXT NOT NULL,
    "onboardingId" TEXT NOT NULL,
    "smokingAsHost" TEXT[],
    "smokingAsHostOther" TEXT,
    "eventTypes" TEXT[],
    "preferredAgeRange" TEXT,
    "noiseLevel" TEXT,
    "kidsOkay" BOOLEAN,
    "byobPotluckOkay" BOOLEAN,
    "propertyType" TEXT,
    "neighborhoodNotes" TEXT,
    "maxGuests" INTEGER,
    "indoorOutdoorSeating" TEXT,
    "diningTableSize" INTEGER,
    "accessibility" TEXT[],
    "parking" TEXT[],
    "publicTransportInfo" TEXT,
    "hasPets" BOOLEAN,
    "hypoallergenicPet" BOOLEAN,
    "petsFreeRoam" BOOLEAN,
    "quietHours" TEXT,
    "shoesOff" BOOLEAN,
    "diningAreaPhotos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserHostPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGuestPreferences_onboardingId_key" ON "UserGuestPreferences"("onboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserHostPreferences_onboardingId_key" ON "UserHostPreferences"("onboardingId");

-- Migrate existing data from UserPreferences
INSERT INTO "UserGuestPreferences" (
    "id",
    "onboardingId",
    "dietaryRestrictions",
    "dietaryRestrictionsOther",
    "strongDislikes",
    "alcoholStance",
    "smokingAsGuest",
    "smokingAsGuestOther",
    "spiceLevel",
    "petsBotherYou",
    "contributionPreference",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    "onboardingId",
    "dietaryRestrictions",
    "dietaryRestrictionsOther",
    "strongDislikes",
    "alcoholStance",
    "smokingAsGuest",
    "smokingAsGuestOther",
    "spiceLevel",
    "petsBotherYou",
    "contributionPreference",
    "createdAt",
    "updatedAt"
FROM "UserPreferences";

INSERT INTO "UserHostPreferences" (
    "id",
    "onboardingId",
    "smokingAsHost",
    "smokingAsHostOther",
    "eventTypes",
    "preferredAgeRange",
    "noiseLevel",
    "kidsOkay",
    "byobPotluckOkay",
    "propertyType",
    "neighborhoodNotes",
    "maxGuests",
    "indoorOutdoorSeating",
    "diningTableSize",
    "accessibility",
    "parking",
    "publicTransportInfo",
    "hasPets",
    "hypoallergenicPet",
    "petsFreeRoam",
    "quietHours",
    "shoesOff",
    "diningAreaPhotos",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    "onboardingId",
    "smokingAsHost",
    "smokingAsHostOther",
    "eventTypes",
    "preferredAgeRange",
    "noiseLevel",
    "kidsOkay",
    "byobPotluckOkay",
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY[]::TEXT[],
    "createdAt",
    "updatedAt"
FROM "UserPreferences";

-- DropTable
DROP TABLE "UserPreferences";

-- AddForeignKey
ALTER TABLE "UserGuestPreferences" ADD CONSTRAINT "UserGuestPreferences_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "UserOnboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHostPreferences" ADD CONSTRAINT "UserHostPreferences_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "UserOnboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

