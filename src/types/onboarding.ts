export interface FamilyMember {
  id?: string
  name: string
  age?: number | null
  relationship?: string | null
}

export interface Pet {
  id?: string
  name: string
  kind?: string | null
}

export interface AddressDetails {
  id?: string
  lon?: number
  lat?: number
  postalCode?: string
  confidenceStreetLevel?: number
  confidenceCityLevel?: number
  formattedAddress: string
  streetName?: string
  houseNumber?: string
  city?: string
  state?: string
  country?: string
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  address: string
  addressDetails?: AddressDetails
  phoneNumber: string
  familyMembers: FamilyMember[]
  pets: Pet[]
}

export interface GuestPreferences {
  dietaryRestrictions: string[]
  dietaryRestrictionsOther?: string
  strongDislikes?: string
  alcoholStance?: string
  smokingAsGuest: string[]
  smokingAsGuestOther?: string
  spiceLevel?: string
  petsBotherYou?: boolean
  contributionPreference?: string
  additionalNotes?: string
}

export interface HostPreferences {
  smokingAsHost: string[]
  smokingAsHostOther?: string
  eventTypes: string[]
  preferredAgeRange?: string
  noiseLevel?: string
  kidsOkay?: boolean
  byobPotluckOkay?: boolean
  propertyType?: string
  neighborhoodNotes?: string
  maxGuests?: number
  indoorOutdoorSeating?: string
  diningTableSize?: number
  accessibility: string[]
  parking: string[]
  publicTransportInfo?: string
  hasPets?: boolean
  hypoallergenicPet?: boolean | null
  petsFreeRoam?: boolean | null
  quietHours?: string
  shoesOff?: boolean
  diningAreaPhotos: string[]
  additionalNotes?: string
}

export interface OnboardingData {
  personalInfo?: PersonalInfo
  guestPreferences?: GuestPreferences
  hostPreferences?: HostPreferences
  completedSteps: number
  isCompleted: boolean
}
