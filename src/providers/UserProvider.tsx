"use client"

import { useUser } from "@clerk/nextjs"
import { createContext, ReactNode, useContext } from "react"

import { useUserDataQuery } from "@/api/frontend/user"
import { UserData } from "@/types/user"

interface UserContextValue {
  user: UserData | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { isSignedIn } = useUser()

  const { data, isLoading, error, refetch } = useUserDataQuery()

  const value: UserContextValue = {
    user: data || null,
    isLoading: isSignedIn ? isLoading : false,
    error: error as Error | null,
    refetch
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserData() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserProvider")
  }
  return context
}
