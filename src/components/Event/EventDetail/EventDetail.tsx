"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parse } from "date-fns"
import React, { useState } from "react"

import { useEvent } from "@/api/frontend/events"
import { JoinRequest } from "@/components/Event/JoinRequest/JoinRequest"
import { CalendarIcon } from "@/components/icons/calendar-icon"
import { MapPinIcon } from "@/components/icons/map-pin-icon"
import { OccasionIcon } from "@/components/icons/occasion-icon"
import { PencilIcon } from "@/components/icons/pencil-icon"
import { UsersIcon } from "@/components/icons/users-icon"
import { AddressInputWithSuggestions } from "@/components/Onboarding/Steps/PersonalInfo/AddressInputWithSuggestions"
import { Button } from "@/components/UI/Button"
import { ControlledCheckboxGroup } from "@/components/UI/CheckboxGroup"
import { Chip } from "@/components/UI/Chip"
import { ImageCarousel } from "@/components/UI/ImageCarousel"
import { Input } from "@/components/UI/Input"
import { Loading } from "@/components/UI/Loading"
import { Select } from "@/components/UI/Select"
import { Text, Title } from "@/components/UI/Text"
import { Textarea } from "@/components/UI/Textarea"
import { useUserData } from "@/lib/auth"
import { AtmosphereTag, CuisineTheme, DietaryAccommodation, EventStatus, OccasionType } from "@/types/event"
import { CreateEventFormData } from "@/validations/event"

import styles from "./EventDetail.module.scss"
import { EventDetailProps } from "./EventDetail.types"

import {
  ATMOSPHERE_TAGS,
  CUISINE_THEMES,
  DIETARY_OPTIONS,
  OCCASION_TYPES,
  SOCIAL_OPTIONS
} from "../constants"

function formatEventDateTime(eventDate: Date, startTime: string, endTime?: string): string {
  const formattedDate = format(new Date(eventDate), "EEEE, MMMM d, yyyy")

  const [startHours, startMinutes] = startTime.split(":")
  const startTimeDate = parse(`${startHours}:${startMinutes}`, "HH:mm", new Date())
  const formattedStartTime = format(startTimeDate, "h:mm a")

  if (endTime) {
    const [endHours, endMinutes] = endTime.split(":")
    const endTimeDate = parse(`${endHours}:${endMinutes}`, "HH:mm", new Date())
    const formattedEndTime = format(endTimeDate, "h:mm a")
    return `${formattedDate} • ${formattedStartTime} - ${formattedEndTime}`
  }

  return `${formattedDate} • ${formattedStartTime}`
}

export const EventDetail = ({ eventId }: EventDetailProps) => {
  const { user } = useUserData()
  const queryClient = useQueryClient()
  const { data: event, isLoading, error } = useEvent(eventId)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<any>(null)

  const updateEventMutation = useMutation({
    mutationFn: async (payload: Partial<CreateEventFormData> & { status: EventStatus }) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to update event")
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] })
      setEditingField(null)
      setEditValue(null)
    },
    onError: (error) => {
      console.error("Error updating event:", error)
    }
  })

  const handleUpdateField = async (fieldName: string, value: any) => {
    if (!event) return

    const updates = ["guests", "dateTime", "location"].includes(fieldName) ? value : { [fieldName]: value }

    const payload: any = {
      title: event.title,
      occasionType: event.occasionType,
      customOccasionType: event.customOccasionType,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split("T")[0] : "",
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      formattedAddress: event.formattedAddress,
      streetName: event.streetName,
      houseNumber: event.houseNumber,
      city: event.city,
      state: event.state,
      country: event.country,
      postalCode: event.postalCode,
      lat: event.lat,
      lon: event.lon,
      neighborhood: event.neighborhood,
      maxGuests: event.maxGuests,
      minGuests: event.minGuests,
      cuisineTheme: event.cuisineTheme,
      proposedMenu: event.proposedMenu,
      accommodatesDietary: event.accommodatesDietary,
      atmosphereTags: event.atmosphereTags,
      houseRules: event.houseRules,
      kidFriendly: event.kidFriendly,
      petFriendly: event.petFriendly,
      smokingAllowed: event.smokingAllowed,
      alcoholProvided: event.alcoholProvided,
      parking: event.parking,
      accessibility: event.accessibility || [],
      isKosher: event.isKosher,
      isVegetarian: event.isVegetarian,
      isGlutenFree: event.isGlutenFree,
      hasNuts: event.hasNuts,
      hasDairy: event.hasDairy,
      whoElsePresent: event.whoElsePresent || [],
      contributionType: event.contributionType,
      contributionAmount: event.contributionAmount,
      status: event.status,
      photos: event.photos || [],
      ...updates
    }

    updateEventMutation.mutate(payload)
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className={styles.error}>
        <Text>Failed to load event details. Please try again.</Text>
      </div>
    )
  }

  const isHost = user?.id === event.userId

  const images = event.photos?.length > 0 ? event.photos.sort((a, b) => a.order - b.order).map((p) => p.url) : []

  const dateTime = formatEventDateTime(event.eventDate, event.startTime, event.endTime)

  const guestText =
    event.minGuests && event.minGuests > 1
      ? `${event.minGuests}-${event.maxGuests} guests`
      : `Up to ${event.maxGuests} guest${event.maxGuests > 1 ? "s" : ""}`

  const occasionTypeLabel = event.customOccasionType || event.occasionType

  const startEditing = (field: string, value: any) => {
    setEditingField(field)
    setEditValue(value)
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditValue(null)
  }

  const isSaveDisabled = (originalValue: any) => {
    return JSON.stringify(originalValue) === JSON.stringify(editValue) || updateEventMutation.isPending
  }

  const EditableWrapper = ({
    field,
    value,
    children,
    editComponent
  }: {
    field: string
    value: any
    children: React.ReactNode
    editComponent: React.ReactNode
  }) => {
    const isEditing = editingField === field

    if (!isHost) return <>{children}</>

    if (isEditing) {
      return (
        <div className={styles.editMode}>
          {editComponent}
          <div className={styles.editActions}>
            <Button variant="secondary" size="sm" onClick={cancelEditing} disabled={updateEventMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleUpdateField(field, editValue)}
              disabled={isSaveDisabled(value)}
            >
              {updateEventMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.editableWrapper}>
        {children}
        <button className={styles.editTrigger} onClick={() => startEditing(field, value)} aria-label={`Edit ${field}`}>
          <PencilIcon size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {images.length > 0 && (
        <div className={styles.imageSection}>
          <ImageCarousel images={images} alt={event.title} aspectRatio="16/10" />
        </div>
      )}

      <div className={styles.mainInfo}>
        <EditableWrapper
          field="title"
          value={event.title}
          editComponent={
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              className={styles.editInput}
            />
          }
        >
          <Title level={1} size="2xl" className={styles.title}>
            {event.title}
          </Title>
        </EditableWrapper>

        <div className={styles.hostInfo}>
          <div className={styles.hostAvatar}>{event.hostFirstName.charAt(0).toUpperCase()}</div>
          <div>
            <Text size="sm" className={styles.hostLabel}>
              Hosted by
            </Text>

            <Text size="md" className={styles.hostName}>
              {event.hostFirstName} {event.hostLastName}
            </Text>
          </div>
        </div>

        {event.description && (
          <div className={styles.aboutSection}>
            <Title level={3} size="md" className={styles.sectionTitle}>
              About This Event
            </Title>
            <EditableWrapper
              field="description"
              value={event.description}
              editComponent={
                <Textarea
                  value={editValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditValue(e.target.value)}
                  autoFocus
                  rows={4}
                  className={styles.editInput}
                />
              }
            >
              <Text className={styles.description}>{event.description}</Text>
            </EditableWrapper>
          </div>
        )}
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <OccasionIcon className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <Text size="xs" className={styles.detailLabel}>
              Occasion
            </Text>
            <EditableWrapper
              field="occasionType"
              value={event.occasionType}
              editComponent={
                <div className={styles.editInput}>
                  <Select
                    options={OCCASION_TYPES}
                    value={OCCASION_TYPES.find((option) => option.value === editValue)?.label || ""}
                    onChange={(label) => {
                      const selectedOption = OCCASION_TYPES.find((option) => option.label === label)
                      setEditValue(selectedOption?.value)
                    }}
                    placeholder="Select occasion type"
                  />
                  {editValue === OccasionType.OTHER && (
                    <Input
                      value={event.customOccasionType}
                      onChange={(e) => handleUpdateField("customOccasionType", e.target.value)}
                      placeholder="Custom occasion"
                      className={styles.editInput}
                      style={{ marginTop: "8px" }}
                    />
                  )}
                </div>
              }
            >
              <Text size="md" className={styles.detailValue}>
                {occasionTypeLabel}
              </Text>
            </EditableWrapper>
          </div>
        </div>

        <div className={styles.detailItem}>
          <CalendarIcon className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <Text size="xs" className={styles.detailLabel}>
              Date & Time
            </Text>
            <EditableWrapper
              field="dateTime"
              value={{ eventDate: event.eventDate, startTime: event.startTime, endTime: event.endTime }}
              editComponent={
                <div className={styles.formRow}>
                  <Input
                    type="date"
                    label="Date"
                    value={editValue?.eventDate ? new Date(editValue.eventDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => setEditValue({ ...editValue, eventDate: e.target.value })}
                    className={styles.editInput}
                  />
                  <Input
                    type="time"
                    label="Start"
                    value={editValue?.startTime || ""}
                    onChange={(e) => setEditValue({ ...editValue, startTime: e.target.value })}
                    className={styles.editInput}
                  />
                  <Input
                    type="time"
                    label="End"
                    value={editValue?.endTime || ""}
                    onChange={(e) => setEditValue({ ...editValue, endTime: e.target.value })}
                    className={styles.editInput}
                  />
                </div>
              }
            >
              <Text size="md" className={styles.detailValue}>
                {dateTime}
              </Text>
            </EditableWrapper>
          </div>
        </div>

        <div className={styles.detailItem}>
          <MapPinIcon className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <Text size="xs" className={styles.detailLabel}>
              Location
            </Text>
            <EditableWrapper
              field="location"
              value={{ formattedAddress: event.formattedAddress }}
              editComponent={
                <AddressInputWithSuggestions
                  value={editValue?.formattedAddress || ""}
                  onChange={(val) => setEditValue({ ...editValue, formattedAddress: val })}
                  onSuggestionSelect={(suggestion) => {
                    setEditValue({
                      ...editValue,
                      formattedAddress: suggestion.properties.formatted,
                      lat: suggestion.properties.lat,
                      lon: suggestion.properties.lon,
                      city: suggestion.properties.city,
                      state: suggestion.properties.state,
                      country: suggestion.properties.country,
                      postalCode: suggestion.properties.postcode,
                      streetName: suggestion.properties.street,
                      houseNumber: suggestion.properties.housenumber
                    })
                  }}
                  label="Address"
                  className={styles.editInput}
                />
              }
            >
              <Text size="md" className={styles.detailValue}>
                {event.formattedAddress || event.neighborhood || event.city || "Location provided after approval"}
              </Text>
            </EditableWrapper>
          </div>
        </div>

        <div className={styles.detailItem}>
          <UsersIcon className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <Text size="xs" className={styles.detailLabel}>
              Guests
            </Text>
            <EditableWrapper
              field="guests"
              value={{ minGuests: event.minGuests, maxGuests: event.maxGuests }}
              editComponent={
                <div className={styles.formRow}>
                  <Input
                    type="number"
                    label="Min"
                    value={editValue?.minGuests || 0}
                    onChange={(e) => setEditValue({ ...editValue, minGuests: parseInt(e.target.value) })}
                    className={styles.editInput}
                  />
                  <Input
                    type="number"
                    label="Max"
                    value={editValue?.maxGuests || 0}
                    onChange={(e) => setEditValue({ ...editValue, maxGuests: parseInt(e.target.value) })}
                    className={styles.editInput}
                  />
                </div>
              }
            >
              <Text size="md" className={styles.detailValue}>
                {guestText}
              </Text>
            </EditableWrapper>
          </div>
        </div>
      </div>

      {event.cuisineTheme && event.cuisineTheme.length > 0 && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            Cuisine Theme
          </Title>
          <EditableWrapper
            field="cuisineTheme"
            value={event.cuisineTheme}
            editComponent={
              <ControlledCheckboxGroup
                options={CUISINE_THEMES.filter((o) => o.value !== CuisineTheme.OTHER)}
                value={editValue}
                onChange={setEditValue}
              />
            }
          >
            <div className={styles.chips}>
              {event.cuisineTheme.map((cuisine) => (
                <Chip key={cuisine} label={cuisine} />
              ))}
            </div>
          </EditableWrapper>
        </div>
      )}

      {event.accommodatesDietary && event.accommodatesDietary.length > 0 && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            Dietary Restrictions
          </Title>
          <EditableWrapper
            field="accommodatesDietary"
            value={event.accommodatesDietary}
            editComponent={<ControlledCheckboxGroup options={DIETARY_OPTIONS} value={editValue} onChange={setEditValue} />}
          >
            <div className={styles.chips}>
              {event.accommodatesDietary.map((diet) => (
                <Chip key={diet} label={diet} />
              ))}
            </div>
          </EditableWrapper>
        </div>
      )}

      {event.proposedMenu && event.proposedMenu.length > 0 && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            Proposed Menu
          </Title>
          <EditableWrapper
            field="proposedMenu"
            value={event.proposedMenu}
            editComponent={
              <div>
                <div className={styles.chips} style={{ marginBottom: "8px" }}>
                  {Array.isArray(editValue) &&
                    editValue.map((item: string, index: number) => (
                      <Chip
                        key={index}
                        label={item}
                        onRemove={() => setEditValue(editValue.filter((_: any, i: number) => i !== index))}
                      />
                    ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Input placeholder="Add menu item" id="new-menu-item" />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const input = document.getElementById("new-menu-item") as HTMLInputElement
                      if (input.value) {
                        setEditValue([...(Array.isArray(editValue) ? editValue : []), input.value])
                        input.value = ""
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            }
          >
            <div className={styles.chips}>
              {event.proposedMenu.map((item, index) => (
                <Chip key={index} label={item} />
              ))}
            </div>
          </EditableWrapper>
        </div>
      )}

      {event.atmosphereTags && event.atmosphereTags.length > 0 && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            Atmosphere
          </Title>
          <EditableWrapper
            field="atmosphereTags"
            value={event.atmosphereTags}
            editComponent={<ControlledCheckboxGroup options={ATMOSPHERE_TAGS} value={editValue} onChange={setEditValue} />}
          >
            <div className={styles.chips}>
              {event.atmosphereTags.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </div>
          </EditableWrapper>
        </div>
      )}

      <EditableWrapper
        field="socialOptions"
        value={{
          kidFriendly: event.kidFriendly,
          petFriendly: event.petFriendly,
          byob: event.byob,
          alcoholProvided: event.alcoholProvided
        }}
        editComponent={
          <ControlledCheckboxGroup
            options={SOCIAL_OPTIONS}
            value={[
              editValue?.kidFriendly ? "kidFriendly" : "",
              editValue?.petFriendly ? "petFriendly" : "",
              editValue?.byob ? "byob" : "",
              editValue?.alcoholProvided ? "alcoholProvided" : ""
            ].filter(Boolean)}
            onChange={(values) => {
              setEditValue({
                kidFriendly: values.includes("kidFriendly"),
                petFriendly: values.includes("petFriendly"),
                byob: values.includes("byob"),
                alcoholProvided: values.includes("alcoholProvided")
              })
            }}
          />
        }
      >
        <div className={styles.chips}>
          {event.kidFriendly && <Chip label="Kid Friendly" />}
          {event.petFriendly && <Chip label="Pet Friendly" />}
          {event.byob && <Chip label="BYOB" />}
          {event.alcoholProvided && <Chip label="Alcohol Provided" />}
        </div>
      </EditableWrapper>

      {event.houseRules && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            House Rules
          </Title>
          <EditableWrapper
            field="houseRules"
            value={event.houseRules}
            editComponent={
              <Textarea
                value={editValue}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditValue(e.target.value)}
                autoFocus
                rows={3}
                className={styles.editInput}
              />
            }
          >
            <Text className={styles.description}>{event.houseRules}</Text>
          </EditableWrapper>
        </div>
      )}

      <div className={styles.divider} />

      {!isHost && <JoinRequest maxGuests={event.maxGuests} />}
    </div>
  )
}
