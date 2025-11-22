"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Title, Text } from '@/components/UI/Text';
import { Textarea } from '@/components/UI/Textarea';
import { Input } from '@/components/UI/Input';
import { Button } from '@/components/UI/Button';
import { CheckboxGroup, CheckboxItem } from '@/components/UI/CheckboxGroup';
import { RadioGroup, RadioItem } from '@/components/UI/RadioGroup';
import { RadioCardGroup, RadioCardItem } from '@/components/UI/RadioCard';
import { Range } from '@/components/UI/Range';
import { FileUpload } from '@/components/UI/FileUpload';
import { useSaveHostPreferences } from '@/api/frontend/onboarding';
import { hostPreferencesSchema, HostPreferencesFormData } from '@/validations/onboarding';
import { HostPreferences } from '@/types/onboarding';
import styles from './HostPreferencesStep.module.scss';

interface HostPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: HostPreferences;
}

const SMOKING_HOST_OPTIONS = [
  { value: 'no_mind', label: 'Not mind about smoking' },
  { value: 'outside', label: 'You can smoke outside' },
  { value: 'no_smoking', label: 'No smoking' },
  { value: 'other', label: 'Other' },
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

const ACCESSIBILITY_OPTIONS = [
  { value: 'wheelchair_accessible', label: 'Wheelchair accessible entry' },
  { value: 'elevator', label: 'Elevator available' },
  { value: 'no_steps', label: 'No steps / minimal steps' },
  { value: 'accessible_restroom', label: 'Accessible restroom' },
];

const PARKING_OPTIONS = [
  { value: 'street_parking', label: 'Street parking' },
  { value: 'private_parking', label: 'Private parking' },
  { value: 'paid_parking', label: 'Paid parking nearby' },
  { value: 'no_parking', label: 'No parking options' },
];

export const HostPreferencesStep = ({ onNext, onBack, initialData }: HostPreferencesStepProps) => {
  const { mutate: saveHostPreferences, isPending } = useSaveHostPreferences();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<HostPreferencesFormData>({
    resolver: zodResolver(hostPreferencesSchema),
    mode: 'onChange',
    defaultValues: {
      smokingAsHost: initialData?.smokingAsHost || [],
      smokingAsHostOther: initialData?.smokingAsHostOther || '',
      eventTypes: initialData?.eventTypes || [],
      preferredAgeRange: initialData?.preferredAgeRange || '',
      noiseLevel: initialData?.noiseLevel || '',
      kidsOkay: initialData?.kidsOkay,
      byobPotluckOkay: initialData?.byobPotluckOkay,
      propertyType: initialData?.propertyType || '',
      neighborhoodNotes: initialData?.neighborhoodNotes || '',
      maxGuests: initialData?.maxGuests,
      indoorOutdoorSeating: initialData?.indoorOutdoorSeating || '',
      diningTableSize: initialData?.diningTableSize,
      accessibility: initialData?.accessibility || [],
      parking: initialData?.parking || [],
      publicTransportInfo: initialData?.publicTransportInfo || '',
      hasPets: initialData?.hasPets,
      hypoallergenicPet: initialData?.hypoallergenicPet,
      petsFreeRoam: initialData?.petsFreeRoam,
      quietHours: initialData?.quietHours || '',
      shoesOff: initialData?.shoesOff,
      diningAreaPhotos: initialData?.diningAreaPhotos || [],
      additionalNotes: initialData?.additionalNotes || '',
    },
  });

  const smokingAsHost = watch('smokingAsHost');
  const hasPets = watch('hasPets');

  const handleCheckboxChange = (
    fieldName: 'smokingAsHost' | 'eventTypes' | 'accessibility' | 'parking',
    value: string,
    currentValues: string[]
  ) => {
    return currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
  };

  const onSubmit = (data: HostPreferencesFormData) => {
    saveHostPreferences(data, {
      onSuccess: () => {
        onNext();
      },
      onError: (error) => {
        console.error('Failed to save host preferences:', error);
      },
    });
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Host Preferences</Title>
      <Text className={styles.subtitle}>
        Tell us about hosting at your place. This helps guests know what to expect.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Smoking & Event Preferences</h3>

          <Controller
            name="smokingAsHost"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Smoking preferences (as host)" labelClassName={styles.questionLabel}>
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
            name="eventTypes"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Type of events you host *" labelClassName={styles.questionLabel}>
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
                label="Preferred age range for guests (optional)"
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
              <RadioGroup label="Event atmosphere" labelClassName={styles.questionLabel}>
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

          <Controller
            name="kidsOkay"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup label="Are kids okay at your events?" labelClassName={styles.questionLabel}>
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
            name="byobPotluckOkay"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioGroup label="Are you okay with BYOB / potluck format?" labelClassName={styles.questionLabel}>
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
          <h3 className={styles.sectionHeader}>Basic Home Details</h3>

          <Controller
            name="propertyType"
            control={control}
            render={({ field }) => (
              <RadioCardGroup label="Apartment or house?" labelClassName={styles.questionLabel}>
                <RadioCardItem
                  {...field}
                  value="apartment"
                  checked={field.value === 'apartment'}
                >
                  Apartment
                </RadioCardItem>
                <RadioCardItem
                  {...field}
                  value="house"
                  checked={field.value === 'house'}
                >
                  House
                </RadioCardItem>
              </RadioCardGroup>
            )}
          />

          <Controller
            name="neighborhoodNotes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Important things to know about the neighborhood"
                placeholder="e.g., quiet area, close to restaurants, etc."
                error={errors.neighborhoodNotes?.message}
                maxLength={512}
              />
            )}
          />

          <Controller
            name="maxGuests"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Range
                label="Max number of guests you can host"
                value={value || 0}
                onChange={onChange}
                min={0}
                max={12}
                error={errors.maxGuests?.message}
              />
            )}
          />

          <Controller
            name="indoorOutdoorSeating"
            control={control}
            render={({ field }) => (
              <RadioCardGroup label="Indoor / outdoor seating available?" labelClassName={styles.questionLabel}>
                <RadioCardItem
                  {...field}
                  value="indoor"
                  checked={field.value === 'indoor'}
                >
                  Indoor
                </RadioCardItem>
                <RadioCardItem
                  {...field}
                  value="outdoor"
                  checked={field.value === 'outdoor'}
                >
                  Outdoor
                </RadioCardItem>
                <RadioCardItem
                  {...field}
                  value="both"
                  checked={field.value === 'both'}
                >
                  Both
                </RadioCardItem>
              </RadioCardGroup>
            )}
          />

          <Controller
            name="diningTableSize"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                type="number"
                value={value?.toString() || ''}
                onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                label="Dining table size (number of seats)"
                placeholder="e.g., 6"
                error={errors.diningTableSize?.message}
              />
            )}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Accessibility</h3>

          <Controller
            name="accessibility"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Select all that apply" labelClassName={styles.questionLabel}>
                {ACCESSIBILITY_OPTIONS.map(option => (
                  <CheckboxItem
                    key={option.value}
                    checked={field.value.includes(option.value)}
                    onChange={() => {
                      field.onChange(handleCheckboxChange('accessibility', option.value, field.value));
                    }}
                  >
                    {option.label}
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            )}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Logistics</h3>

          <Controller
            name="parking"
            control={control}
            render={({ field }) => (
              <CheckboxGroup label="Parking options" labelClassName={styles.questionLabel}>
                {PARKING_OPTIONS.map(option => (
                  <CheckboxItem
                    key={option.value}
                    checked={field.value.includes(option.value)}
                    onChange={() => {
                      field.onChange(handleCheckboxChange('parking', option.value, field.value));
                    }}
                  >
                    {option.label}
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            )}
          />

          <Controller
            name="publicTransportInfo"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Public transportation options"
                placeholder="Which bus/metro lines are close?"
                error={errors.publicTransportInfo?.message}
                maxLength={512}
              />
            )}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Pets at Home</h3>

          <Controller
            name="hasPets"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioCardGroup label="Cats, dogs, or others present" labelClassName={styles.questionLabel}>
                <RadioCardItem
                  value="yes"
                  checked={value === true}
                  onChange={() => onChange(true)}
                >
                  Yes
                </RadioCardItem>
                <RadioCardItem
                  value="no"
                  checked={value === false}
                  onChange={() => onChange(false)}
                >
                  No
                </RadioCardItem>
              </RadioCardGroup>
            )}
          />

          {hasPets && (
            <>
              <Controller
                name="hypoallergenicPet"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <RadioCardGroup label="Hypoallergenic pet" labelClassName={styles.questionLabel}>
                    <RadioCardItem
                      value="yes"
                      checked={value === true}
                      onChange={() => onChange(true)}
                    >
                      Yes
                    </RadioCardItem>
                    <RadioCardItem
                      value="no"
                      checked={value === false}
                      onChange={() => onChange(false)}
                    >
                      No
                    </RadioCardItem>
                  </RadioCardGroup>
                )}
              />

              <Controller
                name="petsFreeRoam"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <RadioCardGroup label="Are pets free to roam during events?" labelClassName={styles.questionLabel}>
                    <RadioCardItem
                      value="yes"
                      checked={value === true}
                      onChange={() => onChange(true)}
                    >
                      Yes
                    </RadioCardItem>
                    <RadioCardItem
                      value="no"
                      checked={value === false}
                      onChange={() => onChange(false)}
                    >
                      No
                    </RadioCardItem>
                  </RadioCardGroup>
                )}
              />
            </>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Ambiance / House Rules</h3>

          <Controller
            name="quietHours"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Quiet hours"
                placeholder="e.g., after 10 PM on weekdays"
                error={errors.quietHours?.message}
                maxLength={512}
              />
            )}
          />

          <Controller
            name="shoesOff"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioCardGroup label="Shoes-off house?" labelClassName={styles.questionLabel}>
                <RadioCardItem
                  value="yes"
                  checked={value === true}
                  onChange={() => onChange(true)}
                >
                  Yes
                </RadioCardItem>
                <RadioCardItem
                  value="no"
                  checked={value === false}
                  onChange={() => onChange(false)}
                >
                  No
                </RadioCardItem>
              </RadioCardGroup>
            )}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Optional Media</h3>
          <Text className={styles.sectionDescription}>
            Upload 1-2 photos of your dining area (optional). Helps with trust and boosts event engagement.
          </Text>

          <Controller
            name="diningAreaPhotos"
            control={control}
            render={({ field: { onChange } }) => (
              <FileUpload
                label="Dining area photos"
                multiple
                maxFiles={2}
                accept="image/*"
                onChange={(files) => {
                  onChange(files.map(f => f.name));
                }}
              />
            )}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Additional Notes</h3>
          <Text className={styles.sectionDescription}>
            Any additional information you'd like to share about your hosting preferences.
          </Text>

          <Controller
            name="additionalNotes"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="e.g., We are huge winter olympics fans, etc."
                maxLength={512}
                helperText="Maximum 512 characters"
              />
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

