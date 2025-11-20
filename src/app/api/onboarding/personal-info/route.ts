import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/user';
import { prisma } from '@/db/prisma';
import { personalInfoSchema } from '@/validations/onboarding';
import { clerkClient } from '@clerk/nextjs/server';

interface GeoapifyResponse {
  features: Array<{
    properties: {
      formatted: string;
      lon: number;
      lat: number;
      confidence: number;
      confidence_city_level: number;
      confidence_street_level: number;
      postcode?: string;
      street?: string;
      housenumber?: string;
      city?: string;
      state?: string;
      country?: string;
    };
    geometry: {
      coordinates: [number, number];
    };
  }>;
}

async function validateAddress(text: string) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        text
      )}&apiKey=${process.env.GEOAPIFY_KEY}&format=json&limit=1`
    );

    if (!response.ok) {
      throw new Error('Failed to validate address');
    }

    const data: GeoapifyResponse = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature = data.features[0];
    const properties = feature.properties;

    // Log confidence levels if below threshold
    if (properties.confidence_street_level < 0.5 || properties.confidence_city_level < 0.5) {
      console.warn('Low confidence address validation:', {
        address: text,
        confidence_street_level: properties.confidence_street_level,
        confidence_city_level: properties.confidence_city_level,
        formatted: properties.formatted,
      });
    }

    return {
      formattedAddress: properties.formatted,
      lon: properties.lon,
      lat: properties.lat,
      postalCode: properties.postcode,
      confidenceStreetLevel: properties.confidence_street_level,
      confidenceCityLevel: properties.confidence_city_level,
      streetName: properties.street,
      houseNumber: properties.housenumber,
      city: properties.city,
      state: properties.state,
      country: properties.country
    };
  } catch (error) {
    console.error('Error validating address:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = personalInfoSchema.parse(body);

    // Validate address using Geoapify
    const addressValidation = await validateAddress(validatedData.address);

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
        addressDetails: addressValidation ? {
          upsert: {
            create: addressValidation,
            update: addressValidation,
          },
        } : undefined,
      },
      create: {
        userId: user.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
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
        addressDetails: addressValidation ? {
          create: addressValidation,
        } : undefined,
      },
      include: {
        familyMembers: true,
        pets: true,
        addressDetails: true,
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

