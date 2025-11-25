import { memo } from "react"
import { Control, Controller } from "react-hook-form"

import { FileUpload } from "@/components/UI/FileUpload"
import { Text } from "@/components/UI/Text"
import { HostPreferencesFormData } from "@/validations/onboarding"

import styles from "./HostPreferencesStep.module.scss"
interface MediaSectionProps {
  control: Control<HostPreferencesFormData>
}

export const MediaSection = memo(({ control }: MediaSectionProps) => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionHeader}>Optional Media</h3>
      <Text className="sectionDescription">
        Upload 1-2 photos of your dining area (optional). Helps with trust and boosts event engagement.
      </Text>

      <Controller
        name="diningAreaPhotos"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FileUpload
            label="Dining area photos"
            multiple
            maxFiles={2}
            accept="image/*"
            value={value}
            onChange={(urls) => {
              onChange(urls)
            }}
          />
        )}
      />
    </div>
  )
})

MediaSection.displayName = "MediaSection"
