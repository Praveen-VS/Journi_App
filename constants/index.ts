/**
 * Journi Brand Identity, System Constants & Rich Mock Data
 * "Every journey begins a story."
 */

import type {
  Destination,
  TripSummary,
  ItineraryDay,
  BudgetItem,
  BudgetCategorySummary,
  PackingItem,
  WeatherDay,
  SavedPlace,
  UserProfile,
} from '@/types';

export const BRAND = {
  name: 'Journi',
  tagline: 'Every journey begins a story.',
  description:
    'An AI-first travel planner that turns natural language dreams into beautifully sequenced day-by-day itineraries, budgets, packing lists, and weather insights.',
} as const;

export const THEME_COLORS = {
  burgundy: '#5B0B24',
  journeyPink: '#C2185B',
  coralPink: '#FF4F7A',
  sunsetOrange: '#FF7A3D',
  goldenYellow: '#FFC83D',
  background: '#FFF7FA',
} as const;

export const ROUTES = {
  public: {
    home: '/',
    howItWorks: '/how-it-works',
    destinations: '/home',
    onboarding: '/onboarding',
  },
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
  },
  app: {
    home: '/home',
    ai: '/ai',
    trips: '/trips',
    tripDetail: (tripId: string) => `/trips/${tripId}`,
    itinerary: '/itinerary',
    budget: '/budget',
    packing: '/packing',
    weather: '/weather',
    map: '/map',
    saved: '/saved',
    profile: '/profile',
    settings: '/settings',
  },
} as const;

export const MOCK_USER: UserProfile = {
  id: 'usr_01',
  name: 'Elena Rostova',
  email: 'elena@journi.travel',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Visual designer & slow traveler. Chasing golden hours, quiet alley cafes, and historic architecture.',
  homeCity: 'San Francisco, CA',
  tripsCount: 4,
  savedPlacesCount: 18,
  countriesExplored: 12,
  preferences: ['Slow Travel', 'Historic Sights', 'Art & Cafes', 'Scenic Walks'],
  createdAt: '2025-01-15',
};

import { ALL_DESTINATIONS } from './destinationsData';
export { ALL_DESTINATIONS };

export const MOCK_DESTINATIONS: Destination[] = ALL_DESTINATIONS;

// Anchor destinations derived directly from ALL_DESTINATIONS catalog
const kyotoCatalog = ALL_DESTINATIONS.find((d) => d.id === 'dest_intl_kyoto') || ALL_DESTINATIONS[0];
const amalfiCatalog = ALL_DESTINATIONS.find((d) => d.id.includes('amalfi') || d.name.includes('Amalfi')) || ALL_DESTINATIONS[1];
const parisCatalog = ALL_DESTINATIONS.find((d) => d.id === 'dest_intl_paris') || ALL_DESTINATIONS[2];
const banffCatalog = ALL_DESTINATIONS.find((d) => d.name.toLowerCase().includes('banff')) || ALL_DESTINATIONS[3];

export const MOCK_TRIPS: TripSummary[] = [
  {
    id: 'trip_kyoto_autumn',
    title: 'Kyoto Autumn Zen & Tea Trails',
    destination: kyotoCatalog?.name || 'Kyoto',
    country: kyotoCatalog?.country || 'Japan',
    startDate: '2026-10-12',
    endDate: '2026-10-17',
    daysCount: 5,
    coverImage: kyotoCatalog?.coverImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    gradient: kyotoCatalog?.gradient || 'from-[#5B0B24] via-[#C2185B] to-[#FF7A3D]',
    status: 'upcoming',
    estimatedBudget: 154000,
    spentBudget: 51000,
    currency: 'INR',
    pace: 'Balanced',
    vibe: (kyotoCatalog?.vibes && kyotoCatalog.vibes.length > 0) ? kyotoCatalog.vibes : ['Cultural', 'Nature', 'Cuisine'],
    description:
      kyotoCatalog?.description ||
      'A hand-crafted 5-day journey through maple-draped temples, early-morning bamboo forest walks, and quiet Gion tea ceremonies.',
  },
  {
    id: 'trip_amalfi_summer',
    title: 'Amalfi Coastline & Sunset Drives',
    destination: amalfiCatalog?.name || 'Positano & Capri',
    country: amalfiCatalog?.country || 'Italy',
    startDate: '2026-06-08',
    endDate: '2026-06-14',
    daysCount: 6,
    coverImage: amalfiCatalog?.coverImage || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    gradient: amalfiCatalog?.gradient || 'from-[#C2185B] via-[#FF4F7A] to-[#FFC83D]',
    status: 'draft',
    estimatedBudget: 198000,
    spentBudget: 0,
    currency: 'INR',
    pace: 'Relaxed',
    vibe: (amalfiCatalog?.vibes && amalfiCatalog.vibes.length > 0) ? amalfiCatalog.vibes : ['Romantic', 'Coastal', 'Sunset'],
    description:
      amalfiCatalog?.description ||
      'Soaking in panoramic views from Ravello, tasting limoncello in Sorrento, and boat trips around the Faraglioni cliffs.',
  },
  {
    id: 'trip_paris_spring',
    title: 'Parisian Spring Architecture & Bistros',
    destination: parisCatalog?.name || 'Paris',
    country: parisCatalog?.country || 'France',
    startDate: '2025-04-10',
    endDate: '2025-04-15',
    daysCount: 5,
    coverImage: parisCatalog?.coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    gradient: parisCatalog?.gradient || 'from-[#5B0B24] via-[#FF4F7A] to-[#FF7A3D]',
    status: 'completed',
    estimatedBudget: 165000,
    spentBudget: 162000,
    currency: 'INR',
    pace: 'Balanced',
    vibe: (parisCatalog?.vibes && parisCatalog.vibes.length > 0) ? parisCatalog.vibes : ['Museums', 'Bistros', 'Historic'],
    description:
      parisCatalog?.description ||
      'Golden hour walks along the Seine, croissant mornings in Le Marais, and evening chamber music at Sainte-Chapelle.',
  },
];

export const MOCK_ITINERARY_DAYS: ItineraryDay[] = [
  {
    dayNumber: 1,
    date: 'Mon, Oct 12',
    title: 'Arashiyama & Bamboo Whisper',
    theme: 'Western Kyoto & Historic Temples',
    activities: [
      {
        id: 'act_101',
        time: '07:30 AM',
        period: 'Morning',
        title: 'Arashiyama Bamboo Grove at Dawn',
        description:
          'Beat the afternoon crowds by walking the towering green bamboo stalks right at first light when the wind creates peaceful natural melodies.',
        location: 'Ukyo Ward, Kyoto',
        duration: '1.5 hrs',
        cost: 0,
        category: 'sightseeing',
        tips: 'Arrive before 8:00 AM for soft morning light filtering through the stalks.',
      },
      {
        id: 'act_102',
        time: '09:30 AM',
        period: 'Morning',
        title: 'Tenryu-ji Temple & Sogenchi Garden',
        description:
          'UNESCO World Heritage site featuring a 14th-century pond garden framed seamlessly against the Arashiyama mountains.',
        location: '68 Sagatenryuji Susukinobabacho',
        duration: '2 hrs',
        cost: 8,
        category: 'culture',
        tips: 'Remove shoes to sit on the tatami veranda overlooking the koi pond.',
      },
      {
        id: 'act_103',
        time: '12:30 PM',
        period: 'Afternoon',
        title: 'Traditional Yudofu (Tofu) Lunch at Seizan Sodo',
        description:
          'Delicate hot pot silken tofu served in a quiet garden pavilion surrounded by moss stones and bamboo screens.',
        location: 'Near Tenryu-ji North Exit',
        duration: '1.5 hrs',
        cost: 32,
        category: 'dining',
        tips: 'Reservations recommended; pair with local Kyoto craft green tea.',
      },
      {
        id: 'act_104',
        time: '03:00 PM',
        period: 'Afternoon',
        title: 'Okochi Sanso Villa & Hilltop Matcha',
        description:
          'The private estate of silent film star Denjiro Okochi offering sweeping views of Kyoto city and a complimentary matcha bowl.',
        location: '8 Tabuchiyamacho, Saga Ogurayama',
        duration: '1.5 hrs',
        cost: 10,
        category: 'leisure',
      },
      {
        id: 'act_105',
        time: '06:00 PM',
        period: 'Evening',
        title: 'Sunset Walk along Togetsukyo Bridge',
        description:
          'Watch the evening sky turn into shades of coral and burgundy reflected across the gentle waters of the Katsura River.',
        location: 'Togetsukyo, Ukyo Ward',
        duration: '1 hr',
        cost: 0,
        category: 'sightseeing',
      },
    ],
  },
  {
    dayNumber: 2,
    date: 'Tue, Oct 13',
    title: 'Gion Alleys & Vermilion Torii Gates',
    theme: 'Southern & Eastern Kyoto Stories',
    activities: [
      {
        id: 'act_201',
        time: '07:00 AM',
        period: 'Morning',
        title: 'Fushimi Inari-Taisha Sacred Mountain Hike',
        description:
          'Walk beneath thousands of vermilion shrine gates winding up the sacred Mount Inari through quiet cedar forests.',
        location: '68 Fukakusa Yabunouchicho',
        duration: '2.5 hrs',
        cost: 0,
        category: 'sightseeing',
        tips: 'Hike past Yotsutsuji intersection for the best panoramic view of south Kyoto.',
      },
      {
        id: 'act_202',
        time: '11:00 AM',
        period: 'Morning',
        title: 'Kiyomizu-dera Wooden Stage',
        description:
          'Historic temple constructed entirely without nails, jutting out over the hillside with panoramic vistas of cherry and maple foliage.',
        location: '1 Chome-294 Kiyomizu, Higashiyama',
        duration: '2 hrs',
        cost: 4,
        category: 'culture',
      },
      {
        id: 'act_203',
        time: '01:30 PM',
        period: 'Afternoon',
        title: 'Sannenzaka & Ninenzaka Stone Alleys',
        description:
          'Preserved Edo-period stone stairways lined with traditional wooden merchant shops, incense makers, and handmade wagashi sweets.',
        location: 'Higashiyama Ward',
        duration: '2 hrs',
        cost: 15,
        category: 'leisure',
      },
      {
        id: 'act_204',
        time: '06:30 PM',
        period: 'Evening',
        title: 'Lantern Lit Dinner along Shirakawa Canal',
        description:
          'Intimate Kaiseki seasonal banquet in a restored wooden Machiya townhouse with willow trees swaying over the canal.',
        location: 'Gion Shirakawa, Higashiyama',
        duration: '2.5 hrs',
        cost: 65,
        category: 'dining',
      },
    ],
  },
  {
    dayNumber: 3,
    date: 'Wed, Oct 14',
    title: 'Golden Pavilion & Philosophers Path',
    theme: 'Zen Meditation & Northern Kyoto',
    activities: [
      {
        id: 'act_301',
        time: '09:00 AM',
        period: 'Morning',
        title: 'Kinkaku-ji (The Golden Pavilion)',
        description:
          'Top two floors covered in genuine gold leaf shimmering spectacularly over the surrounding Mirror Pond.',
        location: '1 Kinkakujicho, Kita Ward',
        duration: '1.5 hrs',
        cost: 5,
        category: 'culture',
      },
      {
        id: 'act_302',
        time: '11:30 AM',
        period: 'Morning',
        title: 'Ryoan-ji Zen Rock Garden',
        description:
          'Contemplate the famous 15 stones arranged in white gravel where from any vantage point, only 14 can be seen simultaneously.',
        location: '13 Ryoanji Goryonoshitacho',
        duration: '1.5 hrs',
        cost: 6,
        category: 'culture',
      },
      {
        id: 'act_303',
        time: '02:00 PM',
        period: 'Afternoon',
        title: 'Strolling Philosophers Path (Tetsugaku no Michi)',
        description:
          'A tranquil stone pathway along a cherry-tree lined canal once walked daily by renowned Kyoto philosopher Nishida Kitaro.',
        location: 'Sakyo Ward',
        duration: '2 hrs',
        cost: 0,
        category: 'sightseeing',
      },
    ],
  },
];

export const MOCK_BUDGET_CATEGORIES: BudgetCategorySummary[] = [
  {
    category: 'stay',
    label: 'Accommodations',
    allocated: 78000,
    spent: 31000,
    iconName: 'Hotel',
    color: '#5B0B24',
  },
  {
    category: 'food',
    label: 'Food & Dining',
    allocated: 38000,
    spent: 12000,
    iconName: 'Utensils',
    color: '#FF4F7A',
  },
  {
    category: 'activities',
    label: 'Activities & Entry',
    allocated: 21000,
    spent: 5500,
    iconName: 'Compass',
    color: '#FF7A3D',
  },
  {
    category: 'transport',
    label: 'Local Transit',
    allocated: 17000,
    spent: 2500,
    iconName: 'Train',
    color: '#FFC83D',
  },
];

export const MOCK_EXPENSES: BudgetItem[] = [
  {
    id: 'exp_1',
    title: 'Traditional Ryokan Deposit (2 Nights)',
    category: 'stay',
    amount: 31000,
    date: '2026-10-01',
    paidBy: 'Elena',
  },
  {
    id: 'exp_2',
    title: 'ICOCA Transit Smart Card Recharge',
    category: 'transport',
    amount: 2500,
    date: '2026-10-12',
    paidBy: 'Elena',
  },
  {
    id: 'exp_3',
    title: 'Gion Kaiseki Multi-Course Tasting',
    category: 'food',
    amount: 7800,
    date: '2026-10-12',
    paidBy: 'Elena',
  },
  {
    id: 'exp_4',
    title: 'Tenryu-ji & Okochi Sanso Combined Entry',
    category: 'activities',
    amount: 1500,
    date: '2026-10-12',
    paidBy: 'Elena',
  },
  {
    id: 'exp_5',
    title: 'Artisan Matcha Sweets in Sannenzaka',
    category: 'food',
    amount: 1800,
    date: '2026-10-13',
    paidBy: 'Elena',
  },
];

export const MOCK_PACKING_ITEMS: PackingItem[] = [
  { id: 'pack_1', title: 'Passport & Visa documentation', category: 'Essentials', isPacked: true },
  { id: 'pack_2', title: 'Japan Rail Pass / Transit Cards', category: 'Essentials', isPacked: true },
  { id: 'pack_3', title: 'Travel insurance card copy', category: 'Essentials', isPacked: true },
  { id: 'pack_4', title: 'Comfortable walking shoes (easy slip-on)', category: 'Clothing', isPacked: false },
  { id: 'pack_5', title: 'Light rainproof shell jacket', category: 'Clothing', isPacked: true },
  { id: 'pack_6', title: 'Warm layers for cool temple mornings', category: 'Clothing', isPacked: false },
  { id: 'pack_7', title: 'Compact travel umbrella', category: 'Essentials', isPacked: true },
  { id: 'pack_8', title: 'Camera & spare SD cards', category: 'Tech', isPacked: false },
  { id: 'pack_9', title: 'Universal power plug adapter', category: 'Tech', isPacked: true },
  { id: 'pack_10', title: '10,000mAh portable power bank', category: 'Tech', isPacked: true },
  { id: 'pack_11', title: 'Travel-size sunscreen & lip balm', category: 'Toiletries', isPacked: true },
  { id: 'pack_12', title: 'Personal first aid & blister pads', category: 'Toiletries', isPacked: false },
];

export const MOCK_WEATHER_DAYS: WeatherDay[] = [
  {
    date: '2026-10-12',
    dayName: 'Monday',
    condition: 'Clear',
    icon: 'Sun',
    highTemp: 21,
    lowTemp: 12,
    precipitationPercent: 5,
    uvIndex: 4,
    advice: 'Crisp morning air followed by warm sunshine. Ideal for Arashiyama walks.',
  },
  {
    date: '2026-10-13',
    dayName: 'Tuesday',
    condition: 'Sunny',
    icon: 'Sun',
    highTemp: 22,
    lowTemp: 13,
    precipitationPercent: 10,
    uvIndex: 5,
    advice: 'Pleasant temperatures all day. Wear comfortable shoes for Fushimi Inari.',
  },
  {
    date: '2026-10-14',
    dayName: 'Wednesday',
    condition: 'Partly Cloudy',
    icon: 'CloudSun',
    highTemp: 19,
    lowTemp: 11,
    precipitationPercent: 20,
    uvIndex: 3,
    advice: 'Mild cloud cover in the afternoon. Great light for Golden Pavilion photography.',
  },
  {
    date: '2026-10-15',
    dayName: 'Thursday',
    condition: 'Breezy',
    icon: 'Wind',
    highTemp: 18,
    lowTemp: 10,
    precipitationPercent: 15,
    uvIndex: 3,
    advice: 'Slight breeze in the evening; a light coat or sweater recommended.',
  },
  {
    date: '2026-10-16',
    dayName: 'Friday',
    condition: 'Rainy',
    icon: 'CloudRain',
    highTemp: 16,
    lowTemp: 12,
    precipitationPercent: 65,
    uvIndex: 2,
    advice: 'Scattered afternoon showers. Perfect time for indoor museum visits and matcha tastings.',
  },
  {
    date: '2026-10-17',
    dayName: 'Saturday',
    condition: 'Sunny',
    icon: 'Sun',
    highTemp: 20,
    lowTemp: 11,
    precipitationPercent: 10,
    uvIndex: 4,
    advice: 'Clear blue skies returning for your final stroll through Gion.',
  },
];

export const MOCK_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'place_1',
    name: 'Gion Duck Noodles & Tea',
    destination: kyotoCatalog?.name || 'Kyoto',
    country: kyotoCatalog?.country || 'Japan',
    category: 'Cafe',
    rating: 4.8,
    image: kyotoCatalog?.coverImage || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    notes: 'Hidden alley ramen bar with secret pictogram menu and delicate smoked duck broth.',
    savedAt: '2 days ago',
  },
  {
    id: 'place_2',
    name: (kyotoCatalog?.highlights && kyotoCatalog.highlights[0]) || 'Otagi Nenbutsu-ji Temple',
    destination: kyotoCatalog?.name || 'Kyoto',
    country: kyotoCatalog?.country || 'Japan',
    category: 'Culture',
    rating: 4.9,
    image: kyotoCatalog?.coverImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    notes: '1,200 whimsical moss-covered stone statues carved by amateur sculptors.',
    savedAt: '3 days ago',
  },
  {
    id: 'place_3',
    name: (amalfiCatalog?.highlights && amalfiCatalog.highlights[0]) || 'Il San Pietro Cliffside Terraces',
    destination: amalfiCatalog?.name || 'Positano',
    country: amalfiCatalog?.country || 'Italy',
    category: 'Sight',
    rating: 5.0,
    image: amalfiCatalog?.coverImage || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    notes: 'Unmatched sunset vantage point carved into the rock overlooking Positano bay.',
    savedAt: '1 week ago',
  },
  {
    id: 'place_4',
    name: (banffCatalog?.highlights && banffCatalog.highlights[0]) || 'Moraine Lake Canoe Dock',
    destination: banffCatalog?.name || 'Banff',
    country: banffCatalog?.country || 'Canada',
    category: 'Nature',
    rating: 4.9,
    image: banffCatalog?.coverImage || 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=80',
    notes: 'Vibrant turquoise waters under the Ten Peaks at sunrise.',
    savedAt: '2 weeks ago',
  },
];

export const SAMPLE_AI_PROMPTS = [
  'Plan a 5-day cultural trip to Kyoto with quiet temples, tea ceremonies, and local food spots.',
  'Create a 4-day romantic road trip along the Amalfi Coast with scenic cliffside dinners.',
  'Design an active 4-day hiking itinerary in Banff with sunrise photography locations.',
  'A relaxing 3-day weekend exploring art galleries and sunset terraces in Florence.',
  'Family-friendly 5 days in Swiss Alps with scenic cogwheel trains and alpine walks.',
];
