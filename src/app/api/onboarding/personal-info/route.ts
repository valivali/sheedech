import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';
import { personalInfoSchema } from '@/validations/onboarding';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = personalInfoSchema.parse(body);

    let user = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: authUser.userId,
          email: authUser.email,
        },
      });
    }

    const onboarding = await prisma.userOnboarding.upsert({
      where: { userId: user.id },
      update: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        address: validatedData.address,
        phoneNumber: validatedData.phoneNumber,
        completedSteps: 1,
        familyMembers: {
          deleteMany: {},
          create: validatedData.familyMembers.map((fm) => ({
            name: fm.name,
            age: fm.age,
            relationship: fm.relationship,
          })),
        },
        pets: {
          deleteMany: {},
          create: validatedData.pets.map((pet) => ({
            name: pet.name,
            kind: pet.kind,
          })),
        },
      },
      create: {
        userId: user.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        address: validatedData.address,
        phoneNumber: validatedData.phoneNumber,
        completedSteps: 1,
        familyMembers: {
          create: validatedData.familyMembers.map((fm) => ({
            name: fm.name,
            age: fm.age,
            relationship: fm.relationship,
          })),
        },
        pets: {
          create: validatedData.pets.map((pet) => ({
            name: pet.name,
            kind: pet.kind,
          })),
        },
      },
      include: {
        familyMembers: true,
        pets: true,
      },
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(authUser.userId, {
      privateMetadata: {
        onboardingCompleted: false,
        completedSteps: 1,
      },
    });

    return NextResponse.json(onboarding);
  } catch (error) {
    console.error('Error saving personal info:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

