-- CreateTable
CREATE TABLE "UserPhoto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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

    CONSTRAINT "UserPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiningImage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "cropX" DOUBLE PRECISION,
    "cropY" DOUBLE PRECISION,
    "cropWidth" DOUBLE PRECISION,
    "cropHeight" DOUBLE PRECISION,
    "order" INTEGER NOT NULL,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiningImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPhoto" ADD CONSTRAINT "UserPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiningImage" ADD CONSTRAINT "DiningImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
