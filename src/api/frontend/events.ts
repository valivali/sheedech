import { useQuery } from "@tanstack/react-query"
import { EventCardData } from "@/types/event"
import { MapBounds } from "@/components/Map/Map.types"

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

export interface DateFilter {
  startDate?: string | null
  endDate?: string | null
}

export function useEventsByBounds(bounds: MapBounds | null, filters?: DateFilter) {
  return useQuery<EventCardData[]>({
    queryKey: ["events", "bounds", bounds, filters],
    queryFn: async () => {
      if (!bounds) {
        return []
      }

      const params = new URLSearchParams({
        minLat: bounds.minLat.toString(),
        maxLat: bounds.maxLat.toString(),
        minLon: bounds.minLon.toString(),
        maxLon: bounds.maxLon.toString()
      })

      if (filters?.startDate) params.append("startDate", filters.startDate)
      if (filters?.endDate) params.append("endDate", filters.endDate)

      const response = await fetch(`/api/events?${params.toString()}`)
      const result: EventsResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch events")
      }

      return result.data
    },
    enabled: bounds !== null,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
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

interface SingleEventResponse {
  success: boolean
  data?: EventCardData
  error?: string
}

export function useEvent(eventId: string | null) {
  return useQuery<EventCardData | null>({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) {
        return null
      }

      const response = await fetch(`/api/events/${eventId}`)
      const result: SingleEventResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch event")
      }

      return result.data || null
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

