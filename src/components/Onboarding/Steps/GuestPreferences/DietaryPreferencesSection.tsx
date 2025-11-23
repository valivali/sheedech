import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/UI/Input';
import { ControlledCheckboxGroup } from '@/components/UI/CheckboxGroup';
import { RadioGroup, RadioItem } from '@/components/UI/RadioGroup';
import { GuestPreferencesFormData } from '@/validations/onboarding';
import { DIETARY_RESTRICTIONS, SPICE_LEVELS } from './constants';

interface DietaryPreferencesSectionProps {
  control: Control<GuestPreferencesFormData>;
  errors: FieldErrors<GuestPreferencesFormData>;
  dietaryRestrictions: string[];
}

export const DietaryPreferencesSection = ({
  control,
  errors,
  dietaryRestrictions,
}: DietaryPreferencesSectionProps) => {
  return (
    <div className="section">
      <h3 className="sectionHeader">Dietary Preferences</h3>

      <Controller
        name="dietaryRestrictions"
        control={control}
        render={({ field }) => (
          <>
            <ControlledCheckboxGroup
              options={DIETARY_RESTRICTIONS}
              value={field.value}
              onChange={field.onChange}
              label="Dietary restrictions"
              labelClassName="questionLabel"
            />
            {dietaryRestrictions.includes('other') && (
              <Controller
                name="dietaryRestrictionsOther"
                control={control}
                render={({ field: otherField }) => (
                  <Input
                    {...otherField}
                    placeholder="Please specify"
                    error={errors.dietaryRestrictionsOther?.message}
                    maxLength={512}
                    className="otherInput"
                  />
                )}
              />
            )}
          </>
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
          <RadioGroup label="Spice level comfort" labelClassName="questionLabel">
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
  );
};
