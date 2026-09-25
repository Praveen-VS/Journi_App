'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import AIPromptInput from '@/components/forms/AIPromptInput';
import CompactTasteConsole from '@/components/forms/CompactTasteConsole';
import TripCard from '@/components/cards/TripCard';
import DestinationCard from '@/components/cards/DestinationCard';
import AITravelPlanCard from '@/components/cards/AITravelPlanCard';
import CategoryGrid from '@/components/shared/CategoryGrid';
import MobileHeader from '@/components/navigation/MobileHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import PromptSuggestionChip from '@/components/ui/PromptSuggestionChip';
import {
  MOCK_USER,
  MOCK_TRIPS,
  MOCK_DESTINATIONS,
  SAMPLE_AI_PROMPTS,
} from '@/constants';
import {
  Sparkles,
  Compass,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { UIStateMode, Destination } from '@/types';
import { useSavedStore } from '@/store';

const categoryToLandscape: Record<string, string> = {
  Mountains: 'mountains',
  Beaches: 'beaches',
  Cities: 'metropolis',
  Nature: 'nature',
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || '';
  const initialLandscapeParam = searchParams.get('landscape') || '';

  const { isSaved, toggleFavorite } = useSavedStore();
  const [uiState, setUiState] = useState<UIStateMode>('default');

  const resolvedInitialCat = initialCategoryParam
    ? initialCategoryParam.charAt(0).toUpperCase() + initialCategoryParam.slice(1).toLowerCase()
    : initialLandscapeParam === 'mountains'
    ? 'Mountains'
    : initialLandscapeParam === 'beaches'
    ? 'Beaches'
    : initialLandscapeParam === 'metropolis'
    ? 'Cities'
    : initialLandscapeParam === 'nature'
    ? 'Nature'
    : null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(resolvedInitialCat);
  const [selectedLandscape, setSelectedLandscape] = useState<string | null>(
    initialLandscapeParam || (resolvedInitialCat ? categoryToLandscape[resolvedInitialCat] : null)
  );
  const [consoleQuery, setConsoleQuery] = useState<string>('');
  const [consoleTrigger, setConsoleTrigger] = useState<number>(0);

  const upcomingTrip = MOCK_TRIPS[0];

  const handlePromptSubmit = (prompt: string) => {
    if (prompt && prompt.trim()) {
      const q = prompt.trim();
      setConsoleQuery(q);
      const lower = q.toLowerCase();
      if (lower.includes('beach') || lower.includes('coast')) {
        setSelectedLandscape('beaches');
        setSelectedCategory('Beaches');
      } else if (lower.includes('mountain') || lower.includes('alpine') || lower.includes('hike')) {
        setSelectedLandscape('mountains');
        setSelectedCategory('Mountains');
      } else if (lower.includes('city') || lower.includes('urban')) {
        setSelectedLandscape('metropolis');
        setSelectedCategory('Cities');
      } else if (lower.includes('nature') || lower.includes('forest') || lower.includes('wild')) {
        setSelectedLandscape('nature');
        setSelectedCategory('Nature');
      }
      setConsoleTrigger((prev) => prev + 1);
      const el = document.getElementById('plan');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      const el = document.getElementById('plan');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push('/home#plan');
      }
    }
  };

  const handleCategorySelect = (category: string) => {
    const isTogglingOff = selectedCategory === category;
    const newCat = isTogglingOff ? null : category;
    setSelectedCategory(newCat);

    const mappedLandscape = newCat ? (categoryToLandscape[newCat] || 'beaches') : 'beaches';
    setSelectedLandscape(mappedLandscape);
    setConsoleTrigger((prev) => prev + 1);

    const el = document.getElementById('plan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter destinations if category selected
  const filteredDestinations = selectedCategory
    ? MOCK_DESTINATIONS.filter((d) => {
        const cat = selectedCategory.toLowerCase();
        return (
          d.vibes.some((v) => v.toLowerCase().includes(cat)) ||
          d.name.toLowerCase().includes(cat) ||
          (cat === 'mountains' && (d.landscape?.toLowerCase().includes('alpine') || d.landscape?.toLowerCase().includes('mountain'))) ||
          (cat === 'beaches' && (d.landscape?.toLowerCase().includes('beach') || d.landscape?.toLowerCase().includes('coast'))) ||
          (cat === 'cities' && (d.landscape?.toLowerCase().includes('metropolis') || d.landscape?.toLowerCase().includes('historic'))) ||
          (cat === 'nature' && (d.landscape?.toLowerCase().includes('nature') || d.landscape?.toLowerCase().includes('forest')))
        );
      })
    : MOCK_DESTINATIONS;

  // Loading Skeleton State
  if (uiState === 'loading') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <MobileHeader title="Journi Home" />
        <div className="space-y-4">
          <Skeleton height={140} className="w-full rounded-[28px]" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton height={100} className="rounded-2xl" />
            <Skeleton height={100} className="rounded-2xl" />
            <Skeleton height={100} className="rounded-2xl" />
            <Skeleton height={100} className="rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton height={240} className="rounded-2xl" />
            <Skeleton height={240} className="rounded-2xl" />
            <Skeleton height={240} className="rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (uiState === 'error') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <MobileHeader title="Journi Home" />
        <EmptyState
          icon={<Compass className="w-8 h-8 text-rose-500" />}
          title="Could not load your travel dashboard"
          description="We encountered an unexpected connection error while fetching your recent journeys. Please retry."
          actionLabel="Retry Loading"
          onAction={() => setUiState('default')}
        />
      </main>
    );
  }

  // Empty State
  if (uiState === 'empty') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <MobileHeader title="Journi Home" />
        <div className="max-w-xl mx-auto text-center py-10">
          <EmptyState
            icon={<Sparkles className="w-8 h-8 text-[#FF7A3D]" />}
            title="No journeys planned yet"
            description="Your story starts with a single prompt. Tell Journi where you want to travel and let our AI craft your first itinerary."
            actionLabel="Create Your First Trip"
            onAction={() => router.push('/ai')}
          />
        </div>
      </main>
    );
  }

  // Default Loaded State (M07 Mobile Home & D03 Desktop Dashboard)
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-8 overflow-x-hidden">
      {/* Mobile Top Header with official logo & cursive tagline */}
      <div className="sm:hidden flex items-center justify-between pb-2">
        <MobileHeader title="" showLogo />
        <span
          className="text-[#FF2A6D] text-xs font-bold rotate-[-6deg]"
          style={{ fontFamily: 'var(--font-caveat, cursive)' }}
        >
          Explore a Better Tomorrow
        </span>
      </div>

      {/* ===================== HERO WELCOME & NATURAL LANGUAGE LAUNCHER ===================== */}
      <section className="relative rounded-[32px] sm:rounded-[36px] overflow-hidden bg-gradient-to-tr from-[#3E0717] via-[#C2185B] to-[#FF7A3D] text-white p-6 sm:p-10 shadow-xl">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-[#FFC83D]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Greeting Tag */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FFC83D] uppercase tracking-wider">
                Welcome back
              </span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/80 font-medium">
                {MOCK_USER.homeCity}
              </span>
            </div>
            <span
              className="hidden sm:inline-block text-white/90 text-sm md:text-base font-bold rotate-[-6deg]"
              style={{ fontFamily: 'var(--font-caveat, cursive)' }}
            >
              Explore a Better Tomorrow
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 leading-tight">
            Where to next, {MOCK_USER.name.split(' ')[0]}?
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-xl mb-6 leading-relaxed">
            Type any travel idea in plain words. Journi crafts complete day-by-day itineraries with smart INR budgets in seconds.
          </p>

          {/* Central Natural Language Prompt Box */}
          <div className="mb-4">
            <AIPromptInput onSubmit={handlePromptSubmit} />
          </div>

          {/* Suggestion Chips with single-line truncation and hover popover */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 pt-1 w-full max-w-full">
            <span className="text-xs font-semibold text-white/80 mr-1 shrink-0 mb-0.5 sm:mb-0">
              Try asking:
            </span>
            {SAMPLE_AI_PROMPTS.slice(0, 3).map((prompt, idx) => (
              <PromptSuggestionChip
                key={idx}
                prompt={prompt}
                onClick={handlePromptSubmit}
                variant="glass"
                popoverPosition="top"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ASTRA 6 AI FILTER & TASTE CONSOLE ===================== */}
      <section id="plan" className="w-full max-w-4xl mx-auto scroll-mt-24 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Badge variant="sunset" size="sm">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Astra 6 AI Engine
            </Badge>
            <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
              Smart Filter & Travel Taste Search
            </span>
          </div>
          <span
            className="text-[#FF2A6D] text-xs font-bold rotate-[-4deg] hidden sm:inline"
            style={{ fontFamily: 'var(--font-caveat, cursive)' }}
          >
            Live AI Recommendations
          </span>
        </div>

        <CompactTasteConsole
          externalLandscape={selectedLandscape}
          initialQuery={consoleQuery}
          searchTrigger={consoleTrigger}
          onLandscapeChange={(l) => {
            setSelectedLandscape(l);
            const matchedCat = Object.entries(categoryToLandscape).find(([, val]) => val === l);
            if (matchedCat) {
              setSelectedCategory(matchedCat[0]);
            }
          }}
        />
      </section>

      {/* ===================== M02 DISCOVER CATEGORY BOXES (Mountains, Beaches, Cities, Nature) ===================== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight">
              Discover by Style
            </h2>
            <p className="text-xs text-[#704250] dark:text-[#FFB3C6]">
              Tap any style to instantly filter and consult Astra AI
            </p>
          </div>
          <Link
            href="/saved"
            className="text-xs font-bold text-[#E61E50] hover:underline flex items-center gap-1"
          >
            <span>Saved Places</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </section>

      {/* ===================== SIGNATURE AI PLAN SHOWCASE (From M03 Mockup) ===================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 cols): Upcoming Adventure */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight">
              Upcoming Adventure
            </h2>
            <Link
              href={`/trips/${upcomingTrip.id}`}
              className="text-xs font-bold text-[#E61E50] hover:underline flex items-center gap-1"
            >
              <span>View Trip Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Upcoming Trip Card */}
          <div className="rounded-[28px] bg-white dark:bg-[#240612] border border-[#FF4F7A]/20 p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="relative w-full sm:w-48 h-40 rounded-2xl overflow-hidden shrink-0">
                <Image
                  src={upcomingTrip.coverImage}
                  alt={upcomingTrip.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="golden" size="sm">
                    In 20 Days
                  </Badge>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between h-full space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#704250] dark:text-[#FFB3C6] font-medium mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E61E50]" />
                    <span>{upcomingTrip.destination}, {upcomingTrip.country}</span>
                    <span>•</span>
                    <span>{upcomingTrip.daysCount} Days Planned</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#3E0717] dark:text-white tracking-tight">
                    {upcomingTrip.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] line-clamp-2 mt-1.5 leading-relaxed">
                    {upcomingTrip.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F4EBEF] dark:border-white/5">
                  <div className="text-xs font-bold text-[#C2185B] dark:text-[#FF8BA7]">
                    Budget: ₹{upcomingTrip.estimatedBudget.toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/itinerary?tripId=${upcomingTrip.id}`}>
                      <Button variant="sunset" size="sm" className="font-bold">
                        Timeline Flow
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Active Trips Grid */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#3E0717] dark:text-[#FFF7FA]">
                All Planned Journeys ({MOCK_TRIPS.length})
              </h3>
              <Link href="/trips" className="text-xs text-[#E61E50] font-semibold hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_TRIPS.slice(0, 2).map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Signature M03 AI Travel Plan Card Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight">
              Featured AI Plan
            </h2>
            <Link
              href="/#plan"
              className="text-xs font-bold text-[#E61E50] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Generate New</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* M03 Signature Travel Plan Card with Maldives / Indian Rupee */}
          <AITravelPlanCard
            title="Maldives Getaway"
            durationDays={5}
            peopleCount="2 People"
            tags={['Beaches', 'Adventure', 'Relaxation']}
            imageUrl="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80"
            bestTime="Nov - Apr"
            estimatedBudget={240000}
            topExperiences="Snorkeling, Island Hopping, Sunset Cruise"
            foodRecommendations="Local Seafood, Coconut Curries, Cafés"
            isSaved={isSaved('Maldives Getaway')}
            onSave={() =>
              toggleFavorite({
                id: 'dest-maldives-featured',
                name: 'Maldives Getaway',
                destination: 'Maldives',
                country: 'Maldives',
                coverImage:
                  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80',
                tagline: 'Tropical paradise of overwater bungalows and coral reefs',
                idealDays: 5,
                estimatedBudget: 240000,
                continent: 'Asia',
                bestTimeToVisit: 'Nov - Apr',
                vibes: ['Beaches', 'Adventure', 'Relaxation'],
                popularSpots: ['Male', 'Maafushi', 'Ari Atoll'],
                rating: 4.9,
                reviewCount: 340,
              } as unknown as Destination)
            }
            onExplore={() => router.push('/ai?prompt=Plan+a+5-day+Maldives+Getaway+for+2+people')}
          />
        </div>
      </section>

      {/* ===================== CURATED DESTINATIONS ===================== */}
      <section className="pt-4 border-t border-[#F4EBEF] dark:border-[#FF4F7A]/15">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight">
              Inspiring Destinations
            </h2>
            <p className="text-xs text-[#704250] dark:text-[#FFB3C6]">
              Explore breathtaking getaways crafted for unforgettable memories
            </p>
          </div>
          <Link
            href="/saved"
            className="text-xs font-bold text-[#E61E50] hover:underline flex items-center gap-1"
          >
            <span>Bucket List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredDestinations.slice(0, 4).map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onSelect={(d) =>
                router.push(
                  `/ai?prompt=${encodeURIComponent(
                    `Plan a trip to ${d.name}, ${d.country} for ${d.idealDays} days.`
                  )}`
                )
              }
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <MobileHeader title="Journi Home" />
          <div className="space-y-4">
            <Skeleton height={140} className="w-full rounded-[28px]" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Skeleton height={100} className="rounded-2xl" />
              <Skeleton height={100} className="rounded-2xl" />
              <Skeleton height={100} className="rounded-2xl" />
              <Skeleton height={100} className="rounded-2xl" />
            </div>
          </div>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
