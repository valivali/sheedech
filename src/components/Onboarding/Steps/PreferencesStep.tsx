"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Title, Text } from '@/components/UI/Text';
import { Input } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';
import { CheckboxGroup, CheckboxItem } from '@/components/UI/CheckboxGroup';
import { RadioGroup, RadioItem } from '@/components/UI/RadioGroup';
import { useSavePreferences } from '@/api/frontend/onboarding';
import { preferencesSchema, PreferencesFormData } from '@/validations/onboarding';
import { Preferences } from '@/types/onboarding';
import styles from './PreferencesStep.module.scss';

interface PreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: Preferences;
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

const SMOKING_HOST_OPTIONS = [
  { value: 'no_mind', label: 'Not mind about smoking' },
  { value: 'outside', label: 'You can smoke outside' },
  { value: 'no_smoking', label: 'No smoking' },
  { value: 'other', label: 'Other' },
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

const EVENT_TYPES = [
  { value: 'casual_dinners', label: 'Casual dinners' },
  { value: 'potluck', label: 'Potluck' },
  { value: 'festive', label: 'Festive/holiday events' },
  { value: 'small_intimate', label: 'Small intimate hangouts' },
  { value: 'large_gatherings', label: 'Large gatherings' },
];

const NOISE_LEVELS = [
  { value: 'chill', label: 'Chill & quiet' },
  { value: 'lively', label: 'Lively social energy' },
];

const CONTRIBUTION_OPTIONS = [
  { value: 'bring_dish', label: 'Bring a dish' },
  { value: 'help_cook', label: 'Help cook' },
  { value: 'just_join', label: 'Just join' },
];

export const PreferencesStep = ({ onNext, onBack, initialData }: PreferencesStepProps) => {
  const { mutate: savePreferences, isPending } = useSavePreferences();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    mode: 'onChange',
    defaultValues: {
      dietaryRestrictions: initialData?.dietaryRestrictions || [],
      dietaryRestrictionsOther: initialData?.dietaryRestrictionsOther || '',
      strongDislikes: initialData?.strongDislikes || '',
      alcoholStance: initialData?.alcoholStance || '',
      smokingAsHost: initialData?.smokingAsHost || [],
      smokingAsHostOther: initialData?.smokingAsHostOther || '',
      smokingAsGuest: initialData?.smokingAsGuest || [],
      smokingAsGuestOther: initialData?.smokingAsGuestOther || '',
      spiceLevel: initialData?.spiceLevel || '',
      eventTypes: initialData?.eventTypes || [],
      preferredAgeRange: initialData?.preferredAgeRange || '',
      noiseLevel: initialData?.noiseLevel || '',
      petsBotherYou: initialData?.petsBotherYou,
      kidsOkay: initialData?.kidsOkay,
      byobPotluckOkay: initialData?.byobPotluckOkay,
      contributionPreference: initialData?.contributionPreference || '',
    },
  });

  const dietaryRestrictions = watch('dietaryRestrictions');
  const smokingAsHost = watch('smokingAsHost');
  const smokingAsGuest = watch('smokingAsGuest');

  const handleCheckboxChange = (
    fieldName: 'dietaryRestrictions' | 'smokingAsHost' | 'smokingAsGuest' | 'eventTypes',
    value: string,
    currentValues: string[]
  ) => {
    return currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
  };

  const onSubmit = (data: PreferencesFormData) => {
    savePreferences(data, {
      onSuccess: () => {
        onNext();
      },
      onError: (error) => {
        console.error('Failed to save preferences:', error);
      },
    });
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Preferences</Title>
      <Text className={styles.subtitle}>
        Help us match you better by sharing your preferences. All fields are optional.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.section}>
          <Title level={3}>Food & Dining Preferences</Title>

          <Controller
            name="dietaryRestrictions"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Dietary restrictions">
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
            name="alcoholStance"
            control={control}
            render={({ field }) => (
              <RadioGroup label="Alcohol stance">
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
            name="smokingAsHost"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Smoking preferences (as host)">
                {SMOKING_HOST_OPTIONS.map(option => (
                  <div key={option.value}>
                    <CheckboxItem
                      checked={field.value.includes(option.value)}
                      onChange={() => {
                        field.onChange(handleCheckboxChange('smokingAsHost', option.value, field.value));
                      }}
                    >
                      {option.label}
                    </CheckboxItem>
                    {option.value === 'other' && smokingAsHost.includes('other') && (
                      <Controller
                        name="smokingAsHostOther"
                        control={control}
                        render={({ field: otherField }) => (
                          <Input
                            {...otherField}
                            placeholder="Please specify"
                            error={errors.smokingAsHostOther?.message}
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
            name="smokingAsGuest"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Smoking preferences (as guest)">
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

          <Controller
            name="spiceLevel"
            control={control}
            render={({ field }) => (
              <RadioGroup label="Spice level comfort">
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
          <Title level={3}>Vibe Preferences</Title>

          <Controller
            name="eventTypes"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Type of events we enjoy">
                {EVENT_TYPES.map(option => (
                  <CheckboxItem
                    key={option.value}
                    checked={field.value.includes(option.value)}
                    onChange={() => {
                      field.onChange(handleCheckboxChange('eventTypes', option.value, field.value));
                    }}
                  >
                    {option.label}
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            )}
          />

          <Controller
            name="preferredAgeRange"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Preferred age range (optional)"
                placeholder='e.g., "25-35", "30+"'
                error={errors.preferredAgeRange?.message}
                maxLength={512}
              />
            )}
          />

          <Controller
            name="noiseLevel"
            control={control}
            render={({ field }) => (
              <RadioGroup label="Preferred noise level">
                {NOISE_LEVELS.map(option => (
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
          <Title level={3}>Social Comfort</Title>

          <Controller
            name="petsBotherYou"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup label="Do pets bother you?">
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

          <Controller
            name="kidsOkay"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup label="Are kids okay in events?">
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
          <Title level={3}>Contribution Preferences</Title>

          <Controller
            name="byobPotluckOkay"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup label="Are you okay with BYOB / potluck format?">
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

          <Controller
            name="contributionPreference"
            control={control}
            render={({ field }) => (
              <RadioGroup label="Do you prefer to:">
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
            {isPending ? 'Saving...' : 'Next Step'}
          </Button>
        </div>
      </form>
    </div>
  );
};

