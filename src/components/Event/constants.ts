import {
    AccessibilityType,
    AtmosphereTag,
    CuisineTheme,
    DietaryAccommodation,
    OccasionType
} from "@/types/event"

export const OCCASION_TYPES = [
    { label: "Dinner", value: OccasionType.DINNER },
    { label: "Holiday Festive Event", value: OccasionType.HOLIDAY },
    { label: "Birthday", value: OccasionType.BIRTHDAY },
    { label: "Casual Meetup", value: OccasionType.CASUAL },
    { label: "BYOB Gathering", value: OccasionType.BYOB },
    { label: "Cooking Workshop", value: OccasionType.WORKSHOP },
    { label: "Cultural Food Exchange", value: OccasionType.CULTURAL },
    { label: "Other", value: OccasionType.OTHER }
]

export const CUISINE_THEMES = [
    { label: "Italian", value: CuisineTheme.ITALIAN },
    { label: "Israeli", value: CuisineTheme.ISRAELI },
    { label: "Kosher", value: CuisineTheme.KOSHER },
    { label: "Vegetarian", value: CuisineTheme.VEGETARIAN },
    { label: "Vegan", value: CuisineTheme.VEGAN },
    { label: "Comfort Food", value: CuisineTheme.COMFORT },
    { label: "Open Fire BBQ", value: CuisineTheme.BBQ },
    { label: "Asian", value: CuisineTheme.ASIAN },
    { label: "Mediterranean", value: CuisineTheme.MEDITERRANEAN },
    { label: "Mexican", value: CuisineTheme.MEXICAN },
    { label: "Other", value: CuisineTheme.OTHER }
]

export const DIETARY_OPTIONS = [
    { label: "Gluten-Free", value: DietaryAccommodation.GLUTEN_FREE },
    { label: "Vegan", value: DietaryAccommodation.VEGAN },
    { label: "Kosher-Style", value: DietaryAccommodation.KOSHER_STYLE },
    { label: "Nut-Free", value: DietaryAccommodation.NUT_FREE },
    { label: "Lactose Intolerant", value: DietaryAccommodation.LACTOSE_INTOLERANT },
    { label: "Cannot Accommodate", value: DietaryAccommodation.NONE }
]

export const ACCESSIBILITY_OPTIONS = [
    { label: "Elevator Available", value: AccessibilityType.ELEVATOR },
    { label: "Wheelchair Accessible", value: AccessibilityType.WHEELCHAIR },
    { label: "Stairs (Few)", value: AccessibilityType.STAIRS_FEW },
    { label: "Stairs (Many)", value: AccessibilityType.STAIRS_MANY }
]

export const ATMOSPHERE_TAGS = [
    { label: "Chill", value: AtmosphereTag.CHILL },
    { label: "Lively", value: AtmosphereTag.LIVELY },
    { label: "Deep Conversations", value: AtmosphereTag.DEEP_CONVERSATIONS },
    { label: "Music Background", value: AtmosphereTag.MUSIC },
    { label: "Game Night After Dinner", value: AtmosphereTag.GAMES },
    { label: "Quiet Environment", value: AtmosphereTag.QUIET }
]

export const SOCIAL_OPTIONS = [
    { label: "Kid-Friendly", value: "kidFriendly" },
    { label: "Pet-Friendly", value: "petFriendly" },
    { label: "Smoking Allowed", value: "smokingAllowed" },
    { label: "Alcohol Provided", value: "alcoholProvided" },
    { label: "BYOB Welcome", value: "byob" }
]
