import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const onboarding = await prisma.userOnboarding.update({
      where: { userId: user.id },
      data: {
        isCompleted: true,
        completedSteps: 3,
      },
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(authUser.userId, {
      privateMetadata: {
        onboardingCompleted: true,
        completedSteps: 3,
      },
    });

    // Set cookie for immediate redirect optimization (middleware will check this first)
    const response = NextResponse.json(onboarding);
    response.cookies.set('onboarding-just-completed', 'true', {
      maxAge: 10, // 10 seconds - just enough for the redirect
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

