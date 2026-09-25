import { ItineraryDay, TripOptionVariant, ActivityItem } from '@/types';

export interface TripOptionsInput {
  destination: string;
  country: string;
  daysCount: number;
  companion: string; // 'Solo' | 'Couple' | 'Family' | 'Friends'
  budgetTier: string; // 'Budget' | 'Moderate' | 'Luxury'
  adultsCount?: number;
  childrenCount?: number;
  energyRhythm?: string;
  foodPreferences?: string[];
  highlights?: string[];
  curatorNote?: string;
}

/**
 * Clean & normalize tier strings
 */
function normalizeBudgetTier(raw?: string): 'Budget' | 'Moderate' | 'Luxury' {
  const lower = (raw || '').toLowerCase();
  if (lower.includes('budget') || lower.includes('low') || lower.includes('economy')) return 'Budget';
  if (lower.includes('lux') || lower.includes('premium') || lower.includes('royal')) return 'Luxury';
  return 'Moderate';
}

function normalizeCompanion(raw?: string): 'Solo' | 'Couple' | 'Family' | 'Friends' {
  const lower = (raw || '').toLowerCase();
  if (lower.includes('solo') || lower.includes('alone') || lower.includes('single')) return 'Solo';
  if (lower.includes('family') || lower.includes('kid') || lower.includes('children')) return 'Family';
  if (lower.includes('friend') || lower.includes('group')) return 'Friends';
  return 'Couple';
}

function getOptionStaysAndDining(
  dest: string,
  optionIndex: number,
  tier: 'Budget' | 'Moderate' | 'Luxury',
  companion: string
): {
  stayName: string;
  stayAmenity: string;
  childPolicy: { isFree: boolean; ratePerNight: number; description: string };
  curatedRestaurants: Array<{
    name: string;
    cuisine: string;
    signatureDish: string;
    priceForTwo: number;
    vibe: string;
  }>;
} {
  const dLower = dest.toLowerCase();

  // 1. Munnar, Kerala
  if (dLower.includes('munnar')) {
    if (optionIndex === 0) {
      return {
        stayName: 'Zostel Munnar & Tea Garden Pods',
        stayAmenity: 'Panoramic Tea Garden Balcony • Free Wi-Fi • Community Cafe',
        childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free with parents' },
        curatedRestaurants: [
          { name: 'Rapsy Restaurant', cuisine: 'Kerala Classic', signatureDish: 'Malabar Parotta & Beef Roast / Vegetable Kurma', priceForTwo: 450, vibe: 'Iconic Local Hub' },
          { name: 'Saravana Bhavan Munnar', cuisine: 'South Indian Pure Veg', signatureDish: 'Crispy Ghee Roast Dosa with 3 Chutneys', priceForTwo: 350, vibe: 'Fast & Authentic' },
        ],
      };
    }
    if (optionIndex === 1) {
      return {
        stayName: 'Tea County Heritage Hill Resort',
        stayAmenity: 'Valley-view Suites • Ayurvedic Spa • Complimentary Breakfast Buffet',
        childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free (free breakfast buffet)' },
        curatedRestaurants: [
          { name: 'Copper Castle Restaurant', cuisine: 'Kerala & Tandoor', signatureDish: 'Claypot Pepper Chicken & Appam', priceForTwo: 900, vibe: 'Scenic Valley Dining' },
          { name: 'Silver Spoon Multi-Cuisine', cuisine: 'Continental & Indian', signatureDish: 'Fresh Grilled River Fish with Garlic Butter', priceForTwo: 800, vibe: 'Cozy Family Ambience' },
        ],
      };
    }
    return {
      stayName: 'Amber Dale Luxury Resort & Spa',
      stayAmenity: 'Private Jacuzzi Balcony • Infinity Valley View • 5-Star Hospitality',
      childPolicy: companion === 'Family'
        ? { isFree: false, ratePerNight: 750, description: 'Kids (<5 yrs): ₹750/night (extra rollaway cot & gourmet breakfast)' }
        : { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free on existing bedding' },
      curatedRestaurants: [
        { name: 'The High Range Club Restaurant', cuisine: 'Colonial Heritage & Kerala', signatureDish: 'Cardamom Roast Duck & Scottish Broth', priceForTwo: 1800, vibe: 'Historic Gentlemen’s Club' },
        { name: 'Hill Spice at Fragrant Nature', cuisine: 'Fine Dining Malabar', signatureDish: 'Kerala Prawn Moilee with Steamed Idiyappam', priceForTwo: 1600, vibe: 'Candlelight Mountain Panorama' },
      ],
    };
  }

  // 2. Alleppey (Alappuzha), Kerala
  if (dLower.includes('alleppey') || dLower.includes('alappuzha')) {
    if (optionIndex === 0) {
      return {
        stayName: 'Zostel Alleppey Beach Hostel',
        stayAmenity: 'Seaside Courtyard • Free Wi-Fi • Bicycle Rentals',
        childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free with parents' },
        curatedRestaurants: [
          { name: 'Halais Restaurant', cuisine: 'Malabar & Arab', signatureDish: 'Alleppey Chicken Dum Biryani', priceForTwo: 450, vibe: 'Bustling Local Legend' },
          { name: 'Dreamers Cafe Beachfront', cuisine: 'Coastal Cafe', signatureDish: 'Fresh Fish Fry & Tropical Pineapple Smoothie', priceForTwo: 400, vibe: 'Chill Sunset Shack' },
        ],
      };
    }
    if (optionIndex === 1) {
      return {
        stayName: 'Punnamada Backwater Heritage Resort',
        stayAmenity: 'Canal-facing Heritage Villas • Swimming Pool • Sunset Houseboat Desk',
        childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free (complimentary breakfast)' },
        curatedRestaurants: [
          { name: 'Chakara at Marari Beach Resort', cuisine: 'Traditional Kerala Coastal', signatureDish: 'Karimeen Pollichathu (Pearl Spot in Banana Leaf)', priceForTwo: 1200, vibe: 'Open-Air Thatched Heritage' },
          { name: 'Cassia Restaurant & Lounge', cuisine: 'Seafood & Fusion', signatureDish: 'Alleppey Fish Curry with Red Rice', priceForTwo: 850, vibe: 'Quiet Lagoon Setting' },
        ],
      };
    }
    return {
      stayName: 'Vasundhara Sarovar Premiere & Houseboat',
      stayAmenity: 'Floating Houseboat Suites • Infinity Pool • Ayurveda Healing Sanctuary',
      childPolicy: companion === 'Family'
        ? { isFree: false, ratePerNight: 850, description: 'Kids (<5 yrs): ₹850/night (extra bed & breakfast package)' }
        : { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free on existing bedding' },
      curatedRestaurants: [
        { name: 'The History Restaurant', cuisine: 'Royal Travancore Cuisine', signatureDish: 'Jumbo Tiger Prawns in Spiced Raw Mango Gravy', priceForTwo: 2200, vibe: 'Ultra-Luxury Backwater Dining' },
        { name: 'Ze Waterside Pavilion', cuisine: 'Pan-Asian & Coastal', signatureDish: 'Wok-tossed Mud Crab with Black Pepper', priceForTwo: 1900, vibe: 'Floating Deck Dining' },
      ],
    };
  }

  // 3. Varkala, Kerala
  if (dLower.includes('varkala')) {
    if (optionIndex === 0) {
      return {
        stayName: 'The Lost Hostels Varkala Helipad',
        stayAmenity: 'North Cliff Proximity • Hammock Garden • Yoga Shala Access',
        childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free in private rooms' },
        curatedRestaurants: [
          { name: 'Coffee Temple', cuisine: 'Artisan Cafe & Bakery', signatureDish: 'Banana Nutella Crepes & Iced Cappuccino', priceForTwo: 500, vibe: 'Cliffside Bohemian' },
          { name: 'Darjeeling Cafe', cuisine: 'Tibetan & Coastal', signatureDish: 'Steamed Prawn Momos & Ginger Lemon Honey Tea', priceForTwo: 450, vibe: 'Sunset Beanbags' },
        ],
      };
    }
    if (optionIndex === 1) {
      return {
        stayName: 'Clafouti Heritage Beach Resort',
        stayAmenity: 'Cliff-edge Ocean Views • Thatched Wood Cottages • Private Beach Steps',
        childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free (complimentary breakfast)' },
        curatedRestaurants: [
          { name: 'Abhiba Cafe & Grill', cuisine: 'Fresh Arabian Seafood', signatureDish: 'Charcoal Grilled Red Snapper with Garlic Naan', priceForTwo: 950, vibe: 'Oceanfront Candlelight' },
          { name: 'Tibetan Kitchen Varkala', cuisine: 'Tibetan & Chinese', signatureDish: 'Thukpa Noodle Soup & Crispy Chilli Fish', priceForTwo: 750, vibe: 'Lively Cliff Atmosphere' },
        ],
      };
    }
    return {
      stayName: 'Gateway Varkala (IHCL SeleQtions)',
      stayAmenity: 'Hilltop Sea Views • Olympic-size Swimming Pool • Taj Luxury Service',
      childPolicy: companion === 'Family'
        ? { isFree: false, ratePerNight: 900, description: 'Kids (<5 yrs): ₹900/night (extra cot & kids breakfast spread)' }
        : { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free on existing bedding' },
      curatedRestaurants: [
        { name: 'Coastal Kitchen at Gateway', cuisine: 'Fine Dining Kerala & Coastal', signatureDish: 'Lobster Roast with Kerala Malabar Parotta', priceForTwo: 2400, vibe: 'Luxury Ocean Promenade' },
        { name: 'Sunset Lounge Deck', cuisine: 'Continental & Wine', signatureDish: 'Cheese Board with Smoked Seer Fish Tapas', priceForTwo: 1800, vibe: 'Cliff-edge Sunset Cocktails' },
      ],
    };
  }

  // 4. Wayanad, Kerala
  if (dLower.includes('wayanad')) {
    if (optionIndex === 0) {
      return {
        stayName: 'Wayanad Nature Homestay & Pods',
        stayAmenity: 'Plantation Walk • Bonfire Pit • High-Speed Wi-Fi',
        childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free with parents' },
        curatedRestaurants: [
          { name: '1980’s A Nostalgic Restaurant', cuisine: 'Authentic Kerala Sadya', signatureDish: 'Full Banana Leaf Sadya with 24 Dishes', priceForTwo: 500, vibe: 'Vintage Village Setting' },
          { name: 'Wilton Restaurant Kalpetta', cuisine: 'Malabar & Arab', signatureDish: 'Bamboo Chicken Biryani', priceForTwo: 550, vibe: 'Hearty Local Favorite' },
        ],
      };
    }
    if (optionIndex === 1) {
      return {
        stayName: 'Vythiri Resort & Treehouse Cottages',
        stayAmenity: 'Rope Bridge • Natural Stream Pool • Rainforest Canopy Views',
        childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free (free breakfast buffet)' },
        curatedRestaurants: [
          { name: 'The Coffee Grove Restaurant', cuisine: 'Plantation Spiced Cuisine', signatureDish: 'Coorg-Wayanad Spiced Chicken & Akki Roti', priceForTwo: 850, vibe: 'Amidst Coffee Groves' },
          { name: 'Udupi Pure Veg Sultan Bathery', cuisine: 'South Indian Veg', signatureDish: 'Special Masala Dosa & Filter Coffee', priceForTwo: 350, vibe: 'Clean Traditional Tiffin' },
        ],
      };
    }
    return {
      stayName: 'The Windflower Resort & Spa Wayanad',
      stayAmenity: 'Private Valley Villa • Kerala Ayurvedic Center • Infinity Pool',
      childPolicy: companion === 'Family'
        ? { isFree: false, ratePerNight: 800, description: 'Kids (<5 yrs): ₹800/night (extra rollaway bed & breakfast)' }
        : { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free on existing bedding' },
      curatedRestaurants: [
        { name: 'The Olive Restaurant at Windflower', cuisine: 'Chef’s Gourmet Table', signatureDish: 'Slow-cooked Malabar Pepper Duck with Steamed Rice', priceForTwo: 2100, vibe: 'Misty Hilltop Fine Dining' },
        { name: 'Breeze Valley Pavilion', cuisine: 'Multi-Cuisine Barbecue', signatureDish: 'Live Tandoor Skewers & Spice-infused Mocktails', priceForTwo: 1700, vibe: 'Open-Sky Mountain Vista' },
      ],
    };
  }

  // 5. General Fallback for other destinations
  const base = dest;
  if (optionIndex === 0) {
    return {
      stayName: `${base} Traveler Backpacker Hostel & Pods`,
      stayAmenity: 'Central Location • Free High-Speed Wi-Fi • Community Lounge',
      childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free with parents in private rooms' },
      curatedRestaurants: [
        { name: `${base} Heritage Food Mess`, cuisine: 'Local Specialties', signatureDish: 'Traditional Daily Thali & Fresh Breads', priceForTwo: 400, vibe: 'Authentic Local Classic' },
        { name: 'The Traveler’s Corner Cafe', cuisine: 'Cafe & Quick Bites', signatureDish: 'Fresh Artisan Sandwiches & Roasted Coffee', priceForTwo: 450, vibe: 'Casual & Friendly' },
      ],
    };
  }
  if (optionIndex === 1) {
    return {
      stayName: `${base} Boutique Garden Retreat & Suites`,
      stayAmenity: 'Deluxe AC Rooms • Scenic Garden Terrace • Daily Breakfast Buffet',
      childPolicy: { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free (complimentary breakfast)' },
      curatedRestaurants: [
        { name: `${base} Grand Kitchen`, cuisine: 'Regional Fine Dining', signatureDish: 'Chef’s Signature Spiced Platter & Claypot Delicacy', priceForTwo: 900, vibe: 'Warm Family Dining' },
        { name: 'The Terrace Bistro & Lounge', cuisine: 'Multi-Cuisine & Grill', signatureDish: 'Fresh Grilled Cutlets with Seasonal Salads', priceForTwo: 850, vibe: 'Scenic Viewpoint Terrace' },
      ],
    };
  }
  return {
    stayName: `${base} Grand Palace & Luxury Wellness Resort`,
    stayAmenity: 'Luxury Suites with Panoramic Balcony • Heated Pool • Signature Spa',
    childPolicy: companion === 'Family'
      ? { isFree: false, ratePerNight: 700, description: 'Kids (<5 yrs): ₹700/night (extra rollaway bed & breakfast)' }
      : { isFree: true, ratePerNight: 0, description: 'Kids (<5 yrs): Stay Free on existing bedding' },
    curatedRestaurants: [
      { name: `Royal Pavilion at ${base}`, cuisine: 'Gourmet Heritage Dining', signatureDish: 'Signature Royal Tasting Menu for Two', priceForTwo: 2200, vibe: '5-Star Luxury Splendor' },
      { name: 'The Azure Lounge & Wine Bar', cuisine: 'Continental & Local Seafood', signatureDish: 'Wood-fired Oven Specialties & Fine Desserts', priceForTwo: 1800, vibe: 'Refined Candlelit Ambience' },
    ],
  };
}

/**
 * Generate 3 AI-Tailored Trip Options combining ALL filter constraints
 */
export function generateTripOptions(input: TripOptionsInput): {
  options: TripOptionVariant[];
  curatorIntelligence: string;
} {
  const dest = input.destination || 'Destination';
  const country = input.country || 'Global';
  const days = Math.min(Math.max(input.daysCount || 5, 1), 14);
  const budget = normalizeBudgetTier(input.budgetTier);
  const companion = normalizeCompanion(input.companion);
  const rhythm = input.energyRhythm || 'balanced';
  const highlights = input.highlights && input.highlights.length > 0
    ? input.highlights
    : [`Historic Center of ${dest}`, `Scenic Viewpoints in ${dest}`, `Local Artisan Markets`];
  const foods = input.foodPreferences && input.foodPreferences.length > 0
    ? input.foodPreferences
    : ['Local specialties', 'Street delicacies', 'Authentic regional recipes'];

  // Base Curator Advisory Insight
  const curatorIntelligence = input.curatorNote && input.curatorNote.trim().length > 10
    ? input.curatorNote
    : `${dest}'s vibrant culture, scenic landscapes, and regional character make it an exceptional ${companion.toLowerCase()} destination. One note: Plan your days around local daylight hours to enjoy viewpoints and authentic dining at their prime moments.`;

  // Define 3 options based on holistic persona combination
  interface OptionTemplate {
    title: string;
    tagline: string;
    badge: string;
    stayType: string;
    starRating: string;
    description: string;
    dailyStay: number;
    dailyFood: number;
    dailyTransit: number;
    actMultiplier: number;
    pace: 'Relaxed' | 'Balanced' | 'Fast-Paced';
    highlights: string[];
    inclusions: string[];
  }

  let templates: [OptionTemplate, OptionTemplate, OptionTemplate];

  if (budget === 'Budget') {
    if (companion === 'Solo') {
      templates = [
        {
          title: 'Social Backpacker & Dormitory Pod Trail',
          tagline: 'Connect with fellow travelers while exploring on a shoestring',
          badge: 'Hostel Pod • Maximum Social',
          stayType: 'Verified Backpacker Hostel Pod / Bunk (e.g. Zostel-style)',
          starRating: 'Hostel Dormitory',
          description: `Designed specifically for the budget solo traveler: stay in a vibrant, secure backpacker dormitory in ${dest}, join community walking tours, and savor budget-friendly street foods.`,
          dailyStay: 750,
          dailyFood: 450,
          dailyTransit: 150,
          actMultiplier: 0.5,
          pace: 'Balanced',
          highlights: ['Hostel community hub & social vibes', 'Self-guided scenic walking trails', 'Authentic street eats & cheap thalis'],
          inclusions: ['Bunk in air-cooled hostel pod', 'Free Wi-Fi & lockers', 'Shared transit advice', 'Community walking routes'],
        },
        {
          title: 'Independent Explorer & Local Homestay',
          tagline: 'Private space with genuine warmth from a local host family',
          badge: 'Cozy Homestay • Cultural Immersion',
          stayType: 'Private Room in Certified Family Homestay / 2-Star Guesthouse',
          starRating: '2-Star / Homestay',
          description: `Enjoy your own private sanctuary without breaking the bank. Home-cooked regional breakfasts, local tips from your host, and peaceful solo exploration of ${dest}.`,
          dailyStay: 1400,
          dailyFood: 600,
          dailyTransit: 250,
          actMultiplier: 0.7,
          pace: 'Relaxed',
          highlights: ['Private room with attached bath', 'Home-cooked local breakfast', 'Offbeat viewpoints away from crowds'],
          inclusions: ['Private homestay room', 'Traditional breakfast daily', 'Insider neighborhood guide', 'Affordable auto/taxi contacts'],
        },
        {
          title: 'Standard Comfort & 3-Star Boutique Inn',
          tagline: 'The sweet spot of reliable comfort and smart budget control',
          badge: '3-Star Standard • Smart Comfort',
          stayType: 'Private Ensuite Room in Clean 3-Star City Hotel / Lodge',
          starRating: '3-Star Standard',
          description: `The upper threshold of budget travel: a dependable 3-star room with modern amenities, central location, and verified cleanliness. Strictly excludes expensive 4/5-star markups.`,
          dailyStay: 2200,
          dailyFood: 850,
          dailyTransit: 400,
          actMultiplier: 1.0,
          pace: 'Balanced',
          highlights: ['Air-conditioned private room', 'Central walkable location', 'Curated entry to iconic sights'],
          inclusions: ['3-Star hotel room with private bath', 'Daily breakfast buffet', '24/7 reception & security', 'Curated sightseeing map'],
        },
      ];
    } else if (companion === 'Family') {
      templates = [
        {
          title: 'Family Heritage Homestay & Garden Retreat',
          tagline: 'Spacious, home-cooked, and safe for parents & kids alike',
          badge: 'Family Homestay • Safe & Spacious',
          stayType: 'Spacious Family Quad Room in Certified Homestay with Garden',
          starRating: 'Certified Family Homestay',
          description: `A warm, stress-free family haven in ${dest}. Ample lawn space for children, freshly cooked hygienic regional meals, and relaxed pacing with zero rush.`,
          dailyStay: 2800,
          dailyFood: 1600,
          dailyTransit: 800,
          actMultiplier: 0.8,
          pace: 'Relaxed',
          highlights: ['Garden lawn & safe open play area', 'Custom home-cooked kid-friendly meals', 'Gentle scenic nature strolls'],
          inclusions: ['Spacious 4-bed family suite', 'Fresh home-style breakfast', 'Private day cab driver contacts', 'Child-friendly activity tips'],
        },
        {
          title: 'Comfort 2-Star Family Guesthouse',
          tagline: 'Practical, well-located, and gentle on the family budget',
          badge: '2-Star Guesthouse • Practical Base',
          stayType: 'Connected Family Rooms in Clean 2-Star Guesthouse',
          starRating: '2-Star Guesthouse',
          description: `A cost-effective family setup in ${dest} offering interconnected rooms, easy transit access to major landmarks, and proximity to family-friendly dining.`,
          dailyStay: 3400,
          dailyFood: 2000,
          dailyTransit: 1100,
          actMultiplier: 1.0,
          pace: 'Balanced',
          highlights: ['Connected family rooms', 'Easy access to kid-friendly sights', 'Reliable local family restaurants'],
          inclusions: ['Twin connected rooms with AC', 'Filtered drinking water & Wi-Fi', 'Private auto-rickshaw / cab arrangements', 'Entry tickets guidance'],
        },
        {
          title: 'Family Standard 3-Star Suite',
          tagline: 'Reliable amenities, breakfast included, and full peace of mind',
          badge: '3-Star Family • Full Comfort',
          stayType: 'Family Deluxe Suite in Verified 3-Star Hotel',
          starRating: '3-Star Hotel',
          description: `The top tier of budget family travel: full hotel services, in-house restaurant, hot water, and lift access, ensuring zero compromises on comfort or safety.`,
          dailyStay: 4500,
          dailyFood: 2400,
          dailyTransit: 1400,
          actMultiplier: 1.2,
          pace: 'Balanced',
          highlights: ['In-house restaurant & room service', 'Spacious ensuite family room', 'Curated family sightseeing itinerary'],
          inclusions: ['3-Star Deluxe Family Room', 'Buffet breakfast included', 'Dedicated parking & cab desk', 'Curated family day plan'],
        },
      ];
    } else {
      // Couple or Friends (Budget)
      templates = [
        {
          title: companion === 'Friends' ? 'Friends Group Hostel & Quad Bunk' : 'Charming Budget Guesthouse & Café Trail',
          tagline: companion === 'Friends' ? 'Maximum energy, group laughs, and low costs' : 'Cozy, authentic, and delightfully affordable for two',
          badge: companion === 'Friends' ? 'Group Hostel • Social Vibes' : 'Cozy Guesthouse • Sweet & Simple',
          stayType: companion === 'Friends' ? 'Private 4-Bed Dormitory Room' : 'Ensuite Room in Scenic Budget Guesthouse',
          starRating: companion === 'Friends' ? 'Hostel Private Dorm' : 'Budget Guesthouse',
          description: `Explore ${dest} together without overspending: authentic local food joints, breathtaking free sunset viewpoints, and clean, high-spirited accommodations.`,
          dailyStay: companion === 'Friends' ? 2400 : 1300,
          dailyFood: companion === 'Friends' ? 1800 : 900,
          dailyTransit: companion === 'Friends' ? 600 : 350,
          actMultiplier: 0.6,
          pace: 'Balanced',
          highlights: ['Scenic viewpoints & evening strolls', 'Famous local street food spots', 'Community hub & friendly ambiance'],
          inclusions: ['Clean private room/dorm with lockers', 'Free Wi-Fi & tea/coffee', 'Walking route maps', 'Budget transit guidance'],
        },
        {
          title: 'Authentic Regional Homestay Experience',
          tagline: 'Immerse in local living with home-cooked meals and host hospitality',
          badge: 'Local Homestay • Warm Hospitality',
          stayType: 'Heritage Homestay Room with Balcony / Veranda',
          starRating: '2-Star Homestay',
          description: `Experience ${dest} through the eyes of locals. Enjoy warm hospitality, secret recommendations away from tourist crowds, and home-style culinary delights.`,
          dailyStay: companion === 'Friends' ? 3200 : 1800,
          dailyFood: companion === 'Friends' ? 2200 : 1200,
          dailyTransit: companion === 'Friends' ? 900 : 500,
          actMultiplier: 0.8,
          pace: 'Relaxed',
          highlights: ['Balcony view of local landscape', 'Home-cooked traditional breakfast', 'Quiet trails and secret spots'],
          inclusions: ['Spacious room with balcony', 'Traditional home breakfast', 'Local insider itinerary', 'Shared cab recommendations'],
        },
        {
          title: 'Standard Comfort 3-Star City Stay',
          tagline: 'Central convenience, modern essentials, and smart spending',
          badge: '3-Star Hotel • City Convenience',
          stayType: 'Standard Double/Twin Room in 3-Star Hotel',
          starRating: '3-Star Hotel',
          description: `The maximum threshold of budget travel: a dependable 3-star city hotel with air conditioning, elevator, Wi-Fi, and easy access to ${dest}'s top sights. Strictly no luxury markup.`,
          dailyStay: companion === 'Friends' ? 4200 : 2500,
          dailyFood: companion === 'Friends' ? 2600 : 1500,
          dailyTransit: companion === 'Friends' ? 1200 : 700,
          actMultiplier: 1.0,
          pace: 'Balanced',
          highlights: ['Air-conditioned modern room', 'Central walkable neighborhood', 'Breakfast included'],
          inclusions: ['3-Star Standard Room', 'Daily breakfast', '24/7 front desk', 'Local travel assistance'],
        },
      ];
    }
  } else if (budget === 'Luxury') {
    // Luxury Tier
    templates = [
      {
        title: 'Heritage Palace & Grand Luxury Experience',
        tagline: 'Timeless grandeur, royal suites, and white-glove hospitality',
        badge: '5-Star Heritage • Royal Elegance',
        stayType: `Luxury Heritage Palace / 5-Star Grand Hotel in ${dest}`,
        starRating: '5-Star Luxury Palace',
        description: `Indulge in royal opulence in ${dest}. Historic architecture, bespoke butler service, private fine-dining pavilions, and chauffeur-driven luxury transit.`,
        dailyStay: 18000,
        dailyFood: 5500,
        dailyTransit: 3500,
        actMultiplier: 2.5,
        pace: 'Relaxed',
        highlights: ['Royal heritage suite with panoramic vistas', 'Candlelit chef-curated private dining', 'Private chauffeur throughout the journey'],
        inclusions: ['Luxury 5-Star Suite', 'Full gourmet breakfast', 'Dedicated chauffeur & sedan', 'VIP entry & private guide'],
      },
      {
        title: 'Secluded Boutique Pool Villa & Spa Retreat',
        tagline: 'Private infinity views, therapeutic wellness, and total privacy',
        badge: 'Private Villa • Seclusion & Spa',
        stayType: `Private Boutique Villa with Plunge Pool & Spa Pavilion`,
        starRating: 'Boutique Luxury Villa',
        description: `A haven of tranquility tailored for ${companion.toLowerCase()} travelers: secluded luxury villas, private plunge pool, signature Ayurvedic massages, and organic farm-to-table feasts.`,
        dailyStay: 22000,
        dailyFood: 6500,
        dailyTransit: 4000,
        actMultiplier: 2.8,
        pace: 'Relaxed',
        highlights: ['Private plunge pool & sun deck', 'Signature couple/individual spa rituals', 'Organic farm-to-table culinary experiences'],
        inclusions: ['Private Luxury Villa', 'Daily rejuvenating spa treatment', 'Gourmet dining allowance', 'Airport/station private transfers'],
      },
      {
        title: 'Experiential Bespoke Expedition & Fine Living',
        tagline: 'Private curated access, helicopter/luxury safari, and culinary art',
        badge: 'Curated Expedition • Exclusive Access',
        stayType: `Premium Luxury Eco-Lodge or High-End Hilltop Resort`,
        starRating: '5-Star Eco-Luxury Resort',
        description: `The pinnacle of tailored exploration: exclusive after-hours access to heritage landmarks, private naturalist-guided safaris, and multi-course wine/tea pairings.`,
        dailyStay: 26000,
        dailyFood: 7500,
        dailyTransit: 5000,
        actMultiplier: 3.2,
        pace: 'Balanced',
        highlights: ['Private naturalist/historian companion', 'Exclusive after-hours sight access', 'Masterclass with celebrity chef / master craftsman'],
        inclusions: ['Hilltop/Lakeside Luxury Chalet', 'All-inclusive gourmet meals & drinks', 'Dedicated 4x4 private transport', 'Curator bespoke concierge'],
      },
    ];
  } else {
    // Moderate Tier (Balanced 3 to 4 star comfort)
    templates = [
      {
        title: companion === 'Family' ? 'Kid-Friendly Nature & Wildlife Safari' : 'Curated Cultural & Boutique Discovery',
        tagline: 'Rich local experiences, characterful stays, and relaxed pacing',
        badge: 'Boutique Hotel • Character & Charm',
        stayType: `Charming 3-4 Star Boutique Hotel in central ${dest}`,
        starRating: 'Boutique 3/4-Star',
        description: `Handpicked boutique accommodations with regional design flair, delicious authentic dining at popular neighborhood kitchens, and a balanced day flow.`,
        dailyStay: 4200,
        dailyFood: 2200,
        dailyTransit: 1200,
        actMultiplier: 1.3,
        pace: 'Balanced',
        highlights: ['Boutique regional architecture', 'Guided cultural walking tours', 'Handpicked local restaurant dining'],
        inclusions: ['Boutique Deluxe Room', 'Breakfast buffet daily', 'Comfortable AC cab transfers', 'Sight entry tickets included'],
      },
      {
        title: companion === 'Family' ? 'Interactive Plantation Living & Farm Craft' : 'Artisanal Culinary & Scenic Hidden Gems',
        tagline: 'Deep dive into local tastes, secret viewpoints, and artisanal crafts',
        badge: 'Estate Lodge • Culinary & Craft',
        stayType: `Scenic Eco-Lodge or Plantation Cottage in ${dest}`,
        starRating: 'Eco-Resort / 3-Star Lodge',
        description: `Surround yourself with breathtaking nature. Experience guided plantation walks, artisanal tastings (${foods[0] || 'local specialties'}), and serene sunset vistas.`,
        dailyStay: 4800,
        dailyFood: 2500,
        dailyTransit: 1400,
        actMultiplier: 1.4,
        pace: 'Relaxed',
        highlights: ['Scenic plantation or lakeside setting', 'Artisanal culinary & tasting masterclass', 'Serene uncrowded viewpoints'],
        inclusions: ['Cottage with valley/garden view', 'Specialty culinary dinner', 'Guided plantation tour', 'Private transit support'],
      },
      {
        title: 'Comfort Leisure & Complete Exploration',
        tagline: 'All major sights covered seamlessly with modern comfort',
        badge: 'Premium 4-Star • Full Ease',
        stayType: `Premium 4-Star Hotel with Swimming Pool & Wellness`,
        starRating: '4-Star Hotel',
        description: `Seamless travel with zero hassle: 4-star comfort, swimming pool, on-demand cab service, and complete coverage of ${dest}'s top signature highlights.`,
        dailyStay: 5800,
        dailyFood: 2800,
        dailyTransit: 1600,
        actMultiplier: 1.6,
        pace: 'Balanced',
        highlights: ['Hotel pool & fitness/wellness amenities', 'Fast-track access to signature attractions', 'Dedicated private driver for day excursions'],
        inclusions: ['4-Star Executive Room', 'Daily gourmet breakfast', 'Dedicated AC private cab', '24/7 concierge assistance'],
      },
    ];
  }

  const defaultAdults = companion === 'Solo' ? 1 : companion === 'Couple' ? 2 : companion === 'Friends' ? 3 : 2;
  const defaultChildren = companion === 'Family' ? 1 : 0;
  const adults = Math.max(input.adultsCount ?? defaultAdults, 1);
  const children = Math.max(input.childrenCount ?? defaultChildren, 0);

  // Synthesize each option into full TripOptionVariant with synchronized days & dynamic budget
  const options: TripOptionVariant[] = templates.map((tmpl, optIdx) => {
    const optionId = `opt-${optIdx + 1}`;
    const stayAndDining = getOptionStaysAndDining(dest, optIdx, budget, companion);

    // Synthesize days matching this exact option's character & stay
    const optionDays: ItineraryDay[] = Array.from({ length: days }, (_, dayIdx) => {
      const dayNum = dayIdx + 1;
      const isFirst = dayNum === 1;
      const isLast = dayNum === days;
      const diningSpot = stayAndDining.curatedRestaurants[dayIdx % stayAndDining.curatedRestaurants.length];

      // Activity 1: Morning
      const act1Cost = Math.round(350 * tmpl.actMultiplier);
      const act1: ActivityItem = {
        id: `act-${optionId}-${dayNum}-1`,
        time: isFirst ? '10:00 AM' : '09:00 AM',
        period: 'Morning',
        title: isFirst
          ? `Check-in at ${stayAndDining.stayName} & Orientation`
          : `Explore ${highlights[(dayIdx * 2) % highlights.length] || dest}`,
        description: isFirst
          ? `Settle into ${stayAndDining.stayName}, unpack, and take a gentle stroll around the immediate scenic neighborhood.`
          : `Morning visit to ${highlights[(dayIdx * 2) % highlights.length] || dest} during golden morning light.`,
        location: isFirst ? stayAndDining.stayName : dest,
        duration: '2.5 hrs',
        cost: isFirst ? 0 : act1Cost,
        category: 'sightseeing',
        tips: 'Comfortable walking shoes recommended.',
      };

      // Activity 2: Afternoon Dining & Craft
      const act2Cost = Math.round(500 * tmpl.actMultiplier);
      const act2: ActivityItem = {
        id: `act-${optionId}-${dayNum}-2`,
        time: '01:00 PM',
        period: 'Afternoon',
        title: `Curator Dining: ${diningSpot.name} (${diningSpot.cuisine})`,
        description: `Savor ${diningSpot.signatureDish} at ${diningSpot.name}. Vibe: ${diningSpot.vibe}. (Approx ₹${diningSpot.priceForTwo} for two).`,
        location: diningSpot.name,
        duration: '1.5 hrs',
        cost: act2Cost,
        category: 'dining',
        tips: `Must try: ${diningSpot.signatureDish}.`,
      };

      // Activity 3: Evening Sunset & Leisure
      const act3Cost = Math.round(300 * tmpl.actMultiplier);
      const act3: ActivityItem = {
        id: `act-${optionId}-${dayNum}-3`,
        time: '05:30 PM',
        period: 'Evening',
        title: isLast
          ? `Farewell Sunset Stroll & Souvenir Shopping`
          : `Golden Hour at ${highlights[(dayIdx * 2 + 1) % highlights.length] || 'Scenic Viewpoint'}`,
        description: isLast
          ? `Pick up artisanal souvenirs, regional spices or teas, and soak in your last tranquil evening in ${dest}.`
          : `Relaxing sunset viewpoints and evening tea/beverage overlooking ${dest}.`,
        location: dest,
        duration: '2.0 hrs',
        cost: act3Cost,
        category: 'leisure',
        tips: 'Great photography opportunities.',
      };

      return {
        dayNumber: dayNum,
        date: `Day ${dayNum}`,
        title: isFirst
          ? `Arrival & Settling into ${dest}`
          : isLast
          ? `Cultural Farewell & Departure`
          : `${dest} Signature Discovery Day ${dayNum}`,
        theme: isFirst ? 'Atmospheric Welcome' : isLast ? 'Reflections & Farewell' : tmpl.badge,
        activities: [act1, act2, act3],
      };
    });

    // Calculate DYNAMIC mathematically exact total package budget
    const numberOfNights = Math.max(days - 1, 1);
    const roomsCount = companion === 'Solo' ? 1 : Math.max(Math.ceil(adults / 2), 1);
    const baseStayCost = tmpl.dailyStay * numberOfNights * roomsCount;
    const childStayCost = stayAndDining.childPolicy.isFree
      ? 0
      : stayAndDining.childPolicy.ratePerNight * numberOfNights * children;
    const totalStayCost = baseStayCost + childStayCost;

    const dailyFoodPerAdult = Math.round(tmpl.dailyFood / (companion === 'Solo' ? 1 : 2));
    const totalFoodCost = Math.round((dailyFoodPerAdult * adults + dailyFoodPerAdult * 0.35 * children) * days);

    const vehiclesNeeded = Math.max(Math.ceil((adults + children) / 4), 1);
    const totalTransitCost = tmpl.dailyTransit * days * vehiclesNeeded;

    const totalActivitiesCost = optionDays.reduce(
      (sum, d) => sum + d.activities.reduce((actSum, a) => actSum + a.cost, 0),
      0
    ) * adults;

    const totalIncidentals = Math.round((totalActivitiesCost + totalStayCost) * 0.05);

    const dynamicTotalBudget = totalStayCost + totalFoodCost + totalTransitCost + totalActivitiesCost + totalIncidentals;
    const perPersonBudget = Math.round(dynamicTotalBudget / adults);
    const dailyRate = Math.round(dynamicTotalBudget / days);

    return {
      id: optionId,
      title: tmpl.title,
      tagline: tmpl.tagline,
      badge: tmpl.badge,
      stayType: tmpl.stayType,
      starRating: tmpl.starRating,
      description: tmpl.description,
      estimatedBudget: dynamicTotalBudget,
      currency: 'INR',
      dailyRate,
      pace: tmpl.pace,
      highlights: tmpl.highlights,
      inclusions: tmpl.inclusions,
      days: optionDays,
      imageUrl: getOptionDestinationImage(dest, optIdx),
      stayInfo: {
        name: stayAndDining.stayName,
        type: tmpl.stayType,
        approxPerNight: tmpl.dailyStay,
        amenity: stayAndDining.stayAmenity,
        childPolicy: stayAndDining.childPolicy,
      },
      curatedRestaurants: stayAndDining.curatedRestaurants,
      adultsCount: adults,
      childrenCount: children,
      perPersonBudget,
    };
  });

  return { options, curatorIntelligence };
}

/**
 * High-quality, apt, and compressed (<150KB WebP) destination images for option variants
 */
export function getOptionDestinationImage(dest: string, optionIndex: number): string {
  const dLower = (dest || '').toLowerCase();

  if (dLower.includes('munnar')) {
    const photos = [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('alleppey') || dLower.includes('alappuzha')) {
    const photos = [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('goa')) {
    const photos = [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61782153f5b?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('ooty') || dLower.includes('nilgiri')) {
    const photos = [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('kyoto')) {
    const photos = [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('paris')) {
    const photos = [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520939817895-060bdef4d18f?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('maldives')) {
    const photos = [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('bali')) {
    const photos = [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559628233-eb1b1a45564b?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('dubai')) {
    const photos = [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('amalfi') || dLower.includes('positano')) {
    const photos = [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('santorini')) {
    const photos = [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61782153f5b?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }
  if (dLower.includes('swiss') || dLower.includes('alps') || dLower.includes('zermatt')) {
    const photos = [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    ];
    return photos[optionIndex % photos.length];
  }

  // Universal scenic fallback library indexed deterministically
  const universal = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  ];
  const charSum = (dest || 'travel').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return universal[(Math.abs(charSum) + optionIndex) % universal.length];
}
