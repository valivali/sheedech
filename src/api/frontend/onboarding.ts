import { useMutation, useQuery } from '@tanstack/react-query';
import { PersonalInfo, OnboardingData, Preferences } from '@/types/onboarding';

const API_BASE = '/api/onboarding';

export const useOnboardingData = () => {
  return useQuery<OnboardingData>({
    queryKey: ['onboarding'],
    queryFn: async () => {
      console.log('fetching onboarding data');
      const response = await fetch(API_BASE);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch onboarding data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSavePersonalInfo = () => {
  return useMutation({
    mutationFn: async (data: PersonalInfo) => {
      const response = await fetch(`${API_BASE}/personal-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save personal info');
      return response.json();
    },
    onSuccess: () => {
    },
  });
};

export const useSavePreferences = () => {
  return useMutation({
    mutationFn: async (data: Preferences) => {
      const response = await fetch(`${API_BASE}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save preferences');
      return response.json();
    },
    onSuccess: () => {
    },
  });
};

export const useCompleteOnboarding = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE}/complete`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to complete onboarding');
      return response.json();
    },
  });
};

