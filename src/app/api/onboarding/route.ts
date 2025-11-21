import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { email: authUser.email },
      create: {
        email: authUser.email,
        clerkId: authUser.userId,
      },
      update: {
        clerkId: authUser.userId,
      },
      include: {
        onboarding: {
          include: {
            familyMembers: true,
            pets: true,
            guestPreferences: true,
            hostPreferences: true,
            addressDetails: true,
          },
        },
      },
    });

    if (!user?.onboarding) {
      return NextResponse.json({ 
        completedSteps: 0, 
        isCompleted: false 
      });
    }

    return NextResponse.json({
      personalInfo: {
        firstName: user.onboarding.firstName,
        lastName: user.onboarding.lastName,
        address: user.onboarding.addressDetails?.formattedAddress || '',
        addressDetails: user.onboarding.addressDetails,
        phoneNumber: user.onboarding.phoneNumber,
        familyMembers: user.onboarding.familyMembers,
        pets: user.onboarding.pets,
      },
      guestPreferences: user.onboarding.guestPreferences || undefined,
      hostPreferences: user.onboarding.hostPreferences || undefined,
      completedSteps: user.onboarding.completedSteps,
      isCompleted: user.onboarding.isCompleted,
    });
  } catch (error) {
    console.error('Error fetching onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

