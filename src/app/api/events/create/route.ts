import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/db/prisma"
import { getAuthUser } from "@/lib/auth/user"
import { ensureUniqueSlug, generateSlug } from "@/lib/generateSlug"
import { mapEventStatusToPrisma, mapEventWithPhotosFromPrisma } from "@/mappers/event"
import { createEventSchema } from "@/validations/event"

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: authUser.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const baseSlug = generateSlug(validatedData.title, validatedData.eventDate)
    const slug = await ensureUniqueSlug(baseSlug, async (slug) => {
      const existing = await prisma.event.findUnique({ where: { slug } })
      return !!existing
    })

    const eventData = {
      userId: user.id,
      slug,
      status: validatedData.status ? mapEventStatusToPrisma(validatedData.status) : "draft",
      title: validatedData.title,
      occasionType: validatedData.occasionType,
      eventDate: new Date(validatedData.eventDate),
      startTime: validatedData.startTime,
      endTime: validatedData.endTime || null,
      description: validatedData.description || null,

      formattedAddress: validatedData.formattedAddress || null,
      streetName: validatedData.streetName || null,
      houseNumber: validatedData.houseNumber || null,
      city: validatedData.city || null,
      state: validatedData.state || null,
      country: validatedData.country || null,
      postalCode: validatedData.postalCode || null,
      lat: validatedData.lat || null,
      lon: validatedData.lon || null,
      neighborhood: validatedData.neighborhood || null,
      accessibility: validatedData.accessibility || [],
      parking: validatedData.parking || null,

      cuisineTheme: validatedData.cuisineTheme || [],
      proposedMenu: validatedData.proposedMenu || [],
      isKosher: validatedData.isKosher || null,
      isVegetarian: validatedData.isVegetarian || null,
      isGlutenFree: validatedData.isGlutenFree || null,
      hasNuts: validatedData.hasNuts || null,
      hasDairy: validatedData.hasDairy || null,
      accommodatesDietary: validatedData.accommodatesDietary || [],

      maxGuests: validatedData.maxGuests,
      minGuests: validatedData.minGuests || null,
      kidFriendly: validatedData.kidFriendly || null,
      petFriendly: validatedData.petFriendly || null,
      smokingAllowed: validatedData.smokingAllowed || null,
      alcoholProvided: validatedData.alcoholProvided || null,
      byob: validatedData.byob || null,
      whoElsePresent: validatedData.whoElsePresent || [],

      atmosphereTags: validatedData.atmosphereTags || [],
      houseRules: validatedData.houseRules || null,

      contributionType: validatedData.contributionType || null,
      contributionAmount: validatedData.contributionAmount || null
    }

    const event = await prisma.event.create({
      data: eventData,
      include: {
        photos: true
      }
    })

    if (validatedData.photos && validatedData.photos.length > 0) {
      await prisma.eventPhoto.createMany({
        data: validatedData.photos.map((url, index) => ({
          eventId: event.id,
          url,
          order: index
        }))
      })
    }

    const eventWithPhotos = await prisma.event.findUnique({
      where: { id: event.id },
      include: { photos: true }
    })

    if (!eventWithPhotos) {
      return NextResponse.json({ error: "Event not found after creation" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: mapEventWithPhotosFromPrisma(eventWithPhotos)
    })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
