import type { Destination } from '@/types';
import rawDestinations from '@/data/destinations.json';

export const ALL_DESTINATIONS: Destination[] = rawDestinations as Destination[];

export const TOTAL_DESTINATIONS_COUNT = ALL_DESTINATIONS.length;

// O(1) indexed lookups
const DESTINATIONS_BY_ID = new Map<string, Destination>();
const DESTINATIONS_BY_STATE = new Map<string, Destination[]>();
const DESTINATIONS_BY_COUNTRY = new Map<string, Destination[]>();
const DESTINATIONS_BY_CONTINENT = new Map<string, Destination[]>();

// Initialize indices once on load
for (let i = 0; i < ALL_DESTINATIONS.length; i++) {
  const d = ALL_DESTINATIONS[i];
  DESTINATIONS_BY_ID.set(d.id, d);
  DESTINATIONS_BY_ID.set(d.name.toLowerCase().trim(), d);

  if (d.state) {
    const sKey = d.state.toLowerCase().trim();
    const sList = DESTINATIONS_BY_STATE.get(sKey) || [];
    sList.push(d);
    DESTINATIONS_BY_STATE.set(sKey, sList);
  }

  const cKey = d.country.toLowerCase().trim();
  const cList = DESTINATIONS_BY_COUNTRY.get(cKey) || [];
  cList.push(d);
  DESTINATIONS_BY_COUNTRY.set(cKey, cList);

  const contKey = d.continent.toLowerCase().trim();
  const contList = DESTINATIONS_BY_CONTINENT.get(contKey) || [];
  contList.push(d);
  DESTINATIONS_BY_CONTINENT.set(contKey, contList);
}

/**
 * Fast O(1) destination lookup by ID or exact name
 */
export function getDestinationById(id: string): Destination | undefined {
  if (!id) return undefined;
  return DESTINATIONS_BY_ID.get(id) || DESTINATIONS_BY_ID.get(id.toLowerCase().trim());
}

/**
 * Get destinations by Indian state in O(1)
 */
export function getDestinationsByState(state: string): Destination[] {
  return DESTINATIONS_BY_STATE.get(state.toLowerCase().trim()) || [];
}

/**
 * Get destinations by country in O(1)
 */
export function getDestinationsByCountry(country: string): Destination[] {
  return DESTINATIONS_BY_COUNTRY.get(country.toLowerCase().trim()) || [];
}

/**
 * Get destinations by continent in O(1)
 */
export function getDestinationsByContinent(continent: string): Destination[] {
  return DESTINATIONS_BY_CONTINENT.get(continent.toLowerCase().trim()) || [];
}

/**
 * Search destinations by query
 */
export function searchDestinations(query: string): Destination[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_DESTINATIONS;

  return ALL_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.continent.toLowerCase().includes(q) ||
      (d.state && d.state.toLowerCase().includes(q)) ||
      d.tagline.toLowerCase().includes(q) ||
      d.vibes.some((v) => v.toLowerCase().includes(q)) ||
      (d.highlights && d.highlights.some((h) => h.toLowerCase().includes(q))) ||
      (d.foodTypes && d.foodTypes.some((f) => f.toLowerCase().includes(q)))
  );
}
