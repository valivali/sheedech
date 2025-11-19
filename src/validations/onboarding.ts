import { z } from 'zod';

export const familyMemberSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .refine((val) => !/\d/.test(val), 'Name cannot contain numbers'),
  age: z.number().optional().nullable(),
  relationship: z.string().optional().nullable(),
});

export const petSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .refine((val) => !/\d/.test(val), 'Name cannot contain numbers'),
  kind: z.string().optional().nullable(),
});

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be valid'),
  familyMembers: z.array(familyMemberSchema),
  pets: z.array(petSchema),
});

export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;
export type PetFormData = z.infer<typeof petSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const textFieldSchema = z.string().max(512, 'Maximum 512 characters allowed').optional();

export const preferencesSchema = z.object({
  dietaryRestrictions: z.array(z.string()),
  dietaryRestrictionsOther: textFieldSchema,
  strongDislikes: textFieldSchema,
  alcoholStance: z.string().optional(),
  smokingAsHost: z.array(z.string()),
  smokingAsHostOther: textFieldSchema,
  smokingAsGuest: z.array(z.string()),
  smokingAsGuestOther: textFieldSchema,
  spiceLevel: z.string().optional(),
  eventTypes: z.array(z.string()),
  preferredAgeRange: textFieldSchema,
  noiseLevel: z.string().optional(),
  petsBotherYou: z.boolean().optional(),
  kidsOkay: z.boolean().optional(),
  byobPotluckOkay: z.boolean().optional(),
  contributionPreference: z.string().optional(),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

