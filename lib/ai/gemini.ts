import type { GeneratedTripPayload } from './fallbackEngine';

/**
 * Google Gemini 1.5 Flash Free Tier Client
 * Connects directly to Google Generative Language API
 */
export async function callGeminiTravelPlanner(params: {
  prompt: string;
  days?: number;
  vibe?: string;
  budgetTier?: string;
  companion?: string;
  apiKey: string;
}): Promise<GeneratedTripPayload> {
  const daysCount = Math.min(Math.max(params.days || 5, 1), 14);
  const vibe = params.vibe || 'Cultural';
  const budgetTier = params.budgetTier || 'Moderate';
  const companion = params.companion || 'Couple';

  const systemInstruction = `You are the Lead Travel Architect for Journi ("Every journey begins a story.").
Your task is to plan a complete, inspiring, realistic travel itinerary based on the user's prompt and parameters.
Output strictly valid JSON matching this exact structure:
{
  "trip": {
    "id": "string",
    "title": "string",
    "destination": "string",
    "country": "string",
    "startDate": "Upcoming",
    "endDate": "${daysCount} Days",
    "daysCount": ${daysCount},
    "coverImage": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
    "gradient": "from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]",
    "status": "upcoming",
    "estimatedBudget": number,
    "spentBudget": 0,
    "currency": "INR",
    "pace": "Relaxed" | "Balanced" | "Fast-Paced",
    "vibe": ["string"],
    "description": "string"
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "Day 1",
      "title": "string",
      "theme": "string",
      "activities": [
        {
          "id": "string",
          "time": "09:00 AM",
          "period": "Morning" | "Afternoon" | "Evening",
          "title": "string",
          "description": "string",
          "location": "string",
          "duration": "2.0 hrs",
          "cost": number,
          "category": "sightseeing" | "dining" | "culture" | "leisure" | "transport",
          "tips": "string"
        }
      ]
    }
  ],
  "budget": {
    "totalEstimated": number,
    "currency": "INR",
    "categories": [
      { "category": "stay", "label": "Stays & Hotels", "allocated": number, "spent": 0, "iconName": "Home", "color": "#C2185B" },
      { "category": "food", "label": "Food & Dining", "allocated": number, "spent": 0, "iconName": "Utensils", "color": "#FF7A3D" },
      { "category": "activities", "label": "Activities & Entry", "allocated": number, "spent": 0, "iconName": "Ticket", "color": "#FFC83D" },
      { "category": "transport", "label": "Transit & Rail", "allocated": number, "spent": 0, "iconName": "Train", "color": "#5B0B24" },
      { "category": "other", "label": "Incidentals", "allocated": number, "spent": 0, "iconName": "Tag", "color": "#FF4F7A" }
    ],
    "items": [
      { "id": "b-1", "title": "string", "category": "stay", "amount": number, "date": "Day 1" }
    ]
  },
  "packing": [
    { "id": "p-1", "title": "string", "category": "Essentials" | "Clothing" | "Toiletries" | "Tech", "isPacked": boolean }
  ],
  "weather": [
    { "date": "Day 1", "dayName": "Day 1", "condition": "Sunny" | "Partly Cloudy" | "Rainy" | "Clear" | "Breezy", "icon": "Sun", "highTemp": number, "lowTemp": number, "precipitationPercent": number, "uvIndex": number, "advice": "string" }
  ]
}

Ensure:
- Exactly ${daysCount} days in the days array.
- 3 to 4 well-spaced activities per day (Morning, Afternoon, Evening).
- Accurate, authentic place names and genuine travel advice.
- Currency MUST strictly be "INR" (Indian Rupee - ₹). All estimated budget numbers, activity costs, and accommodations must be in realistic Indian Rupees (e.g. ₹60,000 - ₹2,50,000 total trip; activities ₹500 - ₹3,500).
- Budget tier is respected: ${budgetTier}.
- Vibe is emphasized: ${vibe}. Companion: ${companion}.`;

  const userQuery = `User Prompt: "${params.prompt}"
Duration: ${daysCount} days. Vibe: ${vibe}. Budget: ${budgetTier}. Traveling as: ${companion}.
Synthesize the complete travel plan now.`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
    params.apiKey
  )}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${systemInstruction}\n\n${userQuery}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Gemini API error (${response.status}): ${errText}`);
  }

  const jsonResult = await response.json();
  const rawText = jsonResult.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('No candidate content received from Google Gemini');
  }

  const parsedData = JSON.parse(rawText) as GeneratedTripPayload;
  parsedData.source = 'gemini';

  // Guarantee IDs and basic properties
  if (!parsedData.trip.id) {
    parsedData.trip.id = `trip-ai-${Date.now()}`;
  }

  return parsedData;
}
