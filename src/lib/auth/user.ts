import { auth, currentUser } from '@clerk/nextjs/server';

export interface AuthUser {
  email: string;
  userId: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    const user = await currentUser();
    
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return null;
    }

    return {
      email: user.emailAddresses[0].emailAddress,
      userId,
    };
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

