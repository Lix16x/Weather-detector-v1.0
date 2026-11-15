import { describeWeatherCode } from '../utils/weatherCodes'

export async function fetchWeather(latitude, longitude, locationLabel = '') {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
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
  const daily = data.daily || {}
  const dailyUnits = data.daily_units || {}

  if (!current || typeof current.temperature_2m !== 'number') {
    throw new Error('Received incomplete weather data. Please try again.')
  }

  const condition = describeWeatherCode(current.weather_code)
  const days = Array.isArray(daily.time) ? daily.time : []

  return {
    latitude: data.latitude ?? latitude,
    longitude: data.longitude ?? longitude,
    timezone: data.timezone || '',
    locationLabel,
    isDay: current.is_day === 1,
    temperature: current.temperature_2m,
    temperatureUnit: units.temperature_2m || '°C',
    feelsLike: current.apparent_temperature,
    feelsLikeUnit: units.apparent_temperature || '°C',
    humidity: current.relative_humidity_2m,
    humidityUnit: units.relative_humidity_2m || '%',
    precipitation: current.precipitation,
    precipitationUnit: units.precipitation || 'mm',
    pressure: current.pressure_msl,
    pressureUnit: units.pressure_msl || 'hPa',
    windSpeed: current.wind_speed_10m,
    windSpeedUnit: units.wind_speed_10m || 'km/h',
    windDirection: current.wind_direction_10m,
    windDirectionUnit: units.wind_direction_10m || '°',
    conditionLabel: condition.label,
    conditionIcon: condition.icon,
    observedAt: current.time || '',
    daily: days.map((date, i) => {
      const code = daily.weather_code?.[i]
      const info = describeWeatherCode(code)
      return {
        date,
        code,
        label: info.label,
        icon: info.icon,
        max: daily.temperature_2m_max?.[i],
        min: daily.temperature_2m_min?.[i],
        precipProb: daily.precipitation_probability_max?.[i],
      }
    }),
    dailyUnits: {
      temperature: dailyUnits.temperature_2m_max || '°C',
      precipProb: dailyUnits.precipitation_probability_max || '%',
    },
  }
}

export const fetchCurrentWeather = fetchWeather

