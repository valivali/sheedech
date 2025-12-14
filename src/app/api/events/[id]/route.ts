import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/db/prisma"
import { mapEventWithPhotosFromPrisma } from "@/mappers/event"
import { EventCardData } from "@/types/event"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const event = await prisma.event.findUnique({
      where: { id },
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
      }
    })

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    await prisma.event.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    const eventWithPhotos = mapEventWithPhotosFromPrisma(event)
    const eventCardData: EventCardData = {
      ...eventWithPhotos,
      hostFirstName: event.user.onboarding?.firstName || "Host",
      hostDiningImages: event.user.diningImages.map((img) => ({ url: img.url }))
    }

    return NextResponse.json({
      success: true,
      data: eventCardData
    })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch event" }, { status: 500 })
  }
}
