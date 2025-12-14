import { EventCardData } from "@/types/event"

export interface MapEventCardProps {
  event: EventCardData
  onClose?: () => void
  onClick?: () => void
}

