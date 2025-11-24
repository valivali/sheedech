import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { prisma } from "@/db/prisma"
import { getAuthUser } from "@/lib/auth/user"
import { mapEventCardDataFromPrisma } from "@/mappers/event"

type EventWithUserData = Prisma.EventGetPayload<{
  include: {
    photos: true
    user: {
      include: {
        onboarding: {
          select: {
            firstName: true
          }
        }
        diningImages: {
          select: {
            url: true
          }
        }
      }
    }
  }
}>

export async function GET() {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: authUser.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const now = new Date()

    const hostingEvents = await prisma.event.findMany({
      where: {
        userId: user.id,
        eventDate: {
          gte: now
        },
        status: {
          in: ["active", "pending"]
        }
      },
      include: {
        photos: {
          orderBy: {
            order: "asc"
          }
        },
        user: {
          include: {
            onboarding: {
              select: {
                firstName: true
              }
            },
            diningImages: {
              orderBy: {
                order: "asc"
              },
              select: {
                url: true
              }
            }
          }
        }
      },
      orderBy: {
        eventDate: "asc"
      }
    })

    const historicalEvents = await prisma.event.findMany({
      where: {
        userId: user.id,
        eventDate: {
          lt: now
        }
      },
      include: {
        photos: {
          orderBy: {
            order: "asc"
          }
        },
        user: {
          include: {
            onboarding: {
              select: {
                firstName: true
              }
            },
            diningImages: {
              orderBy: {
                order: "asc"
              },
              select: {
                url: true
              }
            }
          }
        }
      },
      orderBy: {
        eventDate: "desc"
      }
    })

    const hostingData = hostingEvents.map((event: EventWithUserData) => mapEventCardDataFromPrisma(event))
    const historicalData = historicalEvents.map((event: EventWithUserData) => mapEventCardDataFromPrisma(event))

    return NextResponse.json({
      success: true,
      data: {
        hosting: hostingData,
        attending: [],
        historical: historicalData
      }
    })
  } catch (error) {
    console.error("Error fetching user events:", error)
    return NextResponse.json({ error: "Failed to fetch user events" }, { status: 500 })
  }
}

