"use client"

import "react-phone-input-2/lib/style.css"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import PhoneInput from "react-phone-input-2"

import { useSavePersonalInfo } from "@/api/frontend/onboarding"
import { Button } from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { Text, Title } from "@/components/UI/Text"
import { PersonalInfo } from "@/types/onboarding"
import { FamilyMemberFormData, PersonalInfoFormData, personalInfoSchema, PetFormData } from "@/validations/onboarding"

import { AddressInputWithSuggestions } from "./AddressInputWithSuggestions"
import { FamilyMemberForm } from "./FamilyMemberForm"
import styles from "./PersonalInfoStep.module.scss"
import { PetForm } from "./PetForm"

interface PersonalInfoStepProps {
  onNext: () => void
  initialData?: PersonalInfo
}

export const PersonalInfoStep = ({ onNext, initialData }: PersonalInfoStepProps) => {
  const { mutate: savePersonalInfo, isPending } = useSavePersonalInfo()
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberFormData[]>(initialData?.familyMembers || [])
  const [pets, setPets] = useState<PetFormData[]>(initialData?.pets || [])

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      address: initialData?.addressDetails?.formattedAddress || "",
      phoneNumber: initialData?.phoneNumber || "",
      familyMembers: initialData?.familyMembers || [],
      pets: initialData?.pets || []
    }
  })

  const handleFamilyMembersChange = useCallback((members: FamilyMemberFormData[]) => {
    setFamilyMembers(members)
  }, [])

  const handlePetsChange = useCallback((newPets: PetFormData[]) => {
    setPets(newPets)
  }, [])

  const onSubmit = useCallback(
    (data: PersonalInfoFormData) => {
      const formData = {
        ...data,
        familyMembers,
        pets
      }

      savePersonalInfo(formData, {
        onSuccess: () => {
          onNext()
        }
      })
    },
    [familyMembers, pets, savePersonalInfo, onNext]
  )

  return (
    <div className={styles.container}>
      <Title level={2}>Personal Information</Title>
      <Text className={styles.subtitle}>Help us get to know you better by sharing some basic information.</Text>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formRow}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => <Input {...field} label="First Name *" error={errors.firstName?.message} placeholder="John" />}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => <Input {...field} label="Last Name *" error={errors.lastName?.message} placeholder="Doe" />}
          />
        </div>

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <AddressInputWithSuggestions value={field.value} onChange={field.onChange} error={errors.address?.message} />
          )}
        />

        <div className={styles.phoneInputWrapper}>
          <label className={styles.phoneInputLabel}>Phone Number *</label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                country={"ca"}
                value={value}
                onChange={(phone) => onChange(phone)}
                inputProps={{
                  name: "phoneNumber"
                }}
                containerClass={styles.phoneInputContainer}
                enableSearch={true}
                disableSearchIcon={false}
                disableCountryGuess={true}
              />
            )}
          />
          {errors.phoneNumber && <span className={styles.phoneInputErrorText}>{errors.phoneNumber.message}</span>}
          <span className={styles.phoneInputHelperText}>We will not expose phone number until there is a match</span>
        </div>

        <FamilyMemberForm initialMembers={familyMembers} onMembersChange={handleFamilyMembersChange} />

        <PetForm initialPets={pets} onPetsChange={handlePetsChange} />

        <div className={styles.actions}>
          <Button type="submit" disabled={!isValid || isPending} size="md">
            {isPending ? "Saving..." : "Next Step"}
          </Button>
        </div>
      </form>
    </div>
  )
}
