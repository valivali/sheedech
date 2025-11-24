"use client"

import { EventCardData } from "@/types/event"
import { EventCard } from "./EventCard"
import styles from "./EventCardGrid.module.scss"

export interface EventCardGridProps {
  events: EventCardData[]
  className?: string
}

export const EventCardGrid = ({ events, className }: EventCardGridProps) => {
  if (events.length === 0) {
    return null
  }

  return (
    <div className={`${styles.grid} ${className || ""}`}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

