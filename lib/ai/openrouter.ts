import type { Destination, UserTasteProfile, TripSummary, ItineraryDay } from '@/types';
import type { GeneratedTripPayload } from './fallbackEngine';
import { resolveCustomLocationSearch } from './customDestinations';

/**
 * OpenRouter & Astra 6 Intelligence Client for Journi
 * Uses native fetch without external dependencies.
 */

export interface OpenRouterPlannerInput {
  prompt: string;
  days?: number;
  vibe?: string;
  budgetTier?: string;
  companion?: string;
  apiKey?: string;
}

export interface AIDestinationSearchResponse {
  query: string;
  summary: string;
  destinations: Destination[];
  suggestedFollowUps: string[];
  source: 'openrouter_astra' | 'catalog_fallback' | 'smart_taste_fallback';
}

/**
 * Resolve OpenRouter / Astra 6 API Key from headers or multiple environment variable conventions
 */
export function getOpenRouterApiKey(explicitKey?: string): string | undefined {
  if (explicitKey && explicitKey.trim() !== '') {
    return explicitKey.trim();
  }

  const envKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTER_KEY ||
    process.env.ASTRA_API_KEY ||
    process.env.ASTRA_KEY ||
    process.env.ASTRA_6_KEY ||
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  return envKey && envKey.trim() !== '' ? envKey.trim() : undefined;
}

/**
 * Resolve Model Identifier (Defaults to 'openai/gpt-6-astra' or custom env)
 */
export function getOpenRouterModel(): string {
  return (
    process.env.OPENROUTER_MODEL ||
    process.env.ASTRA_MODEL ||
    process.env.ASTRA_6_MODEL ||
    process.env.MODEL_NAME ||
    'openai/gpt-6-astra'
  );
}

/**
 * Helper to strip markdown code blocks and sanitize JSON strings
 */
function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Safely parse JSON with bracket-balancing repair for truncated responses
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseItinerarySafely(raw: string): any {
  const cleaned = cleanJsonString(raw);
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    console.warn('Initial JSON.parse failed, attempting bracket-balanced repair...', initialErr);
  }

  const daysIndex = cleaned.indexOf('"days"');
  if (daysIndex !== -1) {
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace > daysIndex) {
      let testStr = cleaned.substring(0, lastBrace + 1);
      const stack: string[] = [];
      let inString = false;
      let escape = false;

      for (let i = 0; i < testStr.length; i++) {
        const c = testStr[i];
        if (escape) {
          escape = false;
          continue;
        }
        if (c === '\\') {
          escape = true;
          continue;
        }
        if (c === '"') {
          inString = !inString;
          continue;
        }
        if (!inString) {
          if (c === '[' || c === '{') {
            stack.push(c);
          } else if (c === ']' && stack[stack.length - 1] === '[') {
            stack.pop();
          } else if (c === '}' && stack[stack.length - 1] === '{') {
            stack.pop();
          }
        }
      }

      while (stack.length > 0) {
        const top = stack.pop();
        if (top === '[') testStr += ']';
        else if (top === '{') testStr += '}';
      }

      try {
        return JSON.parse(testStr);
      } catch (repairErr) {
        console.warn('Bracket-balanced repair failed:', repairErr);
      }
    }
  }

  return {};
}

/**
 * Call OpenRouter / Astra 6 to synthesize a complete trip plan
 */
export async function callOpenRouterTravelPlanner(
  input: OpenRouterPlannerInput
): Promise<GeneratedTripPayload> {
  const apiKey = getOpenRouterApiKey(input.apiKey);

  if (!apiKey) {
    throw new Error('No OpenRouter / Astra 6 API key configured in .env.local or request');
  }

  const model = getOpenRouterModel();
  const daysCount = Math.min(Math.max(input.days || 5, 1), 14);
  const vibe = input.vibe || 'Cultural';
  const budgetTier = input.budgetTier || 'Moderate';
  const companion = input.companion || 'Couple';

  const systemPrompt = `You are Journi AI, an elite travel architect ("Every journey begins a story.").
Your task is to synthesize a complete, highly realistic travel plan.
Return ONLY valid JSON matching this exact schema:
{
  "trip": {
    "id": "trip-${Date.now()}",
    "title": "Inspiring Title",
    "destination": "City Name",
    "country": "Country Name",
    "startDate": "Upcoming",
    "endDate": "${daysCount} Days",
    "daysCount": ${daysCount},
    "coverImage": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
    "gradient": "from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]",
    "status": "upcoming",
    "estimatedBudget": 95000,
    "spentBudget": 0,
    "currency": "INR",
    "pace": "Relaxed" | "Balanced" | "Fast-Paced",
    "vibe": ["${vibe}"],
    "description": "Engaging 2-3 sentence overview."
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "Day 1",
      "title": "Arrival & Initial Exploration",
      "theme": "Atmospheric Welcome",
      "activities": [
        {
          "id": "act-1",
          "time": "09:00 AM",
          "period": "Morning",
          "title": "Activity Title",
          "description": "Descriptive narrative of activity.",
          "location": "Specific place or landmark",
          "duration": "2.0 hrs",
          "cost": 1200,
          "category": "sightseeing" | "dining" | "culture" | "leisure" | "transport",
          "tips": "Local insider advice"
        }
      ]
    }
  ],
  "budget": {
    "totalEstimated": 95000,
    "currency": "INR",
    "categories": [
      { "category": "stay", "label": "Stays & Hotels", "allocated": 45000, "spent": 0, "iconName": "Home", "color": "#C2185B" },
      { "category": "food", "label": "Food & Dining", "allocated": 22000, "spent": 0, "iconName": "Utensils", "color": "#FF7A3D" },
      { "category": "activities", "label": "Activities & Entry", "allocated": 15000, "spent": 0, "iconName": "Ticket", "color": "#FFC83D" },
      { "category": "transport", "label": "Transit & Rail", "allocated": 8000, "spent": 0, "iconName": "Train", "color": "#5B0B24" },
      { "category": "other", "label": "Incidentals", "allocated": 5000, "spent": 0, "iconName": "Tag", "color": "#FF4F7A" }
    ],
    "items": [
      { "id": "b-1", "title": "Boutique Heritage Hotel", "category": "stay", "amount": 45000, "date": "Day 1" }
    ]
  },
  "packing": [
    { "id": "p-1", "title": "Passport & ID copies", "category": "Essentials", "isPacked": false }
  ],
  "weather": [
    { "date": "Day 1", "dayName": "Day 1", "condition": "Sunny", "icon": "Sun", "highTemp": 28, "lowTemp": 18, "precipitationPercent": 10, "uvIndex": 6, "advice": "Light layers & sunglasses" }
  ]
}

Ensure:
- Exactly ${daysCount} days in the days array.
- Exactly 3 to 4 activities per day (Morning, Afternoon, Evening). Keep activity descriptions concise (1-2 sentences maximum) so the entire JSON completes cleanly.
- Currency MUST strictly be "INR" (Indian Rupee - ₹). Realistic numbers.
- Budget tier: ${budgetTier}, Vibe: ${vibe}, Companion: ${companion}.
`;

  const userContent = `User Prompt: "${input.prompt}"
Duration: ${daysCount} days. Vibe: ${vibe}. Budget: ${budgetTier}. Traveling as: ${companion}.
Output strictly valid JSON with no extraneous text.`;

  let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://journi.travel',
      'X-Title': 'Journi AI Travel Planner',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3500,
      temperature: 0.7,
    }),
  });

  // Auto-failover if OpenRouter primary model limits or fails
  if (!response.ok && model !== 'openrouter/auto') {
    console.warn(`OpenRouter primary planner (${model}) returned ${response.status}, auto-failing over to openrouter/auto...`);
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://journi.travel',
        'X-Title': 'Journi AI Travel Planner (Failover)',
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 3500,
        temperature: 0.6,
      }),
    });
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`OpenRouter API responded with ${response.status}: ${errorText}`);
  }

  const json = await response.json();
  const rawContent = json?.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error('Empty response received from OpenRouter');
  }

  const parsed = parseItinerarySafely(rawContent);

  const destMatch = input.prompt.match(/(?:trip to|travel to|explore|visit|in)\s+([^,.]+?)(?:,\s*([^.]+?))?(?:\s+featuring|\s+with|\.|$)/i);
  const fallbackDestName = destMatch ? destMatch[1].trim() : 'Destination';
  const fallbackCountry = destMatch && destMatch[2] ? destMatch[2].replace(/\b(?:featuring|with|for)\b.*$/i, '').trim() : 'Global';

  const rawTrip = parsed?.trip || parsed;
  const trip: TripSummary = {
    id: rawTrip?.id || `trip-${Date.now()}`,
    title: rawTrip?.title || `${daysCount}-Day ${vibe} Journey in ${fallbackDestName}`,
    destination: rawTrip?.destination || fallbackDestName,
    country: rawTrip?.country || fallbackCountry,
    startDate: rawTrip?.startDate || 'Upcoming',
    endDate: rawTrip?.endDate || `${daysCount} Days`,
    daysCount: rawTrip?.daysCount || daysCount,
    coverImage: rawTrip?.coverImage || getScenicPhoto(undefined, fallbackDestName),
    gradient: rawTrip?.gradient || 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
    status: 'upcoming',
    estimatedBudget: rawTrip?.estimatedBudget || 75000,
    spentBudget: 0,
    currency: 'INR',
    pace: rawTrip?.pace || 'Balanced',
    vibe: Array.isArray(rawTrip?.vibe) ? rawTrip.vibe : [vibe],
    description: rawTrip?.description || `A masterfully curated ${daysCount}-day ${vibe.toLowerCase()} experience in ${fallbackDestName}.`,
  };

  const rawDays = Array.isArray(parsed?.days)
    ? parsed.days
    : Array.isArray(parsed?.itinerary)
    ? parsed.itinerary
    : Array.isArray(rawTrip?.days)
    ? rawTrip.days
    : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const days: ItineraryDay[] = rawDays.map((d: any, idx: number) => ({
    dayNumber: d.dayNumber || idx + 1,
    date: d.date || `Day ${d.dayNumber || idx + 1}`,
    title: d.title || `${trip.destination} Day ${idx + 1}`,
    theme: d.theme || 'Exploration & Culture',
    activities: Array.isArray(d.activities)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? d.activities.map((a: any, actIdx: number) => ({
          id: a.id || `act-${idx + 1}-${actIdx + 1}`,
          time: a.time || (actIdx === 0 ? '09:00 AM' : actIdx === 1 ? '01:00 PM' : '06:00 PM'),
          period: a.period || (actIdx === 0 ? 'Morning' : actIdx === 1 ? 'Afternoon' : 'Evening'),
          title: a.title || `Explore ${trip.destination}`,
          description: a.description || `Experience signature sights and local character in ${trip.destination}.`,
          location: a.location || trip.destination,
          duration: a.duration || '2.0 hrs',
          cost: typeof a.cost === 'number' ? a.cost : 1000,
          category: a.category || (actIdx === 1 ? 'dining' : 'sightseeing'),
          tips: a.tips || 'Arrive on time and enjoy the experience.',
        }))
      : [],
  }));

  // Backfill if any requested day was truncated or missing
  while (days.length < daysCount) {
    const nextDayNum = days.length + 1;
    days.push({
      dayNumber: nextDayNum,
      date: `Day ${nextDayNum}`,
      title: `${trip.destination} Highlights & Leisure`,
      theme: 'Exploration & Culture',
      activities: [
        {
          id: `act-${nextDayNum}-1`,
          time: '09:30 AM',
          period: 'Morning',
          title: `Discover Historic & Scenic Sights of ${trip.destination}`,
          description: `Morning exploration of top cultural spots, heritage landmarks, and viewpoints in ${trip.destination}.`,
          location: trip.destination,
          duration: '2.5 hrs',
          cost: 1000,
          category: 'sightseeing',
          tips: 'Wear comfortable walking shoes and bring sunglasses.',
        },
        {
          id: `act-${nextDayNum}-2`,
          time: '01:00 PM',
          period: 'Afternoon',
          title: `Authentic Regional Lunch in ${trip.destination}`,
          description: `Taste local specialties, street food delicacies, and traditional recipes at a popular eatery.`,
          location: trip.destination,
          duration: '1.5 hrs',
          cost: 1200,
          category: 'dining',
          tips: 'Ask for the chef special and authentic local preparations.',
        },
        {
          id: `act-${nextDayNum}-3`,
          time: '06:00 PM',
          period: 'Evening',
          title: `Sunset Stroll & Evening Farewell`,
          description: `A relaxed evening stroll along scenic waterfronts or bustling markets in ${trip.destination}.`,
          location: trip.destination,
          duration: '2.0 hrs',
          cost: 800,
          category: 'leisure',
          tips: 'Perfect moment for photography and picking up local souvenirs.',
        },
      ],
    });
  }

  return {
    trip,
    days,
    budget: parsed?.budget || {
      totalEstimated: trip.estimatedBudget,
      currency: 'INR',
      categories: [
        { category: 'stay', label: 'Stays & Hotels', allocated: Math.round(trip.estimatedBudget * 0.45), spent: 0, iconName: 'Home', color: '#C2185B' },
        { category: 'food', label: 'Food & Dining', allocated: Math.round(trip.estimatedBudget * 0.25), spent: 0, iconName: 'Utensils', color: '#FF7A3D' },
        { category: 'activities', label: 'Activities & Entry', allocated: Math.round(trip.estimatedBudget * 0.15), spent: 0, iconName: 'Ticket', color: '#FFC83D' },
        { category: 'transport', label: 'Transit & Rail', allocated: Math.round(trip.estimatedBudget * 0.10), spent: 0, iconName: 'Train', color: '#5B0B24' },
        { category: 'other', label: 'Incidentals', allocated: Math.round(trip.estimatedBudget * 0.05), spent: 0, iconName: 'Tag', color: '#FF4F7A' },
      ],
      items: [
        { id: 'b-1', title: `Boutique Stays in ${trip.destination}`, category: 'stay', amount: Math.round(trip.estimatedBudget * 0.45), date: 'Day 1' },
      ],
    },
    packing: parsed?.packing || [
      { id: 'p-1', title: 'Passport & Travel Documents', category: 'Essentials', isPacked: true },
      { id: 'p-2', title: 'Comfortable walking shoes', category: 'Clothing', isPacked: false },
      { id: 'p-3', title: 'Camera or Smartphone with charger', category: 'Tech', isPacked: true },
    ],
    weather: parsed?.weather || [
      { date: 'Day 1', dayName: 'Day 1', condition: 'Sunny', icon: 'Sun', highTemp: 28, lowTemp: 20, precipitationPercent: 10, uvIndex: 6, advice: 'Clear and pleasant.' },
    ],
    source: 'openrouter',
  };
}

const SCENIC_PHOTOS_BY_LANDSCAPE: Record<string, string[]> = {
  beaches: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1510414842594-a61782153f5b?q=80&w=1000&auto=format&fit=crop',
  ],
  mountains: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop',
  ],
  historic: [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=1000&auto=format&fit=crop',
  ],
  nature: [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop',
  ],
  metropolis: [
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000&auto=format&fit=crop',
  ],
};

export function getScenicPhoto(landscapeKey?: string, name?: string): string {
  const key = (landscapeKey || '').toLowerCase();
  for (const [lKey, list] of Object.entries(SCENIC_PHOTOS_BY_LANDSCAPE)) {
    if (key.includes(lKey)) {
      const charCodeSum = (name || 'destination').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return list[Math.abs(charCodeSum) % list.length];
    }
  }
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop';
}

export interface AIDestinationSearchParams {
  query?: string;
  scope?: string;
  origin?: string;
  customLocation?: string;
  rhythm?: string;
  landscape?: string;
  budgetTier?: string;
  companion?: string;
  cuisines?: string[];
  ageGroup?: string;
  vibe?: string;
  continent?: string;
  apiKey?: string;
  limit?: number;
}

export function detectStateAndCountry(origin?: string): { state: string; city: string; country: string } {
  const raw = (origin || '').trim();

  const indianStates = [
    'Kerala', 'Karnataka', 'Tamil Nadu', 'Goa', 'Maharashtra', 'Rajasthan',
    'Himachal Pradesh', 'Uttarakhand', 'Andhra Pradesh', 'Telangana', 'West Bengal',
    'Gujarat', 'Punjab', 'Odisha', 'Sikkim', 'Assam', 'Meghalaya', 'Madhya Pradesh',
    'Jammu and Kashmir', 'Ladakh', 'Pondicherry', 'Delhi'
  ];

  for (const st of indianStates) {
    if (new RegExp(`\\b${st}\\b`, 'i').test(raw)) {
      const cityPart = raw.split(',')[0].replace(new RegExp(`\\b${st}\\b`, 'i'), '').trim() || (st === 'Kerala' ? 'Kochi' : st);
      return { state: st, city: cityPart, country: 'India' };
    }
  }

  // Default to user's real analyzed location: Kerala, India
  return { state: 'Kerala', city: 'Kochi', country: 'India' };
}

function formatScopeDescription(scope?: string, origin?: string): string {
  const loc = detectStateAndCountry(origin);
  const userCity = origin && origin !== 'Bengaluru, Karnataka' && origin !== 'San Francisco, CA'
    ? origin
    : `${loc.city}, ${loc.state}, ${loc.country}`;

  switch (scope) {
    case 'nearby_200km':
      return `Strictly within ~200 km road trip distance of ${userCity}. Ideal for a 1-3 day weekend getaway or scenic road trip (e.g. for ${loc.state}: Munnar, Vagamon, Alleppey, Athirappilly, Thekkady, Varkala, Kumarakom, Marari). Must be genuine destinations located within 200 km drive of ${loc.city}, ${loc.state}.`;
    case 'in_state':
      return `STRICT MANDATE: The traveler is currently located in the state of ${loc.state}, ${loc.country} (Origin: ${userCity}). You MUST ONLY return genuine destinations located strictly within the state of ${loc.state} (e.g. for Kerala: Munnar, Alleppey, Wayanad, Varkala, Thekkady, Kovalam, Kumarakom, Bekal, Athirappilly, Vagamon, Marari, Ponmudi). Absolutely DO NOT return destinations from any other states like Karnataka (Hampi, Coorg, Gokarna), Andhra Pradesh, or Tamil Nadu. Every single recommendation must be 100% authentically located inside ${loc.state}.`;
    case 'interstate':
      return `Domestic interstate travel across India OUTSIDE the state of ${loc.state} (Origin: ${userCity}). Diverse vacation spots across other Indian states (e.g. Goa, Rajasthan, Himachal Pradesh, Pondicherry, Uttarakhand, Kashmir, Andaman). Do NOT return destinations located inside ${loc.state}.`;
    case 'international':
      return `Global international destinations outside India (Passport required). Spectacular overseas travel hotspots (e.g. Bali, Thailand, Sri Lanka, Japan, Maldives, Greece, Italy, Switzerland, Vietnam).`;
    case 'custom':
      return `Custom traveler requested destination.`;
    default:
      return scope || 'General travel';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseRecommendationsSafely(raw: string): any {
  const cleaned = cleanJsonString(raw);
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Initial JSON parse failed, attempting robust repair...', err);
    let repaired = cleaned.trim();
    if (!repaired.endsWith('}')) {
      const lastObjIndex = repaired.lastIndexOf('}');
      if (lastObjIndex > 0) {
        repaired = repaired.slice(0, lastObjIndex + 1);
        if (!repaired.endsWith(']}')) {
          repaired += ']}';
        }
      }
    }
    try {
      return JSON.parse(repaired);
    } catch {
      return { recommendations: [] };
    }
  }
}

/**
 * Call OpenRouter / Astra 6 for unconstrained, ChatGPT-style world travel curation.
 * Takes the traveler's complete filter selections and generates genuine global destination matches.
 */
export async function callOpenRouterDestinationSearch(
  params: AIDestinationSearchParams
): Promise<AIDestinationSearchResponse> {
  const {
    query = '',
    scope = 'interstate',
    origin = 'Kerala, India',
    customLocation,
    rhythm,
    landscape,
    budgetTier,
    companion,
    cuisines,
    ageGroup,
    vibe,
    continent,
    limit = 8,
  } = params;
  const apiKey = getOpenRouterApiKey(params.apiKey);

  // If no API key configured, use intelligent local heuristic search
  if (!apiKey) {
    return performHeuristicDestinationSearch(params);
  }

  const model = getOpenRouterModel();
  const targetCount = Math.max(limit, 8);

  const systemPrompt = `You are Journi AI, an elite global travel curator powered by Astra 6.
You operate as an open, unconstrained world travel AI (ChatGPT-style) discovering authentic destinations.
Do not restrict recommendations to any fixed catalog. Recommend genuine global or regional destinations matching the traveler's desires.

Respond ONLY with valid JSON in this exact structure:
{
  "summary": "A friendly 1-2 sentence travel curator summary explaining how these recommendations match the traveler's custom preferences.",
  "recommendations": [
    {
      "name": "City or Destination Name",
      "country": "Country Name",
      "continent": "Continent",
      "tagline": "Evocative 1-line travel tagline",
      "matchScore": 98,
      "matchReason": "1-2 crisp sentences explaining why this fits their rhythm, landscape, and companion vibe.",
      "idealDays": 5,
      "bestSeason": "Spring / Autumn",
      "vibes": ["Coastal", "Romantic"],
      "highlights": ["Landmark 1", "Experience 2"],
      "foodTypes": ["Local specialty 1", "Dining style 2"]
    }
  ],
  "suggestedFollowUps": [
    "Alternative search or related prompt 1",
    "Alternative search or related prompt 2",
    "Alternative search or related prompt 3"
  ]
}

Rules:
- Curate ${targetCount} distinct, world-class destination matches.
- All recommendations must strictly adhere to the requested Distance & Scope and Landscape.
- Match scores must be between 88 and 99.
- Make 'matchReason' 1 crisp, persuasive sentence grounded in real travel details.`;

  const filterDetails: string[] = [];
  if (customLocation && customLocation.trim()) {
    filterDetails.push(
      `- TARGET GEOGRAPHY / LOCATION (ABSOLUTE REQUIREMENT): The traveler explicitly wants destinations strictly located inside or directly around "${customLocation.trim()}". All recommended destinations MUST be authentically in "${customLocation.trim()}". Do NOT recommend places from other countries or unrelated regions.`
    );
  } else if (scope === 'custom') {
    filterDetails.push(`- Distance & Scope: Open world destinations matching the traveler's custom travel desire.`);
  }
  if (query.trim()) filterDetails.push(`- Traveler desire/prompt: "${query.trim()}"`);
  if (scope && scope !== 'custom') {
    filterDetails.push(`- Distance & Scope Constraint: ${formatScopeDescription(scope, origin)}`);
  }
  if (rhythm) filterDetails.push(`- Trip Rhythm: "${rhythm}"`);
  if (landscape) filterDetails.push(`- Landscape: "${landscape}"`);
  if (budgetTier) filterDetails.push(`- Budget Tier: "${budgetTier}"`);
  if (companion) filterDetails.push(`- Traveling Companion: "${companion}"`);
  if (cuisines && cuisines.length > 0) filterDetails.push(`- Preferred Cuisines & Dining: "${cuisines.join(', ')}"`);
  if (ageGroup) filterDetails.push(`- Traveler Age Demographic: "${ageGroup}"`);
  if (vibe && vibe !== 'All') filterDetails.push(`- Preferred Vibe: "${vibe}"`);
  if (continent && continent !== 'All') filterDetails.push(`- Preferred Continent: "${continent}"`);

  const userContent = filterDetails.length > 0
    ? `Curate top ${targetCount} destination matches for this traveler profile:\n${filterDetails.join('\n')}\n\nReturn exactly ${targetCount} exceptional, distinct destination matches in valid JSON now.`
    : `Curate ${targetCount} exceptional, diverse destination matches for a memorable holiday in valid JSON now.`;

  try {
    let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://journi.travel',
        'X-Title': 'Journi AI Destination Search',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2200,
        temperature: 0.6,
      }),
    });

    // Auto-failover if OpenRouter credit limit or model issue occurs (402, 429, etc.)
    if (!response.ok && model !== 'openai/gpt-6-luna') {
      console.warn(`OpenRouter primary model (${model}) returned ${response.status}, auto-failing over to OpenAI GPT-6 Luna...`);
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://journi.travel',
          'X-Title': 'Journi AI Destination Search (Failover)',
        },
        body: JSON.stringify({
          model: 'openai/gpt-6-luna',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 2200,
          temperature: 0.5,
        }),
      });
    }

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.warn(`OpenRouter search failed with status ${response.status}: ${errBody}`);
      return performHeuristicDestinationSearch(params);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      return performHeuristicDestinationSearch(params);
    }

    const parsed = parseRecommendationsSafely(rawContent);
    const aiRecs = (parsed.recommendations || []) as Array<{
      name: string;
      country: string;
      continent?: string;
      tagline?: string;
      matchScore?: number;
      matchReason?: string;
      idealDays?: number;
      bestSeason?: string;
      vibes?: string[];
      highlights?: string[];
      foodTypes?: string[];
    }>;

    // Convert Astra 6 recommendations directly into Destination objects (pure generative AI search)
    const matchedDestinations: Destination[] = [];
    const usedIds = new Set<string>();

    for (const rec of aiRecs) {
      if (!rec.name) continue;
      const recNameLower = rec.name.toLowerCase().trim();
      const recCountry = rec.country || 'Global';

      const synthId = `astra-${recNameLower.replace(/[^a-z0-9]/g, '-')}`;

      if (!usedIds.has(synthId)) {
        usedIds.add(synthId);
        matchedDestinations.push({
          id: synthId,
          name: rec.name,
          country: recCountry,
          continent: rec.continent || 'Global',
          tagline: rec.tagline || `Handpicked escape in ${recCountry}`,
          description: rec.matchReason || `Curated by Astra 6 for your travel preferences.`,
          coverImage: getScenicPhoto(landscape, `${rec.name}-${recCountry}`),
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: rec.bestSeason || 'Spring / Autumn',
          averageTemp: '24°C',
          idealDays: rec.idealDays || 4,
          vibes: rec.vibes?.length ? rec.vibes : ['Curated', 'Scenic'],
          highlights: rec.highlights?.length ? rec.highlights : [`Iconic sights in ${rec.name}`],
          foodTypes: rec.foodTypes?.length ? rec.foodTypes : ['Regional specialties'],
          matchScore: rec.matchScore || 96,
          matchReason: rec.matchReason || `Matches your chosen rhythm and landscape preferences.`,
        });
      }
    }

    // If Astra returned no recommendations, fallback gracefully to intelligent generator
    if (matchedDestinations.length === 0) {
      return performHeuristicDestinationSearch(params);
    }

    // Ensure we always return at least targetCount (8) recommendations
    if (matchedDestinations.length < targetCount) {
      const fallback = performHeuristicDestinationSearch(params);
      for (const d of fallback.destinations) {
        if (!usedIds.has(d.id) && matchedDestinations.length < targetCount) {
          usedIds.add(d.id);
          matchedDestinations.push(d);
        }
      }
    }

    return {
      query: query || (customLocation ? customLocation : 'Custom Travel Taste'),
      summary: parsed.summary || `Astra 6 curated ${matchedDestinations.length} destinations matching your exact preferences.`,
      destinations: matchedDestinations.slice(0, targetCount),
      suggestedFollowUps: parsed.suggestedFollowUps || [
        `Explore hidden food markets in ${matchedDestinations[0]?.name || 'the area'}`,
        `Budget stays for ${matchedDestinations[0]?.name || 'your trip'}`,
        `Best season to visit ${matchedDestinations[0]?.country || 'your destination'}`,
      ],
      source: 'openrouter_astra',
    };
  } catch (err) {
    console.warn('OpenRouter destination search error, using intelligent generator:', err);
    return performHeuristicDestinationSearch(params);
  }
}

/**
 * Intelligently scores and ranks a pool of candidate destinations
 * against the traveler's landscape, query, rhythm, vibes, and cuisines.
 */
export function filterAndRankCuratedDestinations(
  pool: Destination[],
  params: AIDestinationSearchParams
): Destination[] {
  const {
    query = '',
    landscape = '',
    rhythm = '',
    vibe = '',
    cuisines = [],
    customLocation = '',
  } = params;

  const qClean = query.toLowerCase().trim();
  const landClean = landscape.toLowerCase().trim();
  const rhythmClean = rhythm.toLowerCase().trim();
  const vibeClean = vibe.toLowerCase().trim();
  const locClean = customLocation.toLowerCase().trim();

  const isBeachIntent =
    /\b(beach|beaches|coast|coastal|sea|ocean|sands?|surf|island|islands|cove|lagoon|cliff|marine|shacks?)\b/i.test(landClean) ||
    /\b(beach|beaches|coast|coastal|sea|ocean|sands?|surf|island|islands|cove|lagoon|cliff|marine|shacks?)\b/i.test(qClean) ||
    /\b(coastal|beach)\b/i.test(vibeClean);

  const isMountainIntent =
    /\b(mountain|mountains|alpine|peaks?|hills?|slopes?|tea|coffee|altitude|valleys?|trek|treks|trekking|summits?|himalayas|ghats|mist|snow)\b/i.test(landClean) ||
    /\b(mountain|mountains|alpine|peaks?|hills?|slopes?|tea|coffee|altitude|valleys?|trek|treks|trekking|summits?|himalayas|ghats|mist|snow)\b/i.test(qClean) ||
    /\b(alpine|mountain)\b/i.test(vibeClean);

  const isHistoricIntent =
    /\b(historic|history|heritage|palaces?|forts?|ramparts?|monuments?|architecture|unesco|ruins|temples?|old\s*towns?|ancient|colonial|cities|city)\b/i.test(landClean) ||
    /\b(historic|history|heritage|palaces?|forts?|ramparts?|monuments?|architecture|unesco|ruins|temples?|old\s*towns?|ancient|colonial|cities|city)\b/i.test(qClean) ||
    /\b(historic|cultural|culture)\b/i.test(vibeClean);

  const isNatureIntent =
    /\b(nature|wildlife|safari|forest|rainforest|sanctuary|jungle|waterfalls?|falls|canopy|biodiversity|tigers?|elephants?|rivers?|lakes?|backwaters?)\b/i.test(landClean) ||
    /\b(nature|wildlife|safari|forest|rainforest|sanctuary|jungle|waterfalls?|falls|canopy|biodiversity|tigers?|elephants?|rivers?|lakes?|backwaters?)\b/i.test(qClean) ||
    /\b(nature|adventure)\b/i.test(vibeClean);

  const scored = pool.map((dest) => {
    let score = 50;

    const vibesStr = (dest.vibes || []).join(' ').toLowerCase();
    const nameAndTagline = (dest.name + ' ' + dest.tagline).toLowerCase();
    const haystack = [
      dest.name,
      dest.tagline,
      dest.description,
      ...(dest.vibes || []),
      ...(dest.highlights || []),
      ...(dest.foodTypes || []),
      dest.state || '',
      dest.country || '',
    ]
      .join(' ')
      .toLowerCase();

    // 1. Geography / Custom Location Match
    if (locClean) {
      if (
        dest.country.toLowerCase().includes(locClean) ||
        (dest.state && dest.state.toLowerCase().includes(locClean)) ||
        dest.name.toLowerCase().includes(locClean)
      ) {
        score += 80;
      }
    }

    // 2. Landscape matching
    if (isBeachIntent) {
      if (vibesStr.includes('coastal') || vibesStr.includes('beach')) score += 70;
      if (/\b(beach|beaches|coast|coastal|sea|ocean|sands?|surf|island|lagoon|cliff)\b/i.test(nameAndTagline)) score += 40;
      if (vibesStr.includes('mountains') || vibesStr.includes('alpine')) score -= 60;
      if (vibesStr.includes('historic')) score -= 30;
    } else if (isMountainIntent) {
      if (vibesStr.includes('mountains') || vibesStr.includes('alpine')) score += 70;
      if (/\b(mountain|mountains|alpine|peaks?|hills?|tea|coffee|altitude|valleys?|trek|summits?|himalayan|ghats)\b/i.test(nameAndTagline)) score += 40;
      if (vibesStr.includes('coastal') || vibesStr.includes('beach')) score -= 60;
      if (vibesStr.includes('historic')) score -= 30;
    } else if (isHistoricIntent) {
      if (vibesStr.includes('historic') || vibesStr.includes('cultural')) score += 70;
      if (/\b(historic|history|heritage|palaces?|forts?|unesco|ruins|temples?|monuments?)\b/i.test(nameAndTagline)) score += 40;
      if (vibesStr.includes('mountains') || vibesStr.includes('alpine')) score -= 30;
    } else if (isNatureIntent) {
      if (vibesStr.includes('nature') || vibesStr.includes('wildlife') || vibesStr.includes('adventure')) score += 70;
      if (/\b(nature|wildlife|safari|forest|sanctuary|jungle|waterfalls?|river|lake|backwaters)\b/i.test(nameAndTagline)) score += 40;
    }

    // 3. User Query Term Matching
    if (qClean) {
      const terms = qClean
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 2 && !['plan', 'scenic', 'trip', 'with', 'focused', 'and', 'the', 'for', 'stays', 'authentic'].includes(t));

      for (const term of terms) {
        if (dest.name.toLowerCase().includes(term)) score += 40;
        else if (dest.country.toLowerCase().includes(term)) score += 25;
        else if (dest.state && dest.state.toLowerCase().includes(term)) score += 25;
        else if (dest.vibes?.some((v) => v.toLowerCase().includes(term))) score += 20;
        else if (dest.highlights?.some((h) => h.toLowerCase().includes(term))) score += 15;
        else if (haystack.includes(term)) score += 8;
      }
    }

    // 4. Rhythm matching
    if (rhythmClean) {
      if (rhythmClean.includes('chill') || rhythmClean.includes('peace')) {
        if (/\b(chill|peace|zen|quiet|relax|serene|tranquil|slow|secluded)\b/i.test(haystack)) score += 15;
      } else if (rhythmClean.includes('adventure')) {
        if (/\b(adventure|trek|rafting|safari|rapids|climb|outdoor|active)\b/i.test(haystack)) score += 15;
      } else if (rhythmClean.includes('culture')) {
        if (/\b(culture|cultural|heritage|art|historic|temple|palace)\b/i.test(haystack)) score += 15;
      }
    }

    // 5. Cuisines matching
    if (cuisines && cuisines.length > 0) {
      for (const c of cuisines) {
        const cClean = c.toLowerCase().replace(/_/g, ' ');
        if (haystack.includes(cClean)) score += 8;
      }
    }

    return { dest, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.map((item, idx) => {
    const d = item.dest;
    const dynamicScore = Math.max(88, Math.min(99, 98 - idx));
    let dynamicReason = d.matchReason;

    if (isBeachIntent && /\b(beach|coast|sea|surf|lagoon|shacks)\b/i.test(d.tagline + ' ' + d.description + ' ' + (d.vibes || []).join(' '))) {
      dynamicReason = `${d.name} delivers pristine coastal beauty, relaxing seaside rhythms, and quintessential beach vibes.`;
    } else if (isMountainIntent && /\b(mountain|alpine|hill|tea|coffee|peak|snow|valleys?)\b/i.test(d.tagline + ' ' + d.description + ' ' + (d.vibes || []).join(' '))) {
      dynamicReason = `${d.name} features cool mountain air, panoramic high-altitude viewpoints, and serene highland retreats.`;
    } else if (isHistoricIntent && /\b(historic|palace|fort|heritage|unesco|ruins)\b/i.test(d.tagline + ' ' + d.description + ' ' + (d.vibes || []).join(' '))) {
      dynamicReason = `${d.name} delivers rich historic architecture, centuries-old royal landmarks, and vibrant cultural immersion.`;
    } else if (isNatureIntent && /\b(nature|wildlife|forest|river|sanctuary|backwaters)\b/i.test(d.tagline + ' ' + d.description + ' ' + (d.vibes || []).join(' '))) {
      dynamicReason = `${d.name} connects you with untouched wilderness, lush natural reserves, and serene outdoor sanctuaries.`;
    }

    return {
      ...d,
      matchScore: dynamicScore,
      matchReason: dynamicReason || d.matchReason || `Matches your travel style and preferences.`,
    };
  });
}

export function generateSearchSummary(
  destinations: Destination[],
  params: AIDestinationSearchParams,
  scopeLabel: string
): string {
  const { landscape = '', rhythm = '', query = '' } = params;
  const count = destinations.length;
  const landClean = landscape.toLowerCase().trim();
  const qClean = query.toLowerCase().trim();

  let categoryDesc = 'curated';
  if (/\b(beach|beaches|coast|coastal)\b/i.test(landClean + ' ' + qClean)) {
    categoryDesc = 'coastal & beach';
  } else if (/\b(mountain|mountains|alpine|hills?)\b/i.test(landClean + ' ' + qClean)) {
    categoryDesc = 'mountain & highland';
  } else if (/\b(historic|history|heritage|palace|old\s*town)\b/i.test(landClean + ' ' + qClean)) {
    categoryDesc = 'historic & heritage';
  } else if (/\b(nature|wildlife|forest|safari)\b/i.test(landClean + ' ' + qClean)) {
    categoryDesc = 'lush nature & wildlife';
  }

  const rhythmDesc = rhythm ? `${rhythm} pace` : 'relaxed rhythm';
  return `Astra 6 analyzed your preferences and curated ${count} premier ${categoryDesc} destinations across ${scopeLabel} tailored to your ${rhythmDesc}.`;
}

export function generateFollowUps(
  destinations: Destination[],
  params: AIDestinationSearchParams
): string[] {
  const { landscape = '', query = '' } = params;
  const top = destinations[0];
  const topName = top?.name || 'your top match';
  const landClean = (landscape + ' ' + query).toLowerCase();

  if (/\b(beach|beaches|coast|coastal)\b/i.test(landClean)) {
    return [
      `Best secluded sunset spots in ${topName}`,
      `Fresh seafood & coastal shack recommendations for ${topName}`,
      `Water sports and island boat excursions in ${topName}`,
    ];
  }
  if (/\b(mountain|mountains|alpine|hills?)\b/i.test(landClean)) {
    return [
      `Scenic viewpoints and hiking trails in ${topName}`,
      `Best boutique estate homestays in ${topName}`,
      `Crisp mountain weather & packing tips for ${topName}`,
    ];
  }
  if (/\b(historic|history|heritage|old\s*town)\b/i.test(landClean)) {
    return [
      `Heritage walking tour itineraries for ${topName}`,
      `Best local bazaars & artisan crafts in ${topName}`,
      `Architectural marvels and guided monument tours in ${topName}`,
    ];
  }
  return [
    `Hidden gems and secret viewpoints in ${topName}`,
    `Best travel season and weather for ${topName}`,
    `Authentic culinary specialties to try in ${topName}`,
  ];
}

/**
 * Intelligent Dynamic Destination Fallback Generator
 * Generates authentic destination objects matching the requested location & taste without relying on static files.
 */
function performHeuristicDestinationSearch(
  params: AIDestinationSearchParams
): AIDestinationSearchResponse {
  const {
    query = '',
    scope = 'interstate',
    origin = 'Kerala, India',
    customLocation,
    rhythm = 'chill',
    landscape = 'beaches',
    limit = 8,
  } = params;

  // 1. If user specified a custom location or used "Other" scope
  const effectiveCustom = (customLocation || '').trim() || (scope === 'custom' && (query || '').trim() ? (query || '').trim() : '');
  if (effectiveCustom) {
    const locClean = effectiveCustom.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (locClean.includes('sri') || locClean.includes('lanka') || locClean.includes('ceylon')) {
      const sriLankaCurated: Destination[] = [
        {
          id: 'astra-galle-unawatuna',
          name: 'Galle & Unawatuna',
          country: 'Sri Lanka',
          continent: 'Asia',
          tagline: 'Historic Dutch fortress overlooking golden tropical surf',
          description: 'A captivating coastal jewel where 17th-century cobblestone ramparts meet sun-drenched Indian Ocean beaches.',
          coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'December to April',
          averageTemp: '28°C',
          idealDays: 4,
          vibes: ['Coastal', 'Historic', 'Chill'],
          highlights: ['Galle Dutch Fort', 'Unawatuna Beach', 'Lighthouse Walk'],
          foodTypes: ['Ceylon Seafood Curry', 'Fresh Coconut', 'Hoppers'],
          matchScore: 98,
          matchReason: 'Unites your desire for chill coastal beauty with rich world-heritage history and phenomenal seafood.',
        },
        {
          id: 'astra-mirissa-coast',
          name: 'Mirissa',
          country: 'Sri Lanka',
          continent: 'Asia',
          tagline: 'Crescent palms, azure waters & unforgettable marine life',
          description: 'Sri Lanka’s premier beach enclave, famous for secret surf breaks, coconut tree hills, and majestic blue whales.',
          coverImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'November to April',
          averageTemp: '29°C',
          idealDays: 3,
          vibes: ['Beaches', 'Marine Wildlife', 'Relaxed'],
          highlights: ['Coconut Tree Hill', 'Secret Beach', 'Whale Watching Safari'],
          foodTypes: ['Grilled Jumbo Prawns', 'Roti Stalls', 'Tropical Smoothies'],
          matchScore: 97,
          matchReason: 'Delivers the quintessence of relaxed coastal rhythm with postcard-perfect palm coves.',
        },
        {
          id: 'astra-ella-hill-country',
          name: 'Ella & Hill Country',
          country: 'Sri Lanka',
          continent: 'Asia',
          tagline: 'Misty tea plantations & iconic rail bridge panoramas',
          description: 'A serene mountain village nestled in dramatic mountain passes, famed for waterfalls, hiking, and organic tea estates.',
          coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'January to May',
          averageTemp: '21°C',
          idealDays: 4,
          vibes: ['Mountains', 'Scenic', 'Nature'],
          highlights: ['Nine Arch Bridge', 'Little Adam’s Peak', 'Ravana Falls'],
          foodTypes: ['Traditional Rice & Curry', 'Ceylon High Tea', 'Local Roti'],
          matchScore: 96,
          matchReason: 'Breathtaking alpine serenity with lush green tea vistas and peaceful trail hikes.',
        },
        {
          id: 'astra-tangalle-bays',
          name: 'Tangalle',
          country: 'Sri Lanka',
          continent: 'Asia',
          tagline: 'Untouched southern sands & whisper-quiet ocean bays',
          description: 'A peaceful, less-trodden coastline where turquoise swells lap against dramatic rock formations and turtle-nesting shores.',
          coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'December to April',
          averageTemp: '28°C',
          idealDays: 3,
          vibes: ['Secluded', 'Coastal', 'Peace & Zen'],
          highlights: ['Silent Beach', 'Goyambokka Cove', 'Mulkirigala Rock Temple'],
          foodTypes: ['Fresh Crab Curry', 'Local Coconut Sambal', 'King Coconut'],
          matchScore: 95,
          matchReason: 'A sanctuary of peace and seclusion along Sri Lanka’s wild southern coast.',
        },
        {
          id: 'astra-sigiriya-fortress',
          name: 'Sigiriya Rock Fortress',
          country: 'Sri Lanka',
          continent: 'Asia',
          tagline: 'Ancient royal citadel rising 200m above emerald jungle',
          description: 'The iconic 5th-century palace in the sky with world-renowned frescoes, landscaped water gardens, and 360-degree jungle vistas.',
          coverImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'January to April',
          averageTemp: '30°C',
          idealDays: 3,
          vibes: ['Historic', 'Cultural', 'Scenic'],
          highlights: ['Lion Rock Summit', 'Water Gardens', 'Pidurangala Rock Sunrise'],
          foodTypes: ['Village Curry Buffet', 'Kottu Roti', 'Woodapple Juice'],
          matchScore: 94,
          matchReason: 'A wonder of ancient royal engineering embedded deep in tropical forests.',
        },
        {
          id: 'astra-bentota-lagoon',
          name: 'Bentota Beach & River',
          country: 'Sri Lanka',
          continent: 'Asia',
          tagline: 'Golden sun-drenched sands & tranquil mangrove lagoons',
          description: 'A luxurious coastal haven on the southwestern shore, beloved for tranquil waters, river boat safaris, and sea turtle conservation.',
          coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'November to April',
          averageTemp: '28°C',
          idealDays: 3,
          vibes: ['Chill & Coastal', 'Water Sports', 'Relaxed'],
          highlights: ['Madu Ganga River Safari', 'Bentota Golden Beach', 'Brief Garden'],
          foodTypes: ['Fresh Prawn Curry', 'Grilled Lobster', 'Tropical Mango Shakes'],
          matchScore: 93,
          matchReason: 'Effortless coastal relaxation with scenic calm-water lagoons.',
        },
        {
          id: 'astra-kandy-highlands',
          name: 'Kandy & Cultural Highlands',
          country: 'Sri Lanka',
          continent: 'Asia',
          tagline: 'Sacred mountain lake city & lush royal gardens',
          description: 'The spiritual heart of Sri Lanka, framed by misty mountain peaks, tea hills, and the sacred Temple of the Tooth Relic.',
          coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'December to April',
          averageTemp: '23°C',
          idealDays: 3,
          vibes: ['Cultural', 'Historic', 'Peace & Zen'],
          highlights: ['Temple of the Tooth', 'Peradeniya Royal Botanical Gardens', 'Kandy Lake Walk'],
          foodTypes: ['Traditional Kandy Thali', 'Avocado Juice', 'Ceylon Spiced Tea'],
          matchScore: 92,
          matchReason: 'Deep spiritual heritage in a serene, cooler highland climate.',
        },
        {
          id: 'astra-nilaveli-trinco',
          name: 'Nilaveli & Trincomalee',
          country: 'Sri Lanka',
          continent: 'Asia',
          tagline: 'Powder-soft white sands & vibrant offshore coral reefs',
          description: 'The jewel of Sri Lanka’s eastern shore with crystal-clear calm waters, vibrant marine parks, and secluded shores.',
          coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'May to September',
          averageTemp: '30°C',
          idealDays: 4,
          vibes: ['Beaches', 'Secluded', 'Snorkeling'],
          highlights: ['Pigeon Island National Park', 'Nilaveli White Beach', 'Koneswaram Temple'],
          foodTypes: ['East-Coast Crab Curry', 'Tamil Style Dosa', 'Fresh King Coconut'],
          matchScore: 91,
          matchReason: 'Unmatched pristine marine life and serene turquoise shallows.',
        },
      ];

      const rankedSriLanka = filterAndRankCuratedDestinations(sriLankaCurated, params);

      return {
        query: query || effectiveCustom || 'Sri Lanka Escapes',
        summary: generateSearchSummary(rankedSriLanka, params, 'Sri Lanka'),
        destinations: rankedSriLanka.slice(0, limit),
        suggestedFollowUps: generateFollowUps(rankedSriLanka, params),
        source: 'smart_taste_fallback',
      };
    }

    // Resolve any other custom destination (Paris, Goa, Kyoto, Swiss Alps, Dubai, Bali, Fiji, etc.)
    return resolveCustomLocationSearch(effectiveCustom, params);
  }

  // 2. Global / International Fallback (or unconstrained "Other" scope) (8 items)
  if (scope === 'international' || scope === 'custom') {
    const internationalCurated: Destination[] = [
      {
        id: 'astra-kyoto-japan',
        name: 'Kyoto',
        country: 'Japan',
        continent: 'Asia',
        tagline: 'Ancient Zen gardens & timeless bamboo groves',
        description: 'Immerse yourself in tranquil temple sanctuaries, centuries-old tea rituals, and ethereal bamboo paths.',
        coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'March to May & Oct to Nov',
        averageTemp: '18°C',
        idealDays: 5,
        vibes: ['Peace & Zen', 'Culture', 'Historic'],
        highlights: ['Arashiyama Bamboo Grove', 'Fushimi Inari Taisha', 'Gion District'],
        foodTypes: ['Kaiseki Multi-course', 'Matcha Tea', 'Artisanal Ramen'],
        matchScore: 98,
        matchReason: 'Harmonizes profound peaceful rhythm with unparalleled cultural architecture.',
      },
      {
        id: 'astra-amalfi-italy',
        name: 'Amalfi Coast',
        country: 'Italy',
        continent: 'Europe',
        tagline: 'Pastel cliffside villages over sapphire Mediterranean seas',
        description: 'Spectacular seaside roads, terraced lemon orchards, and coastal glamour etched into dramatic limestone cliffs.',
        coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'April to October',
        averageTemp: '24°C',
        idealDays: 4,
        vibes: ['Chill & Coastal', 'Romantic', 'Scenic'],
        highlights: ['Positano Cliffside', 'Path of the Gods', 'Ravello Gardens'],
        foodTypes: ['Fresh Seafood Pasta', 'Limoncello', 'Artisan Gelato'],
        matchScore: 97,
        matchReason: 'Offers breathtaking coastal elegance with sublime Mediterranean dining.',
      },
      {
        id: 'astra-bali-indonesia',
        name: 'Bali (Uluwatu & Ubud)',
        country: 'Indonesia',
        continent: 'Asia',
        tagline: 'Dramatic surf cliffs, sacred water temples & jungle retreats',
        description: 'From spiritual yoga sanctuaries in misty ravines to world-class clifftop ocean sunsets.',
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'May to September',
        averageTemp: '27°C',
        idealDays: 6,
        vibes: ['Coastal', 'Peace & Zen', 'Relaxed'],
        highlights: ['Uluwatu Sunset Temple', 'Tegallalang Rice Terraces', 'Padang Padang Beach'],
        foodTypes: ['Nasi Campur', 'Smoothie Bowls', 'Fresh Grilled Snapper'],
        matchScore: 96,
        matchReason: 'Seamlessly merges tropical ocean relaxation with vibrant island culture.',
      },
      {
        id: 'astra-banff-canada',
        name: 'Banff National Park',
        country: 'Canada',
        continent: 'North America',
        tagline: 'Glacial turquoise lakes surrounded by jagged peaks',
        description: 'Vast wilderness wonderlands, emerald lakes reflecting snow-capped summits, and crisp alpine air.',
        coverImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'June to September & Dec to March',
        averageTemp: '16°C',
        idealDays: 5,
        vibes: ['Mountains & Alpine', 'Lush Nature', 'Adventure'],
        highlights: ['Lake Louise', 'Moraine Lake', 'Banff Gondola'],
        foodTypes: ['Alberta Beef', 'Wild Salmon', 'Warm Maple Tarts'],
        matchScore: 95,
        matchReason: 'A majestic alpine escape for nature lovers and high-mountain explorers.',
      },
      {
        id: 'astra-santorini-greece',
        name: 'Santorini (Oia & Fira)',
        country: 'Greece',
        continent: 'Europe',
        tagline: 'Whitewashed Aegean villages perched over volcanic calderas',
        description: 'Iconic cobalt-blue domes, dramatic volcanic cliffs, and legendary golden sunsets overlooking the Aegean Sea.',
        coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'May to October',
        averageTemp: '25°C',
        idealDays: 4,
        vibes: ['Romantic', 'Chill & Coastal', 'Scenic'],
        highlights: ['Oia Sunset Castle', 'Red Beach', 'Caldera Boat Tour'],
        foodTypes: ['Greek Salad with Feta', 'Grilled Calamari', 'Assyrtiko Wine'],
        matchScore: 94,
        matchReason: 'Postcard-perfect Greek island romance with sublime seaside dining.',
      },
      {
        id: 'astra-swiss-alps-zermatt',
        name: 'Zermatt & Swiss Alps',
        country: 'Switzerland',
        continent: 'Europe',
        tagline: 'Matterhorn views, glacier trails & alpine luxury',
        description: 'A car-free alpine village nestled at the foot of the Matterhorn, offering pure mountain air and world-class scenery.',
        coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'December to April & July to Oct',
        averageTemp: '12°C',
        idealDays: 5,
        vibes: ['Mountains & Alpine', 'Luxury Escapes', 'Peace & Zen'],
        highlights: ['Gornergrat Railway', 'Matterhorn Glacier Paradise', 'Five Lakes Walk'],
        foodTypes: ['Cheese Fondue', 'Raclette', 'Swiss Chocolate'],
        matchScore: 93,
        matchReason: 'The world benchmark for dramatic alpine beauty and serene mountain retreats.',
      },
      {
        id: 'astra-phuket-krabi-thailand',
        name: 'Phuket & Krabi',
        country: 'Thailand',
        continent: 'Asia',
        tagline: 'Towering limestone karst cliffs rising from emerald seas',
        description: 'Vibrant Andaman coast with hidden sea caves, soft white sands, and lively night markets.',
        coverImage: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'November to April',
        averageTemp: '29°C',
        idealDays: 5,
        vibes: ['Chill & Coastal', 'Street Food', 'Tropical'],
        highlights: ['Railay Beach', 'Phi Phi Islands', 'Old Phuket Town'],
        foodTypes: ['Pad Thai', 'Tom Yum Goong', 'Mango Sticky Rice'],
        matchScore: 92,
        matchReason: 'Tropical ocean splendor paired with iconic Thai night-market cuisine.',
      },
      {
        id: 'astra-queenstown-nz',
        name: 'Queenstown',
        country: 'New Zealand',
        continent: 'Oceania',
        tagline: 'Dramatic fiord peaks over crystal alpine waters',
        description: 'The Southern Hemisphere’s scenic adventure capital, surrounded by the Remarkables mountains and Lake Wakatipu.',
        coverImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'December to March',
        averageTemp: '18°C',
        idealDays: 5,
        vibes: ['Mountains & Alpine', 'High Adventure', 'Scenic'],
        highlights: ['Milford Sound Day Tour', 'Skyline Gondola', 'Lake Wakatipu Cruise'],
        foodTypes: ['Fergburger', 'Central Otago Pinot Noir', 'Lamb Cutlets'],
        matchScore: 91,
        matchReason: 'Pristine wilderness landscapes with thrilling mountain panoramas.',
      },
      {
        id: 'astra-bali-tropical',
        name: 'Bali (Uluwatu & Canggu)',
        country: 'Indonesia',
        continent: 'Asia',
        tagline: 'World-class surf breaks, cliff temples & tropical beaches',
        description: 'An idyllic Indonesian island paradise famed for dramatic sea temples, golden sunset beaches, and vibrant beach club culture.',
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'April to October',
        averageTemp: '28°C',
        idealDays: 6,
        vibes: ['Chill & Coastal', 'Beaches', 'Water Sports'],
        highlights: ['Uluwatu Cliff Temple', 'Padang Padang Beach', 'Echo Beach Sunset'],
        foodTypes: ['Nasi Goreng', 'Fresh Grilled Snapper', 'Açaí Bowls'],
        matchScore: 94,
        matchReason: 'Tropical ocean sunsets, azure surf beaches, and relaxed island rhythms.',
      },
      {
        id: 'astra-rome-eternal',
        name: 'Rome',
        country: 'Italy',
        continent: 'Europe',
        tagline: 'Ancient imperial ruins, Baroque piazzas & open-air history',
        description: 'The Eternal City where classical antiquity meets vibrant street life, historic cobblestones, and world-class trattorias.',
        coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'April to June & Sept to Oct',
        averageTemp: '22°C',
        idealDays: 4,
        vibes: ['Historic Old Towns', 'Vibrant & Cultural', 'Architecture'],
        highlights: ['The Colosseum', 'Pantheon & Trevi Fountain', 'Vatican Museums'],
        foodTypes: ['Cacio e Pepe', 'Roman Pizza al Taglio', 'Artisan Tiramisù'],
        matchScore: 95,
        matchReason: 'Millennia of world-heritage architecture, iconic monuments, and culinary masters.',
      },
    ];

    const rankedInternational = filterAndRankCuratedDestinations(internationalCurated, params);

    return {
      query: query || (scope === 'custom' ? 'Custom Global Escapes' : 'International Escapes'),
      summary: generateSearchSummary(
        rankedInternational,
        params,
        scope === 'custom' ? 'custom global destinations' : 'global destinations'
      ),
      destinations: rankedInternational.slice(0, limit),
      suggestedFollowUps: generateFollowUps(rankedInternational, params),
      source: 'smart_taste_fallback',
    };
  }

  const loc = detectStateAndCountry(origin);

  // 3. Nearby (< 200 km from origin) (8 items)
  if (scope === 'nearby_200km') {
    if (loc.state === 'Kerala') {
      const keralaNearby: Destination[] = [
        {
          id: 'dest_kerala_munnar',
          name: 'Munnar',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Misty tea slopes & highest peaks of South India (~125 km)',
          description: 'Kerala’s premier mountain haven, blanketed in emerald tea carpet slopes, misty valleys, and cool Western Ghats breezes.',
          coverImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'September to March',
          averageTemp: '19°C',
          idealDays: 3,
          vibes: ['Mountains & Alpine', 'Peace & Zen', 'Scenic'],
          highlights: ['Eravikulam National Park', 'Mattupetty Dam', 'Top Station Sunset'],
          foodTypes: ['Appam with Vegetable Stew', 'Kerala Parotta & Roast', 'Fresh Cardamom Tea'],
          matchScore: 98,
          matchReason: 'Cool mountain mist, lush tea estates, and spectacular high-altitude trekking within easy reach.',
        },
        {
          id: 'dest_kerala_alleppey',
          name: 'Alleppey (Alappuzha)',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Iconic palm-fringed backwaters & tranquil houseboat cruises (~55 km)',
          description: 'Known as the Venice of the East, famed for serene canals, coconut palm shores, and overnight luxury kettuvalam stays.',
          coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'October to March',
          averageTemp: '28°C',
          idealDays: 2,
          vibes: ['Chill & Coastal', 'Peace & Zen', 'Relaxed'],
          highlights: ['Overnight Houseboat Cruise', 'Vembanad Lake Sunset', 'Marari Beach Relaxation'],
          foodTypes: ['Karimeen Pollichathu', 'Kerala Fish Curry Meals', 'Fresh Toddy & Tapioca'],
          matchScore: 97,
          matchReason: 'Tranquil emerald backwaters and world-renowned slow houseboat journeys within ~55 km.',
        },
        {
          id: 'dest_kerala_athirappilly',
          name: 'Athirappilly & Vazhachal',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'The Niagara of South India & emerald rainforest waterfalls (~68 km)',
          description: 'Kerala’s most majestic 80-foot waterfall roaring into dense Sholayar rainforests, featured in world-famous cinema.',
          coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'June to January',
          averageTemp: '26°C',
          idealDays: 2,
          vibes: ['Lush Nature', 'Scenic', 'Adventure'],
          highlights: ['Athirappilly Falls Base Walk', 'Vazhachal Forest Rapids', 'Thumboormuzhy Hanging Bridge'],
          foodTypes: ['Traditional Kerala Sadya', 'Puttu & Kadala Curry', 'Tender Coconut'],
          matchScore: 96,
          matchReason: 'Thunderous rainforest waterfalls and lush jungle riverbanks within ~70 km drive.',
        },
        {
          id: 'dest_kerala_vagamon',
          name: 'Vagamon & Pine Forests',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Misty pine valleys, tea meadows & paragliding ridges (~100 km)',
          description: 'An offbeat hillside sanctuary free from commercial bustle, famous for whispering pine forests and rolling grassy knolls.',
          coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'September to May',
          averageTemp: '20°C',
          idealDays: 2,
          vibes: ['Mountains & Alpine', 'Peace & Zen', 'Secluded'],
          highlights: ['Vagamon Pine Forest Walk', 'Kurisumala Ashram Ridge', 'Marmala Waterfalls'],
          foodTypes: ['Hot Kerala Masala Tea', 'Kerala Beef / Mushroom Fry', 'Cassava Chips'],
          matchScore: 95,
          matchReason: 'Untouched hill station tranquility with whisper-quiet pine glades and cool winds.',
        },
        {
          id: 'dest_kerala_thekkady',
          name: 'Thekkady & Periyar',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Spice hills & wild elephant sanctuary lake safaris (~145 km)',
          description: 'Dense cardamom forest sanctuaries surrounding the serene Periyar lake, home to wild elephants, tigers, and spice gardens.',
          coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'September to April',
          averageTemp: '23°C',
          idealDays: 3,
          vibes: ['Lush Nature', 'Wildlife Safari', 'Peace & Zen'],
          highlights: ['Periyar Lake Boat Safari', 'Organic Spice Plantation Tour', 'Bamboo Rafting Trek'],
          foodTypes: ['Spiced Pepper Roast', 'Kerala Banana Fritters', 'Black Pepper Chicken'],
          matchScore: 94,
          matchReason: 'Vibrant spice hill aroma and breathtaking lake safari wildlife encounters.',
        },
        {
          id: 'dest_kerala_kumarakom',
          name: 'Kumarakom',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Lakeside bird sanctuaries & heritage lagoon resorts (~48 km)',
          description: 'A cluster of picturesque islands on Vembanad Lake, home to migratory birds, lotus canals, and Ayurveda retreats.',
          coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'November to February',
          averageTemp: '27°C',
          idealDays: 2,
          vibes: ['Chill & Coastal', 'Peace & Zen', 'Luxury Escapes'],
          highlights: ['Kumarakom Bird Sanctuary', 'Sunset Shikara Boat Ride', 'Canal Village Life Walk'],
          foodTypes: ['Fresh Pearl Spot Fry', 'Coconut Duck Roast', 'Kerala Payasam'],
          matchScore: 93,
          matchReason: 'Ultimate peaceful lagoon luxury and avian sanctuary serenity right at your doorstep.',
        },
        {
          id: 'dest_kerala_marari',
          name: 'Marari Beach',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Golden sleepy fishing shores & swaying coconut groves (~42 km)',
          description: 'An idyllic, unhurried coastal village where traditional fishing boats line endless golden sands under swaying palm fronds.',
          coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'October to April',
          averageTemp: '28°C',
          idealDays: 2,
          vibes: ['Chill & Coastal', 'Secluded', 'Peace & Zen'],
          highlights: ['Marari Golden Beach Walk', 'Fishermen Morning Catch', 'Ayurvedic Wellness Spa'],
          foodTypes: ['Grilled Calamari', 'Kerala Coastal Curry', 'Fresh Sweet Coconut'],
          matchScore: 92,
          matchReason: 'Uncrowded, postcard-perfect Arabian Sea beach escape within 45 minutes.',
        },
        {
          id: 'dest_kerala_varkala',
          name: 'Varkala & Papanasam Beach',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Dramatic red laterite cliffs over the Arabian Sea (~160 km)',
          description: 'A world-famous coastal cliff strip packed with cliffside cafes, Tibetan craft markets, yoga shalas, and sacred beach springs.',
          coverImage: 'https://images.unsplash.com/photo-1510414842594-a61782153f5b?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'October to March',
          averageTemp: '28°C',
          idealDays: 3,
          vibes: ['Chill & Coastal', 'Culinary', 'Vibrant & Cultural'],
          highlights: ['North Cliff Sunset Walk', 'Papanasam Beach Holy Springs', 'Kapil Lake Coastal Boating'],
          foodTypes: ['Tandoori Kingfish', 'Avocado Smoothies', 'Kerala Prawn Masala'],
          matchScore: 91,
          matchReason: 'Iconic cliff-edge sunsets and vibrant seaside cafe culture overlooking the sea.',
        },
      ];

      const rankedNearbyKerala = filterAndRankCuratedDestinations(keralaNearby, params);

      return {
        query: query || 'Weekend Trips Near You in Kerala',
        summary: generateSearchSummary(rankedNearbyKerala, params, 'Kerala road trip distance'),
        destinations: rankedNearbyKerala.slice(0, limit),
        suggestedFollowUps: generateFollowUps(rankedNearbyKerala, params),
        source: 'smart_taste_fallback',
      };
    }

    const nearbyCurated: Destination[] = [
      {
        id: 'astra-nandi-hills',
        name: 'Nandi Hills & Skandagiri',
        country: 'India',
        continent: 'Asia',
        tagline: 'Sunrise cloud beds & historic hill fort ruins (~60 km)',
        description: 'Bengaluru’s favorite mountain sunrise escape, featuring ancient Tipu Sultan ramparts and tranquil morning mist.',
        coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'Year-round (Best: Oct to March)',
        averageTemp: '20°C',
        idealDays: 2,
        vibes: ['Mountains & Alpine', 'Peace & Zen', 'Scenic'],
        highlights: ['Tipu’s Drop Sunrise', 'Amrita Sarovar Lake', 'Bhoga Nandeeshwara Temple'],
        foodTypes: ['South Indian Filter Coffee', 'Masala Dosa', 'Fresh Sugarcane Juice'],
        matchScore: 98,
        matchReason: 'A quick 1-hour mountain getaway for morning cloud beds and cool hill breezes.',
      },
      {
        id: 'astra-bheemeshwari-cauvery',
        name: 'Bheemeshwari & Cauvery Sanctuary',
        country: 'India',
        continent: 'Asia',
        tagline: 'Riverbank camps & lush forest wildlife (~100 km)',
        description: 'Tucked along the Cauvery riverbanks, ideal for coracle boat rides, riverside campfires, and bird watching.',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'August to February',
        averageTemp: '26°C',
        idealDays: 2,
        vibes: ['Lush Nature', 'Adventure', 'Peace & Zen'],
        highlights: ['Coracle Boating on Cauvery', 'Jungle Camping', 'Muthathi Forest Walk'],
        foodTypes: ['Country Chicken Curry', 'Ragi Mudde with Saaru', 'Fresh Coconut'],
        matchScore: 97,
        matchReason: 'Peaceful river nature retreat away from city traffic within a 2-hour drive.',
      },
      {
        id: 'astra-shivanasamudra-falls',
        name: 'Shivanasamudra Falls & Talakadu',
        country: 'India',
        continent: 'Asia',
        tagline: 'Roaring twin waterfalls & sand-covered temples (~130 km)',
        description: 'The dramatic twin cascades of Gaganachukki and Bharachukki, paired with the mysterious buried temples of Talakadu.',
        coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'July to December',
        averageTemp: '25°C',
        idealDays: 2,
        vibes: ['Scenic', 'Historic', 'Lush Nature'],
        highlights: ['Gaganachukki Waterfall Viewpoint', 'Bharachukki Falls', 'Talakadu Sand Temples'],
        foodTypes: ['Freshwater Fish Fry', 'Karnataka Thali', 'Tender Coconut'],
        matchScore: 96,
        matchReason: 'Spectacular thunderous waterfalls and tranquil sand-dune heritage.',
      },
      {
        id: 'astra-mysore-heritage',
        name: 'Mysore & Srirangapatna',
        country: 'India',
        continent: 'Asia',
        tagline: 'Illuminated royal palaces & fragrant sandalwood (~145 km)',
        description: 'The grand royal capital of Karnataka, boasting the world-famous illuminated Amba Vilas Palace and Chamundi Hills.',
        coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'October to March',
        averageTemp: '24°C',
        idealDays: 3,
        vibes: ['Historic Old Towns', 'Vibrant & Cultural', 'Architecture'],
        highlights: ['Mysore Palace Grand Tour', 'Chamundi Hill Temple', 'Brindavan Gardens'],
        foodTypes: ['Mysore Pak Sweets', 'Mysore Masala Dosa', 'Mylari Dosa'],
        matchScore: 95,
        matchReason: 'A regal royal weekend break with world-class heritage architecture.',
      },
      {
        id: 'astra-yelagiri-hills',
        name: 'Yelagiri Hills',
        country: 'India',
        continent: 'Asia',
        tagline: 'Quiet orchard hill slopes & serene lake boating (~150 km)',
        description: 'A cozy hill station nestled across the Tamil Nadu border, featuring quiet hairpins, rose gardens, and calm boat lakes.',
        coverImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'November to February',
        averageTemp: '22°C',
        idealDays: 2,
        vibes: ['Mountains & Alpine', 'Peace & Zen', 'Relaxed'],
        highlights: ['Punganur Lake Boating', 'Swamimalai Hill Trek', 'Jalagamparai Waterfalls'],
        foodTypes: ['Chettinad Pepper Chicken', 'Local Mountain Honey', 'Idli & Vada'],
        matchScore: 94,
        matchReason: 'Uncrowded, relaxing hill escape perfect for couples and families.',
      },
      {
        id: 'astra-lepakshi-heritage',
        name: 'Lepakshi & Heritage Trail',
        country: 'India',
        continent: 'Asia',
        tagline: 'Monolithic hanging pillars & Vijayanagara stone craft (~120 km)',
        description: 'A mind-bending architectural marvel with the famous hanging pillar, colossal Nandi bull sculpture, and historic murals.',
        coverImage: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'October to March',
        averageTemp: '27°C',
        idealDays: 1,
        vibes: ['Historic Old Towns', 'Architecture', 'Culture'],
        highlights: ['Veerabhadra Temple Hanging Pillar', 'Monolithic Nandi', 'Nagalinga Statue'],
        foodTypes: ['Andhra Spicy Meals', 'Pesarattu Dosa', 'Filter Coffee'],
        matchScore: 93,
        matchReason: 'Incredible day trip for history and ancient stone architecture enthusiasts.',
      },
      {
        id: 'astra-ramanagara-hills',
        name: 'Ramanagara & SRS Boulder Hills',
        country: 'India',
        continent: 'Asia',
        tagline: 'Iconic silk towns & world-famous granite boulder climbs (~50 km)',
        description: 'Famed for giant granite monoliths, bouldering, and bird sanctuaries, just 45 minutes from South Bengaluru.',
        coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'September to February',
        averageTemp: '25°C',
        idealDays: 1,
        vibes: ['Adventure', 'Nature', 'Rock Climbing'],
        highlights: ['Ramadevara Betta Sanctuary', 'SRS Hills Trek', 'Vulture Conservation Reserve'],
        foodTypes: ['Kamath Lokaruchi Thatte Idli', 'Bisi Bele Bath', 'Maddur Vada'],
        matchScore: 92,
        matchReason: 'Super-close adventure and high-energy trekking escape.',
      },
      {
        id: 'astra-kabini-nagarhole',
        name: 'Kabini & Nagarhole River Fringe',
        country: 'India',
        continent: 'Asia',
        tagline: 'Legendary leopard waters & serene lake jungle resorts (~210 km)',
        description: 'One of Asia’s premier wildlife sanctuaries, where black panthers, wild elephants, and tigers gather by the backwaters.',
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'October to May',
        averageTemp: '24°C',
        idealDays: 3,
        vibes: ['Lush Nature', 'Marine Wildlife', 'Luxury Escapes'],
        highlights: ['Boat Safari on Kabini River', 'Jungle Jeep Safari', 'Coracle Sunset Rides'],
        foodTypes: ['South Indian Buffet', 'Coorg Spiced Pork/Vegetables', 'Fresh Bakes'],
        matchScore: 91,
        matchReason: 'Unmatched luxury wildlife safari experience right on the backwaters.',
      },
    ];

    const rankedNearby = filterAndRankCuratedDestinations(nearbyCurated, params);

    return {
      query: query || `Weekend Trips Near ${loc.state || 'Bengaluru'}`,
      summary: generateSearchSummary(rankedNearby, params, `${loc.state || 'Bengaluru'} road trip distance`),
      destinations: rankedNearby.slice(0, limit),
      suggestedFollowUps: generateFollowUps(rankedNearby, params),
      source: 'smart_taste_fallback',
    };
  }

  // 4. In-State Fallback (8 items)
  if (scope === 'in_state') {
    if (loc.state === 'Kerala') {
      const keralaInState: Destination[] = [
        {
          id: 'dest_kerala_munnar',
          name: 'Munnar',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Misty tea slopes & highest peaks of South India',
          description: 'Kerala’s most iconic mountain jewel, blanketed in emerald tea carpet slopes, misty valleys, and cool Western Ghats breezes.',
          coverImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'September to March',
          averageTemp: '19°C',
          idealDays: 3,
          vibes: ['Mountains & Alpine', 'Peace & Zen', 'Scenic'],
          highlights: ['Eravikulam National Park', 'Mattupetty Dam', 'Top Station Sunset'],
          foodTypes: ['Appam with Vegetable Stew', 'Kerala Parotta & Roast', 'Fresh Cardamom Tea'],
          matchScore: 98,
          matchReason: 'Cool mountain mist, lush tea estates, and spectacular high-altitude trekking strictly in Kerala.',
        },
        {
          id: 'dest_kerala_alleppey',
          name: 'Alleppey (Alappuzha)',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Iconic palm-fringed backwaters & tranquil houseboat cruises',
          description: 'Known as the Venice of the East, famed for serene canals, coconut palm shores, and overnight luxury kettuvalam stays.',
          coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'October to March',
          averageTemp: '28°C',
          idealDays: 3,
          vibes: ['Chill & Coastal', 'Peace & Zen', 'Relaxed'],
          highlights: ['Overnight Houseboat Cruise', 'Vembanad Lake Sunset', 'Marari Beach Relaxation'],
          foodTypes: ['Karimeen Pollichathu', 'Kerala Fish Curry Meals', 'Fresh Toddy & Tapioca'],
          matchScore: 97,
          matchReason: 'Tranquil emerald backwaters and world-renowned slow houseboat journeys strictly in Kerala.',
        },
        {
          id: 'dest_kerala_wayanad',
          name: 'Wayanad',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Misty rainforests, ancient cave art & spice estates',
          description: 'A verdant mountain plateau nestled high in the Western Ghats, famed for Neolithic Edakkal caves, waterfalls, and wildlife.',
          coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'October to May',
          averageTemp: '21°C',
          idealDays: 4,
          vibes: ['Lush Nature', 'Mountains & Alpine', 'High Adventure'],
          highlights: ['Edakkal Prehistoric Caves', 'Chembra Heart-Shaped Lake Trek', 'Banasura Sagar Dam'],
          foodTypes: ['Wayanad Bamboo Biryani', 'Malabar Parotta', 'Fresh Estate Honey'],
          matchScore: 96,
          matchReason: 'Untamed mountain rainforests and ancient cave heritage strictly in Kerala.',
        },
        {
          id: 'dest_kerala_varkala',
          name: 'Varkala & Papanasam Beach',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Dramatic red laterite cliffs over the Arabian Sea',
          description: 'A world-famous coastal cliff strip packed with bohemian cliffside cafes, Tibetan craft markets, yoga shalas, and natural spring waters.',
          coverImage: 'https://images.unsplash.com/photo-1510414842594-a61782153f5b?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'October to March',
          averageTemp: '28°C',
          idealDays: 3,
          vibes: ['Chill & Coastal', 'Culinary', 'Peace & Zen'],
          highlights: ['North Cliff Sunset Walk', 'Papanasam Beach Holy Springs', 'Kapil Lake Coastal Boating'],
          foodTypes: ['Tandoori Kingfish', 'Avocado Smoothies', 'Kerala Prawn Masala'],
          matchScore: 95,
          matchReason: 'Iconic cliff-edge sunsets and vibrant seaside cafe culture strictly in Kerala.',
        },
        {
          id: 'dest_kerala_thekkady',
          name: 'Thekkady & Periyar Sanctuary',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Cardamom hills & wild elephant sanctuary lake safaris',
          description: 'Dense cardamom forest sanctuaries surrounding the serene Periyar lake, home to wild elephants, tigers, and organic spice plantations.',
          coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'September to April',
          averageTemp: '23°C',
          idealDays: 3,
          vibes: ['Lush Nature', 'Wildlife Safari', 'Peace & Zen'],
          highlights: ['Periyar Lake Boat Safari', 'Organic Spice Plantation Tour', 'Bamboo Rafting Trek'],
          foodTypes: ['Spiced Pepper Roast', 'Kerala Banana Fritters', 'Black Pepper Chicken'],
          matchScore: 94,
          matchReason: 'Vibrant spice hill aroma and breathtaking lake safari wildlife encounters strictly in Kerala.',
        },
        {
          id: 'dest_kerala_kovalam',
          name: 'Kovalam Beach',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Crescent golden beaches & iconic striped cliff lighthouse',
          description: 'Kerala’s original world-renowned beach destination, featuring three adjacent crescent beaches separated by rocky headlands.',
          coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'November to February',
          averageTemp: '29°C',
          idealDays: 3,
          vibes: ['Chill & Coastal', 'Relaxed', 'Seafood'],
          highlights: ['Lighthouse Beach Sunset', 'Hawa Beach Catamaran Ride', 'Samudra Beach Calm Shacks'],
          foodTypes: ['Grilled Jumbo Prawns', 'Kerala Crab Curry', 'Fresh King Coconut'],
          matchScore: 93,
          matchReason: 'Classic golden crescent beaches and warm Arabian Sea waters strictly in Kerala.',
        },
        {
          id: 'dest_kerala_kumarakom',
          name: 'Kumarakom',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Lakeside bird sanctuaries & heritage lagoon resorts',
          description: 'A cluster of picturesque islands on Vembanad Lake, home to migratory birds, lotus canals, and world-class Ayurveda wellness retreats.',
          coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'November to February',
          averageTemp: '27°C',
          idealDays: 2,
          vibes: ['Chill & Coastal', 'Peace & Zen', 'Luxury Escapes'],
          highlights: ['Kumarakom Bird Sanctuary', 'Sunset Shikara Boat Ride', 'Canal Village Life Walk'],
          foodTypes: ['Fresh Pearl Spot Fry', 'Coconut Duck Roast', 'Kerala Payasam'],
          matchScore: 92,
          matchReason: 'Ultimate peaceful lagoon luxury and avian sanctuary serenity strictly in Kerala.',
        },
        {
          id: 'dest_kerala_bekal',
          name: 'Bekal & Fort Coast',
          country: 'India',
          continent: 'Asia',
          state: 'Kerala',
          tagline: 'Colossal keyhole sea fort & golden North Kerala beaches',
          description: 'The largest and best-preserved fort in Kerala, rising directly from Arabian Sea surf with water gates, observation towers, and beach parks.',
          coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop',
          gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
          bestSeason: 'October to March',
          averageTemp: '28°C',
          idealDays: 3,
          vibes: ['Historic Old Towns', 'Scenic', 'Chill & Coastal'],
          highlights: ['Bekal Fort Ramparts', 'Kappil Beach Estuary', 'Nileshwaram Backwaters'],
          foodTypes: ['Malabar Biryani', 'Kallummakkaya (Mussels) Fry', 'Elaneer Payasam'],
          matchScore: 91,
          matchReason: 'Spectacular historic sea fort ramparts overlooking endless surf strictly in Kerala.',
        },
      ];

      const rankedInStateKerala = filterAndRankCuratedDestinations(keralaInState, params);

      return {
        query: query || 'In-State Kerala Escapes',
        summary: generateSearchSummary(rankedInStateKerala, params, 'Kerala in-state destinations'),
        destinations: rankedInStateKerala.slice(0, limit),
        suggestedFollowUps: generateFollowUps(rankedInStateKerala, params),
        source: 'smart_taste_fallback',
      };
    }

    const inStateCurated: Destination[] = [
      {
        id: 'astra-gokarna-karnataka',
        name: 'Gokarna',
        country: 'India',
        continent: 'Asia',
        tagline: 'Soulful cliffside beaches & sacred Shiva temples',
        description: 'Karnataka’s legendary coastal haven where rustic beach shacks meet secluded crescent coves.',
        coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'October to March',
        averageTemp: '28°C',
        idealDays: 4,
        vibes: ['Chill & Coastal', 'Peace & Zen', 'Secluded'],
        highlights: ['Om Beach', 'Kudle Beach Sunset', 'Half Moon Beach Hike'],
        foodTypes: ['Coastal Fish Curry', 'Nutella Crepes', 'Prawn Ghee Roast'],
        matchScore: 98,
        matchReason: 'The ultimate coastal retreat in Karnataka for relaxed beach days.',
      },
      {
        id: 'astra-coorg-madikeri',
        name: 'Coorg (Kodagu)',
        country: 'India',
        continent: 'Asia',
        tagline: 'Misty coffee plantations & aromatic spice estates',
        description: 'Known as the Scotland of India, blanketed in rolling emerald coffee estates and fragrant spice orchards.',
        coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'October to April',
        averageTemp: '20°C',
        idealDays: 3,
        vibes: ['Mountains & Alpine', 'Lush Nature', 'Peace & Zen'],
        highlights: ['Abbey Falls', 'Raja’s Seat Sunset', 'Dubare Elephant Camp'],
        foodTypes: ['Pandi Curry (or Mushroom Curry)', 'Akki Roti', 'Estate Filter Coffee'],
        matchScore: 97,
        matchReason: 'Cool mountain air, lush plantations, and cozy boutique estate stays.',
      },
      {
        id: 'astra-hampi-unesco',
        name: 'Hampi',
        country: 'India',
        continent: 'Asia',
        tagline: 'Surreal boulder landscapes & ancient imperial ruins',
        description: 'A UNESCO World Heritage marvel with colossal 14th-century stone palaces and Tungabhadra riverbanks.',
        coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'November to February',
        averageTemp: '26°C',
        idealDays: 4,
        vibes: ['Historic Old Towns', 'Vibrant & Cultural', 'Architecture'],
        highlights: ['Virupaksha Temple', 'Stone Chariot at Vijaya Vittala', 'Matanga Hill Sunrise'],
        foodTypes: ['Mango Tree Special Thali', 'Banana Flower Curry', 'Falafel Platter'],
        matchScore: 96,
        matchReason: 'Breathtaking open-air museum of ancient Vijayanagara grandeur.',
      },
      {
        id: 'astra-chikmagalur-peaks',
        name: 'Chikmagalur & Mullayanagiri',
        country: 'India',
        continent: 'Asia',
        tagline: 'Highest peak summits & origin of Indian coffee',
        description: 'Spectacular Western Ghats trekking trails, cascading waterfalls, and historic hillside shrines.',
        coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'September to March',
        averageTemp: '21°C',
        idealDays: 3,
        vibes: ['Mountains & Alpine', 'High Adventure', 'Scenic'],
        highlights: ['Mullayanagiri Peak Trek', 'Baba Budangiri', 'Hebbe Waterfalls'],
        foodTypes: ['Malanadu Akki Roti', 'Kaai Holige', 'Fresh Coffee Brew'],
        matchScore: 95,
        matchReason: 'High-mountain hiking with uninterrupted valley vistas.',
      },
      {
        id: 'astra-dandeli-river',
        name: 'Dandeli & Kali River',
        country: 'India',
        continent: 'Asia',
        tagline: 'Whitewater river rafting & dense hornbill canopies',
        description: 'An adrenaline-packed river sanctuary in North Karnataka with wild rapids, natural jacuzzis, and coracle rides.',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'October to May',
        averageTemp: '25°C',
        idealDays: 3,
        vibes: ['High Adventure', 'Lush Nature', 'Water Sports'],
        highlights: ['Kali River White Water Rafting', 'Syntheri Rocks', 'Jungle Night Safari'],
        foodTypes: ['North Karnataka Jowar Roti', 'Bamboo Shoot Curry', 'Spicy Fish Curry'],
        matchScore: 94,
        matchReason: 'Exciting river rapids and untamed wildlife jungle experiences.',
      },
      {
        id: 'astra-badami-caves',
        name: 'Badami, Aihole & Pattadakal',
        country: 'India',
        continent: 'Asia',
        tagline: 'Ancient sandstone cave temples carved into red cliffs',
        description: 'The cradle of Indian temple architecture, where 6th-century Chalukya artisans carved rock temples over Agastya Lake.',
        coverImage: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'November to February',
        averageTemp: '25°C',
        idealDays: 3,
        vibes: ['Historic Old Towns', 'Architecture', 'Culture'],
        highlights: ['Badami Cave Temples', 'Bhuthanatha Temple by the Lake', 'Pattadakal UNESCO Complex'],
        foodTypes: ['Sajje Rotti & Yennegai', 'Shenga Chutney', 'Belgaum Kunda'],
        matchScore: 93,
        matchReason: 'A world-class archaeological treasure trove in red sandstone hills.',
      },
      {
        id: 'astra-udupi-malpe',
        name: 'Udupi & Malpe Beach',
        country: 'India',
        continent: 'Asia',
        tagline: 'Basalt volcanic islands & legendary temple cuisine',
        description: 'Karnataka’s culinary capital with golden Malpe sands and boat excursions to unique basalt rock islands.',
        coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'October to March',
        averageTemp: '28°C',
        idealDays: 3,
        vibes: ['Chill & Coastal', 'Culinary', 'Historic'],
        highlights: ['St. Mary’s Basalt Island', 'Malpe Sea Walk', 'Krishna Temple'],
        foodTypes: ['Neer Dosa & Ghee Roast', 'Udupi Sambar', 'Mangalore Buns'],
        matchScore: 92,
        matchReason: 'Sensational coastal culinary delights with unique geological islands.',
      },
      {
        id: 'astra-bandipur-wildlife',
        name: 'Bandipur National Park',
        country: 'India',
        continent: 'Asia',
        tagline: 'Nilgiri biosphere tiger reserve & elephant trails',
        description: 'A protected forest sanctuary at the foothills of the Nilgiris, celebrated for tiger safaris and wild elephant herds.',
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
        gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        bestSeason: 'October to May',
        averageTemp: '24°C',
        idealDays: 2,
        vibes: ['Lush Nature', 'Wildlife Safari', 'Peace & Zen'],
        highlights: ['Open-top Jeep Jungle Safari', 'Himavad Gopalaswamy Betta', 'Elephant Spotting'],
        foodTypes: ['Karnataka Jungle Camp Meals', 'Ragi Roti', 'Local Honey'],
        matchScore: 91,
        matchReason: 'Prime tiger and elephant habitat within easy reach across Karnataka.',
      },
    ];

    const rankedInState = filterAndRankCuratedDestinations(inStateCurated, params);

    return {
      query: query || `In-State ${loc.state || 'Karnataka'} Escapes`,
      summary: generateSearchSummary(rankedInState, params, `${loc.state || 'Karnataka'} in-state destinations`),
      destinations: rankedInState.slice(0, limit),
      suggestedFollowUps: generateFollowUps(rankedInState, params),
      source: 'smart_taste_fallback',
    };
  }

  // 5. Interstate (Domestic India outside Karnataka) Fallback (8 items)
  const domesticCurated: Destination[] = [
    {
      id: 'astra-goa-south',
      name: 'South Goa',
      country: 'India',
      continent: 'Asia',
      tagline: 'Pristine quiet sands, heritage Portuguese villas & slow days',
      description: 'The peaceful soul of Goa, defined by coconut groves, uncrowded beaches, and laid-back seaside shacks.',
      coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'November to March',
      averageTemp: '28°C',
      idealDays: 4,
      vibes: ['Chill & Coastal', 'Relaxed', 'Seafood'],
      highlights: ['Palolem Beach', 'Cabo de Rama Fort', 'Cola Beach Lagoon'],
      foodTypes: ['Goan Fish Thali', 'Bebinca', 'Prawn Balchão'],
      matchScore: 98,
      matchReason: 'Exemplifies a relaxed coastal getaway with vibrant culinary heritage.',
    },
    {
      id: 'astra-munnar-kerala',
      name: 'Munnar & Tea Hills',
      country: 'India',
      continent: 'Asia',
      tagline: 'Rolling emerald tea hills shrouded in cool mountain mist',
      description: 'Endless carpets of tea estates, pristine mountain viewpoints, and crisp hill country tranquility.',
      coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'September to March',
      averageTemp: '19°C',
      idealDays: 3,
      vibes: ['Mountains & Alpine', 'Lush Nature', 'Peace & Zen'],
      highlights: ['Eravikulam National Park', 'Top Station', 'Tea Museum'],
      foodTypes: ['Appam with Stew', 'Cardamom Tea', 'Kerala Sadya'],
      matchScore: 97,
      matchReason: 'A sanctuary of cool mountain air and lush green serenity.',
    },
    {
      id: 'astra-jaipur-rajasthan',
      name: 'Jaipur',
      country: 'India',
      continent: 'Asia',
      tagline: 'Royal pink sandstone palaces & opulent desert heritage',
      description: 'The Pink City captivates with colossal hill forts, ornate royal palaces, and bustling artisanal bazaars.',
      coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to March',
      averageTemp: '22°C',
      idealDays: 3,
      vibes: ['Historic Old Towns', 'Vibrant & Cultural', 'Architecture'],
      highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace'],
      foodTypes: ['Dal Baati Churma', 'Ghewar', 'Pyaaz Kachori'],
      matchScore: 96,
      matchReason: 'Rich architectural grandeur meeting energetic cultural exploration.',
    },
    {
      id: 'astra-udaipur-rajasthan',
      name: 'Udaipur',
      country: 'India',
      continent: 'Asia',
      tagline: 'Shimmering lake palaces & romantic Rajput romance',
      description: 'Surrounded by the Aravalli hills, Udaipur charms travelers with mirrored waters and marble courtyards.',
      coverImage: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to March',
      averageTemp: '24°C',
      idealDays: 3,
      vibes: ['Historic Old Towns', 'Romantic', 'Scenic'],
      highlights: ['Lake Pichola Boat Ride', 'City Palace Complex', 'Jag Mandir'],
      foodTypes: ['Laal Maas', 'Kadhi Pakora', 'Gulab Jamun'],
      matchScore: 95,
      matchReason: 'Timeless lakeside romance and grand Rajasthani royalty.',
    },
    {
      id: 'astra-pondicherry-coastal',
      name: 'Pondicherry & White Town',
      country: 'India',
      continent: 'Asia',
      tagline: 'French colonial boulevards & bohemian coastal promenades',
      description: 'Mustard-yellow villas, chic artisan cafes, and peaceful spiritual enclaves along the Bay of Bengal.',
      coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to March',
      averageTemp: '27°C',
      idealDays: 3,
      vibes: ['Chill & Coastal', 'Culture', 'Artisan Cafes'],
      highlights: ['Rock Beach Promenade', 'Auroville Dome', 'French Quarter Heritage Walk'],
      foodTypes: ['Crepes & Croissants', 'French-Tamil Fusion Seafood', 'Café Au Lait'],
      matchScore: 94,
      matchReason: 'A vibrant French-Indian seaside escape with serene cafe culture.',
    },
    {
      id: 'astra-varkala-cliff',
      name: 'Varkala Cliff',
      country: 'India',
      continent: 'Asia',
      tagline: 'Red laterite cliffs jutting above the Arabian Sea',
      description: 'Dramatic cliffside paths lined with bohemian cafes overlooking golden sandy shores and natural mineral springs.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'November to March',
      averageTemp: '28°C',
      idealDays: 4,
      vibes: ['Chill & Coastal', 'Yoga & Wellness', 'Peace & Zen'],
      highlights: ['Varkala North Cliff Walk', 'Papanasam Beach', 'Janardhana Swami Temple'],
      foodTypes: ['Fresh Tandoori Fish', 'Ayurvedic Herb Bowls', 'Kerala Parotta'],
      matchScore: 93,
      matchReason: 'Unique ocean cliff panoramas and laid-back sunset vibes.',
    },
    {
      id: 'astra-manali-solang',
      name: 'Manali & Solang Valley',
      country: 'India',
      continent: 'Asia',
      tagline: 'Snow-clad Himalayan summits & roaring Beas river pines',
      description: 'A paradise for mountain adventurers, surrounded by towering deodar forests, snow passes, and alpine valleys.',
      coverImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to June',
      averageTemp: '14°C',
      idealDays: 5,
      vibes: ['Mountains & Alpine', 'High Adventure', 'Scenic'],
      highlights: ['Atal Tunnel & Sissu', 'Solang Valley Adventure', 'Old Manali Cafes'],
      foodTypes: ['Siddu with Ghee', 'Trout Fish', 'Thukpa & Momos'],
      matchScore: 92,
      matchReason: 'Unmatched high-altitude Himalayan beauty and fresh alpine air.',
    },
    {
      id: 'astra-havelock-andaman',
      name: 'Havelock Island (Swaraj Dweep)',
      country: 'India',
      continent: 'Asia',
      tagline: 'White sand beaches & crystal turquoise coral lagoons',
      description: 'Home to Asia’s best-rated beaches, vibrant coral reefs, and calm mangrove kayak lagoons.',
      coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to May',
      averageTemp: '28°C',
      idealDays: 5,
      vibes: ['Beaches', 'Secluded', 'Scuba Diving'],
      highlights: ['Radhanagar Beach Sunset', 'Elephant Beach Coral Snorkel', 'Kalapathar Beach'],
      foodTypes: ['Fresh Island Crab', 'Coconut Fish Curry', 'Tropical Fruit Platters'],
      matchScore: 91,
      matchReason: 'An exotic tropical island dreamscape within domestic borders.',
    },
    {
      id: 'astra-gokarna-karnataka',
      name: 'Gokarna',
      country: 'India',
      continent: 'Asia',
      state: 'Karnataka',
      tagline: 'Soulful cliffside beaches & sacred Shiva temples',
      description: 'Karnataka’s legendary coastal haven where rustic beach shacks meet secluded crescent coves.',
      coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to March',
      averageTemp: '28°C',
      idealDays: 4,
      vibes: ['Chill & Coastal', 'Peace & Zen', 'Beaches'],
      highlights: ['Om Beach', 'Kudle Beach Sunset', 'Half Moon Beach Hike'],
      foodTypes: ['Coastal Fish Curry', 'Nutella Crepes', 'Prawn Ghee Roast'],
      matchScore: 95,
      matchReason: 'The ultimate coastal retreat for relaxed, uncrowded beach days.',
    },
    {
      id: 'dest_kerala_kovalam',
      name: 'Kovalam Beach',
      country: 'India',
      continent: 'Asia',
      state: 'Kerala',
      tagline: 'Crescent golden beaches & iconic striped cliff lighthouse',
      description: 'Kerala’s original world-renowned beach destination, featuring three adjacent crescent beaches separated by rocky headlands.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'November to February',
      averageTemp: '29°C',
      idealDays: 3,
      vibes: ['Chill & Coastal', 'Beaches', 'Relaxed'],
      highlights: ['Lighthouse Beach Sunset', 'Hawa Beach Catamaran Ride', 'Samudra Beach Calm Shacks'],
      foodTypes: ['Grilled Jumbo Prawns', 'Kerala Crab Curry', 'Fresh King Coconut'],
      matchScore: 94,
      matchReason: 'Classic golden crescent beaches and warm Arabian Sea waters.',
    },
    {
      id: 'astra-udupi-malpe',
      name: 'Udupi & Malpe Beach',
      country: 'India',
      continent: 'Asia',
      state: 'Karnataka',
      tagline: 'Basalt volcanic islands & legendary temple cuisine',
      description: 'Karnataka’s culinary capital with golden Malpe sands and boat excursions to unique basalt rock islands.',
      coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to March',
      averageTemp: '28°C',
      idealDays: 3,
      vibes: ['Chill & Coastal', 'Beaches', 'Culinary'],
      highlights: ['St. Mary’s Basalt Island', 'Malpe Sea Walk', 'Krishna Temple'],
      foodTypes: ['Neer Dosa & Ghee Roast', 'Udupi Sambar', 'Mangalore Buns'],
      matchScore: 92,
      matchReason: 'Sensational coastal culinary delights with unique geological islands.',
    },
    {
      id: 'astra-coorg-madikeri',
      name: 'Coorg (Kodagu)',
      country: 'India',
      continent: 'Asia',
      state: 'Karnataka',
      tagline: 'Misty coffee plantations & aromatic spice estates',
      description: 'Known as the Scotland of India, blanketed in rolling emerald coffee estates and fragrant spice orchards.',
      coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to April',
      averageTemp: '20°C',
      idealDays: 3,
      vibes: ['Mountains & Alpine', 'Lush Nature', 'Peace & Zen'],
      highlights: ['Abbey Falls', 'Raja’s Seat Sunset', 'Dubare Elephant Camp'],
      foodTypes: ['Pandi Curry (or Mushroom Curry)', 'Akki Roti', 'Estate Filter Coffee'],
      matchScore: 96,
      matchReason: 'Cool mountain air, lush plantations, and cozy boutique estate stays.',
    },
    {
      id: 'astra-chikmagalur-peaks',
      name: 'Chikmagalur & Mullayanagiri',
      country: 'India',
      continent: 'Asia',
      state: 'Karnataka',
      tagline: 'Highest peak summits & origin of Indian coffee',
      description: 'Spectacular Western Ghats trekking trails, cascading waterfalls, and historic hillside shrines.',
      coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'September to March',
      averageTemp: '21°C',
      idealDays: 3,
      vibes: ['Mountains & Alpine', 'High Adventure', 'Scenic'],
      highlights: ['Mullayanagiri Peak Trek', 'Baba Budangiri', 'Hebbe Waterfalls'],
      foodTypes: ['Malanadu Akki Roti', 'Kaai Holige', 'Fresh Coffee Brew'],
      matchScore: 95,
      matchReason: 'High-mountain hiking with uninterrupted valley vistas.',
    },
    {
      id: 'dest_kerala_wayanad',
      name: 'Wayanad & Ghat Peaks',
      country: 'India',
      continent: 'Asia',
      state: 'Kerala',
      tagline: 'Misty cloud forests, spice mountains & prehistoric edakkal caves',
      description: 'High-altitude Western Ghats plateau filled with mist-covered mountain peaks and sprawling tea estates.',
      coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to May',
      averageTemp: '22°C',
      idealDays: 3,
      vibes: ['Mountains & Alpine', 'Lush Nature', 'Scenic'],
      highlights: ['Chembra Peak Heart Lake Trek', 'Edakkal Caves Prehistoric Petroglyphs', 'Banasura Sagar Dam'],
      foodTypes: ['Malabar Bamboo Biryani', 'Puttu with Kadala Curry', 'Herbal Wayanad Coffee'],
      matchScore: 94,
      matchReason: 'High-altitude cloud forests and heart-lake mountain hikes.',
    },
    {
      id: 'astra-hampi-unesco',
      name: 'Hampi',
      country: 'India',
      continent: 'Asia',
      state: 'Karnataka',
      tagline: 'Surreal boulder landscapes & ancient imperial ruins',
      description: 'A UNESCO World Heritage marvel with colossal 14th-century stone palaces and Tungabhadra riverbanks.',
      coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'November to February',
      averageTemp: '26°C',
      idealDays: 4,
      vibes: ['Historic Old Towns', 'Vibrant & Cultural', 'Architecture'],
      highlights: ['Virupaksha Temple', 'Stone Chariot at Vijaya Vittala', 'Matanga Hill Sunrise'],
      foodTypes: ['Mango Tree Special Thali', 'Banana Flower Curry', 'Falafel Platter'],
      matchScore: 96,
      matchReason: 'Breathtaking open-air museum of ancient Vijayanagara grandeur.',
    },
    {
      id: 'dest_kerala_alleppey',
      name: 'Alleppey (Alappuzha)',
      country: 'India',
      continent: 'Asia',
      state: 'Kerala',
      tagline: 'Iconic palm-fringed backwaters & tranquil houseboat cruises',
      description: 'Known as the Venice of the East, famed for serene canals, coconut palm shores, and overnight luxury kettuvalam stays.',
      coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to March',
      averageTemp: '28°C',
      idealDays: 2,
      vibes: ['Lush Nature', 'Chill & Coastal', 'Peace & Zen'],
      highlights: ['Overnight Kettuvalam Cruise', 'Vembanad Lake Sunset', 'Kuttanad Below-Sea-Level Paddy Walk'],
      foodTypes: ['Karimeen Pollichathu', 'Kerala Red Rice with Fish Curry', 'Banana Fritters'],
      matchScore: 95,
      matchReason: 'Iconic serene backwater canals and coconut lagoon houseboats.',
    },
    {
      id: 'astra-bandipur-wildlife',
      name: 'Bandipur National Park',
      country: 'India',
      continent: 'Asia',
      state: 'Karnataka',
      tagline: 'Nilgiri biosphere tiger reserve & elephant trails',
      description: 'A protected forest sanctuary at the foothills of the Nilgiris, celebrated for tiger safaris and wild elephant herds.',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
      gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
      bestSeason: 'October to May',
      averageTemp: '24°C',
      idealDays: 2,
      vibes: ['Lush Nature', 'Wildlife Safari', 'Peace & Zen'],
      highlights: ['Open-top Jeep Jungle Safari', 'Himavad Gopalaswamy Betta', 'Elephant Spotting'],
      foodTypes: ['Karnataka Jungle Camp Meals', 'Ragi Roti', 'Local Honey'],
      matchScore: 93,
      matchReason: 'Prime tiger and elephant habitat within lush forest canopies.',
    },
  ];

  const rankedDomestic = filterAndRankCuratedDestinations(domesticCurated, params);

  return {
    query: query || 'Handpicked Interstate Getaways',
    summary: generateSearchSummary(rankedDomestic, params, 'diverse Indian states'),
    destinations: rankedDomestic.slice(0, limit),
    suggestedFollowUps: generateFollowUps(rankedDomestic, params),
    source: 'smart_taste_fallback',
  };
}
