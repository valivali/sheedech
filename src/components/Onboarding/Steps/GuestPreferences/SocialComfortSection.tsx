import { Controller, Control } from 'react-hook-form';
import { memo } from 'react';
import { RadioGroup, RadioItem } from '@/components/UI/RadioGroup';
import { GuestPreferencesFormData } from '@/validations/onboarding';
import styles from "./GuestPreferencesStep.module.scss"
interface SocialComfortSectionProps {
  control: Control<GuestPreferencesFormData>;
}

export const SocialComfortSection = memo(({ control }: SocialComfortSectionProps) => {
  return (
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
  );
});

SocialComfortSection.displayName = 'SocialComfortSection';
