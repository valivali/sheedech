import { Controller, Control } from 'react-hook-form';
import { memo } from 'react';
import { Text } from '@/components/UI/Text';
import { Textarea } from '@/components/UI/Textarea';
import { GuestPreferencesFormData } from '@/validations/onboarding';
import styles from "./GuestPreferencesStep.module.scss"
interface GuestAdditionalNotesSectionProps {
  control: Control<GuestPreferencesFormData>;
}

export const GuestAdditionalNotesSection = memo(({ control }: GuestAdditionalNotesSectionProps) => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>Additional Notes</h3>
      <Text className={styles.sectionDescription}>
        Any additional information you'd like to share about your preferences as a guest.
      </Text>

      <Controller
        name="additionalNotes"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="e.g., I love trying new cuisines, I'm allergic to certain foods, etc."
            maxLength={512}
            helperText="Maximum 512 characters"
          />
        )}
      />
    </div>
  );
});

GuestAdditionalNotesSection.displayName = 'GuestAdditionalNotesSection';
