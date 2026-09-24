import type { GeneratedTripPayload } from '@/lib/ai/fallbackEngine';
import type { ApiResponse } from '@/types';

export interface GenerateTripParams {
  prompt: string;
  days?: number;
  vibe?: string;
  budgetTier?: string;
  companion?: string;
  userApiKey?: string;
}

/**
 * AI Service Client for Journi
 */
export const aiService = {
  /**
   * Synthesize a complete trip plan using Google Gemini or Smart Travel Engine
   */
  generateTripPlan: async (params: GenerateTripParams): Promise<GeneratedTripPayload> => {
    // Check for client stored key in browser if not explicitly passed
    let clientKey = params.userApiKey;
    if (!clientKey && typeof window !== 'undefined') {
      clientKey =
        localStorage.getItem('journi_openrouter_api_key') ||
        localStorage.getItem('journi_gemini_api_key') ||
        undefined;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (clientKey && clientKey.trim() !== '') {
      headers['x-openrouter-api-key'] = clientKey.trim();
      headers['x-gemini-api-key'] = clientKey.trim();
    }

    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt: params.prompt,
        days: params.days,
        vibe: params.vibe,
        budgetTier: params.budgetTier,
        companion: params.companion,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with status ${response.status}`);
    }

    const result = (await response.json()) as ApiResponse<GeneratedTripPayload>;
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to generate itinerary');
    }

    return result.data;
  },

  /**
   * Powerful AI destination & POI search powered by OpenRouter Astra 6
   */
  searchDestinationsAI: async (params: {
    query: string;
    vibe?: string;
    continent?: string;
    limit?: number;
    userApiKey?: string;
  }) => {
    let clientKey = params.userApiKey;
    if (!clientKey && typeof window !== 'undefined') {
      clientKey =
        localStorage.getItem('journi_openrouter_api_key') ||
        localStorage.getItem('journi_gemini_api_key') ||
        undefined;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (clientKey && clientKey.trim() !== '') {
      headers['x-openrouter-api-key'] = clientKey.trim();
    }

    const response = await fetch('/api/ai/search', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: params.query,
        vibe: params.vibe,
        continent: params.continent,
        limit: params.limit || 16,
      }),
    });

    if (!response.ok) {
      throw new Error('AI search request failed');
    }

    return response.json();
  },

  /**
   * Quick destination and POI search
   */
  searchPlaces: async (query: string) => {
    const response = await fetch(`/api/ai/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    return response.json();
  },

  /**
   * Check operational status and active AI model
   */
  checkEngineStatus: async () => {
    const response = await fetch('/api/ai/generate');
    if (!response.ok) {
      return { operational: false, engine: 'Offline' };
    }
    return response.json();
  },
};
