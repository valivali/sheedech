import { FamilyMember, Pet, PersonalInfo, AddressDetails, GuestPreferences, HostPreferences } from '@/types/onboarding';

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

export const mapPrismaGuestPreferences = (prefs: any): GuestPreferences => ({
  dietaryRestrictions: prefs.dietaryRestrictions || [],
  dietaryRestrictionsOther: prefs.dietaryRestrictionsOther || undefined,
  strongDislikes: prefs.strongDislikes || undefined,
  alcoholStance: prefs.alcoholStance || undefined,
  smokingAsGuest: prefs.smokingAsGuest || [],
  smokingAsGuestOther: prefs.smokingAsGuestOther || undefined,
  spiceLevel: prefs.spiceLevel || undefined,
  petsBotherYou: prefs.petsBotherYou ?? undefined,
  contributionPreference: prefs.contributionPreference || undefined,
});

export const mapPrismaHostPreferences = (prefs: any): HostPreferences => ({
  smokingAsHost: prefs.smokingAsHost || [],
  smokingAsHostOther: prefs.smokingAsHostOther || undefined,
  eventTypes: prefs.eventTypes || [],
  preferredAgeRange: prefs.preferredAgeRange || undefined,
  noiseLevel: prefs.noiseLevel || undefined,
  kidsOkay: prefs.kidsOkay ?? undefined,
  byobPotluckOkay: prefs.byobPotluckOkay ?? undefined,
  propertyType: prefs.propertyType || undefined,
  neighborhoodNotes: prefs.neighborhoodNotes || undefined,
  maxGuests: prefs.maxGuests ?? undefined,
  indoorOutdoorSeating: prefs.indoorOutdoorSeating || undefined,
  diningTableSize: prefs.diningTableSize ?? undefined,
  accessibility: prefs.accessibility || [],
  parking: prefs.parking || [],
  publicTransportInfo: prefs.publicTransportInfo || undefined,
  hasPets: prefs.hasPets ?? undefined,
  hypoallergenicPet: prefs.hypoallergenicPet ?? undefined,
  petsFreeRoam: prefs.petsFreeRoam ?? undefined,
  quietHours: prefs.quietHours || undefined,
  shoesOff: prefs.shoesOff ?? undefined,
  diningAreaPhotos: prefs.diningAreaPhotos || [],
});

