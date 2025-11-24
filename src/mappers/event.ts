import { Event as PrismaEvent, EventPhoto as PrismaEventPhoto, EventStatus as PrismaEventStatus } from '@prisma/client';
import {
  Event,
  EventPhoto,
  EventStatus,
  EventWithPhotos,
  OccasionType,
  ParkingType,
  ContributionType,
  CuisineTheme,
  AccessibilityType,
  DietaryAccommodation,
  AtmosphereTag,
} from '@/types/event';

export function mapEventStatusToPrisma(status: EventStatus): PrismaEventStatus {
  const statusMap: Record<EventStatus, PrismaEventStatus> = {
    [EventStatus.DRAFT]: 'draft',
    [EventStatus.PENDING]: 'pending',
    [EventStatus.ACTIVE]: 'active',
    [EventStatus.CANCELLED]: 'cancelled',
  };
  return statusMap[status];
}

export function mapEventStatusFromPrisma(status: PrismaEventStatus): EventStatus {
  const statusMap: Record<PrismaEventStatus, EventStatus> = {
    draft: EventStatus.DRAFT,
    pending: EventStatus.PENDING,
    active: EventStatus.ACTIVE,
    cancelled: EventStatus.CANCELLED,
  };
  return statusMap[status];
}

export function mapOccasionTypeFromString(value: string): OccasionType {
  return value as OccasionType;
}

export function mapOccasionTypeToString(value: OccasionType): string {
  return value;
}

export function mapParkingTypeFromString(value: string): ParkingType {
  return value as ParkingType;
}

export function mapParkingTypeToString(value: ParkingType): string {
  return value;
}

export function mapContributionTypeFromString(value: string): ContributionType {
  return value as ContributionType;
}

export function mapContributionTypeToString(value: ContributionType): string {
  return value;
}

export function mapCuisineThemeFromString(value: string): CuisineTheme {
  return value as CuisineTheme;
}

export function mapCuisineThemeToString(value: CuisineTheme): string {
  return value;
}

export function mapAccessibilityTypeFromString(value: string): AccessibilityType {
  return value as AccessibilityType;
}

export function mapAccessibilityTypeToString(value: AccessibilityType): string {
  return value;
}

export function mapDietaryAccommodationFromString(value: string): DietaryAccommodation {
  return value as DietaryAccommodation;
}

export function mapDietaryAccommodationToString(value: DietaryAccommodation): string {
  return value;
}

export function mapAtmosphereTagFromString(value: string): AtmosphereTag {
  return value as AtmosphereTag;
}

export function mapAtmosphereTagToString(value: AtmosphereTag): string {
  return value;
}

export function mapEventPhotoFromPrisma(photo: PrismaEventPhoto): EventPhoto {
  return {
    id: photo.id,
    eventId: photo.eventId,
    url: photo.url,
    width: photo.width ?? undefined,
    height: photo.height ?? undefined,
    cropX: photo.cropX ?? undefined,
    cropY: photo.cropY ?? undefined,
    cropWidth: photo.cropWidth ?? undefined,
    cropHeight: photo.cropHeight ?? undefined,
    order: photo.order,
    caption: photo.caption ?? undefined,
    createdAt: photo.createdAt,
  };
}

export function mapEventFromPrisma(event: PrismaEvent): Event {
  return {
    id: event.id,
    userId: event.userId,
    slug: event.slug,
    status: mapEventStatusFromPrisma(event.status),
    viewCount: event.viewCount,

    title: event.title,
    occasionType: mapOccasionTypeFromString(event.occasionType),
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime ?? undefined,
    description: event.description ?? undefined,

    formattedAddress: event.formattedAddress ?? undefined,
    streetName: event.streetName ?? undefined,
    houseNumber: event.houseNumber ?? undefined,
    city: event.city ?? undefined,
    state: event.state ?? undefined,
    country: event.country ?? undefined,
    postalCode: event.postalCode ?? undefined,
    lat: event.lat ?? undefined,
    lon: event.lon ?? undefined,
    neighborhood: event.neighborhood ?? undefined,
    accessibility: event.accessibility.map(mapAccessibilityTypeFromString),
    parking: event.parking ? mapParkingTypeFromString(event.parking) : undefined,

    cuisineTheme: event.cuisineTheme.map(mapCuisineThemeFromString),
    proposedMenu: event.proposedMenu,
    isKosher: event.isKosher ?? undefined,
    isVegetarian: event.isVegetarian ?? undefined,
    isGlutenFree: event.isGlutenFree ?? undefined,
    hasNuts: event.hasNuts ?? undefined,
    hasDairy: event.hasDairy ?? undefined,
    accommodatesDietary: event.accommodatesDietary.map(mapDietaryAccommodationFromString),

    maxGuests: event.maxGuests,
    minGuests: event.minGuests ?? undefined,
    kidFriendly: event.kidFriendly ?? undefined,
    petFriendly: event.petFriendly ?? undefined,
    smokingAllowed: event.smokingAllowed ?? undefined,
    alcoholProvided: event.alcoholProvided ?? undefined,
    byob: event.byob ?? undefined,
    whoElsePresent: event.whoElsePresent,

    atmosphereTags: event.atmosphereTags.map(mapAtmosphereTagFromString),
    houseRules: event.houseRules ?? undefined,

    contributionType: event.contributionType ? mapContributionTypeFromString(event.contributionType) : undefined,
    contributionAmount: event.contributionAmount ?? undefined,

    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

export function mapEventWithPhotosFromPrisma(
  event: PrismaEvent & { photos: PrismaEventPhoto[] }
): EventWithPhotos {
  return {
    ...mapEventFromPrisma(event),
    photos: event.photos.map(mapEventPhotoFromPrisma),
  };
}

