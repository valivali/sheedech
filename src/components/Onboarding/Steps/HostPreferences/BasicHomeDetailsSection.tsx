import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/UI/Input';
import { RadioCardGroup, RadioCardItem } from '@/components/UI/RadioCard';
import { Range } from '@/components/UI/Range';
import { HostPreferencesFormData } from '@/validations/onboarding';

interface BasicHomeDetailsSectionProps {
  control: Control<HostPreferencesFormData>;
  errors: FieldErrors<HostPreferencesFormData>;
}

export const BasicHomeDetailsSection = ({
  control,
  errors,
}: BasicHomeDetailsSectionProps) => {
  return (
    <div className="section">
      <h3 className="sectionHeader">Basic Home Details</h3>

      <Controller
        name="propertyType"
        control={control}
        render={({ field }) => (
          <RadioCardGroup label="Apartment or house?" labelClassName="questionLabel">
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
          <RadioCardGroup label="Indoor / outdoor seating available?" labelClassName="questionLabel">
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
  );
};
