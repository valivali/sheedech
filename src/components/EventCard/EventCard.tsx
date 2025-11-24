"use client"

import Image from "next/image"
import { EventCardProps } from "./EventCard.types"
import { formatEventDateTime, formatLocation, getEventImage } from "./utils"
import { Text } from "@/components/UI/Text"
import styles from "./EventCard.module.scss"

export const EventCard = ({ event, className }: EventCardProps) => {
  const imageUrl = getEventImage(event)
  const location = formatLocation(event)
  const dateTime = formatEventDateTime(event.eventDate, event.startTime)

  return (
    <div className={`${styles.eventCard} ${className || ""}`}>
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.placeholder}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <Text className={styles.title} size="md">
          {event.title}
        </Text>
        <Text className={styles.host} size="sm">
          Hosted by {event.hostFirstName}
        </Text>
        <Text className={styles.dateTime} size="sm">
          {dateTime}
        </Text>
        <Text className={styles.location} size="sm">
          {location}
        </Text>
      </div>
    </div>
  )
}

