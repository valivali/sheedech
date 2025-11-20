import { FamilyMember, Pet, PersonalInfo, AddressDetails } from '@/types/onboarding';

export const mapPrismaFamilyMember = (member: any): FamilyMember => ({
  id: member.id,
  name: member.name,
  age: member.age,
  relationship: member.relationship,
});

export const mapPrismaPet = (pet: any): Pet => ({
  id: pet.id,
  name: pet.name,
  kind: pet.kind,
});

export const mapPrismaAddressDetails = (address: any): AddressDetails => ({
  id: address.id,
  lon: address.lon || undefined,
  lat: address.lat || undefined,
  postalCode: address.postalCode || undefined,
  confidenceStreetLevel: address.confidenceStreetLevel || undefined,
  confidenceCityLevel: address.confidenceCityLevel || undefined,
  formattedAddress: address.formattedAddress,
  streetName: address.streetName || undefined,
  houseNumber: address.houseNumber || undefined,
  city: address.city || undefined,
  state: address.state || undefined,
  country: address.country || undefined,
});

export const mapPrismaOnboardingToPersonalInfo = (
  onboarding: any
): PersonalInfo => ({
  firstName: onboarding.firstName,
  lastName: onboarding.lastName,
  address: onboarding.addressDetails?.formattedAddress || '',
  addressDetails: onboarding.addressDetails ? mapPrismaAddressDetails(onboarding.addressDetails) : undefined,
  phoneNumber: onboarding.phoneNumber,
  familyMembers: onboarding.familyMembers.map(mapPrismaFamilyMember),
  pets: onboarding.pets.map(mapPrismaPet),
});

