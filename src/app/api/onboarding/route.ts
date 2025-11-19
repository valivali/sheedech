import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';

export async function GET() {
  try {
    console.log('fetching onboarding data from the server');
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
            preferences: true,
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
        address: user.onboarding.address,
        phoneNumber: user.onboarding.phoneNumber,
        familyMembers: user.onboarding.familyMembers,
        pets: user.onboarding.pets,
      },
      preferences: user.onboarding.preferences || undefined,
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

