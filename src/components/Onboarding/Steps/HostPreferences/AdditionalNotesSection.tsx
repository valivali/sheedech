import { Controller, Control } from 'react-hook-form';
import { memo } from 'react';
import { Text } from '@/components/UI/Text';
import { Textarea } from '@/components/UI/Textarea';
import { HostPreferencesFormData } from '@/validations/onboarding';

interface AdditionalNotesSectionProps {
  control: Control<HostPreferencesFormData>;
}

export const AdditionalNotesSection = memo(({ control }: AdditionalNotesSectionProps) => {
  return (
    <div className="section">
      <h3 className="sectionHeader">Additional Notes</h3>
      <Text className="sectionDescription">
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
  );
});

AdditionalNotesSection.displayName = 'AdditionalNotesSection';
