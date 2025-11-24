import { format, parse } from "date-fns"
import { EventCardData } from "@/types/event"

export function formatEventDateTime(eventDate: Date, startTime: string): string {
  const formattedDate = format(new Date(eventDate), "MMM d, yyyy")
  
  const [hours, minutes] = startTime.split(":")
  const timeDate = parse(`${hours}:${minutes}`, "HH:mm", new Date())
  const formattedTime = format(timeDate, "h:mm a")

  return `${formattedDate} at ${formattedTime}`
}

export function formatLocation(event: EventCardData): string {
  if (event.neighborhood) {
    return event.neighborhood
  }
  if (event.city) {
    return event.city
  }
  if (event.formattedAddress) {
    const parts = event.formattedAddress.split(",")
    return parts[parts.length - 2]?.trim() || event.formattedAddress
  }
  return "Location TBD"
}

export function getEventImage(event: EventCardData): string | null {
  if (event.photos && event.photos.length > 0) {
    const sortedPhotos = [...event.photos].sort((a, b) => a.order - b.order)
    return sortedPhotos[0].url
  }
  if (event.hostDiningImages && event.hostDiningImages.length > 0) {
    return event.hostDiningImages[0].url
  }
  return null
}

