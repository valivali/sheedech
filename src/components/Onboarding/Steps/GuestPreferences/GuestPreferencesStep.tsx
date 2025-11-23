"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { Title, Text } from '@/components/UI/Text';
import { Button } from '@/components/UI/Button';
import { useSaveGuestPreferences } from '@/api/frontend/onboarding';
import { guestPreferencesSchema, GuestPreferencesFormData } from '@/validations/onboarding';
import { GuestPreferences } from '@/types/onboarding';
import {
  DietaryPreferencesSection,
  AlcoholSmokingSection,
  SocialComfortSection,
  ContributionPreferencesSection,
  GuestAdditionalNotesSection,
} from '../GuestPreferences';
import styles from './GuestPreferencesStep.module.scss';

interface GuestPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: GuestPreferences;
}

export const GuestPreferencesStep = ({ onNext, onBack, initialData }: GuestPreferencesStepProps) => {
  const { mutate: saveGuestPreferences, isPending } = useSaveGuestPreferences();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<GuestPreferencesFormData>({
    resolver: zodResolver(guestPreferencesSchema),
    mode: 'onChange',
    defaultValues: {
      dietaryRestrictions: initialData?.dietaryRestrictions || [],
      dietaryRestrictionsOther: initialData?.dietaryRestrictionsOther || '',
      strongDislikes: initialData?.strongDislikes || '',
      alcoholStance: initialData?.alcoholStance || '',
      smokingAsGuest: initialData?.smokingAsGuest || [],
      smokingAsGuestOther: initialData?.smokingAsGuestOther || '',
      spiceLevel: initialData?.spiceLevel || '',
      petsBotherYou: initialData?.petsBotherYou,
      contributionPreference: initialData?.contributionPreference || '',
      additionalNotes: initialData?.additionalNotes || '',
    },
  });

  const dietaryRestrictions = watch('dietaryRestrictions');
  const smokingAsGuest = watch('smokingAsGuest');

  const onSubmit = useCallback((data: GuestPreferencesFormData) => {
    saveGuestPreferences(data, {
      onSuccess: () => {
        onNext();
      },
      onError: (error) => {
        console.error('Failed to save guest preferences:', error);
      },
    });
  }, [saveGuestPreferences, onNext]);

  return (
    <div className={styles.container}>
      <Title level={2}>Guest Preferences</Title>
      <Text className={styles.subtitle}>
        Tell us about your preferences when attending events. All fields are optional.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <DietaryPreferencesSection
          control={control}
          errors={errors}
          dietaryRestrictions={dietaryRestrictions}
        />

        <AlcoholSmokingSection
          control={control}
          errors={errors}
          smokingAsGuest={smokingAsGuest}
        />

        <SocialComfortSection
          control={control}
        />

        <ContributionPreferencesSection
          control={control}
        />

        <GuestAdditionalNotesSection
          control={control}
        />

        <div className={styles.actions}>
          <Button
            type="button"
            onClick={onBack}
            variant="secondary"
            size="md"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            size="md"
          >
            {isPending ? 'Saving...' : 'Next Step'}
          </Button>
        </div>
      </form>
    </div>
  );
};

