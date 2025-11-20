export interface FamilyMember {
  id?: string;
  name: string;
  age?: number | null;
  relationship?: string | null;
}

export interface Pet {
  id?: string;
  name: string;
  kind?: string | null;
}

export interface AddressDetails {
  id?: string;
  lon?: number;
  lat?: number;
  postalCode?: string;
  confidenceStreetLevel?: number;
  confidenceCityLevel?: number;
  formattedAddress: string;
  streetName?: string;
  houseNumber?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  address: string;
  addressDetails?: AddressDetails;
  phoneNumber: string;
  familyMembers: FamilyMember[];
  pets: Pet[];
}

export interface Preferences {
  dietaryRestrictions: string[];
  dietaryRestrictionsOther?: string;
  strongDislikes?: string;
  alcoholStance?: string;
  smokingAsHost: string[];
  smokingAsHostOther?: string;
  smokingAsGuest: string[];
  smokingAsGuestOther?: string;
  spiceLevel?: string;
  eventTypes: string[];
  preferredAgeRange?: string;
  noiseLevel?: string;
  petsBotherYou?: boolean;
  kidsOkay?: boolean;
  byobPotluckOkay?: boolean;
  contributionPreference?: string;
}

export interface OnboardingData {
  personalInfo?: PersonalInfo;
  preferences?: Preferences;
  completedSteps: number;
  isCompleted: boolean;
}

