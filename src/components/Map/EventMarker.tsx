"use client"

import { Marker } from "react-map-gl/maplibre"
import { EventCardData } from "@/types/event"
import { getObfuscatedLocation } from "./utils"
import styles from "./EventMarker.module.scss"

interface EventMarkerProps {
  event: EventCardData
  onClick?: (event: EventCardData) => void
}

export const EventMarker = ({ event, onClick }: EventMarkerProps) => {
  if (!event.lat || !event.lon) {
    return null
  }

  const obfuscatedLocation = getObfuscatedLocation(event.lat, event.lon, event.id)

  return (
    <Marker
      longitude={obfuscatedLocation.lon}
      latitude={obfuscatedLocation.lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick?.(event)
      }}
    >
      <div className={styles.marker}>
        <div className={styles.pin} />
        <div className={styles.pulse} />
      </div>
    </Marker>
  )
}

