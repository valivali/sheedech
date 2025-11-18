import { UserOnboarding, FamilyMember as PrismaFamilyMember, Pet as PrismaPet } from '@prisma/client';
import { FamilyMember, Pet, PersonalInfo } from '@/types/onboarding';

export const mapPrismaFamilyMember = (member: PrismaFamilyMember): FamilyMember => ({
  id: member.id,
  name: member.name,
  age: member.age,
  relationship: member.relationship,
});

export const mapPrismaPet = (pet: PrismaPet): Pet => ({
  id: pet.id,
  name: pet.name,
  kind: pet.kind,
});

export const mapPrismaOnboardingToPersonalInfo = (
  onboarding: UserOnboarding & {
    familyMembers: PrismaFamilyMember[];
    pets: PrismaPet[];
  }
): PersonalInfo => ({
  firstName: onboarding.firstName,
  lastName: onboarding.lastName,
  address: onboarding.address,
  phoneNumber: onboarding.phoneNumber,
  familyMembers: onboarding.familyMembers.map(mapPrismaFamilyMember),
  pets: onboarding.pets.map(mapPrismaPet),
});

