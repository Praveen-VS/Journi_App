import type {
  TripSummary,
  ItineraryDay,
  BudgetItem,
  BudgetCategorySummary,
  PackingItem,
  WeatherDay,
} from '@/types';
import { ALL_DESTINATIONS } from '@/constants/destinationsData';

export interface GeneratedTripPayload {
  trip: TripSummary;
  days: ItineraryDay[];
  budget: {
    totalEstimated: number;
    currency: string;
    categories: BudgetCategorySummary[];
    items: BudgetItem[];
  };
  packing: PackingItem[];
  weather: WeatherDay[];
  source: 'gemini' | 'internal_engine';
}

interface DestinationProfile {
  name: string;
  country: string;
  gradient: string;
  coverImage: string;
  currency: string;
  landmarks: string[];
  cuisines: string[];
  neighborhoods: string[];
  vibes: string[];
}

const DESTINATION_CATALOG: Record<string, DestinationProfile> = {
  kyoto: {
    name: 'Kyoto',
    country: 'Japan',
    gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: ['Fushimi Inari Taisha', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Kiyomizu-dera', 'Gion District'],
    cuisines: ['Kaiseki dining', 'Matcha parfait in Uji', 'Yudofu tofu feast', 'Pontocho alley ramen', 'Nishiki Market street bites'],
    neighborhoods: ['Higashiyama', 'Arashiyama', 'Gion', 'Central Kyoto', 'Kita Ward'],
    vibes: ['Cultural', 'Zen', 'Historic', 'Culinary'],
  },
  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    gradient: 'from-[#C2185B] via-[#FF4F7A] to-[#FFC83D]',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: ['Shibuya Crossing', 'Senso-ji Temple', 'Shinjuku Gyoen National Garden', 'TeamLab Planets', 'Meiji Jingu Shrine'],
    cuisines: ['Omakase sushi at Toyosu', 'Tsukemen ramen', 'Yakitori in Omoide Yokocho', 'Fluffy Japanese pancakes', 'Depachika desserts'],
    neighborhoods: ['Shibuya', 'Asakusa', 'Ginza', 'Harajuku', 'Roppongi'],
    vibes: ['Modern', 'Futuristic', 'Culinary', 'Shopping'],
  },
  paris: {
    name: 'Paris',
    country: 'France',
    gradient: 'from-[#5B0B24] via-[#FF4F7A] to-[#FF7A3D]',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: ['Eiffel Tower & Champ de Mars', 'Louvre Museum', 'Musée d’Orsay', 'Montmartre & Sacré-Cœur', 'Sainte-Chapelle'],
    cuisines: ['Warm butter croissants', 'Bistro duck confit', 'Artisan macarons', 'Wine & cheese tasting', 'Steak frites in Saint-Germain'],
    neighborhoods: ['Le Marais', 'Saint-Germain-des-Prés', 'Montmartre', 'Latin Quarter', 'Canal Saint-Martin'],
    vibes: ['Romantic', 'Artistic', 'Historic', 'Café Culture'],
  },
  rome: {
    name: 'Rome',
    country: 'Italy',
    gradient: 'from-[#FF7A3D] via-[#FF4F7A] to-[#FFC83D]',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: ['The Colosseum', 'Vatican Museums & Sistine Chapel', 'Trevi Fountain', 'The Pantheon', 'Roman Forum'],
    cuisines: ['Handmade Cacio e Pepe', 'Artisan Roman pizza al taglio', 'Espresso at Sant’Eustachio', 'Traditional tiramisù', 'Fried artichokes in Trastevere'],
    neighborhoods: ['Trastevere', 'Monti', 'Centro Storico', 'Testaccio', 'Prati'],
    vibes: ['Historic', 'Architectural', 'Romantic', 'Culinary'],
  },
  banff: {
    name: 'Banff & Lake Louise',
    country: 'Canada',
    gradient: 'from-[#5B0B24] via-[#0B4F5B] to-[#FF7A3D]',
    coverImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: ['Lake Louise shoreline', 'Moraine Lake sunrise', 'Banff Gondola & Sulphur Mountain', 'Johnston Canyon', 'Bow Lake'],
    cuisines: ['Wild berry pancakes', 'Canadian bison burgers', 'Alpine fondue', 'Maple smoked salmon', 'Trailside craft cider'],
    neighborhoods: ['Banff Townsite', 'Lake Louise Village', 'Canmore', 'Bow Valley Parkway'],
    vibes: ['Adventure', 'Alpine Nature', 'Serenity', 'Wilderness'],
  },
  amalfi: {
    name: 'Amalfi Coast',
    country: 'Italy',
    gradient: 'from-[#5B0B24] via-[#FF4F7A] to-[#FFC83D]',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: ['Positano cliffside beach', 'Ravello Villa Cimbrone gardens', 'Path of the Gods trail', 'Amalfi Duomo', 'Fiordo di Furore'],
    cuisines: ['Fresh seafood scialatielli', 'Limoncello tasting', 'Caprese salad with buffalo mozzarella', 'Delizia al limone pastries'],
    neighborhoods: ['Positano', 'Amalfi Town', 'Ravello', 'Praiano'],
    vibes: ['Romantic', 'Coastal Luxury', 'Scenic Views', 'Sunset'],
  },
  santorini: {
    name: 'Santorini',
    country: 'Greece',
    gradient: 'from-[#0B3C5D] via-[#FF4F7A] to-[#FFC83D]',
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: ['Oia Blue Domes & Caldera Sunset', 'Fira to Oia cliffside hike', 'Red Beach & Akrotiri', 'Santo Wines terrace'],
    cuisines: ['Grilled octopus', 'Greek salad with feta', 'Tomato gefthedes', 'Santorini Assyrtiko wine', 'Baklava gelato'],
    neighborhoods: ['Oia', 'Fira', 'Imerovigli', 'Megalochori'],
    vibes: ['Romantic', 'Island Escape', 'Sunset', 'Architectural'],
  },
  'swiss alps': {
    name: 'Swiss Alps (Zermatt & Interlaken)',
    country: 'Switzerland',
    gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FFC83D]',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: ['Matterhorn Glacier Paradise', 'Jungfraujoch Top of Europe', 'Gornergrat scenic railway', 'Lauterbrunnen valley waterfalls'],
    cuisines: ['Swiss cheese raclette', 'Traditional rösti with fried egg', 'Alpine fondue', 'Handcrafted Swiss pralines'],
    neighborhoods: ['Zermatt Village', 'Lauterbrunnen', 'Grindelwald', 'Wengen'],
    vibes: ['Alpine', 'Adventure', 'Scenic Train', 'Luxury Nature'],
  },
};

/**
 * Intelligent NLP Destination Extractor
 */
function extractDestination(prompt: string): DestinationProfile {
  const lower = prompt.toLowerCase();

  // First search comprehensive 100+ destinations database
  for (const dest of ALL_DESTINATIONS) {
    const rawId = dest.id.replace('dest_', '').replace(/_/g, ' ');
    if (lower.includes(dest.name.toLowerCase()) || lower.includes(rawId)) {
      return {
        name: dest.name,
        country: dest.country,
        gradient: dest.gradient || 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
        coverImage: dest.coverImage,
        currency: 'INR',
        landmarks: dest.highlights && dest.highlights.length > 0
          ? dest.highlights
          : [`${dest.name} Scenic Old Town`, `${dest.name} Viewpoint Promenade`, `${dest.name} Heritage Quarter`],
        cuisines: dest.cuisines && dest.cuisines.length > 0
          ? dest.cuisines
          : (dest.foodTypes || ['Local specialties', 'Fresh regional dishes', 'Market snacks']),
        neighborhoods: ['Historic Center', 'Scenic Waterfront', 'Artisan Quarter', 'Cultural District'],
        vibes: dest.vibes || ['Cultural', 'Scenic'],
      };
    }
  }

  for (const [key, profile] of Object.entries(DESTINATION_CATALOG)) {
    if (lower.includes(key)) {
      return profile;
    }
  }

  // Regex attempt to find "... to [Destination]" or "... in [Destination]"
  const match = prompt.match(/\b(?:to|in|visit|explore|trip for|travel to)\s+([A-Z][a-zA-Z\s]{2,20})/i);
  const detectedName = match ? match[1].trim() : 'Kyoto';

  return {
    name: detectedName,
    country: 'Travel Destination',
    gradient: 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
    currency: 'INR',
    landmarks: [
      `${detectedName} Old Quarter & Scenic Plaza`,
      `${detectedName} Grand Panorama Viewpoint`,
      `${detectedName} Botanical Gardens & Promenade`,
      `${detectedName} Historic Heritage Sanctuary`,
      `${detectedName} Golden Hour Waterfront`,
    ],
    cuisines: [
      'Locally sourced morning pastries & roast coffee',
      'Traditional chef table tasting menu',
      'Artisan street food market specialties',
      'Sunset rooftop tapas and handcrafted mocktails',
    ],
    neighborhoods: ['Historic Center', 'Artisan Quarter', 'Riverside Promenade', 'Cultural District'],
    vibes: ['Exploration', 'Scenic', 'Cultural'],
  };
}

/**
 * Internal Heuristic Trip Planner in Indian Rupees (INR - ₹)
 */
export function generateFallbackTripPlan(params: {
  prompt: string;
  days?: number;
  vibe?: string;
  budgetTier?: string;
  companion?: string;
}): GeneratedTripPayload {
  const daysCount = Math.min(Math.max(params.days || 5, 1), 14);
  const dest = extractDestination(params.prompt);
  const vibe = params.vibe || 'Cultural';
  const budgetTier = params.budgetTier || 'Moderate';
  const companion = params.companion || 'Couple';

  const budgetMultiplier = budgetTier === 'Luxury Escapes' ? 2.2 : budgetTier === 'Budget Friendly' ? 0.65 : 1.0;
  const companionMultiplier = companion === 'Solo' ? 1.0 : companion === 'Family' ? 2.5 : companion === 'Friends' ? 2.0 : 1.8;

  // Base daily cost in INR (₹14,500 base per day)
  const baseDailyCost = Math.round(14500 * budgetMultiplier * (companionMultiplier > 1 ? companionMultiplier * 0.75 : 1));
  const totalEstimated = baseDailyCost * daysCount;

  // Generate Itinerary Days
  const days: ItineraryDay[] = [];
  const sampleThemes = [
    'Arrival, Neighborhood Discovery & Sunset Welcome',
    'Timeless Heritage, Architecture & Iconic Horizons',
    'Hidden Alleyways, Artisan Crafts & Culinary Delights',
    'Panoramic Scenery, Gentle Trails & Golden Hours',
    'Local Markets, Culture & Celebratory Farewell',
    'Off-the-Beaten-Path Exploration & Relaxation',
    'Scenic Day Excursion & Panoramic Highlights',
  ];

  for (let i = 1; i <= daysCount; i++) {
    const themeIndex = (i - 1) % sampleThemes.length;
    const landmark1 = dest.landmarks[(i - 1) % dest.landmarks.length];
    const landmark2 = dest.landmarks[i % dest.landmarks.length];
    const cuisine1 = dest.cuisines[(i - 1) % dest.cuisines.length];
    const cuisine2 = dest.cuisines[i % dest.cuisines.length];
    const neighborhood = dest.neighborhoods[(i - 1) % dest.neighborhoods.length];

    days.push({
      dayNumber: i,
      date: `Day ${i}`,
      title: `${dest.name} Day ${i}: ${sampleThemes[themeIndex]}`,
      theme: sampleThemes[themeIndex],
      activities: [
        {
          id: `act-${i}-1`,
          time: '09:00 AM',
          period: 'Morning',
          title: `Morning Exploration at ${landmark1}`,
          description: `Begin the day early to enjoy ${landmark1} in serene morning light before crowds gather. Perfect for contemplative photography.`,
          location: `${neighborhood}, ${dest.name}`,
          duration: '2.5 hrs',
          cost: Math.round(800 * budgetMultiplier),
          category: 'sightseeing',
          tips: 'Arrive 15 minutes before opening for pristine photo angles without crowds.',
        },
        {
          id: `act-${i}-2`,
          time: '01:00 PM',
          period: 'Afternoon',
          title: `Culinary Discovery: ${cuisine1}`,
          description: `Savor authentic local delicacies crafted with seasonal ingredients at an artisan eatery in ${neighborhood}.`,
          location: `${neighborhood} Food District`,
          duration: '1.5 hrs',
          cost: Math.round(1800 * budgetMultiplier),
          category: 'dining',
          tips: 'Try the house recommendation paired with locally pressed refreshments.',
        },
        {
          id: `act-${i}-3`,
          time: '03:30 PM',
          period: 'Afternoon',
          title: `Cultural Immersion around ${landmark2}`,
          description: `Stroll through peaceful courtyards, artisan boutiques, and picturesque corridors surrounding ${landmark2}.`,
          location: `${dest.name}`,
          duration: '2.0 hrs',
          cost: Math.round(1200 * budgetMultiplier),
          category: 'culture',
          tips: 'Great opportunity to pick up handcrafted souvenirs from local master craftsmen.',
        },
        {
          id: `act-${i}-4`,
          time: '07:00 PM',
          period: 'Evening',
          title: `Golden Hour Dining & Drinks: ${cuisine2}`,
          description: `End the evening with atmospheric dining overlooking scenic views of ${dest.name}.`,
          location: `Scenic Viewpoint & Promenade`,
          duration: '2.0 hrs',
          cost: Math.round(2600 * budgetMultiplier),
          category: 'dining',
          tips: 'Reservations recommended for prime terrace seating during dusk.',
        },
      ],
    });
  }

  // Generate Budget Breakdown in INR
  const stayAllocated = Math.round(totalEstimated * 0.45);
  const foodAllocated = Math.round(totalEstimated * 0.26);
  const activitiesAllocated = Math.round(totalEstimated * 0.15);
  const transportAllocated = Math.round(totalEstimated * 0.10);
  const otherAllocated = Math.round(totalEstimated * 0.04);

  const budgetCategories: BudgetCategorySummary[] = [
    { category: 'stay', label: 'Boutique Stays & Ryokans', allocated: stayAllocated, spent: 0, iconName: 'Home', color: '#C2185B' },
    { category: 'food', label: 'Dining & Artisan Cafés', allocated: foodAllocated, spent: 0, iconName: 'Utensils', color: '#FF7A3D' },
    { category: 'activities', label: 'Cultural Experiences & Entry', allocated: activitiesAllocated, spent: 0, iconName: 'Ticket', color: '#FFC83D' },
    { category: 'transport', label: 'Express Rail & Transit', allocated: transportAllocated, spent: 0, iconName: 'Train', color: '#5B0B24' },
    { category: 'other', label: 'Souvenirs & Incidentals', allocated: otherAllocated, spent: 0, iconName: 'Tag', color: '#FF4F7A' },
  ];

  const budgetItems: BudgetItem[] = [
    { id: 'b-1', title: `Accommodation in ${dest.name} (${daysCount} nights)`, category: 'stay', amount: stayAllocated, date: 'Day 1' },
    { id: 'b-2', title: 'Local transit & express passes', category: 'transport', amount: transportAllocated, date: 'Day 1' },
    { id: 'b-3', title: 'Curated welcome dinner and tasting menu', category: 'food', amount: Math.round(foodAllocated * 0.3), date: 'Day 1' },
    { id: 'b-4', title: 'Historic site admission passes', category: 'activities', amount: activitiesAllocated, date: 'Day 2' },
  ];

  // Packing Items
  const packing: PackingItem[] = [
    { id: 'p-1', title: 'Passport and digital copies', category: 'Essentials', isPacked: true },
    { id: 'p-2', title: 'Comfortable walking / cobblestone shoes', category: 'Clothing', isPacked: false },
    { id: 'p-3', title: 'Lightweight breathable rain jacket', category: 'Clothing', isPacked: false },
    { id: 'p-4', title: 'Universal power adapter & power bank', category: 'Tech', isPacked: true },
    { id: 'p-5', title: 'Noise-cancelling headphones', category: 'Tech', isPacked: false },
    { id: 'p-6', title: 'Compact sunscreen & lip balm', category: 'Toiletries', isPacked: false },
    { id: 'p-7', title: 'Personal travel medical kit', category: 'Toiletries', isPacked: false },
  ];

  // Weather Days
  const weather: WeatherDay[] = [
    { date: 'Day 1', dayName: 'Day 1', condition: 'Sunny', icon: 'Sun', highTemp: 23, lowTemp: 14, precipitationPercent: 10, uvIndex: 5, advice: 'Clear skies! Perfect for morning photography.' },
    { date: 'Day 2', dayName: 'Day 2', condition: 'Partly Cloudy', icon: 'CloudSun', highTemp: 21, lowTemp: 13, precipitationPercent: 20, uvIndex: 4, advice: 'Pleasant temperature, ideal for temple walks.' },
    { date: 'Day 3', dayName: 'Day 3', condition: 'Clear', icon: 'Sun', highTemp: 24, lowTemp: 15, precipitationPercent: 5, uvIndex: 6, advice: 'Mild breeze in the afternoon. Stay hydrated.' },
    { date: 'Day 4', dayName: 'Day 4', condition: 'Breezy', icon: 'Wind', highTemp: 20, lowTemp: 12, precipitationPercent: 25, uvIndex: 4, advice: 'Bring a light scarf for sunset viewpoints.' },
    { date: 'Day 5', dayName: 'Day 5', condition: 'Sunny', icon: 'Sun', highTemp: 22, lowTemp: 14, precipitationPercent: 10, uvIndex: 5, advice: 'Crisp morning air and golden sunshine.' },
  ];

  const trip: TripSummary = {
    id: `trip-${dest.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
    title: `${daysCount}-Day ${vibe} Journey in ${dest.name}`,
    destination: dest.name,
    country: dest.country,
    startDate: 'Upcoming',
    endDate: `${daysCount} Days`,
    daysCount,
    coverImage: dest.coverImage,
    gradient: dest.gradient,
    status: 'upcoming',
    estimatedBudget: totalEstimated,
    spentBudget: 0,
    currency: 'INR',
    pace: daysCount <= 3 ? 'Fast-Paced' : daysCount >= 7 ? 'Relaxed' : 'Balanced',
    vibe: [vibe, companion, budgetTier],
    description: `A masterfully curated ${daysCount}-day ${vibe.toLowerCase()} experience in ${dest.name}, designed for ${companion.toLowerCase()} travel with a ${budgetTier.toLowerCase()} budget in Indian Rupees (₹) balancing iconic sights, culinary discoveries, and authentic local rhythm.`,
  };

  return {
    trip,
    days,
    budget: {
      totalEstimated,
      currency: 'INR',
      categories: budgetCategories,
      items: budgetItems,
    },
    packing,
    weather,
    source: 'internal_engine',
  };
}
