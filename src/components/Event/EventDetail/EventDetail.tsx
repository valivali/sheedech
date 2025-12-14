"use client"

import { format, parse } from "date-fns"
import { useState } from "react"

import { useEvent } from "@/api/frontend/events"
import { Button } from "@/components/UI/Button"
import { ImageCarousel } from "@/components/UI/ImageCarousel"
import { Input } from "@/components/UI/Input"
import { Loading } from "@/components/UI/Loading"
import { Text } from "@/components/UI/Text"
import { Textarea } from "@/components/UI/Textarea"

import styles from "./EventDetail.module.scss"
import { EventDetailProps, JoinRequestFormData } from "./EventDetail.types"

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
  const { data: event, isLoading, error } = useEvent(eventId)
  const [formData, setFormData] = useState<JoinRequestFormData>({
    numberOfGuests: 1,
    bringingItem: "",
    comments: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Join request submitted:", formData)
    alert("Request to join submitted! (Mock action)")
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

  const images = event.photos?.length > 0 ? event.photos.sort((a, b) => a.order - b.order).map((p) => p.url) : []

  const dateTime = formatEventDateTime(event.eventDate, event.startTime, event.endTime)

  const guestText =
    event.minGuests && event.minGuests > 1
      ? `${event.minGuests}-${event.maxGuests} guests`
      : `Up to ${event.maxGuests} guest${event.maxGuests > 1 ? "s" : ""}`

  const occasionTypeLabel = event.customOccasionType || event.occasionType

  return (
    <div className={styles.container}>
      {images.length > 0 && (
        <div className={styles.imageSection}>
          <ImageCarousel images={images} alt={event.title} aspectRatio="16/10" />
        </div>
      )}

      <div className={styles.mainInfo}>
        <h1 className={styles.title}>{event.title}</h1>

        <div className={styles.hostInfo}>
          <div className={styles.hostAvatar}>{event.hostFirstName.charAt(0).toUpperCase()}</div>
          <div>
            <p className={styles.hostLabel}>Hosted by</p>
            <p className={styles.hostName}>{event.hostFirstName}</p>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} viewBox="0 0 24 24" fill="none">
            <path
              d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Date & Time</span>
            <span className={styles.detailValue}>{dateTime}</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} viewBox="0 0 24 24" fill="none">
            <path
              d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Guests</span>
            <span className={styles.detailValue}>{guestText}</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>{event.neighborhood || event.city || "Location provided after approval"}</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} viewBox="0 0 24 24" fill="none">
            <path
              d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Occasion</span>
            <span className={styles.detailValue}>{occasionTypeLabel}</span>
          </div>
        </div>
      </div>

      {event.description && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>About This Event</h3>
          <p className={styles.description}>{event.description}</p>
        </div>
      )}

      {event.cuisineTheme && event.cuisineTheme.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cuisine Theme</h3>
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
          <h3 className={styles.sectionTitle}>Proposed Menu</h3>
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
          <h3 className={styles.sectionTitle}>Atmosphere</h3>
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
          <h3 className={styles.sectionTitle}>Dietary Accommodations</h3>
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
          <h3 className={styles.sectionTitle}>House Rules</h3>
          <p className={styles.description}>{event.houseRules}</p>
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.requestSection}>
        <h2 className={styles.requestTitle}>Request to Join</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label className={styles.fieldLabel}>
              Number of Guests <span className={styles.required}>*</span>
            </label>
            <Input
              type="number"
              min="1"
              max={event.maxGuests}
              value={formData.numberOfGuests}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfGuests: parseInt(e.target.value) || 1
                })
              }
              required
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.fieldLabel}>
              What are you planning to bring? <span className={styles.optional}>(Optional)</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., Wine, Dessert, Side dish..."
              value={formData.bringingItem}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bringingItem: e.target.value
                })
              }
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.fieldLabel}>
              Additional Questions or Comments <span className={styles.optional}>(Optional)</span>
            </label>
            <Textarea
              placeholder="Any dietary restrictions, questions, or special requests..."
              rows={4}
              value={formData.comments}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  comments: e.target.value
                })
              }
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className={styles.submitButton}>
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  )
}
