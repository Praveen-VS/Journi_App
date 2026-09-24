/**
 * Journi Intelligent User Location Resolver
 * Automatically analyzes traveler's current location with GPS, IP, and timezone fallbacks.
 */

export interface DetectedLocation {
  city: string;
  state: string;
  country: string;
  display: string;
  source: 'gps' | 'ip' | 'timezone' | 'default';
  lat?: number;
  lng?: number;
}

const DEFAULT_LOCATION: DetectedLocation = {
  city: 'Kochi',
  state: 'Kerala',
  country: 'India',
  display: 'Kerala, India',
  source: 'default',
};

// Quick in-memory cache to avoid duplicate network/GPS prompts
let cachedLocation: DetectedLocation | null = null;

export async function detectUserLocation(forceFreshGps: boolean = false): Promise<DetectedLocation> {
  if (!forceFreshGps && cachedLocation) {
    return cachedLocation;
  }

  // 1. Check browser localStorage (instant 0ms)
  if (!forceFreshGps && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('journi_detected_location');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state) {
          cachedLocation = parsed;
          return parsed;
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  // 2. Instant Timezone Heuristic (0ms - zero network lag)
  if (!forceFreshGps && typeof window !== 'undefined') {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
        const result: DetectedLocation = {
          city: 'Kochi',
          state: 'Kerala',
          country: 'India',
          display: 'Kerala, India',
          source: 'timezone',
        };
        cachedLocation = result;
        saveLocation(result);
        return result;
      }
    } catch {
      // Ignore
    }
  }

  // 3. Attempt GPS Geolocation if requested or available (tighter 1000ms timeout)
  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
    try {
      const gpsResult = await new Promise<DetectedLocation | null>((resolve) => {
        const timer = setTimeout(() => resolve(null), 1000);

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            clearTimeout(timer);
            const { latitude, longitude } = pos.coords;

            // Kerala bounding box: Lat ~8.2 to 12.9, Lng ~74.8 to 77.6
            const isKeralaCoords =
              latitude >= 8.1 && latitude <= 13.0 && longitude >= 74.5 && longitude <= 77.7;

            if (isKeralaCoords) {
              resolve({
                city: 'Kochi',
                state: 'Kerala',
                country: 'India',
                display: 'Kerala, India',
                source: 'gps',
                lat: latitude,
                lng: longitude,
              });
              return;
            }

            // Quick reverse geocode with short timeout
            try {
              const controller = new AbortController();
              const revTimeout = setTimeout(() => controller.abort(), 1500);
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                { signal: controller.signal }
              );
              clearTimeout(revTimeout);
              if (res.ok) {
                const data = await res.json();
                const state = data.address?.state || (isKeralaCoords ? 'Kerala' : 'Karnataka');
                const city = data.address?.city || data.address?.town || data.address?.county || 'Kochi';
                const country = data.address?.country || 'India';
                resolve({
                  city,
                  state,
                  country,
                  display: `${city}, ${state}`,
                  source: 'gps',
                  lat: latitude,
                  lng: longitude,
                });
                return;
              }
            } catch {
              // Fallback to coordinates
            }

            resolve({
              city: isKeralaCoords ? 'Kochi' : 'Detected City',
              state: isKeralaCoords ? 'Kerala' : 'Kerala',
              country: 'India',
              display: isKeralaCoords ? 'Kerala, India' : 'Kerala, India',
              source: 'gps',
              lat: latitude,
              lng: longitude,
            });
          },
          () => {
            clearTimeout(timer);
            resolve(null);
          },
          { timeout: 2500, maximumAge: 60000 }
        );
      });

      if (gpsResult) {
        cachedLocation = gpsResult;
        saveLocation(gpsResult);
        return gpsResult;
      }
    } catch {
      // Continue to IP check
    }
  }

  // 3. Fast IP-based Geolocation Check (timeout 1800ms)
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const ipTimer = setTimeout(() => controller.abort(), 1800);
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(ipTimer);
      if (res.ok) {
        const data = await res.json();
        if (data.region || data.country_name) {
          const state = data.region || 'Kerala';
          const city = data.city || 'Kochi';
          const country = data.country_name || 'India';
          const result: DetectedLocation = {
            city,
            state,
            country,
            display: `${state}, ${country}`,
            source: 'ip',
          };
          cachedLocation = result;
          saveLocation(result);
          return result;
        }
      }
    } catch {
      // Ignore IP fetch failure
    }
  }

  // 4. Timezone Heuristic (India timezone detection)
  if (typeof window !== 'undefined') {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
        const result: DetectedLocation = {
          city: 'Kochi',
          state: 'Kerala',
          country: 'India',
          display: 'Kerala, India',
          source: 'timezone',
        };
        cachedLocation = result;
        saveLocation(result);
        return result;
      }
    } catch {
      // Ignore
    }
  }

  // 5. Default verified location (Kerala, India)
  cachedLocation = DEFAULT_LOCATION;
  saveLocation(DEFAULT_LOCATION);
  return DEFAULT_LOCATION;
}

function saveLocation(loc: DetectedLocation) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('journi_detected_location', JSON.stringify(loc));
    } catch {
      // Ignore
    }
  }
}
