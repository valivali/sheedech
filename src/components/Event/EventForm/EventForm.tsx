"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { AddressInputWithSuggestions } from "@/components/Onboarding/Steps/PersonalInfo/AddressInputWithSuggestions"
import { Button } from "@/components/UI/Button"
import { CheckboxItem, ControlledCheckboxGroup } from "@/components/UI/CheckboxGroup"
import { FileUpload } from "@/components/UI/FileUpload"
import { Input } from "@/components/UI/Input"
import { RadioGroup, RadioItem } from "@/components/UI/RadioGroup"
import { Select } from "@/components/UI/Select"
import { Title } from "@/components/UI/Text"
import { Textarea } from "@/components/UI/Textarea"
import {
  AccessibilityType,
  AtmosphereTag,
  ContributionType,
  CuisineTheme,
  DietaryAccommodation,
  EventStatus,
  OccasionType,
  ParkingType
} from "@/types/event"
import { CreateEventFormData, createEventSchema } from "@/validations/event"

import styles from "./EventForm.module.scss"

const OCCASION_TYPES = [
  { label: "Dinner", value: OccasionType.DINNER },
  { label: "Holiday Festive Event", value: OccasionType.HOLIDAY },
  { label: "Birthday", value: OccasionType.BIRTHDAY },
  { label: "Casual Meetup", value: OccasionType.CASUAL },
  { label: "BYOB Gathering", value: OccasionType.BYOB },
  { label: "Cooking Workshop", value: OccasionType.WORKSHOP },
  { label: "Cultural Food Exchange", value: OccasionType.CULTURAL },
  { label: "Other", value: OccasionType.OTHER }
]

const CUISINE_THEMES = [
  { label: "Italian", value: CuisineTheme.ITALIAN },
  { label: "Israeli", value: CuisineTheme.ISRAELI },
  { label: "Kosher", value: CuisineTheme.KOSHER },
  { label: "Vegetarian", value: CuisineTheme.VEGETARIAN },
  { label: "Vegan", value: CuisineTheme.VEGAN },
  { label: "Comfort Food", value: CuisineTheme.COMFORT },
  { label: "Open Fire BBQ", value: CuisineTheme.BBQ },
  { label: "Asian", value: CuisineTheme.ASIAN },
  { label: "Mediterranean", value: CuisineTheme.MEDITERRANEAN },
  { label: "Mexican", value: CuisineTheme.MEXICAN },
  { label: "Other", value: CuisineTheme.OTHER }
]

const DIETARY_OPTIONS = [
  { label: "Gluten-Free", value: DietaryAccommodation.GLUTEN_FREE },
  { label: "Vegan", value: DietaryAccommodation.VEGAN },
  { label: "Kosher-Style", value: DietaryAccommodation.KOSHER_STYLE },
  { label: "Nut-Free", value: DietaryAccommodation.NUT_FREE },
  { label: "Lactose Intolerant", value: DietaryAccommodation.LACTOSE_INTOLERANT },
  { label: "Cannot Accommodate", value: DietaryAccommodation.NONE }
]

const ACCESSIBILITY_OPTIONS = [
  { label: "Elevator Available", value: AccessibilityType.ELEVATOR },
  { label: "Wheelchair Accessible", value: AccessibilityType.WHEELCHAIR },
  { label: "Stairs (Few)", value: AccessibilityType.STAIRS_FEW },
  { label: "Stairs (Many)", value: AccessibilityType.STAIRS_MANY }
]

const ATMOSPHERE_TAGS = [
  { label: "Chill", value: AtmosphereTag.CHILL },
  { label: "Lively", value: AtmosphereTag.LIVELY },
  { label: "Deep Conversations", value: AtmosphereTag.DEEP_CONVERSATIONS },
  { label: "Music Background", value: AtmosphereTag.MUSIC },
  { label: "Game Night After Dinner", value: AtmosphereTag.GAMES },
  { label: "Quiet Environment", value: AtmosphereTag.QUIET }
]

const SOCIAL_OPTIONS = [
  { label: "Kid-Friendly", value: "kidFriendly" },
  { label: "Pet-Friendly", value: "petFriendly" },
  { label: "Smoking Allowed", value: "smokingAllowed" },
  { label: "Alcohol Provided", value: "alcoholProvided" },
  { label: "BYOB Welcome", value: "byob" }
]

interface EventFormProps {
  initialValues?: Partial<CreateEventFormData>
  onSubmit: (data: CreateEventFormData, status: EventStatus) => Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
  draftLabel?: string
}

export function EventForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Publish Event",
  draftLabel = "Save as Draft"
}: EventFormProps) {
  const [menuItems, setMenuItems] = useState<string[]>([])
  const [menuInput, setMenuInput] = useState("")

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      occasionType: undefined,
      customOccasionType: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      description: "",
      formattedAddress: "",
      accessibility: [],
      parking: undefined,
      cuisineTheme: [],
      customCuisineTheme: "",
      proposedMenu: [],
      accommodatesDietary: [],
      maxGuests: 6,
      minGuests: 2,
      kidFriendly: false,
      petFriendly: false,
      smokingAllowed: false,
      alcoholProvided: false,
      byob: false,
      whoElsePresent: [],
      atmosphereTags: [],
      houseRules: "",
      contributionType: ContributionType.FREE,
      status: EventStatus.DRAFT,
      photos: [],
      ...initialValues
    }
  })

  // Update proposedMenu state when initialValues change or on mount
  useEffect(() => {
    if (initialValues?.proposedMenu) {
      setMenuItems(initialValues.proposedMenu)
    }
  }, [initialValues?.proposedMenu])

  const contributionType = watch("contributionType")
  const selectedCuisineThemes = watch("cuisineTheme") || []
  const kidFriendly = watch("kidFriendly")
  const petFriendly = watch("petFriendly")
  const smokingAllowed = watch("smokingAllowed")
  const alcoholProvided = watch("alcoholProvided")
  const byob = watch("byob")

  const selectedSocialOptions = [
    kidFriendly ? "kidFriendly" : "",
    petFriendly ? "petFriendly" : "",
    smokingAllowed ? "smokingAllowed" : "",
    alcoholProvided ? "alcoholProvided" : "",
    byob ? "byob" : ""
  ].filter(Boolean)

  const addMenuItem = useCallback(() => {
    if (menuInput.trim()) {
      const newMenuItems = [...menuItems, menuInput.trim()]
      setMenuItems(newMenuItems)
      setValue("proposedMenu", newMenuItems)
      setMenuInput("")
    }
  }, [menuInput, menuItems, setValue])

  const removeMenuItem = useCallback(
    (index: number) => {
      const newMenuItems = menuItems.filter((_, i) => i !== index)
      setMenuItems(newMenuItems)
      setValue("proposedMenu", newMenuItems)
    },
    [menuItems, setValue]
  )

  const handleFormSubmit = useCallback(
    (data: CreateEventFormData, eventStatus: EventStatus) => {
      const cuisineThemeWithoutOther = data.cuisineTheme.filter((theme) => theme !== CuisineTheme.OTHER)
      onSubmit(
        {
          ...data,
          cuisineTheme: cuisineThemeWithoutOther,
          status: eventStatus
        },
        eventStatus
      )
    },
    [onSubmit]
  )

  return (
    <form className={styles.form}>
      <section className={styles.section}>
        <Title level={2}>Event Basics</Title>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} label="Event Title *" placeholder="Friday Night Shabbat Dinner" error={errors.title?.message} />
          )}
        />

        <Controller
          name="occasionType"
          control={control}
          render={({ field }) => (
            <div className={styles.field}>
              <label className={styles.label}>Occasion / Type *</label>
              <Select
                options={OCCASION_TYPES}
                value={OCCASION_TYPES.find((option) => option.value === field.value)?.label || ""}
                onChange={(label) => {
                  const selectedOption = OCCASION_TYPES.find((option) => option.label === label)
                  field.onChange(selectedOption?.value)
                }}
                placeholder="Select occasion type"
              />
              {errors.occasionType && <span className={styles.error}>{errors.occasionType.message}</span>}
            </div>
          )}
        />

        <Controller
          name="customOccasionType"
          control={control}
          render={({ field }) => {
            const selectedOccasionType = watch("occasionType")
            if (selectedOccasionType !== OccasionType.OTHER) return <></>

            return (
              <Input
                {...field}
                label="Custom Occasion Type *"
                placeholder="Please specify the occasion type"
                error={errors.customOccasionType?.message}
              />
            )
          }}
        />

        <div className={styles.formRow}>
          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => <Input {...field} type="date" label="Event Date *" error={errors.eventDate?.message} />}
          />

          <Controller
            name="startTime"
            control={control}
            render={({ field }) => <Input {...field} type="time" label="Start Time *" error={errors.startTime?.message} />}
          />

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => <Input {...field} type="time" label="End Time" error={errors.endTime?.message} />}
          />
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Short Description"
              placeholder="Describe what the evening will feel like..."
              rows={4}
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          name="photos"
          control={control}
          render={({ field }) => (
            <FileUpload
              label="Event Images"
              multiple={true}
              maxFiles={5}
              value={field.value || []}
              onChange={field.onChange}
              error={errors.photos?.message}
            />
          )}
        />
      </section>

      <section className={styles.section}>
        <Title level={2}>Location</Title>

        <Controller
          name="formattedAddress"
          control={control}
          render={({ field }) => (
            <AddressInputWithSuggestions
              value={field.value || ""}
              onChange={field.onChange}
              onSuggestionSelect={(suggestion) => {
                setValue("lat", suggestion.properties.lat)
                setValue("lon", suggestion.properties.lon)
                if (suggestion.properties.city) setValue("city", suggestion.properties.city)
                if (suggestion.properties.state) setValue("state", suggestion.properties.state)
                if (suggestion.properties.country) setValue("country", suggestion.properties.country)
                if (suggestion.properties.postcode) setValue("postalCode", suggestion.properties.postcode)
                if (suggestion.properties.street) setValue("streetName", suggestion.properties.street)
                if (suggestion.properties.housenumber) setValue("houseNumber", suggestion.properties.housenumber)
              }}
              label="Address"
              helperText=""
              placeholder="123 Main St, City, State"
              error={errors.formattedAddress?.message}
            />
          )}
        />

        <Controller
          name="accessibility"
          control={control}
          render={({ field }) => (
            <ControlledCheckboxGroup
              label="Accessibility"
              options={ACCESSIBILITY_OPTIONS}
              value={field.value || []}
              onChange={field.onChange}
              error={errors.accessibility?.message}
            />
          )}
        />

        <Controller
          name="parking"
          control={control}
          render={({ field }) => (
            <RadioGroup label="Parking Availability">
              <RadioItem
                {...field}
                value={ParkingType.STREET}
                checked={field.value === ParkingType.STREET}
                onChange={(e) => field.onChange(e.target.value)}
              >
                Street Parking
              </RadioItem>
              <RadioItem
                {...field}
                value={ParkingType.PRIVATE}
                checked={field.value === ParkingType.PRIVATE}
                onChange={(e) => field.onChange(e.target.value)}
              >
                Private Building Parking
              </RadioItem>
              <RadioItem
                {...field}
                value={ParkingType.NONE}
                checked={field.value === ParkingType.NONE}
                onChange={(e) => field.onChange(e.target.value)}
              >
                No Parking
              </RadioItem>
            </RadioGroup>
          )}
        />
      </section>

      <section className={styles.section}>
        <Title level={2}>Food & Menu</Title>

        <Controller
          name="cuisineTheme"
          control={control}
          render={({ field }) => (
            <>
              <ControlledCheckboxGroup
                label="Theme / Cuisine *"
                options={CUISINE_THEMES.filter((option) => option.value !== CuisineTheme.OTHER)}
                value={field.value || []}
                onChange={field.onChange}
                error={errors.cuisineTheme?.message}
              />

              <CheckboxItem
                checked={selectedCuisineThemes.includes(CuisineTheme.OTHER)}
                onChange={(e) => {
                  const currentThemes = field.value || []
                  const valueSet = new Set(currentThemes)
                  if (e.target.checked) {
                    valueSet.add(CuisineTheme.OTHER)
                  } else {
                    valueSet.delete(CuisineTheme.OTHER)
                  }
                  field.onChange(Array.from(valueSet))
                }}
              >
                Other
              </CheckboxItem>

              {selectedCuisineThemes.includes(CuisineTheme.OTHER) && (
                <Controller
                  name="customCuisineTheme"
                  control={control}
                  render={({ field: customField }) => (
                    <Input
                      {...customField}
                      label="Custom Cuisine Theme"
                      placeholder="Please specify your cuisine theme"
                      error={errors.customCuisineTheme?.message}
                    />
                  )}
                />
              )}
            </>
          )}
        />

        <div className={styles.field}>
          <label className={styles.label}>Proposed Menu</label>
          <div className={styles.menuInput}>
            <Input
              value={menuInput}
              onChange={(e) => setMenuInput(e.target.value)}
              placeholder="Add a menu item"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addMenuItem()
                }
              }}
            />
            <Button type="button" onClick={addMenuItem} variant="secondary">
              Add
            </Button>
          </div>
          {menuItems.length > 0 && (
            <ol className={styles.menuList}>
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item}
                  <button type="button" onClick={() => removeMenuItem(index)} className={styles.removeButton}>
                    ×
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        <Controller
          name="accommodatesDietary"
          control={control}
          render={({ field }) => (
            <ControlledCheckboxGroup
              label="Dietary Restrictions You Can Accommodate"
              options={DIETARY_OPTIONS}
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      <section className={styles.section}>
        <Title level={2}>Capacity & Social Expectations</Title>

        <div className={styles.formRow}>
          <Controller
            name="maxGuests"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Maximum Guests *"
                min={1}
                max={50}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                error={errors.maxGuests?.message}
              />
            )}
          />

          <Controller
            name="minGuests"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Minimum Guests"
                min={0}
                max={50}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                error={errors.minGuests?.message}
              />
            )}
          />
        </div>

        <ControlledCheckboxGroup
          label="Social Expectations"
          options={SOCIAL_OPTIONS}
          value={selectedSocialOptions}
          onChange={(values) => {
            setValue("kidFriendly", values.includes("kidFriendly"))
            setValue("petFriendly", values.includes("petFriendly"))
            setValue("smokingAllowed", values.includes("smokingAllowed"))
            setValue("alcoholProvided", values.includes("alcoholProvided"))
            setValue("byob", values.includes("byob"))
          }}
        />
      </section>

      <section className={styles.section}>
        <Title level={2}>Vibe & House Rules</Title>

        <Controller
          name="atmosphereTags"
          control={control}
          render={({ field }) => (
            <ControlledCheckboxGroup label="Atmosphere" options={ATMOSPHERE_TAGS} value={field.value || []} onChange={field.onChange} />
          )}
        />

        <Controller
          name="houseRules"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="House Rules"
              placeholder="e.g., Please remove shoes, arrive on time..."
              rows={3}
              error={errors.houseRules?.message}
            />
          )}
        />
      </section>

      <section className={styles.section}>
        <Title level={2}>Cost & Contribution</Title>

        <Controller
          name="contributionType"
          control={control}
          render={({ field }) => (
            <RadioGroup label="Is contribution requested?">
              <RadioItem
                {...field}
                value={ContributionType.FREE}
                checked={field.value === ContributionType.FREE}
                onChange={(e) => field.onChange(e.target.value)}
              >
                Free - Everything on the host
              </RadioItem>
              <RadioItem
                {...field}
                value={ContributionType.AMOUNT}
                checked={field.value === ContributionType.AMOUNT}
                onChange={(e) => field.onChange(e.target.value)}
              >
                Yes - Specific amount
              </RadioItem>
              <RadioItem
                {...field}
                value={ContributionType.DISH}
                checked={field.value === ContributionType.DISH}
                onChange={(e) => field.onChange(e.target.value)}
              >
                Bring a dish
              </RadioItem>
            </RadioGroup>
          )}
        />

        {contributionType === ContributionType.AMOUNT && (
          <Controller
            name="contributionAmount"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Contribution Amount ($)"
                min={0}
                step={0.01}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                error={errors.contributionAmount?.message}
              />
            )}
          />
        )}
      </section>

      {Object.keys(errors).length > 0 && (
        <div className={styles.formErrors}>
          <div className={styles.errorBanner}>
            Please fix the following errors:
            <ul>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error?.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            handleSubmit(
              (data: CreateEventFormData) => {
                handleFormSubmit(data, EventStatus.DRAFT)
              },
              (errors) => {
                console.log("Draft validation errors:", errors)
              }
            )()
          }}
          disabled={isSubmitting}
        >
          {draftLabel}
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            handleSubmit(
              (data: CreateEventFormData) => {
                handleFormSubmit(data, EventStatus.PENDING)
              },
              (errors) => {
                console.log("Publish validation errors:", errors)
              }
            )()
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
