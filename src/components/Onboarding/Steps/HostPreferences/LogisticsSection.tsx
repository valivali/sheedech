import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/UI/Input';
import { ControlledCheckboxGroup } from '@/components/UI/CheckboxGroup';
import { HostPreferencesFormData } from '@/validations/onboarding';
import { PARKING_OPTIONS } from './constants';

interface LogisticsSectionProps {
  control: Control<HostPreferencesFormData>;
  errors: FieldErrors<HostPreferencesFormData>;
}

export const LogisticsSection = ({ control, errors }: LogisticsSectionProps) => {
  return (
    <div className="section">
      <h3 className="sectionHeader">Logistics</h3>

      <Controller
        name="parking"
        control={control}
        render={({ field }) => (
          <ControlledCheckboxGroup
            options={PARKING_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            label="Parking options"
            labelClassName="questionLabel"
          />
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
  );
};
