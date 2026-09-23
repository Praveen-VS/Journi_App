import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DESTINATIONS, MOCK_SAVED_PLACES } from '@/constants';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';

  if (!q) {
    return NextResponse.json({
      success: true,
      data: {
        destinations: MOCK_DESTINATIONS.slice(0, 4),
        places: MOCK_SAVED_PLACES.slice(0, 4),
      },
    });
  }

  const matchingDestinations = MOCK_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.vibes.some((v) => v.toLowerCase().includes(q))
  );

  const matchingPlaces = MOCK_SAVED_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.destination.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  return NextResponse.json({
    success: true,
    data: {
      destinations: matchingDestinations,
      places: matchingPlaces,
      totalCount: matchingDestinations.length + matchingPlaces.length,
    },
  });
}
