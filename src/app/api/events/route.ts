import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/db/prisma"
import { getAuthUser } from "@/lib/auth/user"
import { mapEventCardDataFromPrisma } from "@/mappers/event"
import { EventCardData } from "@/types/event"

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser()
    const dbUser = authUser ? await prisma.user.findUnique({ where: { email: authUser.email } }) : null

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "100")
    const status = searchParams.get("status")

    const minLat = searchParams.get("minLat")
    const maxLat = searchParams.get("maxLat")
    const minLon = searchParams.get("minLon")
    const maxLon = searchParams.get("maxLon")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {}
    if (status) {
      where.status = status
    } else {
      where.status = {
        in: ["active", "pending"]
      }
    }

    if (minLat && maxLat && minLon && maxLon) {
      where.AND = [
        { lat: { gte: parseFloat(minLat), lte: parseFloat(maxLat) } },
        { lon: { gte: parseFloat(minLon), lte: parseFloat(maxLon) } },
        { lat: { not: null } },
        { lon: { not: null } }
      ]
    }

    if (startDate || endDate) {
      where.eventDate = {}
      if (startDate) {
        where.eventDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.eventDate.lte = new Date(endDate)
      }
    }

    const events = await prisma.event.findMany({
      where,
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
                firstName: true,
                lastName: true
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
      },
      take: limit
    })

    const eventCardData: EventCardData[] = events.map((event) => {
      const isHost = dbUser?.id === event.userId
      const data = mapEventCardDataFromPrisma(event as any)

      if (!isHost) {
        data.formattedAddress = undefined
        data.streetName = undefined
        data.houseNumber = undefined
        data.postalCode = undefined
        data.hostLastName = undefined
      }

      return data
    })

    return NextResponse.json({
      success: true,
      data: eventCardData
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

