export enum EventStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACTIVE = "active",
  CANCELLED = "cancelled"
}

export enum OccasionType {
  DINNER = "dinner",
  HOLIDAY = "holiday",
  BIRTHDAY = "birthday",
  CASUAL = "casual",
  BYOB = "byob",
  WORKSHOP = "workshop",
  CULTURAL = "cultural",
  OTHER = "other"
}

export enum ParkingType {
  STREET = "street",
  PRIVATE = "private",
  NONE = "none"
}

export enum ContributionType {
  FREE = "free",
  AMOUNT = "amount",
  DISH = "dish"
}

export enum CuisineTheme {
  ITALIAN = "italian",
  ISRAELI = "israeli",
  KOSHER = "kosher",
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
  COMFORT = "comfort",
  BBQ = "bbq",
  ASIAN = "asian",
  MEDITERRANEAN = "mediterranean",
  MEXICAN = "mexican"
}

export enum AccessibilityType {
  ELEVATOR = "elevator",
  WHEELCHAIR = "wheelchair",
  STAIRS_FEW = "stairs-few",
  STAIRS_MANY = "stairs-many"
}

export enum DietaryAccommodation {
  GLUTEN_FREE = "gluten-free",
  VEGAN = "vegan",
  KOSHER_STYLE = "kosher-style",
  NUT_FREE = "nut-free",
  LACTOSE_INTOLERANT = "lactose-intolerant",
  NONE = "none"
}

export enum AtmosphereTag {
  CHILL = "chill",
  LIVELY = "lively",
  DEEP_CONVERSATIONS = "deep-conversations",
  MUSIC = "music",
  GAMES = "games",
  QUIET = "quiet"
}

export interface EventPhoto {
  id: string
  eventId: string
  url: string
  width?: number
  height?: number
  cropX?: number
  cropY?: number
  cropWidth?: number
  cropHeight?: number
  order: number
  caption?: string
  createdAt: Date
}

export interface Event {
  id: string
  userId: string
  slug: string
  status: EventStatus
  viewCount: number

  title: string
  occasionType: OccasionType
  customOccasionType?: string
  eventDate: Date
  startTime: string
  endTime?: string
  description?: string

  formattedAddress?: string
  streetName?: string
  houseNumber?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  lat?: number
  lon?: number
  neighborhood?: string
  accessibility: AccessibilityType[]
  parking?: ParkingType

  cuisineTheme: CuisineTheme[]
  proposedMenu: string[]
  isKosher?: boolean
  isVegetarian?: boolean
  isGlutenFree?: boolean
  hasNuts?: boolean
  hasDairy?: boolean
  accommodatesDietary: DietaryAccommodation[]

  maxGuests: number
  minGuests?: number
  kidFriendly?: boolean
  petFriendly?: boolean
  smokingAllowed?: boolean
  alcoholProvided?: boolean
  byob?: boolean
  whoElsePresent: string[]

  atmosphereTags: AtmosphereTag[]
  houseRules?: string

  contributionType?: ContributionType
  contributionAmount?: number

  createdAt: Date
  updatedAt: Date
}

export interface EventWithPhotos extends Event {
  photos: EventPhoto[]
}

export interface CreateEventRequest {
  title: string
  occasionType: OccasionType
  customOccasionType?: string
  eventDate: string
  startTime: string
  endTime?: string
  description?: string

  formattedAddress?: string
  streetName?: string
  houseNumber?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  lat?: number
  lon?: number
  neighborhood?: string
  accessibility?: AccessibilityType[]
  parking?: ParkingType

  cuisineTheme: CuisineTheme[]
  proposedMenu?: string[]
  isKosher?: boolean
  isVegetarian?: boolean
  isGlutenFree?: boolean
  hasNuts?: boolean
  hasDairy?: boolean
  accommodatesDietary?: DietaryAccommodation[]

  maxGuests: number
  minGuests?: number
  kidFriendly?: boolean
  petFriendly?: boolean
  smokingAllowed?: boolean
  alcoholProvided?: boolean
  byob?: boolean
  whoElsePresent?: string[]

  atmosphereTags?: AtmosphereTag[]
  houseRules?: string

  contributionType?: ContributionType
  contributionAmount?: number

  status?: EventStatus
  photos?: string[]
}

export interface CreateEventResponse {
  success: boolean
  data?: EventWithPhotos
  error?: string
}

export interface EventCardData extends EventWithPhotos {
  hostFirstName: string
  hostDiningImages: Array<{ url: string }>
}
