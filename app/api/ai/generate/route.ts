import { NextRequest, NextResponse } from 'next/server';
import { callGeminiTravelPlanner } from '@/lib/ai/gemini';
import { generateFallbackTripPlan, type GeneratedTripPayload } from '@/lib/ai/fallbackEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, days, vibe, budgetTier, companion } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check for API key in header or environment variables
    const headerKey = req.headers.get('x-gemini-api-key');
    const envKey = process.env.GEMINI_API_KEY;
    const activeKey = headerKey || envKey;

    let payload: GeneratedTripPayload;

    if (activeKey && activeKey.trim() !== '') {
      try {
        payload = await callGeminiTravelPlanner({
          prompt,
          days,
          vibe,
          budgetTier,
          companion,
          apiKey: activeKey.trim(),
        });
      } catch (geminiError) {
        console.warn('Google Gemini API request failed or rate-limited. Falling back to internal engine:', geminiError);
        // Seamless fallback to heuristic engine
        payload = generateFallbackTripPlan({
          prompt,
          days,
          vibe,
          budgetTier,
          companion,
        });
      }
    } else {
      // Use internal heuristic travel intelligence
      payload = generateFallbackTripPlan({
        prompt,
        days,
        vibe,
        budgetTier,
        companion,
      });
    }

    return NextResponse.json({
      success: true,
      data: payload,
      message: payload.source === 'gemini'
        ? 'Trip synthesized by Google Gemini 1.5 Flash'
        : 'Trip synthesized by Journi Intelligent Travel Engine',
    });
  } catch (err: unknown) {
    console.error('API AI Generation Error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to generate trip' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY);
  return NextResponse.json({
    success: true,
    engine: hasEnvKey ? 'Google Gemini 1.5 Flash (Active)' : 'Journi Smart Travel Engine (Ready)',
    freeTierAvailable: true,
    status: 'operational',
  });
}
