export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please allow location access and try again.'))
            break
          case err.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable. Please try again.'))
            break
          case err.TIMEOUT:
            reject(new Error('Location request timed out. Please try again.'))
            break
          default:
            reject(new Error('Unable to retrieve your location. Please try again.'))
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  })
}
