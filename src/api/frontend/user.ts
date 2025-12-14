import { useQuery } from "@tanstack/react-query"
import { UserData } from "@/types/user"

const API_BASE = "/api/user"

export const useUserDataQuery = () => {
  return useQuery<UserData>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await fetch(API_BASE)
      if (!response.ok) {
        let errorMessage = 'Unknown error'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error("Failed to parse error response")
        }
        
        if (response.status === 401) {
          throw new Error("Unauthorized")
        }
        if (response.status === 404) {
          console.error("User data not found:", errorMessage)
          throw new Error("User data not found")
        }
        throw new Error("Failed to fetch user data")
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}

