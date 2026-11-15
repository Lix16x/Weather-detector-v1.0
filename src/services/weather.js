import { describeWeatherCode } from '../utils/weatherCodes'

export async function fetchCurrentWeather(latitude, longitude, locationLabel = '') {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    timezone: 'auto',
  })

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  let res
  try {
    res = await fetch(url)
  } catch {
    throw new Error('Network error while fetching weather. Check your connection and try again.')
  }

  if (!res.ok) {
    throw new Error(`Weather service error (${res.status}). Please try again.`)
  }

  const data = await res.json()
  const current = data.current
  const units = data.current_units || {}

  if (!current || typeof current.temperature_2m !== 'number') {
    throw new Error('Received incomplete weather data. Please try again.')
  }

  const condition = describeWeatherCode(current.weather_code)

  return {
    latitude: data.latitude ?? latitude,
    longitude: data.longitude ?? longitude,
    timezone: data.timezone || '',
    locationLabel,
    temperature: current.temperature_2m,
    temperatureUnit: units.temperature_2m || '°C',
    feelsLike: current.apparent_temperature,
    feelsLikeUnit: units.apparent_temperature || '°C',
    humidity: current.relative_humidity_2m,
    humidityUnit: units.relative_humidity_2m || '%',
    windSpeed: current.wind_speed_10m,
    windSpeedUnit: units.wind_speed_10m || 'km/h',
    conditionLabel: condition.label,
    conditionIcon: condition.icon,
    observedAt: current.time || '',
  }
}
