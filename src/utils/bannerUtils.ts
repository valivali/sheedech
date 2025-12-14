const BANNER_IMAGES = [
    "cj.webp",
    "considerate.webp",
    "dan.webp",
    "douglas.webp",
    "nina.webp",
    "sidral.webp",
] as const;

const STORAGE_KEY = "home_banner_img";
const EXPIRY_KEY = "home_banner_expiry";
const EXPIRY_DAYS = 3;

export function getBannerImage(): string {
    if (typeof window === "undefined") return `/assets/home-banner/${BANNER_IMAGES[0]}`;

    const storedImage = localStorage.getItem(STORAGE_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);
    const now = new Date().getTime();

    if (storedImage && expiry && now < parseInt(expiry)) {
        if (BANNER_IMAGES.includes(storedImage as any)) {
            return `/assets/home-banner/${storedImage}`;
        }
    }

    const randomIndex = Math.floor(Math.random() * BANNER_IMAGES.length);
    const newImage = BANNER_IMAGES[randomIndex];

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);

    try {
        localStorage.setItem(STORAGE_KEY, newImage);
        localStorage.setItem(EXPIRY_KEY, expiryDate.getTime().toString());
    } catch (e) {
        console.error("Failed to save banner to localStorage", e);
    }

    return `/assets/home-banner/${newImage}`;
}
