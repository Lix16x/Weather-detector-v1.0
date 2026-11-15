import './WeatherCard.css'

function formatCoord(value, positive, negative) {
  const dir = value >= 0 ? positive : negative
  return `${Math.abs(value).toFixed(4)}° ${dir}`
}

function formatWindDir(deg) {
  if (typeof deg !== 'number' || Number.isNaN(deg)) return ''
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

export default function WeatherCard({ weather }) {
  if (!weather) return null

  const coords = `${formatCoord(weather.latitude, 'N', 'S')}, ${formatCoord(weather.longitude, 'E', 'W')}`
  const location = weather.locationLabel ? `${weather.locationLabel} (${coords})` : coords
  const windDir = formatWindDir(weather.windDirection)

  return (
    <section className="weather-card" aria-label="Current weather">
      <div className="weather-main">
        <div className="weather-icon" aria-hidden="true">{weather.conditionIcon}</div>
        <div>
          <p className="weather-temp">
            {Math.round(weather.temperature)}
            <span className="weather-unit">{weather.temperatureUnit}</span>
          </p>
          <p className="weather-condition">{weather.conditionLabel}</p>
          <p className="weather-meta">{location}</p>
        </div>
      </div>

      <dl className="weather-details">
        <div className="detail">
          <dt>Feels like</dt>
          <dd>{Math.round(weather.feelsLike)}{weather.feelsLikeUnit}</dd>
        </div>
        <div className="detail">
          <dt>Humidity</dt>
          <dd>{weather.humidity}{weather.humidityUnit}</dd>
        </div>
        <div className="detail">
          <dt>Wind</dt>
          <dd>{Math.round(weather.windSpeed)} {weather.windSpeedUnit}{windDir ? ` ${windDir}` : ''}</dd>
        </div>
        <div className="detail">
          <dt>Precipitation</dt>
          <dd>{weather.precipitation ?? 0} {weather.precipitationUnit || 'mm'}</dd>
        </div>
        <div className="detail">
          <dt>Pressure</dt>
          <dd>{weather.pressure != null ? Math.round(weather.pressure) : '—'} {weather.pressureUnit || 'hPa'}</dd>
        </div>
        <div className="detail">
          <dt>Timezone</dt>
          <dd>{weather.timezone || '—'}</dd>
        </div>
        {weather.observedAt && (
          <div className="detail detail-wide">
            <dt>Observed</dt>
            <dd>{weather.observedAt}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}

