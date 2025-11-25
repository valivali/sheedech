import { Controller, Control } from 'react-hook-form';
import { memo } from 'react';
import { RadioGroup, RadioItem } from '@/components/UI/RadioGroup';
import { GuestPreferencesFormData } from '@/validations/onboarding';
import { CONTRIBUTION_OPTIONS } from './constants';
import styles from "./GuestPreferencesStep.module.scss"
interface ContributionPreferencesSectionProps {
  control: Control<GuestPreferencesFormData>;
}

export const ContributionPreferencesSection = memo(({ control }: ContributionPreferencesSectionProps) => {
  return (
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
  );
});

ContributionPreferencesSection.displayName = 'ContributionPreferencesSection';
