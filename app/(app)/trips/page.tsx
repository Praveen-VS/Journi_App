'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MobileHeader from '@/components/navigation/MobileHeader';
import TripCard from '@/components/cards/TripCard';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useTripStore } from '@/store';
import { MOCK_TRIPS } from '@/constants';
import { TripStatus } from '@/types';
import { Sparkles, Map } from 'lucide-react';

export default function TripsPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | TripStatus>('all');
  const [showEmptySim, setShowEmptySim] = useState(false);
  const customTrips = useTripStore((state) => state.customTrips);

  const tabs: Array<{ id: 'all' | TripStatus; label: string }> = [
    { id: 'all', label: 'All Trips' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'draft', label: 'Draft Ideas' },
    { id: 'completed', label: 'Past Memories' },
  ];

  const tripsPool = customTrips && customTrips.length > 0 ? customTrips : MOCK_TRIPS;

  const filteredTrips = tripsPool.filter((trip) => {
    if (showEmptySim) return false;
    if (selectedTab === 'all') return true;
    return trip.status === selectedTab;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header */}
      <MobileHeader title="My Trips" />

      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
            Trip Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-1">
            Organize, customize, and relive your personalized travel stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Empty State Simulator Toggle */}
          <button
            type="button"
            onClick={() => setShowEmptySim(!showEmptySim)}
            className="text-xs px-3 py-1.5 rounded-full border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/5"
          >
            {showEmptySim ? 'Show Loaded Trips' : 'Simulate Empty State'}
          </button>

          <Link href="/ai">
            <Button
              variant="sunset"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="shadow-sunset"
            >
              Plan New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Segment Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
        {tabs.map((tab) => (
          <Chip
            key={tab.id}
            label={tab.label}
            selected={selectedTab === tab.id}
            onClick={() => {
              setSelectedTab(tab.id);
              setShowEmptySim(false);
            }}
          />
        ))}
      </div>

      {/* Trips Grid or Empty State */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Map className="w-8 h-8 text-[#FF4F7A]" />}
          title={showEmptySim ? 'No trips found (Simulation)' : 'No trips in this category'}
          description="You haven't created any trips in this section yet. Use Journi AI to sequence your dream escape."
          actionLabel="Create Trip with AI"
          onAction={() => {
            setShowEmptySim(false);
          }}
        />
      )}
    </main>
  );
}
