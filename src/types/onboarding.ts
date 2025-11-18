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

export interface OnboardingData {
  personalInfo?: PersonalInfo;
  completedSteps: number;
  isCompleted: boolean;
}

