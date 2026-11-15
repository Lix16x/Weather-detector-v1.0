export async function searchLocations(query) {
  const q = String(query || '').trim()
  if (q.length < 2) return []

  const params = new URLSearchParams({
    name: q,
    count: '5',
    language: 'en',
    format: 'json',
  })

  const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
  let res
  try {
    res = await fetch(url)
  } catch {
    throw new Error('Network error while searching locations. Check your connection and try again.')
  }

  if (!res.ok) {
    throw new Error(`Location search failed (${res.status}). Please try again.`)
  }

  const data = await res.json()
  const results = Array.isArray(data.results) ? data.results : []
  return results.map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country || '',
    admin1: r.admin1 || '',
    timezone: r.timezone || '',
  }))
}

export function formatLocationLabel(loc) {
  const parts = [loc.name, loc.admin1, loc.country].filter(Boolean)
  return parts.join(', ')
}

export function parseCoordinates(input) {
  const text = String(input || '').trim()
  const match = text.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/)
  if (!match) return null
  const latitude = Number(match[1])
  const longitude = Number(match[2])
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null
  return { latitude, longitude }
}
