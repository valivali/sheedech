"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"

import { clerkAppearance } from "@/lib/auth/theme"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}
