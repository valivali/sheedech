import { z } from 'zod';
import {
  EventStatus,
  OccasionType,
  ParkingType,
  ContributionType,
  CuisineTheme,
  AccessibilityType,
  DietaryAccommodation,
  AtmosphereTag,
} from '@/types/event';

const textFieldSchema = z.string().max(512, 'Maximum 512 characters allowed').optional();

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  occasionType: z.nativeEnum(OccasionType),
  customOccasionType: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),
  description: textFieldSchema,

  formattedAddress: z.string().optional(),
  streetName: z.string().optional(),
  houseNumber: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  neighborhood: z.string().optional(),
  accessibility: z.array(z.nativeEnum(AccessibilityType)).optional(),
  parking: z.nativeEnum(ParkingType).optional(),

  cuisineTheme: z.array(z.nativeEnum(CuisineTheme)).min(1, 'Please select at least one cuisine theme'),
  customCuisineTheme: z.string().optional(),
  proposedMenu: z.array(z.string()).optional(),
  isKosher: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  hasNuts: z.boolean().optional(),
  hasDairy: z.boolean().optional(),
  accommodatesDietary: z.array(z.nativeEnum(DietaryAccommodation)).optional(),

  maxGuests: z.number().min(1, 'Must accommodate at least 1 guest').max(50, 'Maximum 50 guests'),
  minGuests: z.number().min(0).max(50).optional(),
  kidFriendly: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  alcoholProvided: z.boolean().optional(),
  byob: z.boolean().optional(),
  whoElsePresent: z.array(z.string()).optional(),

  atmosphereTags: z.array(z.nativeEnum(AtmosphereTag)).optional(),
  houseRules: textFieldSchema,

  contributionType: z.nativeEnum(ContributionType).optional(),
  contributionAmount: z.number().min(0).optional(),

  status: z.nativeEnum(EventStatus).optional(),
  photos: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.occasionType === OccasionType.OTHER) {
    return data.customOccasionType && data.customOccasionType.trim().length > 0;
  }
  return true;
}, {
  message: 'Custom occasion type is required when selecting "Other"',
  path: ['customOccasionType'],
}).refine((data) => {
  if (data.minGuests && data.maxGuests) {
    return data.minGuests <= data.maxGuests;
  }
  return true;
}, {
  message: 'Minimum guests cannot exceed maximum guests',
  path: ['minGuests'],
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

