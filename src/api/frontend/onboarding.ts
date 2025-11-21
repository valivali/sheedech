import { useMutation, useQuery } from '@tanstack/react-query';
import { PersonalInfo, OnboardingData, GuestPreferences, HostPreferences } from '@/types/onboarding';

const API_BASE = '/api/onboarding';

export const useOnboardingData = () => {
  return useQuery<OnboardingData>({
    queryKey: ['onboarding'],
    queryFn: async () => {
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

export const useSaveGuestPreferences = () => {
  return useMutation({
    mutationFn: async (data: GuestPreferences) => {
      const response = await fetch(`${API_BASE}/guest-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save guest preferences');
      return response.json();
    },
    onSuccess: () => {
    },
  });
};

export const useSaveHostPreferences = () => {
  return useMutation({
    mutationFn: async (data: HostPreferences) => {
      const response = await fetch(`${API_BASE}/host-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save host preferences');
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

