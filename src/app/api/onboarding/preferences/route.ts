import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';
import { preferencesSchema } from '@/validations/onboarding';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = preferencesSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
      include: { onboarding: true },
    });

    if (!user?.onboarding) {
      return NextResponse.json({ error: 'Onboarding not found' }, { status: 404 });
    }

    const sanitizedData = {
      dietaryRestrictions: validatedData.dietaryRestrictions,
      dietaryRestrictionsOther: validatedData.dietaryRestrictionsOther?.trim() || null,
      strongDislikes: validatedData.strongDislikes?.trim() || null,
      alcoholStance: validatedData.alcoholStance || null,
      smokingAsHost: validatedData.smokingAsHost,
      smokingAsHostOther: validatedData.smokingAsHostOther?.trim() || null,
      smokingAsGuest: validatedData.smokingAsGuest,
      smokingAsGuestOther: validatedData.smokingAsGuestOther?.trim() || null,
      spiceLevel: validatedData.spiceLevel || null,
      eventTypes: validatedData.eventTypes,
      preferredAgeRange: validatedData.preferredAgeRange?.trim() || null,
      noiseLevel: validatedData.noiseLevel || null,
      petsBotherYou: validatedData.petsBotherYou,
      kidsOkay: validatedData.kidsOkay,
      byobPotluckOkay: validatedData.byobPotluckOkay,
      contributionPreference: validatedData.contributionPreference || null,
    };

    const updatedOnboarding = await prisma.userOnboarding.update({
      where: { userId: user.id },
      data: {
        completedSteps: Math.max(user.onboarding.completedSteps, 2),
        preferences: {
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
        preferences: true,
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
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

