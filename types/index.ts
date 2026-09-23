/**
 * Global Core Types for Journi Version 1
 * "Every journey begins a story."
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  homeCity?: string;
  tripsCount: number;
  savedPlacesCount: number;
  countriesExplored: number;
  preferences: string[];
  createdAt: string;
}

export type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'draft';

export interface TripSummary {
  id: string;
  title: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  coverImage: string;
  gradient: string;
  status: TripStatus;
  estimatedBudget: number;
  spentBudget: number;
  currency: string;
  pace: 'Relaxed' | 'Balanced' | 'Fast-Paced';
  vibe: string[];
  description: string;
}

export interface ActivityItem {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  duration: string;
  cost: number;
  category: 'sightseeing' | 'dining' | 'culture' | 'leisure' | 'transport';
  tips?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  activities: ActivityItem[];
}

export interface BudgetItem {
  id: string;
  title: string;
  category: 'stay' | 'food' | 'activities' | 'transport' | 'other';
  amount: number;
  date: string;
  paidBy?: string;
}

export interface BudgetCategorySummary {
  category: 'stay' | 'food' | 'activities' | 'transport' | 'other';
  label: string;
  allocated: number;
  spent: number;
  iconName: string;
  color: string;
}

export interface PackingItem {
  id: string;
  title: string;
  category: 'Essentials' | 'Clothing' | 'Toiletries' | 'Tech';
  isPacked: boolean;
  quantity?: number;
}

export interface WeatherDay {
  date: string;
  dayName: string;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Clear' | 'Breezy';
  icon: string;
  highTemp: number;
  lowTemp: number;
  precipitationPercent: number;
  uvIndex: number;
  advice: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  state?: string;
  tagline: string;
  description: string;
  coverImage: string;
  gradient: string;
  bestSeason: string;
  averageTemp: string;
  idealDays: number;
  vibes: string[];
  trending?: boolean;
  // Extended Taste Profiling attributes
  ageGroups?: string[]; // e.g. ['18-24', '25-34', '35-49', '50+']
  energyRhythm?: 'Peace & Zen' | 'Chill & Coastal' | 'Vibrant & Cultural' | 'High-Energy Adventure';
  foodTypes?: string[]; // e.g. ['Street Food', 'Seafood', 'Fine Dining', 'Authentic Spicy', 'Cafes & Bakeries', 'Plant-Based']
  landscape?: string; // e.g. 'Tropical Beaches', 'Mountains & Alpine', 'Historic Old Towns', 'Lush Nature', 'Neon Metropolis'
  budgetTier?: 'Budget Friendly' | 'Moderate' | 'Luxury Escapes';
  companionFit?: string[]; // ['Solo', 'Couple', 'Family', 'Friends']
  highlights?: string[];
  cuisines?: string[];
  matchScore?: number;
  matchReason?: string;
}

export type LocationScope =
  | 'nearby_200km'
  | 'in_state'
  | 'interstate'
  | 'international'
  | 'custom';

export interface UserTasteProfile {
  ageGroup: string; // '18-24' | '25-34' | '35-49' | '50+'
  energyRhythm: string; // 'peace' | 'chill' | 'culture' | 'adventure'
  foodPreferences: string[]; // e.g. ['street_food', 'seafood', 'fine_dining', 'authentic_spicy', 'cafes_bakeries', 'plant_based']
  landscape: string; // 'beaches' | 'mountains' | 'historic' | 'nature' | 'metropolis'
  budgetTier: string; // 'Budget Friendly' | 'Moderate' | 'Luxury Escapes'
  companion: string; // 'Solo' | 'Couple' | 'Family' | 'Friends'
  tripLength?: number;
  locationScope?: LocationScope;
  userOrigin?: string;
  customLocation?: string;
}

export interface TasteMatchResult {
  destination: Destination;
  score: number; // 0-100
  matchReason: string;
  matchedTags: string[];
}

export interface SavedPlace {
  id: string;
  name: string;
  destination: string;
  country: string;
  category: 'Sight' | 'Cafe' | 'Stay' | 'Nature' | 'Culture';
  rating: number;
  image: string;
  notes?: string;
  savedAt: string;
}

export type UIStateMode = 'default' | 'empty' | 'loading' | 'error';
