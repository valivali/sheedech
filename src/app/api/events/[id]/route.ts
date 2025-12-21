import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/db/prisma"
import { getAuthUser } from "@/lib/auth/user"
import { mapEventCardDataFromPrisma, mapEventWithPhotosFromPrisma } from "@/mappers/event"
import { EventCardData } from "@/types/event"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const authUser = await getAuthUser()
    const dbUser = authUser ? await prisma.user.findUnique({ where: { email: authUser.email } }) : null

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
      data: { viewCount: { increment: 1 } }
    })

    const isHost = dbUser?.id === event.userId
    const eventCardData = mapEventCardDataFromPrisma(event)

    if (!isHost) {
      eventCardData.formattedAddress = undefined
      eventCardData.streetName = undefined
      eventCardData.houseNumber = undefined
      eventCardData.postalCode = undefined
      eventCardData.hostLastName = undefined // Ensure hostLastName is hidden for non-hosts
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: authUser.email }
    })

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const event = await prisma.event.findUnique({
      where: { id }
    })

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    if (event.userId !== dbUser.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Remove immutable fields and process data
    const {
      id: _id,
      userId: _userId,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      viewCount: _viewCount,
      slug: _slug,
      hostFirstName: _hostFirstName,
      hostLastName: _hostLastName,
      hostDiningImages: _hostDiningImages,
      photos,
      eventDate,
      ...updateData
    } = body

    // Handle date conversion if string
    const processedEventDate = eventDate ? new Date(eventDate) : undefined

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...updateData,
        eventDate: processedEventDate,
        photos: {
          deleteMany: {},
          create: photos?.map((photo: any, index: number) => ({
            url: photo.url,
            order: index,
            width: photo.width,
            height: photo.height,
            cropX: photo.cropX,
            cropY: photo.cropY,
            cropWidth: photo.cropWidth,
            cropHeight: photo.cropHeight,
            caption: photo.caption
          }))
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

    const eventWithPhotos = mapEventWithPhotosFromPrisma(updatedEvent)
    const eventCardData: EventCardData = {
      ...eventWithPhotos,
      hostFirstName: updatedEvent.user.onboarding?.firstName || "Host",
      hostDiningImages: updatedEvent.user.diningImages.map((img) => ({ url: img.url }))
    }

    return NextResponse.json({
      success: true,
      data: eventCardData
    })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 500 })
  }
}
