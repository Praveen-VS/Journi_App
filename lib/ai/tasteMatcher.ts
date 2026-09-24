import type { Destination, UserTasteProfile, TasteMatchResult } from '@/types';
import { ALL_DESTINATIONS } from '@/constants/destinationsData';

/**
 * Energy Rhythm Mapping Helper
 */
const RHYTHM_MAP: Record<string, string> = {
  peace: 'Peace & Zen',
  chill: 'Chill & Coastal',
  culture: 'Vibrant & Cultural',
  adventure: 'High-Energy Adventure',
};

/**
 * Landscape Mapping Helper
 */
const LANDSCAPE_MAP: Record<string, string> = {
  beaches: 'Tropical Beaches',
  mountains: 'Mountains & Alpine',
  historic: 'Historic Old Towns',
  nature: 'Lush Nature',
  metropolis: 'Neon Metropolis',
};

/**
 * Food Label Mapping Helper
 */
const FOOD_LABEL_MAP: Record<string, string> = {
  street_food: 'Street Food',
  seafood: 'Seafood',
  fine_dining: 'Fine Dining',
  authentic_spicy: 'Authentic Spicy',
  cafes_bakeries: 'Cafes & Bakeries',
  plant_based: 'Plant-Based',
};

/**
 * Calculate multi-attribute compatibility score between user taste profile and a destination
 */
export function calculateTasteScore(
  profile: UserTasteProfile,
  destination: Destination
): { score: number; matchReason: string; matchedTags: string[] } {
  let score = 0;
  const matchedTags: string[] = [];
  const reasons: string[] = [];

  // 1. Energy Rhythm Match (Max 30 pts)
  const targetRhythm = RHYTHM_MAP[profile.energyRhythm] || profile.energyRhythm;
  if (destination.energyRhythm === targetRhythm) {
    score += 30;
    matchedTags.push(targetRhythm);
    reasons.push(`aligns with your ${targetRhythm.toLowerCase()} rhythm`);
  } else if (
    (profile.energyRhythm === 'peace' && destination.energyRhythm === 'Chill & Coastal') ||
    (profile.energyRhythm === 'chill' && destination.energyRhythm === 'Peace & Zen') ||
    (profile.energyRhythm === 'culture' && destination.energyRhythm === 'High-Energy Adventure') ||
    (profile.energyRhythm === 'adventure' && destination.energyRhythm === 'Vibrant & Cultural')
  ) {
    score += 20;
    matchedTags.push(destination.energyRhythm || 'Balanced Vibe');
  } else {
    score += 10;
  }

  // 2. Food Preferences Match (Max 25 pts)
  if (profile.foodPreferences && profile.foodPreferences.length > 0 && destination.foodTypes) {
    let foodMatchCount = 0;
    const matchedFoods: string[] = [];

    profile.foodPreferences.forEach((prefKey) => {
      const label = FOOD_LABEL_MAP[prefKey] || prefKey;
      if (destination.foodTypes?.some((f) => f.toLowerCase() === label.toLowerCase())) {
        foodMatchCount++;
        matchedFoods.push(label);
      }
    });

    const foodRatio = foodMatchCount / Math.max(profile.foodPreferences.length, 1);
    const foodScore = Math.min(Math.round(foodRatio * 25), 25);
    score += foodScore;

    if (matchedFoods.length > 0) {
      matchedTags.push(...matchedFoods.slice(0, 2));
      reasons.push(`celebrates your love for ${matchedFoods.slice(0, 2).join(' & ')}`);
    }
  } else {
    score += 15;
  }

  // 3. Landscape & Atmosphere Match (Max 20 pts)
  const targetLandscape = LANDSCAPE_MAP[profile.landscape] || profile.landscape;
  if (destination.landscape === targetLandscape) {
    score += 20;
    matchedTags.push(targetLandscape);
    reasons.push(`features iconic ${targetLandscape.toLowerCase()}`);
  } else if (
    (profile.landscape === 'beaches' && destination.landscape === 'Lush Nature') ||
    (profile.landscape === 'mountains' && destination.landscape === 'Lush Nature') ||
    (profile.landscape === 'historic' && destination.landscape === 'Neon Metropolis')
  ) {
    score += 14;
    matchedTags.push(destination.landscape || 'Scenic Scenery');
  } else {
    score += 8;
  }

  // 4. Age Demographic Fit (Max 10 pts)
  if (profile.ageGroup && destination.ageGroups?.includes(profile.ageGroup)) {
    score += 10;
    matchedTags.push(`${profile.ageGroup} Favorites`);
  } else {
    score += 6;
  }

  // 5. Budget Tier Fit (Max 10 pts)
  if (profile.budgetTier && destination.budgetTier === profile.budgetTier) {
    score += 10;
    matchedTags.push(profile.budgetTier);
  } else if (
    (profile.budgetTier === 'Moderate' && destination.budgetTier === 'Budget Friendly') ||
    (profile.budgetTier === 'Moderate' && destination.budgetTier === 'Luxury Escapes')
  ) {
    score += 7;
  } else {
    score += 4;
  }

  // 6. Companion Fit (Max 5 pts)
  if (profile.companion && destination.companionFit?.includes(profile.companion)) {
    score += 5;
    matchedTags.push(`${profile.companion} Fit`);
  } else {
    score += 3;
  }

  // 7. Location Scope & Geographical Fit
  if (profile.locationScope === 'custom' && profile.customLocation?.trim()) {
    const customQ = profile.customLocation.toLowerCase().trim();
    if (
      destination.name.toLowerCase().includes(customQ) ||
      destination.country.toLowerCase().includes(customQ) ||
      destination.continent.toLowerCase().includes(customQ)
    ) {
      score += 25;
      matchedTags.unshift(`Target: ${destination.name}`);
      reasons.unshift(`directly matches your custom destination (${destination.name})`);
    }
  } else if (profile.locationScope === 'nearby_200km') {
    matchedTags.push('Within ~200 km');
    reasons.push('ideal for a scenic weekend road trip');
    score += 15;
  } else if (profile.locationScope === 'in_state') {
    matchedTags.push('Regional State');
    reasons.push('perfect for in-state exploration');
    score += 15;
  } else if (profile.locationScope === 'interstate') {
    matchedTags.push('Domestic Escape');
    reasons.push('handpicked domestic Indian getaway');
    score += 15;
  } else if (profile.locationScope === 'international') {
    matchedTags.push('Global Passport');
    reasons.push('stunning international adventure');
    score += 15;
  }

  // Normalize final percentage score into an intuitive 82% – 99% scale for top results
  // Raw max is 100
  const normalizedScore = Math.min(Math.max(score, 65), 99);

  // Construct personalized match rationale
  let matchReason = `A standout match for you.`;
  if (reasons.length >= 2) {
    matchReason = `Spectacular choice: ${reasons[0]} and ${reasons[1]}.`;
  } else if (reasons.length === 1) {
    matchReason = `Hand-picked because it ${reasons[0]}.`;
  }

  return {
    score: normalizedScore,
    matchReason,
    matchedTags: Array.from(new Set(matchedTags)).slice(0, 4),
  };
}

/**
 * Filter and rank destinations according to taste profile and strict location scope
 */
export function findTopDestinationMatches(
  profile: UserTasteProfile,
  catalog: Destination[] = ALL_DESTINATIONS,
  limit: number = 8
): TasteMatchResult[] {
  let pool = catalog;

  // Strict geographical partitioning based on locationScope
  if (profile.locationScope === 'international') {
    pool = catalog.filter((d) => d.country.toLowerCase() !== 'india');
  } else if (profile.locationScope === 'interstate') {
    pool = catalog.filter((d) => d.country.toLowerCase() === 'india');
  } else if (profile.locationScope === 'in_state') {
    const originLower = (profile.userOrigin || '').toLowerCase();
    const targetState = originLower.includes('karnataka')
      ? 'karnataka'
      : (originLower.includes('tamil') ? 'tamil nadu' : 'kerala');

    const stateMatched = catalog.filter(
      (d) => d.country.toLowerCase() === 'india' && d.state && d.state.toLowerCase() === targetState
    );
    pool = stateMatched.length > 0 ? stateMatched : catalog.filter((d) => (d.state || '').toLowerCase() === 'kerala');
  } else if (profile.locationScope === 'nearby_200km') {
    pool = catalog.filter(
      (d) =>
        d.country.toLowerCase() === 'india' &&
        (d.idealDays <= 3 || d.vibes.includes('Relaxed') || d.vibes.includes('Scenic'))
    );
    if (pool.length < 4) {
      pool = catalog.filter((d) => d.country.toLowerCase() === 'india');
    }
  } else if (profile.locationScope === 'custom' && profile.customLocation?.trim()) {
    const q = profile.customLocation.toLowerCase().trim();
    const cleanQ = q.replace(/[^a-z0-9]/g, '');
    const matched = catalog.filter((d) => {
      const cName = d.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cCountry = d.country.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cState = (d.state || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return (
        cName.includes(cleanQ) ||
        cleanQ.includes(cName) ||
        cCountry.includes(cleanQ) ||
        cleanQ.includes(cCountry) ||
        (cState && cState.includes(cleanQ))
      );
    });
    if (matched.length > 0) {
      pool = matched;
    }
  }

  const scored = pool.map((dest) => {
    const { score, matchReason, matchedTags } = calculateTasteScore(profile, dest);
    return {
      destination: {
        ...dest,
        matchScore: score,
        matchReason,
      },
      score,
      matchReason,
      matchedTags,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
