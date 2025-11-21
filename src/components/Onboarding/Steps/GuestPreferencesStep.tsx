"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Title, Text } from '@/components/UI/Text';
import { Input } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';
import { CheckboxGroup, CheckboxItem } from '@/components/UI/CheckboxGroup';
import { RadioGroup, RadioItem } from '@/components/UI/RadioGroup';
import { useSaveGuestPreferences } from '@/api/frontend/onboarding';
import { guestPreferencesSchema, GuestPreferencesFormData } from '@/validations/onboarding';
import { GuestPreferences } from '@/types/onboarding';
import styles from './GuestPreferencesStep.module.scss';

interface GuestPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: GuestPreferences;
}

const DIETARY_RESTRICTIONS = [
  { value: 'none', label: 'No restrictions' },
  { value: 'vegetarian', label: 'Vegetarian / Vegan' },
  { value: 'kosher_halal', label: 'Kosher / Halal' },
  { value: 'lactose_intolerant', label: 'Lactose intolerant' },
  { value: 'gluten_free', label: 'Gluten-free' },
  { value: 'nut_allergies', label: 'Nut allergies' },
  { value: 'other', label: 'Other' },
];

const ALCOHOL_OPTIONS = [
  { value: 'drinks', label: 'Drinks alcohol' },
  { value: 'no_alcohol', label: 'Prefers no alcohol' },
  { value: 'open', label: 'Open but not necessary' },
];

const SMOKING_GUEST_OPTIONS = [
  { value: 'not_smoking', label: 'Not smoking' },
  { value: 'sometimes', label: 'Sometimes smoking but can hold back' },
  { value: 'outside', label: 'Smoking - can smoke outside' },
  { value: 'have_to', label: 'Smoking - have to smoke' },
  { value: 'other', label: 'Other' },
];

const SPICE_LEVELS = [
  { value: 'mild', label: 'Mild' },
  { value: 'medium', label: 'Medium' },
  { value: 'hot', label: 'Hot' },
];

const CONTRIBUTION_OPTIONS = [
  { value: 'bring_dish', label: 'Bring a dish' },
  { value: 'help_cook', label: 'Help cook' },
  { value: 'just_join', label: 'Just join' },
];

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
    },
  });

  const dietaryRestrictions = watch('dietaryRestrictions');
  const smokingAsGuest = watch('smokingAsGuest');

  const handleCheckboxChange = (
    fieldName: 'dietaryRestrictions' | 'smokingAsGuest',
    value: string,
    currentValues: string[]
  ) => {
    return currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
  };

  const onSubmit = (data: GuestPreferencesFormData) => {
    saveGuestPreferences(data, {
      onSuccess: () => {
        onNext();
      },
      onError: (error) => {
        console.error('Failed to save guest preferences:', error);
      },
    });
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Guest Preferences</Title>
      <Text className={styles.subtitle}>
        Tell us about your preferences when attending events. All fields are optional.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Dietary Preferences</h3>

          <Controller
            name="dietaryRestrictions"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Dietary restrictions" labelClassName={styles.questionLabel}>
                {DIETARY_RESTRICTIONS.map(option => (
                  <div key={option.value}>
                    <CheckboxItem
                      checked={field.value.includes(option.value)}
                      onChange={() => {
                        field.onChange(handleCheckboxChange('dietaryRestrictions', option.value, field.value));
                      }}
                    >
                      {option.label}
                    </CheckboxItem>
                    {option.value === 'other' && dietaryRestrictions.includes('other') && (
                      <Controller
                        name="dietaryRestrictionsOther"
                        control={control}
                        render={({ field: otherField }) => (
                          <Input
                            {...otherField}
                            placeholder="Please specify"
                            error={errors.dietaryRestrictionsOther?.message}
                            maxLength={512}
                            className={styles.otherInput}
                          />
                        )}
                      />
                    )}
                  </div>
                ))}
              </CheckboxGroup>
            )}
          />

          <Controller
            name="strongDislikes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Strong dislikes"
                placeholder='e.g., "I hate coriander", "no seafood pls"'
                error={errors.strongDislikes?.message}
                maxLength={512}
              />
            )}
          />

          <Controller
            name="spiceLevel"
            control={control}
            render={({ field }) => (
              <RadioGroup label="Spice level comfort" labelClassName={styles.questionLabel}>
                {SPICE_LEVELS.map(option => (
                  <RadioItem
                    key={option.value}
                    {...field}
                    value={option.value}
                    checked={field.value === option.value}
                  >
                    {option.label}
                  </RadioItem>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Alcohol & Smoking</h3>

          <Controller
            name="alcoholStance"
            control={control}
            render={({ field }) => (
              <RadioGroup label="Alcohol stance" labelClassName={styles.questionLabel}>
                {ALCOHOL_OPTIONS.map(option => (
                  <RadioItem
                    key={option.value}
                    {...field}
                    value={option.value}
                    checked={field.value === option.value}
                  >
                    {option.label}
                  </RadioItem>
                ))}
              </RadioGroup>
            )}
          />

          <Controller
            name="smokingAsGuest"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Smoking preferences (as guest)" labelClassName={styles.questionLabel}>
                {SMOKING_GUEST_OPTIONS.map(option => (
                  <div key={option.value}>
                    <CheckboxItem
                      checked={field.value.includes(option.value)}
                      onChange={() => {
                        field.onChange(handleCheckboxChange('smokingAsGuest', option.value, field.value));
                      }}
                    >
                      {option.label}
                    </CheckboxItem>
                    {option.value === 'other' && smokingAsGuest.includes('other') && (
                      <Controller
                        name="smokingAsGuestOther"
                        control={control}
                        render={({ field: otherField }) => (
                          <Input
                            {...otherField}
                            placeholder="Please specify"
                            error={errors.smokingAsGuestOther?.message}
                            maxLength={512}
                            className={styles.otherInput}
                          />
                        )}
                      />
                    )}
                  </div>
                ))}
              </CheckboxGroup>
            )}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Social Comfort</h3>

          <Controller
            name="petsBotherYou"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup label="Do pets bother you?" labelClassName={styles.questionLabel}>
                <RadioItem
                  key="yes"
                  checked={value === true}
                  onChange={() => onChange(true)}
                >
                  Yes
                </RadioItem>
                <RadioItem
                  key="no"
                  checked={value === false}
                  onChange={() => onChange(false)}
                >
                  No
                </RadioItem>
              </RadioGroup>
            )}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Contribution Preferences</h3>

          <Controller
            name="contributionPreference"
            control={control}
            render={({ field }) => (
              <RadioGroup label="Do you prefer to:" labelClassName={styles.questionLabel}>
                {CONTRIBUTION_OPTIONS.map(option => (
                  <RadioItem
                    key={option.value}
                    {...field}
                    value={option.value}
                    checked={field.value === option.value}
                  >
                    {option.label}
                  </RadioItem>
                ))}
              </RadioGroup>
            )}
          />
        </div>

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
            {isPending ? 'Saving...' : 'Complete Onboarding'}
          </Button>
        </div>
      </form>
    </div>
  );
};

