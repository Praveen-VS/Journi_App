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

export function getCachedUserLocation(): DetectedLocation {
  if (cachedLocation) return cachedLocation;
  if (typeof window !== 'undefined') {
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
      // Ignore
    }
  }
  return DEFAULT_LOCATION;
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Approximate coordinates of iconic / frequently visited destinations
const DESTINATION_COORDS: Record<string, { lat: number; lng: number; state?: string; country: string }> = {
  // Kerala destinations (< 200 km from Kochi)
  munnar: { lat: 10.0889, lng: 77.0595, state: 'Kerala', country: 'India' },
  alleppey: { lat: 9.4981, lng: 76.3388, state: 'Kerala', country: 'India' },
  alappuzha: { lat: 9.4981, lng: 76.3388, state: 'Kerala', country: 'India' },
  kumarakom: { lat: 9.6175, lng: 76.4301, state: 'Kerala', country: 'India' },
  marari: { lat: 9.6000, lng: 76.2975, state: 'Kerala', country: 'India' },
  athirappilly: { lat: 10.2987, lng: 76.5414, state: 'Kerala', country: 'India' },
  vagamon: { lat: 9.6865, lng: 76.9056, state: 'Kerala', country: 'India' },
  thekkady: { lat: 9.6031, lng: 77.1615, state: 'Kerala', country: 'India' },
  varkala: { lat: 8.7379, lng: 76.7163, state: 'Kerala', country: 'India' },
  thrissur: { lat: 10.5276, lng: 76.2144, state: 'Kerala', country: 'India' },
  cherai: { lat: 10.1416, lng: 76.1783, state: 'Kerala', country: 'India' },
  kochi: { lat: 9.9312, lng: 76.2673, state: 'Kerala', country: 'India' },
  cochin: { lat: 9.9312, lng: 76.2673, state: 'Kerala', country: 'India' },

  // Kerala destinations (> 200 km from Kochi)
  wayanad: { lat: 11.6854, lng: 76.1320, state: 'Kerala', country: 'India' },
  bekal: { lat: 12.3927, lng: 75.0326, state: 'Kerala', country: 'India' },
  kannur: { lat: 11.8745, lng: 75.3704, state: 'Kerala', country: 'India' },
  kovalam: { lat: 8.4004, lng: 76.9787, state: 'Kerala', country: 'India' },
  trivandrum: { lat: 8.5241, lng: 76.9366, state: 'Kerala', country: 'India' },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, state: 'Kerala', country: 'India' },

  // Interstate destinations (India)
  goa: { lat: 15.2993, lng: 74.1240, state: 'Goa', country: 'India' },
  jaipur: { lat: 26.9124, lng: 75.7873, state: 'Rajasthan', country: 'India' },
  udaipur: { lat: 24.5854, lng: 73.7125, state: 'Rajasthan', country: 'India' },
  jodhpur: { lat: 26.2389, lng: 73.0243, state: 'Rajasthan', country: 'India' },
  manali: { lat: 32.2432, lng: 77.1892, state: 'Himachal Pradesh', country: 'India' },
  shimla: { lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh', country: 'India' },
  rishikesh: { lat: 30.0869, lng: 78.2676, state: 'Uttarakhand', country: 'India' },
  hampi: { lat: 15.3350, lng: 76.4600, state: 'Karnataka', country: 'India' },
  coorg: { lat: 12.3375, lng: 75.8069, state: 'Karnataka', country: 'India' },
  mysore: { lat: 12.2958, lng: 76.6394, state: 'Karnataka', country: 'India' },
  ooty: { lat: 11.4102, lng: 76.6950, state: 'Tamil Nadu', country: 'India' },
  kodaikanal: { lat: 10.2381, lng: 77.4892, state: 'Tamil Nadu', country: 'India' },
  leh: { lat: 34.1526, lng: 77.5771, state: 'Ladakh', country: 'India' },
  ladakh: { lat: 34.1526, lng: 77.5771, state: 'Ladakh', country: 'India' },
  varanasi: { lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh', country: 'India' },
  agra: { lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh', country: 'India' },
  delhi: { lat: 28.7041, lng: 77.1025, state: 'Delhi', country: 'India' },
  mumbai: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra', country: 'India' },
  pondicherry: { lat: 11.9416, lng: 79.8083, state: 'Puducherry', country: 'India' },

  // International destinations
  kyoto: { lat: 35.0116, lng: 135.7681, country: 'Japan' },
  tokyo: { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  paris: { lat: 48.8566, lng: 2.3522, country: 'France' },
  positano: { lat: 40.6281, lng: 14.4850, country: 'Italy' },
  amalfi: { lat: 40.6340, lng: 14.6027, country: 'Italy' },
  rome: { lat: 41.9028, lng: 12.4964, country: 'Italy' },
  dubai: { lat: 25.2048, lng: 55.2708, country: 'United Arab Emirates' },
  bali: { lat: -8.4095, lng: 115.1889, country: 'Indonesia' },
  maldives: { lat: 3.2028, lng: 73.2207, country: 'Maldives' },
  male: { lat: 4.1755, lng: 73.5093, country: 'Maldives' },
  santorini: { lat: 36.3932, lng: 25.4615, country: 'Greece' },
  bangkok: { lat: 13.7563, lng: 100.5018, country: 'Thailand' },
  phuket: { lat: 7.8804, lng: 98.3923, country: 'Thailand' },
  singapore: { lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  zurich: { lat: 47.3769, lng: 8.5417, country: 'Switzerland' },
  barcelona: { lat: 41.3879, lng: 2.1699, country: 'Spain' },
  prague: { lat: 50.0755, lng: 14.4378, country: 'Czech Republic' },
  london: { lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
};

const INDIAN_STATES = [
  'Kerala', 'Karnataka', 'Tamil Nadu', 'Goa', 'Maharashtra', 'Rajasthan',
  'Himachal Pradesh', 'Uttarakhand', 'Andhra Pradesh', 'Telangana', 'West Bengal',
  'Gujarat', 'Punjab', 'Odisha', 'Sikkim', 'Assam', 'Meghalaya', 'Madhya Pradesh',
  'Jammu and Kashmir', 'Ladakh', 'Pondicherry', 'Puducherry', 'Delhi', 'Uttar Pradesh'
];

export interface ScopeResolutionResult {
  scope: 'nearby_200km' | 'in_state' | 'interstate' | 'international' | 'custom';
  label: string; // 'Within 200 km' | 'In-State' | 'Interstate' | 'International'
  distanceKm?: number;
  reason?: string;
}

export function resolveScopeForDestination(
  destinationName: string,
  destinationCountry?: string,
  userLocation?: DetectedLocation
): ScopeResolutionResult {
  const user = userLocation || getCachedUserLocation();
  const userCountry = (user.country || 'India').trim().toLowerCase();
  const userState = (user.state || 'Kerala').trim().toLowerCase();

  const dNameClean = (destinationName || '').toLowerCase().trim();
  const dCountryClean = (destinationCountry || '').toLowerCase().trim();

  // Find destination key in lookup
  let foundKey: string | undefined;
  for (const k of Object.keys(DESTINATION_COORDS)) {
    if (dNameClean.includes(k) || k.includes(dNameClean)) {
      foundKey = k;
      break;
    }
  }

  const lookupInfo = foundKey ? DESTINATION_COORDS[foundKey] : undefined;
  const effectiveCountry = (dCountryClean || lookupInfo?.country || '').toLowerCase();
  const effectiveState = (lookupInfo?.state || '').toLowerCase();

  // 1. Check if International
  const isUserInIndia = userCountry === 'india';
  const isDestIndia = effectiveCountry === 'india' || (!effectiveCountry && INDIAN_STATES.some(s => dNameClean.includes(s.toLowerCase())));

  if (effectiveCountry && effectiveCountry !== userCountry) {
    return {
      scope: 'international',
      label: 'International',
      reason: `Destination is in ${destinationCountry || lookupInfo?.country || 'another country'}, outside ${user.country}.`,
    };
  }

  if (isUserInIndia && !isDestIndia && effectiveCountry && effectiveCountry !== 'india') {
    return {
      scope: 'international',
      label: 'International',
      reason: `International destination across borders.`,
    };
  }

  // 2. If coordinates are available for both user and destination, calculate real km
  const userLat = user.lat ?? (user.city === 'Kochi' ? 9.9312 : undefined);
  const userLng = user.lng ?? (user.city === 'Kochi' ? 76.2673 : undefined);

  if (userLat !== undefined && userLng !== undefined && lookupInfo?.lat !== undefined && lookupInfo?.lng !== undefined) {
    const straightDist = calculateDistanceKm(userLat, userLng, lookupInfo.lat, lookupInfo.lng);
    // Real-world travel distance factor (~1.25x for road curvature / mountain winding)
    const dist = Math.round(straightDist * 1.25);

    // If within 200 km
    if (dist <= 200) {
      return {
        scope: 'nearby_200km',
        label: 'Within 200 km',
        distanceKm: dist,
        reason: `Approximately ${dist} km from your current location (${user.city || user.state}).`,
      };
    }

    // If in the same state but > 200 km
    if (effectiveState && effectiveState === userState) {
      return {
        scope: 'in_state',
        label: 'In-State',
        distanceKm: dist,
        reason: `Within ${user.state} (~${dist} km from your location).`,
      };
    }

    // Different state in the same country
    return {
      scope: 'interstate',
      label: 'Interstate',
      distanceKm: dist,
      reason: `Interstate trip to ${lookupInfo?.state || destinationName} (~${dist} km).`,
    };
  }

  // 3. Fallback without exact coordinates
  if (effectiveState) {
    if (effectiveState === userState) {
      const isKnownNearby = ['munnar', 'alleppey', 'alappuzha', 'kumarakom', 'marari', 'athirappilly', 'vagamon', 'thekkady', 'varkala', 'thrissur', 'cherai', 'kochi'].some(p => dNameClean.includes(p));
      if (isKnownNearby) {
        return {
          scope: 'nearby_200km',
          label: 'Within 200 km',
          reason: `Within 200 km of your origin in ${user.state}.`,
        };
      }
      return {
        scope: 'in_state',
        label: 'In-State',
        reason: `Located within ${user.state}.`,
      };
    } else {
      return {
        scope: 'interstate',
        label: 'Interstate',
        reason: `Interstate destination outside ${user.state}.`,
      };
    }
  }

  // Check against Indian states list
  const matchedState = INDIAN_STATES.find(s => dNameClean.includes(s.toLowerCase()));
  if (matchedState) {
    if (matchedState.toLowerCase() === userState) {
      return { scope: 'in_state', label: 'In-State', reason: `Within ${user.state}.` };
    }
    return { scope: 'interstate', label: 'Interstate', reason: `In ${matchedState}.` };
  }

  // Default fallback
  return {
    scope: 'in_state',
    label: 'In-State',
    reason: 'Standard domestic scope.',
  };
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
