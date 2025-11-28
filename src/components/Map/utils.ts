function seedRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) / 2147483647
}

export function getObfuscatedLocation(
  lat: number,
  lon: number,
  seed: string
): { lat: number; lon: number } {
  const radiusInKm = 2
  const randomAngle = seedRandom(seed + '_angle') * 2 * Math.PI
  const randomRadius = seedRandom(seed + '_radius') * radiusInKm
  
  const earthRadiusKm = 6371
  const latDelta = (randomRadius * Math.cos(randomAngle)) / earthRadiusKm * (180 / Math.PI)
  const lonDelta = (randomRadius * Math.sin(randomAngle)) / (earthRadiusKm * Math.cos(lat * Math.PI / 180)) * (180 / Math.PI)
  
  return {
    lat: lat + latDelta,
    lon: lon + lonDelta
  }
}

