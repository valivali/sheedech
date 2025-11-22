import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';
import { guestPreferencesSchema } from '@/validations/onboarding';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = guestPreferencesSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
      include: { onboarding: true },
    });

    if (!user?.onboarding) {
      return NextResponse.json({ error: 'Onboarding not found' }, { status: 404 });
    }

    const sanitizedData = {
      dietaryRestrictions: validatedData.dietaryRestrictions || [],
      dietaryRestrictionsOther: validatedData.dietaryRestrictionsOther?.trim() || null,
      strongDislikes: validatedData.strongDislikes?.trim() || null,
      alcoholStance: validatedData.alcoholStance || null,
      smokingAsGuest: validatedData.smokingAsGuest || [],
      smokingAsGuestOther: validatedData.smokingAsGuestOther?.trim() || null,
      spiceLevel: validatedData.spiceLevel || null,
      petsBotherYou: validatedData.petsBotherYou,
      contributionPreference: validatedData.contributionPreference || null,
      additionalNotes: validatedData.additionalNotes?.trim() || null,
    };

    const updatedOnboarding = await prisma.userOnboarding.update({
      where: { userId: user.id },
      data: {
        completedSteps: Math.max(user.onboarding.completedSteps, 3),
        isCompleted: true,
        guestPreferences: {
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
        guestPreferences: true,
      },
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(authUser.userId, {
      privateMetadata: {
        onboardingCompleted: true,
        completedSteps: 3,
      },
    });

    return NextResponse.json({ 
      success: true,
      data: updatedOnboarding,
    });
  } catch (error) {
    console.error('Error saving guest preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save guest preferences' },
      { status: 500 }
    );
  }
}

