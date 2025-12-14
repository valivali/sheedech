import { z } from 'zod';
import { UserData } from '@/types/user';

export const userDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  completedSteps: z.number(),
  isCompleted: z.boolean(),
  photoUrl: z.string().nullable(),
});

export const mapPrismaUserToUserData = (user: any): UserData => {
  const userData: UserData = {
    id: user.id,
    email: user.email,
    firstName: user.onboarding.firstName,
    lastName: user.onboarding.lastName,
    phoneNumber: user.onboarding.phoneNumber,
    completedSteps: user.onboarding.completedSteps,
    isCompleted: user.onboarding.isCompleted,
    photoUrl: user.photos[0]?.url || null,
  };

  return userDataSchema.parse(userData);
};

