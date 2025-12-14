"use client"

import { format, parse } from "date-fns"
import { useRef } from "react"

import { ImageCarousel } from "@/components/UI/ImageCarousel"
import { Text } from "@/components/UI/Text"
import { EventCardData } from "@/types/event"

import styles from "./MapEventCard.module.scss"
import { MapEventCardProps } from "./MapEventCard.types"

function formatEventDateTime(eventDate: Date, startTime: string): string {
  const formattedDate = format(new Date(eventDate), "MMM d, yyyy")

  const [hours, minutes] = startTime.split(":")
  const timeDate = parse(`${hours}:${minutes}`, "HH:mm", new Date())
  const formattedTime = format(timeDate, "h:mm a")

  return `${formattedDate} at ${formattedTime}`
}

function getEventImages(event: EventCardData): string[] {
  const images: string[] = []

  if (event.photos && event.photos.length > 0) {
    const sortedPhotos = [...event.photos].sort((a, b) => a.order - b.order)
    images.push(...sortedPhotos.map((photo) => photo.url))
  }

  return images
}

export const MapEventCard = ({ event, onClose, onClick }: MapEventCardProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const images = getEventImages(event)
  const dateTime = formatEventDateTime(event.eventDate, event.startTime)

  const guestText =
    event.minGuests && event.minGuests > 1
      ? `${event.minGuests}-${event.maxGuests} guests`
      : `Up to ${event.maxGuests} guest${event.maxGuests > 1 ? "s" : ""}`

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick && !closeButtonRef.current?.contains(e.target as Node)) {
      onClick()
    }
  }

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <button
        ref={closeButtonRef}
        className={styles.closeButton}
        onClick={(e) => {
          e.stopPropagation()
          onClose?.()
        }}
        aria-label="Close"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className={styles.imageWrapper}>
        <ImageCarousel images={images} alt={event.title} aspectRatio="16/10" />
      </div>

      <div className={styles.content}>
        <Text className={styles.title} size="md">
          {event.title}
        </Text>

        <div className={styles.details}>
          <div className={styles.detail}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Text size="sm" className={styles.detailText}>
              {dateTime}
            </Text>
          </div>

          <div className={styles.detail}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Text size="sm" className={styles.detailText}>
              {guestText}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
