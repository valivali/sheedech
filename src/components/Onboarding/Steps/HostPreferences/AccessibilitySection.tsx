import { memo } from "react"
import { Control, Controller } from "react-hook-form"

import { ControlledCheckboxGroup } from "@/components/UI/CheckboxGroup"
import { HostPreferencesFormData } from "@/validations/onboarding"

import { ACCESSIBILITY_OPTIONS } from "./constants"
import styles from "./HostPreferencesStep.module.scss"
interface AccessibilitySectionProps {
  control: Control<HostPreferencesFormData>
}

export const AccessibilitySection = memo(({ control }: AccessibilitySectionProps) => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>Accessibility</h3>

      <Controller
        name="accessibility"
        control={control}
        render={({ field }) => (
          <ControlledCheckboxGroup
            options={ACCESSIBILITY_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            label="Select all that apply"
            labelClassName={styles.questionLabel}
          />
        )}
      />
    </div>
  )
})

AccessibilitySection.displayName = "AccessibilitySection"
