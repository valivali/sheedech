import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/UI/Input';
import { ControlledCheckboxGroup } from '@/components/UI/CheckboxGroup';
import { RadioGroup, RadioItem } from '@/components/UI/RadioGroup';
import { GuestPreferencesFormData } from '@/validations/onboarding';
import { ALCOHOL_OPTIONS, SMOKING_GUEST_OPTIONS } from './constants';

interface AlcoholSmokingSectionProps {
  control: Control<GuestPreferencesFormData>;
  errors: FieldErrors<GuestPreferencesFormData>;
  smokingAsGuest: string[];
}

export const AlcoholSmokingSection = ({
  control,
  errors,
  smokingAsGuest,
}: AlcoholSmokingSectionProps) => {
  return (
    <div className="section">
      <h3 className="sectionHeader">Alcohol & Smoking</h3>

      <Controller
        name="alcoholStance"
        control={control}
        render={({ field }) => (
          <RadioGroup label="Alcohol stance" labelClassName="questionLabel">
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
          <>
            <ControlledCheckboxGroup
              options={SMOKING_GUEST_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              label="Smoking preferences (as guest)"
              labelClassName="questionLabel"
            />
            {smokingAsGuest.includes('other') && (
              <Controller
                name="smokingAsGuestOther"
                control={control}
                render={({ field: otherField }) => (
                  <Input
                    {...otherField}
                    placeholder="Please specify"
                    error={errors.smokingAsGuestOther?.message}
                    maxLength={512}
                    className="otherInput"
                  />
                )}
              />
            )}
          </>
        )}
      />
    </div>
  );
};
