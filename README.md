# Weather Detector

React + Vite web app that detects your location (or lets you search manually) and shows current weather plus a 7-day forecast using Open-Meteo APIs (no API key required).

## Features
- **Auto-detect:** Uses browser Geolocation on load and via **Use my current location**.
- **Manual search:** Search by city name or enter coordinates as `lat, lon` (Open-Meteo Geocoding) — works when geolocation is unavailable.
- **Current conditions:** Temperature, feels like, condition, humidity, wind (speed/direction), precipitation, pressure, and location/time.
- **7-day forecast:** Daily high/low, condition, and precipitation probability.
- **UX:** Loading, success, and actionable error states with retry; responsive layout.

## Requirements
- Node.js 18+ and npm

## Setup
```bash
npm install
```

## Run (development)
```bash
npm run dev
```
Open the printed local URL (e.g. http://localhost:5173/).

To expose on your network:
```bash
npm run dev -- --host 0.0.0.0
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- Browser geolocation typically requires a secure context (HTTPS or `localhost`). On plain HTTP (e.g. a phone hitting a LAN IP), auto-detect may be blocked—use the manual city/coordinate search instead.
- Weather data: [Open-Meteo Forecast API](https://open-meteo.com/). Geocoding: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api).
