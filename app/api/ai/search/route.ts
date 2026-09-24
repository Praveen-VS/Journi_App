import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SAVED_PLACES } from '@/constants';
import { ALL_DESTINATIONS } from '@/constants/destinationsData';
import { callOpenRouterDestinationSearch, getOpenRouterApiKey, getOpenRouterModel } from '@/lib/ai/openrouter';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';
    const vibe = searchParams.get('vibe') || undefined;
    const continent = searchParams.get('continent') || undefined;
    const limit = parseInt(searchParams.get('limit') || '16', 10);

    const headerKey = req.headers.get('x-openrouter-api-key') || req.headers.get('x-ai-api-key');
    const apiKey = getOpenRouterApiKey(headerKey || undefined);

    if (!q) {
      return NextResponse.json({
        success: true,
        data: {
          summary: 'Explore popular destinations and saved travel gems.',
          destinations: ALL_DESTINATIONS.slice(0, limit),
          places: MOCK_SAVED_PLACES.slice(0, 4),
          suggestedFollowUps: [
            'Serene coastal escapes for couples',
            'Budget mountain treks under ₹50,000',
            'Culinary tours in Japan and Italy',
          ],
          source: 'catalog_default',
          totalCount: ALL_DESTINATIONS.length,
          model: getOpenRouterModel(),
        },
      });
    }

    const aiResult = await callOpenRouterDestinationSearch({
      query: q,
      vibe,
      continent,
      limit,
      apiKey,
    });

    const matchingPlaces = MOCK_SAVED_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.destination.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
    );

    return NextResponse.json({
      success: true,
      data: {
        summary: aiResult.summary,
        destinations: aiResult.destinations,
        places: matchingPlaces,
        suggestedFollowUps: aiResult.suggestedFollowUps,
        source: aiResult.source,
        totalCount: aiResult.destinations.length + matchingPlaces.length,
        model: getOpenRouterModel(),
      },
    });
  } catch (err: unknown) {
    console.error('AI Destination Search Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Search failed',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      query,
      scope,
      origin,
      customLocation,
      rhythm,
      landscape,
      budgetTier,
      companion,
      cuisines,
      ageGroup,
      vibe,
      continent,
      limit = 16,
    } = body;
    const headerKey = req.headers.get('x-openrouter-api-key') || req.headers.get('x-ai-api-key');
    const apiKey = getOpenRouterApiKey(headerKey || body.apiKey || undefined);

    const q = (query || '').trim();
    const hasAnyFilter = Boolean(q || scope || rhythm || landscape || budgetTier || companion || customLocation);

    if (!hasAnyFilter) {
      return NextResponse.json({
        success: true,
        data: {
          summary: 'Explore handpicked global gems.',
          destinations: ALL_DESTINATIONS.slice(0, limit),
          places: MOCK_SAVED_PLACES.slice(0, 4),
          suggestedFollowUps: [],
          source: 'catalog_default',
        },
      });
    }

    const aiResult = await callOpenRouterDestinationSearch({
      query: q,
      scope,
      origin,
      customLocation,
      rhythm,
      landscape,
      budgetTier,
      companion,
      cuisines,
      ageGroup,
      vibe,
      continent,
      limit,
      apiKey,
    });

    return NextResponse.json({
      success: true,
      data: aiResult,
    });
  } catch (err: unknown) {
    console.error('AI Destination Search POST Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'AI search failed',
      },
      { status: 500 }
    );
  }
}
