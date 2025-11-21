import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  if (userId && (isProtectedRoute(request) || isOnboardingRoute(request))) {
    const privateMetadata = sessionClaims?.privateMetadata as { onboardingCompleted?: boolean; completedSteps?: number } | undefined;
    const onboardingCompleted = privateMetadata?.onboardingCompleted ?? false;
    const completedSteps = privateMetadata?.completedSteps ?? 0;

    if (!onboardingCompleted && !isOnboardingRoute(request)) {
      const stepMap = ['personal-info', 'preferences', 'under-construction'];
      const stepIndex = Math.min(completedSteps, stepMap.length - 1);
      const redirectStep = stepMap[stepIndex];
      return NextResponse.redirect(new URL(`/onboarding?step=${redirectStep}`, request.url));
    }

    if (onboardingCompleted && isOnboardingRoute(request)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

