'use client';

import React, { useState } from 'react';
import SearchInput from '@/components/forms/SearchInput';
import DestinationCard from '@/components/cards/DestinationCard';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { ALL_DESTINATIONS } from '@/constants/destinationsData';
import { Compass, Sparkles, Loader2 } from 'lucide-react';
import type { Destination } from '@/types';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [visibleCount, setVisibleCount] = useState(32);

  // AI Search states
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSuggestedQueries, setAiSuggestedQueries] = useState<string[]>([]);
  const [aiResults, setAiResults] = useState<Destination[] | null>(null);

  const continents = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];
  const vibes = ['All', 'Cultural', 'Romantic', 'Scenic', 'Adventure', 'Peace & Zen'];

  const quickAIQueries = [
    '☕ Mountain towns with cozy cafes',
    '🏖️ Secluded tropical beaches for couples',
    '🏯 Zen temples & serene tea houses',
    '🍜 Night market street food havens',
  ];

  const executeAISearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsAISearching(true);
    setSearchQuery(queryText);

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          vibe: selectedVibe !== 'All' ? selectedVibe : undefined,
          continent: selectedContinent !== 'All' ? selectedContinent : undefined,
          limit: 32,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAiResults(json.data.destinations || []);
          setAiSummary(json.data.summary || null);
          setAiSuggestedQueries(json.data.suggestedFollowUps || []);
          setVisibleCount(32);
        }
      }
    } catch (err) {
      console.error('AI search failed:', err);
    } finally {
      setIsAISearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setAiResults(null);
    setAiSummary(null);
    setAiSuggestedQueries([]);
  };

  const activePool = aiResults !== null ? aiResults : ALL_DESTINATIONS;

  const filteredDestinations = activePool.filter((dest) => {
    // If AI results are active, they are already scored and relevant
    if (aiResults === null) {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dest.name.toLowerCase().includes(q) ||
        dest.country.toLowerCase().includes(q) ||
        (dest.state && dest.state.toLowerCase().includes(q)) ||
        dest.tagline.toLowerCase().includes(q);

      if (!matchesSearch) return false;
    }

    const matchesContinent =
      selectedContinent === 'All' ||
      dest.continent === selectedContinent ||
      (selectedContinent === 'Americas' && (dest.continent === 'North America' || dest.continent === 'South America'));

    const matchesVibe =
      selectedVibe === 'All' ||
      dest.vibes.some((v) => v.toLowerCase().includes(selectedVibe.toLowerCase())) ||
      (dest.energyRhythm && dest.energyRhythm.toLowerCase().includes(selectedVibe.toLowerCase()));

    return matchesContinent && matchesVibe;
  });

  const displayedDestinations = filteredDestinations.slice(0, visibleCount);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="sunset" size="sm" className="mb-3">
          Discover Places ({ALL_DESTINATIONS.length}+ Global Catalog)
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#5B0B24] dark:text-[#FFF7FA] mb-3">
          Explore Inspiring Destinations
        </h1>
        <p className="text-xs sm:text-sm text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 leading-relaxed">
          Powered by Astra 6 AI. Type any vibe, natural landscape, or travel fantasy to discover your dream getaway.
        </p>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="flex flex-col gap-4 mb-8 sm:mb-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeAISearch(searchQuery);
          }}
          className="max-w-2xl mx-auto w-full flex items-center gap-2"
        >
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                if (!val) handleClearSearch();
              }}
              placeholder="Search destinations or ask AI (e.g. 'quiet cliffside village with fresh seafood')..."
              onClear={handleClearSearch}
            />
          </div>
          <button
            type="submit"
            disabled={!searchQuery.trim() || isAISearching}
            className="flex items-center gap-1.5 px-4 py-3 rounded-[18px] bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] hover:from-[#E03A64] hover:to-[#E5662D] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all shrink-0 cursor-pointer"
          >
            {isAISearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
            <span className="hidden sm:inline">AI Search</span>
          </button>
        </form>

        {/* Quick Inspiration Prompts */}
        {!aiSummary && (
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-[#5B0B24]/50 dark:text-[#FF8BA7]/60">
              Try AI Search:
            </span>
            {quickAIQueries.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => executeAISearch(promptText.replace(/^[^\s]+\s/, ''))}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#5B0B24]/5 dark:bg-[#FF8BA7]/10 hover:bg-[#FF4F7A]/15 text-[#5B0B24] dark:text-[#FFF7FA] transition-all font-medium border border-transparent hover:border-[#FF4F7A]/30"
              >
                {promptText}
              </button>
            ))}
          </div>
        )}

        {/* AI Results Curator Summary Banner */}
        {aiSummary && (
          <div className="max-w-2xl mx-auto w-full p-4 rounded-2xl bg-gradient-to-r from-[#5B0B24]/5 via-[#FF4F7A]/10 to-[#FF7A3D]/10 border border-[#FF4F7A]/25 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#C2185B] dark:text-[#FF8BA7] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A3D]" />
                Astra 6 AI Curator Recommendations
              </span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-[11px] text-[#5B0B24]/70 hover:text-[#5B0B24] dark:text-[#FF8BA7]/80 font-semibold cursor-pointer underline"
              >
                Reset Catalog
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#2E0513] dark:text-[#FFF7FA] leading-relaxed">
              {aiSummary}
            </p>
            {aiSuggestedQueries.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-[#FF4F7A]/15 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#5B0B24]/50 dark:text-[#FF8BA7]/60 tracking-wider">
                  Related Ideas:
                </span>
                {aiSuggestedQueries.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => executeAISearch(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/80 dark:bg-[#3D0A1E]/80 hover:bg-white text-[#5B0B24] dark:text-[#FFF7FA] border border-[#FF4F7A]/20 transition-all font-medium cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

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

      {/* Destinations Grid or AI Curating Skeletons */}
      {isAISearching ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FFF5F8] to-[#FFF0F5] dark:from-[#280814] dark:to-[#380b1d] border border-[#FF4F7A]/25 shadow-sm text-center">
            <Loader2 className="w-5 h-5 animate-spin text-[#FF7A3D]" />
            <span className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
              Astra 6 is analyzing vibes, climate & curated spots across 1,680+ destinations...
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] rounded-[24px] bg-[#FFF5F8]/70 dark:bg-[#280814]/70 border border-[#FF4F7A]/15 p-4 animate-pulse flex flex-col justify-between"
              >
                <div className="h-48 rounded-2xl bg-[#5B0B24]/10 dark:bg-white/10" />
                <div className="space-y-3 pt-3">
                  <div className="h-5 bg-[#5B0B24]/10 dark:bg-white/10 rounded-full w-3/4" />
                  <div className="h-3.5 bg-[#5B0B24]/10 dark:bg-white/10 rounded-full w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-[#5B0B24]/10 dark:bg-white/10 rounded-full" />
                    <div className="h-6 w-20 bg-[#5B0B24]/10 dark:bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredDestinations.length > 0 ? (
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
                className="px-6 py-3 rounded-full bg-[#5B0B24] text-white hover:bg-[#C2185B] dark:bg-[#FF4F7A] dark:text-[#1F060F] dark:hover:bg-[#FF7A3D] font-medium text-xs sm:text-sm shadow-md transition-all duration-200 cursor-pointer"
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
          description={`We couldn't find any places matching "${searchQuery}". Try running an AI Search or picking a different region.`}
          actionLabel="Search with Astra 6 AI"
          onAction={() => {
            if (searchQuery.trim()) {
              executeAISearch(searchQuery);
            } else {
              handleClearSearch();
              setSelectedContinent('All');
              setSelectedVibe('All');
            }
          }}
        />
      )}
    </main>
  );
}
