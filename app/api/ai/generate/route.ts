import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouterTravelPlanner, getOpenRouterApiKey, getOpenRouterModel } from '@/lib/ai/openrouter';
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

    // Check for API keys: OpenRouter / Astra 6 takes priority, then Gemini
    const openRouterHeaderKey = req.headers.get('x-openrouter-api-key') || req.headers.get('x-ai-api-key');
    const openRouterKey = getOpenRouterApiKey(openRouterHeaderKey || undefined);

    const geminiHeaderKey = req.headers.get('x-gemini-api-key');
    const geminiEnvKey = process.env.GEMINI_API_KEY;
    const geminiKey = geminiHeaderKey || geminiEnvKey;

    let payload: GeneratedTripPayload;

    if (openRouterKey) {
      try {
        payload = await callOpenRouterTravelPlanner({
          prompt,
          days,
          vibe,
          budgetTier,
          companion,
          apiKey: openRouterKey,
        });
      } catch (openRouterErr) {
        console.warn('OpenRouter / Astra 6 request failed. Trying fallback:', openRouterErr);
        if (geminiKey && geminiKey.trim() !== '') {
          try {
            payload = await callGeminiTravelPlanner({
              prompt,
              days,
              vibe,
              budgetTier,
              companion,
              apiKey: geminiKey.trim(),
            });
          } catch {
            payload = generateFallbackTripPlan({ prompt, days, vibe, budgetTier, companion });
          }
        } else {
          payload = generateFallbackTripPlan({ prompt, days, vibe, budgetTier, companion });
        }
      }
    } else if (geminiKey && geminiKey.trim() !== '') {
      try {
        payload = await callGeminiTravelPlanner({
          prompt,
          days,
          vibe,
          budgetTier,
          companion,
          apiKey: geminiKey.trim(),
        });
      } catch (geminiError) {
        console.warn('Google Gemini API request failed. Falling back to internal engine:', geminiError);
        payload = generateFallbackTripPlan({ prompt, days, vibe, budgetTier, companion });
      }
    } else {
      payload = generateFallbackTripPlan({ prompt, days, vibe, budgetTier, companion });
    }

    const message =
      payload.source === 'openrouter'
        ? `Trip synthesized by OpenRouter (${getOpenRouterModel()})`
        : payload.source === 'gemini'
        ? 'Trip synthesized by Google Gemini 1.5 Flash'
        : 'Trip synthesized by Journi Intelligent Travel Engine';

    return NextResponse.json({
      success: true,
      data: payload,
      message,
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
  const openRouterKey = getOpenRouterApiKey();
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

  let engine = 'Journi Smart Travel Engine (Ready)';
  if (openRouterKey) {
    engine = `OpenRouter Astra 6 (${getOpenRouterModel()}) (Active)`;
  } else if (hasGeminiKey) {
    engine = 'Google Gemini 1.5 Flash (Active)';
  }

  return NextResponse.json({
    success: true,
    engine,
    openRouterConfigured: Boolean(openRouterKey),
    model: getOpenRouterModel(),
    status: 'operational',
  });
}
