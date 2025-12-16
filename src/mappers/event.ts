import { z } from 'zod';
import { Event as PrismaEvent, EventPhoto as PrismaEventPhoto, EventStatus as PrismaEventStatus } from '@prisma/client';
import {
  Event,
  EventPhoto,
  EventStatus,
  EventWithPhotos,
  EventCardData,
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

const eventPhotoSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  url: z.string(),
  width: z.number().nullable().transform((val) => val ?? undefined),
  height: z.number().nullable().transform((val) => val ?? undefined),
  cropX: z.number().nullable().transform((val) => val ?? undefined),
  cropY: z.number().nullable().transform((val) => val ?? undefined),
  cropWidth: z.number().nullable().transform((val) => val ?? undefined),
  cropHeight: z.number().nullable().transform((val) => val ?? undefined),
  order: z.number(),
  caption: z.string().nullable().transform((val) => val ?? undefined),
  createdAt: z.date(),
}).transform((data): EventPhoto => ({
  id: data.id,
  eventId: data.eventId,
  url: data.url,
  width: data.width,
  height: data.height,
  cropX: data.cropX,
  cropY: data.cropY,
  cropWidth: data.cropWidth,
  cropHeight: data.cropHeight,
  order: data.order,
  caption: data.caption,
  createdAt: data.createdAt,
}));

const eventSchemaBase = z.object({
  id: z.string(),
  userId: z.string(),
  slug: z.string(),
  status: z.enum(['draft', 'pending', 'active', 'cancelled']).transform((val): EventStatus => {
    const statusMap: Record<string, EventStatus> = {
      draft: EventStatus.DRAFT,
      pending: EventStatus.PENDING,
      active: EventStatus.ACTIVE,
      cancelled: EventStatus.CANCELLED,
    };
    return statusMap[val];
  }),
  viewCount: z.number(),
  title: z.string(),
  occasionType: z.string().transform((val): OccasionType => val as OccasionType),
  eventDate: z.date(),
  startTime: z.string(),
  endTime: z.string().nullable().transform((val) => val ?? undefined),
  description: z.string().nullable().transform((val) => val ?? undefined),
  formattedAddress: z.string().nullable().transform((val) => val ?? undefined),
  streetName: z.string().nullable().transform((val) => val ?? undefined),
  houseNumber: z.string().nullable().transform((val) => val ?? undefined),
  city: z.string().nullable().transform((val) => val ?? undefined),
  state: z.string().nullable().transform((val) => val ?? undefined),
  country: z.string().nullable().transform((val) => val ?? undefined),
  postalCode: z.string().nullable().transform((val) => val ?? undefined),
  lat: z.number().nullable().transform((val) => val ?? undefined),
  lon: z.number().nullable().transform((val) => val ?? undefined),
  neighborhood: z.string().nullable().transform((val) => val ?? undefined),
  accessibility: z.array(z.string()).transform((arr): AccessibilityType[] =>
    arr.map((val): AccessibilityType => val as AccessibilityType)
  ),
  parking: z.string().nullable().transform((val): ParkingType | undefined =>
    val ? (val as ParkingType) : undefined
  ),
  cuisineTheme: z.array(z.string()).transform((arr): CuisineTheme[] =>
    arr.map((val): CuisineTheme => val as CuisineTheme)
  ),
  proposedMenu: z.array(z.string()),
  isKosher: z.boolean().nullable().transform((val) => val ?? undefined),
  isVegetarian: z.boolean().nullable().transform((val) => val ?? undefined),
  isGlutenFree: z.boolean().nullable().transform((val) => val ?? undefined),
  hasNuts: z.boolean().nullable().transform((val) => val ?? undefined),
  hasDairy: z.boolean().nullable().transform((val) => val ?? undefined),
  accommodatesDietary: z.array(z.string()).transform((arr): DietaryAccommodation[] =>
    arr.map((val): DietaryAccommodation => val as DietaryAccommodation)
  ),
  maxGuests: z.number(),
  minGuests: z.number().nullable().transform((val) => val ?? undefined),
  kidFriendly: z.boolean().nullable().transform((val) => val ?? undefined),
  petFriendly: z.boolean().nullable().transform((val) => val ?? undefined),
  smokingAllowed: z.boolean().nullable().transform((val) => val ?? undefined),
  alcoholProvided: z.boolean().nullable().transform((val) => val ?? undefined),
  byob: z.boolean().nullable().transform((val) => val ?? undefined),
  whoElsePresent: z.array(z.string()),
  atmosphereTags: z.array(z.string()).transform((arr): AtmosphereTag[] =>
    arr.map((val): AtmosphereTag => val as AtmosphereTag)
  ),
  houseRules: z.string().nullable().transform((val) => val ?? undefined),
  contributionType: z.string().nullable().transform((val): ContributionType | undefined =>
    val ? (val as ContributionType) : undefined
  ),
  contributionAmount: z.number().nullable().transform((val) => val ?? undefined),
  createdAt: z.date(),
  updatedAt: z.date(),
  photos: z.array(eventPhotoSchema),
});

const eventSchema = eventSchemaBase.transform((data): EventWithPhotos => ({
  id: data.id,
  userId: data.userId,
  slug: data.slug,
  status: data.status,
  viewCount: data.viewCount,
  title: data.title,
  occasionType: data.occasionType,
  eventDate: data.eventDate,
  startTime: data.startTime,
  endTime: data.endTime,
  description: data.description,
  formattedAddress: data.formattedAddress,
  streetName: data.streetName,
  houseNumber: data.houseNumber,
  city: data.city,
  state: data.state,
  country: data.country,
  postalCode: data.postalCode,
  lat: data.lat,
  lon: data.lon,
  neighborhood: data.neighborhood,
  accessibility: data.accessibility,
  parking: data.parking,
  cuisineTheme: data.cuisineTheme,
  proposedMenu: data.proposedMenu,
  isKosher: data.isKosher,
  isVegetarian: data.isVegetarian,
  isGlutenFree: data.isGlutenFree,
  hasNuts: data.hasNuts,
  hasDairy: data.hasDairy,
  accommodatesDietary: data.accommodatesDietary,
  maxGuests: data.maxGuests,
  minGuests: data.minGuests,
  kidFriendly: data.kidFriendly,
  petFriendly: data.petFriendly,
  smokingAllowed: data.smokingAllowed,
  alcoholProvided: data.alcoholProvided,
  byob: data.byob,
  whoElsePresent: data.whoElsePresent,
  atmosphereTags: data.atmosphereTags,
  houseRules: data.houseRules,
  contributionType: data.contributionType,
  contributionAmount: data.contributionAmount,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  photos: data.photos,
}));

const eventCardDataSchema = eventSchemaBase.extend({
  user: z.object({
    onboarding: z.object({
      firstName: z.string(),
      lastName: z.string().optional(),
    }).nullable(),
    diningImages: z.array(z.object({
      url: z.string(),
    })),
  }),
}).transform((data): EventCardData => {
  const eventWithPhotos: EventWithPhotos = {
    id: data.id,
    userId: data.userId,
    slug: data.slug,
    status: data.status,
    viewCount: data.viewCount,
    title: data.title,
    occasionType: data.occasionType,
    eventDate: data.eventDate,
    startTime: data.startTime,
    endTime: data.endTime,
    description: data.description,
    formattedAddress: data.formattedAddress,
    streetName: data.streetName,
    houseNumber: data.houseNumber,
    city: data.city,
    state: data.state,
    country: data.country,
    postalCode: data.postalCode,
    lat: data.lat,
    lon: data.lon,
    neighborhood: data.neighborhood,
    accessibility: data.accessibility,
    parking: data.parking,
    cuisineTheme: data.cuisineTheme,
    proposedMenu: data.proposedMenu,
    isKosher: data.isKosher,
    isVegetarian: data.isVegetarian,
    isGlutenFree: data.isGlutenFree,
    hasNuts: data.hasNuts,
    hasDairy: data.hasDairy,
    accommodatesDietary: data.accommodatesDietary,
    maxGuests: data.maxGuests,
    minGuests: data.minGuests,
    kidFriendly: data.kidFriendly,
    petFriendly: data.petFriendly,
    smokingAllowed: data.smokingAllowed,
    alcoholProvided: data.alcoholProvided,
    byob: data.byob,
    whoElsePresent: data.whoElsePresent,
    atmosphereTags: data.atmosphereTags,
    houseRules: data.houseRules,
    contributionType: data.contributionType,
    contributionAmount: data.contributionAmount,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    photos: data.photos,
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return {
    ...eventWithPhotos,
    occasionType: capitalize(data.occasionType) as OccasionType,
    cuisineTheme: data.cuisineTheme.map(c => capitalize(c) as CuisineTheme),
    atmosphereTags: data.atmosphereTags.map(t => capitalize(t) as AtmosphereTag),
    accommodatesDietary: data.accommodatesDietary.map(d => capitalize(d) as DietaryAccommodation),
    accessibility: data.accessibility.map(a => capitalize(a) as AccessibilityType),
    hostFirstName: data.user.onboarding?.firstName || 'Host',
    hostLastName: data.user.onboarding?.lastName,
    hostDiningImages: data.user.diningImages.map((img) => ({ url: img.url })),
  };
});

export function mapEventCardDataFromPrisma(
  event: PrismaEvent & {
    photos: PrismaEventPhoto[];
    user: {
      onboarding: { firstName: string; lastName?: string } | null;
      diningImages: Array<{ url: string }>;
    };
  }
): EventCardData {
  return eventCardDataSchema.parse(event);
}

