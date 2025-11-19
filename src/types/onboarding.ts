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

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  address: string;
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

