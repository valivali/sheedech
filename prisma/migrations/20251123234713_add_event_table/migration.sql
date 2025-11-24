-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('draft', 'pending', 'active', 'cancelled');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'draft',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "occasionType" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "description" TEXT,
    "formattedAddress" TEXT,
    "streetName" TEXT,
    "houseNumber" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "neighborhood" TEXT,
    "accessibility" TEXT[],
    "parking" TEXT,
    "cuisineTheme" TEXT[],
    "proposedMenu" TEXT[],
    "isKosher" BOOLEAN,
    "isVegetarian" BOOLEAN,
    "isGlutenFree" BOOLEAN,
    "hasNuts" BOOLEAN,
    "hasDairy" BOOLEAN,
    "accommodatesDietary" TEXT[],
    "maxGuests" INTEGER NOT NULL,
    "minGuests" INTEGER,
    "kidFriendly" BOOLEAN,
    "petFriendly" BOOLEAN,
    "smokingAllowed" BOOLEAN,
    "alcoholProvided" BOOLEAN,
    "byob" BOOLEAN,
    "whoElsePresent" TEXT[],
    "atmosphereTags" TEXT[],
    "houseRules" TEXT,
    "contributionType" TEXT,
    "contributionAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPhoto" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "cropX" DOUBLE PRECISION,
    "cropY" DOUBLE PRECISION,
    "cropWidth" DOUBLE PRECISION,
    "cropHeight" DOUBLE PRECISION,
    "order" INTEGER NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_userId_idx" ON "Event"("userId");

-- CreateIndex
CREATE INDEX "Event_slug_idx" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_eventDate_idx" ON "Event"("eventDate");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPhoto" ADD CONSTRAINT "EventPhoto_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
