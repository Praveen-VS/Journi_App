'use client';

import React, { useState } from 'react';
import SearchInput from '@/components/forms/SearchInput';
import DestinationCard from '@/components/cards/DestinationCard';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { MOCK_DESTINATIONS } from '@/constants';
import { Compass } from 'lucide-react';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');

  const [visibleCount, setVisibleCount] = useState(32);

  const continents = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];
  const vibes = ['All', 'Cultural', 'Romantic', 'Scenic', 'Adventure', 'Peace & Zen'];

  const filteredDestinations = MOCK_DESTINATIONS.filter((dest) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      dest.name.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      (dest.state && dest.state.toLowerCase().includes(q)) ||
      dest.tagline.toLowerCase().includes(q);

    const matchesContinent =
      selectedContinent === 'All' ||
      dest.continent === selectedContinent ||
      (selectedContinent === 'Americas' && (dest.continent === 'North America' || dest.continent === 'South America'));

    const matchesVibe =
      selectedVibe === 'All' ||
      dest.vibes.some((v) => v.toLowerCase().includes(selectedVibe.toLowerCase())) ||
      (dest.energyRhythm && dest.energyRhythm.toLowerCase().includes(selectedVibe.toLowerCase()));

    return matchesSearch && matchesContinent && matchesVibe;
  });

  const displayedDestinations = filteredDestinations.slice(0, visibleCount);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="sunset" size="sm" className="mb-3">
          Discover Places
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#5B0B24] dark:text-[#FFF7FA] mb-3">
          Explore Inspiring Destinations
        </h1>
        <p className="text-xs sm:text-sm text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 leading-relaxed">
          Curated gems around the world. Select any destination to immediately prefill your AI travel plan.
        </p>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="flex flex-col gap-4 mb-8 sm:mb-12">
        <div className="max-w-xl mx-auto w-full">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by city, country or travel style..."
            onClear={() => setSearchQuery('')}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mr-1">
            Region:
          </span>
          {continents.map((continent) => (
            <Chip
              key={continent}
              label={continent}
              selected={selectedContinent === continent}
              onClick={() => setSelectedContinent(continent)}
            />
          ))}

          <span className="text-xs font-semibold text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 ml-3 mr-1">
            Vibe:
          </span>
          {vibes.map((vibe) => (
            <Chip
              key={vibe}
              label={vibe}
              selected={selectedVibe === vibe}
              onClick={() => setSelectedVibe(vibe)}
            />
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

          {visibleCount < filteredDestinations.length && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 32)}
                className="px-6 py-3 rounded-full bg-[#5B0B24] text-white hover:bg-[#C2185B] dark:bg-[#FF4F7A] dark:text-[#1F060F] dark:hover:bg-[#FF7A3D] font-medium text-xs sm:text-sm shadow-md transition-all duration-200"
              >
                Load More Destinations ({filteredDestinations.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Compass className="w-8 h-8" />}
          title="No destinations found"
          description={`We couldn't find any places matching "${searchQuery}". Try selecting "All" or searching for a different country.`}
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedContinent('All');
            setSelectedVibe('All');
          }}
        />
      )}
    </main>
  );
}
