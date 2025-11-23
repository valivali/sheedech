import { Controller, Control } from 'react-hook-form';
import { memo } from 'react';
import { ControlledCheckboxGroup } from '@/components/UI/CheckboxGroup';
import { HostPreferencesFormData } from '@/validations/onboarding';
import { ACCESSIBILITY_OPTIONS } from './constants';

interface AccessibilitySectionProps {
  control: Control<HostPreferencesFormData>;
}

export const AccessibilitySection = memo(({ control }: AccessibilitySectionProps) => {
  return (
    <div className="section">
      <h3 className="sectionHeader">Accessibility</h3>

      <Controller
        name="accessibility"
        control={control}
        render={({ field }) => (
          <ControlledCheckboxGroup
            options={ACCESSIBILITY_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            label="Select all that apply"
            labelClassName="questionLabel"
          />
        )}
      />
    </div>
  );
});

AccessibilitySection.displayName = 'AccessibilitySection';
