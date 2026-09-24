'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MobileHeader from '@/components/navigation/MobileHeader';
import TimelineCard from '@/components/cards/TimelineCard';
import TextToSpeechButton from '@/components/shared/TextToSpeechButton';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { useTripStore } from '@/store';
import { MOCK_ITINERARY_DAYS, MOCK_TRIPS } from '@/constants';
import { Calendar, Compass, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import UnifiedBackButton from '@/components/navigation/UnifiedBackButton';
import { FilterPreferencesStrip } from '@/components/shared/FilterPreferencesStrip';

function ItineraryContent() {
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const { activeTripId, getTripById, getItineraryForTrip } = useTripStore();
  const tripId = tripIdParam || activeTripId || 'trip-kyoto-autumn';

  const currentTrip = getTripById(tripId) || MOCK_TRIPS[0];
  const itineraryDays = getItineraryForTrip(tripId) || MOCK_ITINERARY_DAYS;

  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [showEmptySim, setShowEmptySim] = useState(false);

  const activeDay = itineraryDays.find(
    (d) => d.dayNumber === selectedDayNumber
  ) || itineraryDays[0] || MOCK_ITINERARY_DAYS[0];

  const speechText = `Day ${activeDay.dayNumber}: ${activeDay.title}. Theme: ${activeDay.theme}. ` +
    activeDay.activities.map((a) => `At ${a.time}, ${a.title} located at ${a.location}. ${a.description}`).join(' ');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header */}
      <MobileHeader title="Day-Wise Itinerary" showBack />

      {/* High-Contrast Unified Back Button */}
      <UnifiedBackButton
        label="Back to AI Plan Studio"
        description="Return to your generated trip plan with all options preserved"
        mobileLabel="Back to Plan"
        badgeText="Active Plan"
        fallbackHref="/ai?view=result"
      />

      {/* Selected Filter Preferences Strip */}
      <FilterPreferencesStrip
        scope="in_state"
        daysCount={itineraryDays.length}
        companion="Curated"
        budgetTier="Moderate"
        energyRhythm="Scenic Explorer"
        className="mb-6"
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="sunset" size="sm">
              {currentTrip.title}
            </Badge>
            <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
              {itineraryDays.length} Days Planned
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
            Day-by-Day Story
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Back to AI planner button if viewing newly generated plan */}
          <Link
            href="/ai?view=result"
            className="text-xs font-semibold text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 hover:text-[#FF4F7A] flex items-center gap-1 bg-white/70 dark:bg-[#280814]/70 px-3 py-2 rounded-full border border-[#5B0B24]/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>AI Plan Studio</span>
          </Link>

          {/* Read Itinerary Audio Button */}
          <TextToSpeechButton textToRead={speechText} label="Read Day Itinerary" />

          {/* Empty State Simulator Toggle */}
          <button
            type="button"
            onClick={() => setShowEmptySim(!showEmptySim)}
            className="text-xs px-3 py-1.5 rounded-full border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/5"
          >
            {showEmptySim ? 'Show Activities' : 'Simulate Empty Day'}
          </button>
        </div>
      </div>

      {/* Day Selector Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {itineraryDays.map((day) => (
          <Chip
            key={day.dayNumber}
            label={`Day ${day.dayNumber}`}
            count={day.activities.length}
            selected={selectedDayNumber === day.dayNumber && !showEmptySim}
            onClick={() => {
              setSelectedDayNumber(day.dayNumber);
              setShowEmptySim(false);
            }}
          />
        ))}
      </div>

      {/* Day Title & Theme Banner */}
      {!showEmptySim && (
        <div className="rounded-[22px] bg-white dark:bg-[#280814] border border-[#5B0B24]/8 dark:border-[#FF8BA7]/15 p-4 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FF7A3D] uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeDay.date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
              Day {activeDay.dayNumber}: {activeDay.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-1">
              {activeDay.theme}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
            <span className="bg-[#5B0B24]/5 dark:bg-[#FF8BA7]/10 px-3 py-1 rounded-full">
              {activeDay.activities.length} Activities
            </span>
          </div>
        </div>
      )}

      {/* Day Timeline Activities */}
      {!showEmptySim ? (
        <div className="space-y-4 max-w-4xl">
          {activeDay.activities.map((activity) => (
            <TimelineCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Compass className="w-8 h-8 text-[#FF4F7A]" />}
          title="No activities for this day yet (Simulation)"
          description="Your timeline for this day is currently open. Tell Journi AI what you want to experience or add an activity."
          actionLabel="Add Activity with AI"
          onAction={() => setShowEmptySim(false)}
        />
      )}
    </main>
  );
}

function ItinerarySkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-pulse">
      {/* Top bar skeleton */}
      <div className="flex items-center justify-between pb-3 border-b border-[#5B0B24]/10 dark:border-white/10">
        <div className="h-9 w-36 rounded-full bg-[#5B0B24]/10 dark:bg-white/10" />
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF7A3D]" />
          <span className="text-xs font-semibold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
            Loading day-by-day story...
          </span>
        </div>
      </div>

      {/* Filter strip skeleton */}
      <div className="h-14 rounded-2xl bg-[#FFF5F8]/70 dark:bg-[#280814]/70 border border-[#FF4F7A]/15" />

      {/* Title & subtitle skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 rounded-full bg-[#5B0B24]/10 dark:bg-white/10" />
        <div className="h-8 w-64 rounded-full bg-[#5B0B24]/15 dark:bg-white/15" />
      </div>

      {/* Day pill bar skeleton */}
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 rounded-full bg-[#FFF5F8]/80 dark:bg-[#280814]/80 border border-[#FF4F7A]/15 shrink-0" />
        ))}
      </div>

      {/* Timeline activity cards skeleton */}
      <div className="space-y-4 max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-[24px] bg-[#FFF5F8]/60 dark:bg-[#280814]/60 border border-[#FF4F7A]/15 p-5 flex flex-col sm:flex-row gap-4"
          >
            <div className="w-full sm:w-44 h-32 rounded-2xl bg-[#5B0B24]/10 dark:bg-white/10 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-28 rounded-full bg-[#5B0B24]/10 dark:bg-white/10" />
              <div className="h-6 w-3/4 rounded-full bg-[#5B0B24]/15 dark:bg-white/15" />
              <div className="h-3.5 w-full rounded-full bg-[#5B0B24]/10 dark:bg-white/10" />
              <div className="h-3.5 w-2/3 rounded-full bg-[#5B0B24]/10 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<ItinerarySkeleton />}>
      <ItineraryContent />
    </Suspense>
  );
}
