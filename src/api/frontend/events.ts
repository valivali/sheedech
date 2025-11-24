import { useQuery } from "@tanstack/react-query"
import { EventCardData } from "@/types/event"

interface EventsResponse {
  success: boolean
  data: EventCardData[]
  error?: string
}

interface UserEventsResponse {
  success: boolean
  data: {
    hosting: EventCardData[]
    attending: EventCardData[]
    historical: EventCardData[]
  }
  error?: string
}

export function useEvents(limit?: number) {
  return useQuery<EventCardData[]>({
    queryKey: ["events", limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (limit) {
        params.append("limit", limit.toString())
      }

      const response = await fetch(`/api/events?${params.toString()}`)
      const result: EventsResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch events")
      }

      return result.data
    }
  })
}

export function useUserEvents() {
  return useQuery({
    queryKey: ["user-events"],
    queryFn: async () => {
      const response = await fetch("/api/events/my-events")
      const result: UserEventsResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch user events")
      }

      return result.data
    }
  })
}

