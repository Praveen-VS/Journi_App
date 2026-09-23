import type { Destination } from '@/types';
import rawDestinations from '@/data/destinations.json';

export const ALL_DESTINATIONS: Destination[] = rawDestinations as Destination[];

export const TOTAL_DESTINATIONS_COUNT = ALL_DESTINATIONS.length;

/**
 * Find destination by ID
 */
export function getDestinationById(id: string): Destination | undefined {
  return ALL_DESTINATIONS.find((d) => d.id === id);
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
      d.tagline.toLowerCase().includes(q) ||
      d.vibes.some((v) => v.toLowerCase().includes(q)) ||
      (d.highlights && d.highlights.some((h) => h.toLowerCase().includes(q))) ||
      (d.foodTypes && d.foodTypes.some((f) => f.toLowerCase().includes(q)))
  );
}
