"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm } from "react-hook-form"

import { useSaveHostPreferences } from "@/api/frontend/onboarding"
import { Button } from "@/components/UI/Button"
import { Text, Title } from "@/components/UI/Text"
import { HostPreferences } from "@/types/onboarding"
import { HostPreferencesFormData, hostPreferencesSchema } from "@/validations/onboarding"

import {
  AccessibilitySection,
  AdditionalNotesSection,
  AmbianceRulesSection,
  BasicHomeDetailsSection,
  LogisticsSection,
  MediaSection,
  PetsSection,
  SmokingEventPreferencesSection
} from "../HostPreferences"
import styles from "./HostPreferencesStep.module.scss"

interface HostPreferencesStepProps {
  onNext: () => void
  onBack: () => void
  initialData?: HostPreferences
}

export const HostPreferencesStep = ({ onNext, onBack, initialData }: HostPreferencesStepProps) => {
  const { mutate: saveHostPreferences, isPending } = useSaveHostPreferences()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<HostPreferencesFormData>({
    resolver: zodResolver(hostPreferencesSchema),
    mode: "onChange",
    defaultValues: {
      smokingAsHost: initialData?.smokingAsHost || [],
      smokingAsHostOther: initialData?.smokingAsHostOther || "",
      eventTypes: initialData?.eventTypes || [],
      preferredAgeRange: initialData?.preferredAgeRange || "",
      noiseLevel: initialData?.noiseLevel || "",
      kidsOkay: initialData?.kidsOkay,
      byobPotluckOkay: initialData?.byobPotluckOkay,
      propertyType: initialData?.propertyType || "",
      neighborhoodNotes: initialData?.neighborhoodNotes || "",
      maxGuests: initialData?.maxGuests,
      indoorOutdoorSeating: initialData?.indoorOutdoorSeating || "",
      diningTableSize: initialData?.diningTableSize,
      accessibility: initialData?.accessibility || [],
      parking: initialData?.parking || [],
      publicTransportInfo: initialData?.publicTransportInfo || "",
      hasPets: initialData?.hasPets,
      hypoallergenicPet: initialData?.hypoallergenicPet,
      petsFreeRoam: initialData?.petsFreeRoam,
      quietHours: initialData?.quietHours || "",
      shoesOff: initialData?.shoesOff,
      diningAreaPhotos: initialData?.diningAreaPhotos || [],
      additionalNotes: initialData?.additionalNotes || ""
    }
  })

  const smokingAsHost = watch("smokingAsHost")
  const hasPets = watch("hasPets")

  const onSubmit = useCallback(
    (data: HostPreferencesFormData) => {
      saveHostPreferences(data, {
        onSuccess: () => {
          onNext()
        },
        onError: (error) => {
          console.error("Failed to save host preferences:", error)
        }
      })
    },
    [saveHostPreferences, onNext]
  )

  return (
    <div className={styles.container}>
      <Title level={2}>Host Preferences</Title>
      <Text className={styles.subtitle}>Tell us about hosting at your place. This helps guests know what to expect.</Text>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <SmokingEventPreferencesSection control={control} errors={errors} smokingAsHost={smokingAsHost} />

        <BasicHomeDetailsSection control={control} errors={errors} />

        <AccessibilitySection control={control} />

        <LogisticsSection control={control} errors={errors} />

        <PetsSection control={control} hasPets={hasPets} />

        <AmbianceRulesSection control={control} errors={errors} />

        <MediaSection control={control} />

        <AdditionalNotesSection control={control} />

        <div className={styles.actions}>
          <Button type="button" onClick={onBack} variant="secondary" size="md">
            Back
          </Button>
          <Button type="submit" disabled={isPending} size="md">
            {isPending ? "Saving..." : "Next Step"}
          </Button>
        </div>
      </form>
    </div>
  )
}
