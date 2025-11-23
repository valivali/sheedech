import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { prisma } from "@/db/prisma"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api(.*)"])

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"])
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  if (userId && (isProtectedRoute(request) || isOnboardingRoute(request))) {
    // Check for immediate redirect cookie (optimization for just-completed onboarding)
    const justCompleted = request.cookies.get("onboarding-just-completed")?.value === "true"

    if (justCompleted) {
      const response = NextResponse.next()
      response.cookies.delete("onboarding-just-completed")
      return response
    }

    // Get onboarding status from database (source of truth)
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { onboarding: true }
      })

      const onboardingCompleted = user?.onboarding?.isCompleted ?? false
      const completedSteps = user?.onboarding?.completedSteps ?? 0

      if (!onboardingCompleted && !isOnboardingRoute(request)) {
        const stepMap = ["personal-info", "host-preferences", "guest-preferences", "onboarding-complete"]
        const stepIndex = Math.min(completedSteps, stepMap.length - 1)
        const redirectStep = stepMap[stepIndex]
        return NextResponse.redirect(new URL(`/onboarding?step=${redirectStep}`, request.url))
      }

      if (onboardingCompleted && isOnboardingRoute(request)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // If DB query fails, allow the request to proceed (fail open)
      // This prevents blocking users if there's a temporary DB issue
      console.error("Error checking onboarding status in middleware:", error)
    }
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
}
