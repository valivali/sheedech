import { Control, Controller, FieldErrors } from "react-hook-form"

import { Input } from "@/components/UI/Input"
import { RadioCardGroup, RadioCardItem } from "@/components/UI/RadioCard"
import { HostPreferencesFormData } from "@/validations/onboarding"

import styles from "./HostPreferencesStep.module.scss"
interface AmbianceRulesSectionProps {
  control: Control<HostPreferencesFormData>
  errors: FieldErrors<HostPreferencesFormData>
}

export const AmbianceRulesSection = ({ control, errors }: AmbianceRulesSectionProps) => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>Ambiance / House Rules</h3>

      <Controller
        name="quietHours"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Quiet hours"
            placeholder="e.g., after 10 PM on weekdays"
            error={errors.quietHours?.message}
            maxLength={512}
          />
        )}
      />

      <Controller
        name="shoesOff"
        control={control}
        render={({ field: { value, onChange } }) => (
          <RadioCardGroup label="Shoes-off house?" labelClassName={styles.questionLabel}>
            <RadioCardItem value="yes" checked={value === true} onChange={() => onChange(true)}>
              Yes
            </RadioCardItem>
            <RadioCardItem value="no" checked={value === false} onChange={() => onChange(false)}>
              No
            </RadioCardItem>
          </RadioCardGroup>
        )}
      />
    </div>
  )
}
