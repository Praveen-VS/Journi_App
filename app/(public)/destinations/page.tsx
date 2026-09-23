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

  const continents = ['All', 'Europe', 'Asia', 'Americas'];
  const vibes = ['All', 'Cultural', 'Romantic', 'Scenic', 'Adventure'];

  const filteredDestinations = MOCK_DESTINATIONS.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesContinent =
      selectedContinent === 'All' || dest.continent === selectedContinent;

    const matchesVibe =
      selectedVibe === 'All' || dest.vibes.includes(selectedVibe);

    return matchesSearch && matchesContinent && matchesVibe;
  });

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
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
