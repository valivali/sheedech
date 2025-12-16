"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parse } from "date-fns"
import React, { useState } from "react"

import { useEvent } from "@/api/frontend/events"
import { EventForm } from "@/components/Event/EventForm/EventForm"
import { JoinRequest } from "@/components/Event/JoinRequest/JoinRequest"
import { CalendarIcon } from "@/components/icons/calendar-icon"
import { MapPinIcon } from "@/components/icons/map-pin-icon"
import { OccasionIcon } from "@/components/icons/occasion-icon"
import { UsersIcon } from "@/components/icons/users-icon"
import { Button } from "@/components/UI/Button"
import { ImageCarousel } from "@/components/UI/ImageCarousel"
import { Loading } from "@/components/UI/Loading"
import { Text, Title } from "@/components/UI/Text"
import { useUserData } from "@/lib/auth"
import { EventStatus } from "@/types/event"
import { CreateEventFormData } from "@/validations/event"

import styles from "./EventDetail.module.scss"
import { EventDetailProps } from "./EventDetail.types"

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
  const [isEditing, setIsEditing] = useState(false)

  const updateEventMutation = useMutation({
    mutationFn: async (payload: CreateEventFormData & { status: EventStatus }) => {
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
      setIsEditing(false)
    },
    onError: (error) => {
      console.error("Error updating event:", error)
    }
  })

  const handleUpdate = async (data: CreateEventFormData, eventStatus: EventStatus) => {
    updateEventMutation.mutate({ ...data, status: eventStatus })
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

  if (isEditing) {
    return (
      <div className={styles.container}>
        <div className={styles.headerAction}>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel Editing
          </Button>
        </div>
        <EventForm
          initialValues={{
            ...event,
            eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split("T")[0] : "",
            photos: event.photos?.map((p) => p.url) || [],
            cuisineTheme: event.cuisineTheme || [],
            atmosphereTags: event.atmosphereTags || [],
            accommodatesDietary: event.accommodatesDietary || [],
            accessibility: event.accessibility || []
          }}
          onSubmit={handleUpdate}
          isSubmitting={updateEventMutation.isPending}
          submitLabel="Save Changes"
          draftLabel="Save Changes"
        />
      </div>
    )
  }

  const images = event.photos?.length > 0 ? event.photos.sort((a, b) => a.order - b.order).map((p) => p.url) : []

  const dateTime = formatEventDateTime(event.eventDate, event.startTime, event.endTime)

  const guestText =
    event.minGuests && event.minGuests > 1
      ? `${event.minGuests}-${event.maxGuests} guests`
      : `Up to ${event.maxGuests} guest${event.maxGuests > 1 ? "s" : ""}`

  const occasionTypeLabel = event.customOccasionType || event.occasionType

  return (
    <div className={styles.container}>
      {isHost && (
        <div className={styles.hostControls}>
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit Event
          </Button>
        </div>
      )}
      {images.length > 0 && (
        <div className={styles.imageSection}>
          <ImageCarousel images={images} alt={event.title} aspectRatio="16/10" />
        </div>
      )}

      <div className={styles.mainInfo}>
        <Title level={1} size="2xl" className={styles.title}>
          {event.title}
        </Title>

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
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <CalendarIcon className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <Text size="xs" className={styles.detailLabel}>
              Date & Time
            </Text>
            <Text size="md" className={styles.detailValue}>
              {dateTime}
            </Text>
          </div>
        </div>

        <div className={styles.detailItem}>
          <UsersIcon className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <Text size="xs" className={styles.detailLabel}>
              Guests
            </Text>
            <Text size="md" className={styles.detailValue}>
              {guestText}
            </Text>
          </div>
        </div>

        <div className={styles.detailItem}>
          <MapPinIcon className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <Text size="xs" className={styles.detailLabel}>
              Location
            </Text>
            <Text size="md" className={styles.detailValue}>
              {event.formattedAddress || event.neighborhood || event.city || "Location provided after approval"}
            </Text>
          </div>
        </div>

        <div className={styles.detailItem}>
          <OccasionIcon className={styles.detailIcon} />
          <div className={styles.detailContent}>
            <Text size="xs" className={styles.detailLabel}>
              Occasion
            </Text>
            <Text size="md" className={styles.detailValue}>
              {occasionTypeLabel}
            </Text>
          </div>
        </div>
      </div>

      {event.description && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            About This Event
          </Title>
          <Text className={styles.description}>{event.description}</Text>
        </div>
      )}

      {event.cuisineTheme && event.cuisineTheme.length > 0 && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            Cuisine Theme
          </Title>
          <div className={styles.tags}>
            {event.cuisineTheme.map((cuisine) => (
              <span key={cuisine} className={styles.tag}>
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      )}

      {event.proposedMenu && event.proposedMenu.length > 0 && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            Proposed Menu
          </Title>
          <ul className={styles.menuList}>
            {event.proposedMenu.map((item, index) => (
              <li key={index} className={styles.menuItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {event.atmosphereTags && event.atmosphereTags.length > 0 && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            Atmosphere
          </Title>
          <div className={styles.tags}>
            {event.atmosphereTags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {event.accommodatesDietary && event.accommodatesDietary.length > 0 && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            Dietary Accommodations
          </Title>
          <div className={styles.tags}>
            {event.accommodatesDietary.map((diet) => (
              <span key={diet} className={styles.tag}>
                {diet}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.tags}>
        {event.kidFriendly && <span className={styles.tag}>Kid Friendly</span>}
        {event.petFriendly && <span className={styles.tag}>Pet Friendly</span>}
        {event.byob && <span className={styles.tag}>BYOB</span>}
        {event.alcoholProvided && <span className={styles.tag}>Alcohol Provided</span>}
      </div>

      {event.houseRules && (
        <div className={styles.section}>
          <Title level={3} size="md" className={styles.sectionTitle}>
            House Rules
          </Title>
          <Text className={styles.description}>{event.houseRules}</Text>
        </div>
      )}

      <div className={styles.divider} />

      {!isHost && <JoinRequest maxGuests={event.maxGuests} />}
    </div>
  )
}
