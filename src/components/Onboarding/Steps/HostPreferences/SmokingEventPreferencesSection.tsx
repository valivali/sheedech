import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/UI/Input';
import { CheckboxGroup, CheckboxItem, ControlledCheckboxGroup } from '@/components/UI/CheckboxGroup';
import { RadioGroup, RadioItem } from '@/components/UI/RadioGroup';
import { HostPreferencesFormData } from '@/validations/onboarding';
import { SMOKING_HOST_OPTIONS, EVENT_TYPES, NOISE_LEVELS } from './constants';

interface SmokingEventPreferencesSectionProps {
  control: Control<HostPreferencesFormData>;
  errors: FieldErrors<HostPreferencesFormData>;
  smokingAsHost: string[];
}

export const SmokingEventPreferencesSection = ({
  control,
  errors,
  smokingAsHost,
}: SmokingEventPreferencesSectionProps) => {
  return (
    <div className="section">
      <h3 className="sectionHeader">Smoking & Event Preferences</h3>

      <Controller
        name="smokingAsHost"
        control={control}
        render={({ field }) => (
          <>
            <ControlledCheckboxGroup
              options={SMOKING_HOST_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              label="Smoking preferences (as host)"
              labelClassName="questionLabel"
            />
            {smokingAsHost.includes('other') && (
              <Controller
                name="smokingAsHostOther"
                control={control}
                render={({ field: otherField }) => (
                  <Input
                    {...otherField}
                    placeholder="Please specify"
                    error={errors.smokingAsHostOther?.message}
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
        name="eventTypes"
        control={control}
        render={({ field }) => (
          <ControlledCheckboxGroup
            options={EVENT_TYPES}
            value={field.value}
            onChange={field.onChange}
            label="Type of events you host *"
            labelClassName="questionLabel"
          />
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
          <RadioGroup label="Event atmosphere" labelClassName="questionLabel">
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
          <RadioGroup label="Are kids okay at your events?" labelClassName="questionLabel">
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
          <RadioGroup label="Are you okay with BYOB / potluck format?" labelClassName="questionLabel">
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
  );
};
