import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';
import { hostPreferencesSchema } from '@/validations/onboarding';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = hostPreferencesSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
      include: { onboarding: true },
    });

    if (!user?.onboarding) {
      return NextResponse.json({ error: 'Onboarding not found' }, { status: 404 });
    }

    const sanitizedData = {
      smokingAsHost: validatedData.smokingAsHost || [],
      smokingAsHostOther: validatedData.smokingAsHostOther?.trim() || null,
      eventTypes: validatedData.eventTypes || [],
      preferredAgeRange: validatedData.preferredAgeRange?.trim() || null,
      noiseLevel: validatedData.noiseLevel || null,
      kidsOkay: validatedData.kidsOkay,
      byobPotluckOkay: validatedData.byobPotluckOkay,
      propertyType: validatedData.propertyType || null,
      neighborhoodNotes: validatedData.neighborhoodNotes?.trim() || null,
      maxGuests: validatedData.maxGuests ?? null,
      indoorOutdoorSeating: validatedData.indoorOutdoorSeating || null,
      diningTableSize: validatedData.diningTableSize ?? null,
      accessibility: validatedData.accessibility || [],
      parking: validatedData.parking || [],
      publicTransportInfo: validatedData.publicTransportInfo?.trim() || null,
      hasPets: validatedData.hasPets,
      hypoallergenicPet: validatedData.hypoallergenicPet,
      petsFreeRoam: validatedData.petsFreeRoam,
      quietHours: validatedData.quietHours?.trim() || null,
      shoesOff: validatedData.shoesOff,
      diningAreaPhotos: validatedData.diningAreaPhotos || [],
      additionalNotes: validatedData.additionalNotes?.trim() || null,
    };

    const updatedOnboarding = await prisma.userOnboarding.update({
      where: { userId: user.id },
      data: {
        completedSteps: Math.max(user.onboarding.completedSteps, 2),
        hostPreferences: {
          upsert: {
            create: {
              ...sanitizedData,
            },
            update: {
              ...sanitizedData,
            },
          },
        },
      },
      include: {
        hostPreferences: true,
      },
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(authUser.userId, {
      privateMetadata: {
        onboardingCompleted: false,
        completedSteps: 2,
      },
    });

    return NextResponse.json({ 
      success: true,
      data: updatedOnboarding,
    });
  } catch (error) {
    console.error('Error saving host preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save host preferences' },
      { status: 500 }
    );
  }
}

