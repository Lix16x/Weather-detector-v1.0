# Weather Detector

React + Vite web app that detects your location (or lets you search manually) and shows current weather conditions using Open-Meteo APIs (no API key required).

## Features
- Auto-detect location via browser Geolocation on load and via **Use my current location**.
- Manual location fallback: search by city name or enter coordinates as `lat, lon` (Open-Meteo Geocoding).
- Current conditions: temperature, feels like, condition, humidity, wind speed, and location/time.
- Loading, success, and error states with retry.

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
