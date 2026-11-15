import { useCallback, useEffect, useState } from 'react'
import './App.css'
import WeatherCard from './components/WeatherCard'
import Forecast from './components/Forecast'
import { getCurrentPosition } from './services/geolocation'
import { fetchWeather } from './services/weather'
import { formatLocationLabel, parseCoordinates, searchLocations } from './services/geocoding'

function App() {
  const [status, setStatus] = useState('idle')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Detecting your location and fetching weather…')

  const [query, setQuery] = useState('')
  const [searchStatus, setSearchStatus] = useState('idle')
  const [searchError, setSearchError] = useState('')
  const [results, setResults] = useState([])

  const loadWeather = useCallback(async (latitude, longitude, locationLabel = '', message = 'Fetching weather…') => {
    setStatus('loading')
    setLoadingMessage(message)
    setError('')
    setWeather(null)
    try {
      const data = await fetchWeather(latitude, longitude, locationLabel)
      setWeather(data)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }, [])

  const detectWeather = useCallback(async () => {
    setStatus('loading')
    setLoadingMessage('Detecting your location and fetching weather…')
    setError('')
    setWeather(null)
    try {
      const coords = await getCurrentPosition()
      const data = await fetchWeather(coords.latitude, coords.longitude, 'Your location')
      setWeather(data)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    detectWeather()
  }, [detectWeather])

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    const coords = parseCoordinates(q)
    if (coords) {
      setSearchError('')
      setResults([])
      setSearchStatus('idle')
      await loadWeather(coords.latitude, coords.longitude, 'Custom coordinates', 'Fetching weather for coordinates…')
      return
    }

    setSearchStatus('loading')
    setSearchError('')
    setResults([])
    try {
      const found = await searchLocations(q)
      setResults(found)
      setSearchStatus('success')
      if (found.length === 0) {
        setSearchError('No locations found. Try a different city name or enter coordinates as "lat, lon".')
      }
    } catch (err) {
      setSearchStatus('error')
      setSearchError(err instanceof Error ? err.message : 'Location search failed. Please try again.')
    }
  }

  function handleSelectLocation(loc) {
    const label = formatLocationLabel(loc)
    setQuery(label)
    setResults([])
    setSearchStatus('idle')
    setSearchError('')
    loadWeather(loc.latitude, loc.longitude, label, `Fetching weather for ${label}…`)
  }

  const isBusy = status === 'loading'

  return (
    <main className="app">
      <div className="container">
        <header className="header">
          <h1>Weather Detector</h1>
          <p className="subtitle">Detect your location automatically or search by city to see current conditions and 7-day forecast.</p>
        </header>

        <section className="search-panel" aria-label="Manual location search">
          <form className="search-form" onSubmit={handleSearch}>
            <label className="search-label" htmlFor="location-input">Search location</label>
            <div className="search-row">
              <input
                id="location-input"
                className="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City name (e.g. London) or lat, lon"
                autoComplete="off"
              />
              <button type="submit" className="search-btn" disabled={searchStatus === 'loading' || isBusy || !query.trim()}>
                {searchStatus === 'loading' ? 'Searching…' : 'Search'}
              </button>
            </div>
          </form>

          {searchError && <p className="search-error" role="alert">{searchError}</p>}

          {results.length > 0 && (
            <ul className="results" aria-label="Search results">
              {results.map((loc) => (
                <li key={`${loc.id}-${loc.latitude}-${loc.longitude}`}>
                  <button type="button" className="result-btn" onClick={() => handleSelectLocation(loc)} disabled={isBusy}>
                    <span className="result-name">{formatLocationLabel(loc)}</span>
                    <span className="result-coords">{loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="actions">
          <button type="button" className="detect-btn" onClick={detectWeather} disabled={isBusy}>
            {isBusy ? 'Working…' : 'Use my current location'}
          </button>
        </div>

        {status === 'loading' && (
          <div className="status loading" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <span>{loadingMessage}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="status error" role="alert">
            <p className="error-title">Could not get weather</p>
            <p>{error}</p>
            <p className="hint">If location access is unavailable, search for a city above or try again with a connection.</p>
          </div>
        )}

        {status === 'success' && weather && (
          <>
            <WeatherCard weather={weather} />
            <Forecast days={weather.daily} units={weather.dailyUnits} />
          </>
        )}

        <footer className="footer">
          <p>Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>. Geocoding by <a href="https://open-meteo.com/en/docs/geocoding-api" target="_blank" rel="noreferrer">Open-Meteo Geocoding</a>.</p>
        </footer>
      </div>
    </main>
  )
}

export default App
