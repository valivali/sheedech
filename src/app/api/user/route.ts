import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';
import { mapPrismaUserToUserData } from '@/mappers/user';

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
        onboarding: true,
        photos: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
    });

    if (!user?.onboarding) {
      return NextResponse.json({ error: 'Onboarding not completed' }, { status: 404 });
    }

    const userData = mapPrismaUserToUserData(user);

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

