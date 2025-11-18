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

