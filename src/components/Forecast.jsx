import './Forecast.css'

function formatDay(dateStr) {
  try {
    const d = new Date(`${dateStr}T00:00:00`)
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function Forecast({ days, units }) {
  if (!Array.isArray(days) || days.length === 0) return null

  return (
    <section className="forecast" aria-label="7-day forecast">
      <h2 className="forecast-title">7-Day Forecast</h2>
      <ul className="forecast-list">
        {days.map((day, idx) => (
          <li key={day.date || idx} className="forecast-item">
            <div className="forecast-day">{idx === 0 ? 'Today' : formatDay(day.date)}</div>
            <div className="forecast-icon" aria-hidden="true">{day.icon}</div>
            <div className="forecast-temps">
              <span className="t-max">{day.max != null ? Math.round(day.max) : '—'}{units?.temperature || '°'}</span>
              <span className="t-min">{day.min != null ? Math.round(day.min) : '—'}{units?.temperature || '°'}</span>
            </div>
            <div className="forecast-rain">Rain {day.precipProb ?? 0}{units?.precipProb || '%'}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
