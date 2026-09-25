'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MobileHeader from '@/components/navigation/MobileHeader';
import SavedPolaroidCard from '@/components/cards/SavedPolaroidCard';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { MOCK_SAVED_PLACES } from '@/constants';
import { useSavedStore } from '@/store';
import { Bookmark, Sparkles, LayoutGrid, Layers, ArrowRight, Trash2, X, MapPin, Sliders } from 'lucide-react';
import type { SavedPlace } from '@/types';

export default function SavedPlacesPage() {
  const router = useRouter();
  const { savedPlaces, removePlace } = useSavedStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'scrapbook' | 'grid'>('scrapbook');
  const [showEmptySim, setShowEmptySim] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState<SavedPlace | null>(null);

  // Saved Destination Detail & Search Criteria Filter states (Same as Home Page)
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState<SavedPlace | null>(null);
  const [tripDays, setTripDays] = useState<number>(5);
  const [energyRhythm, setEnergyRhythm] = useState<string>('peace');
  const [budgetTier, setBudgetTier] = useState<string>('Moderate');
  const [companion, setCompanion] = useState<string>('Couple');
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  // Restore saved search preferences from home console if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('journi_hero_taste_search');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.tripDays) setTripDays(parsed.tripDays);
          if (parsed.energyRhythm) setEnergyRhythm(parsed.energyRhythm);
          if (parsed.budgetTier) setBudgetTier(parsed.budgetTier);
          if (parsed.companion) setCompanion(parsed.companion);
          if (parsed.adultsCount !== undefined) setAdultsCount(parsed.adultsCount);
          if (parsed.childrenCount !== undefined) setChildrenCount(parsed.childrenCount);
        }
      } catch {}
    }
  }, []);

  const handleSelectCompanion = (c: string) => {
    setCompanion(c);
    if (c === 'Solo') {
      setAdultsCount(1);
      setChildrenCount(0);
    } else if (c === 'Couple') {
      setAdultsCount(2);
      setChildrenCount(0);
    } else if (c === 'Family') {
      setAdultsCount(2);
      setChildrenCount(1);
    } else if (c === 'Friends') {
      setAdultsCount(3);
      setChildrenCount(0);
    }
  };

  const handlePlanThisTrip = (place: SavedPlace) => {
    const destName = place.destination || place.name;
    const craftedPrompt = `Plan a ${tripDays}-day ${energyRhythm || 'curated'} trip to ${destName}, ${place.country} featuring ${place.name} with authentic regional experiences.`;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          'journi_hero_taste_search',
          JSON.stringify({
            energyRhythm,
            budgetTier,
            companion,
            adultsCount,
            childrenCount,
            tripDays,
          })
        );
      } catch {}
    }

    const params = new URLSearchParams({
      action: 'generate',
      prompt: craftedPrompt,
      dest: destName,
      country: place.country || '',
      days: String(tripDays),
      vibe: place.category || 'Cultural',
      budget: budgetTier || 'Moderate',
      companion: companion || 'Couple',
      adults: String(adultsCount),
      children: String(childrenCount),
      rhythm: energyRhythm || 'peace',
      from: 'saved',
      reason: place.notes || `Curated escape to ${place.name} in ${destName}, ${place.country}`,
    });

    router.push(`/ai?${params.toString()}`);
  };

  const rhythmOptions = [
    { id: 'peace', label: 'Peace & Zen', icon: '🧘' },
    { id: 'chill', label: 'Chill & Coastal', icon: '🌊' },
    { id: 'culture', label: 'Culture & Arts', icon: '🏛️' },
    { id: 'adventure', label: 'High Adventure', icon: '🧗' },
  ];

  const categories = ['All', 'Mountains', 'Beaches', 'Cities', 'Nature', 'Culture'];

  const handleToggleFavorite = (id: string) => {
    removePlace(id);
  };

  const filteredPlaces = savedPlaces.filter((p) => {
    if (showEmptySim) return false;
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Mountains') return p.category === 'Nature' || p.name.includes('Shrine') || p.name.includes('Sanctuary');
    if (selectedCategory === 'Beaches') return p.name.includes('Beach') || p.name.includes('Bay') || p.name.includes('Lake');
    if (selectedCategory === 'Cities') return p.category === 'Sight' || p.category === 'Cafe';
    if (selectedCategory === 'Nature') return p.category === 'Nature';
    if (selectedCategory === 'Culture') return p.category === 'Culture';
    return true;
  });

  // Sticky notes array for scrapbook effect
  const stickyNotes = ['Amazing places', 'Dream bigger', 'Beautiful memories', 'Must visit', 'Peaceful vibe'];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Mobile Top Header */}
      <MobileHeader title="Saved Places" showBack />

      {/* Header Banner with M04 Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[#FF2A6D] text-base font-bold rotate-[-4deg]"
              style={{ fontFamily: 'var(--font-caveat, cursive)' }}
            >
              Explore a Better Tomorrow
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight">
            Save Every Journey
          </h1>
          <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] mt-0.5">
            Keep your favorite places, trips and memories — all in one place.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="bg-[#FAF0F4] dark:bg-[#280814] p-1 rounded-2xl border border-[#FF4F7A]/20 flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('scrapbook')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'scrapbook'
                  ? 'bg-white dark:bg-[#38091C] text-[#C2185B] dark:text-[#FF8BA7] shadow-sm'
                  : 'text-[#704250] dark:text-[#FFB3C6]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Scrapbook</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#38091C] text-[#C2185B] dark:text-[#FF8BA7] shadow-sm'
                  : 'text-[#704250] dark:text-[#FFB3C6]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmptySim(!showEmptySim)}
              className="hidden lg:inline-flex text-[11px] px-2.5 py-1 rounded-full border border-[#FF4F7A]/20 text-[#704250] dark:text-[#FFB3C6] hover:bg-[#FFF0F4] dark:hover:bg-[#280814] transition-colors"
            >
              {showEmptySim ? 'Show Places' : 'Test Empty'}
            </button>

            <Button
              variant="sunset"
              size="sm"
              onClick={() => {
                if (filteredPlaces.length > 0) {
                  setSelectedPlaceForDetail(filteredPlaces[0]);
                } else {
                  router.push('/ai?prompt=Plan+a+custom+trip+visiting+my+saved+places');
                }
              }}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              className="font-bold text-xs shrink-0 whitespace-nowrap shadow-sm cursor-pointer"
            >
              Plan with AI
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>

      {/* Empty State */}
      {(showEmptySim || filteredPlaces.length === 0) && (
        <div className="py-12">
          <EmptyState
            icon={<Bookmark className="w-8 h-8 text-[#FF4F7A]" />}
            title="No saved places found"
            description="You haven't bookmarked any spots in this category yet. Explore inspiring destinations and tap the heart icon to save them."
            actionLabel="Discover Destinations"
            onAction={() => router.push('/home')}
          />
        </div>
      )}

      {/* Scrapbook View (Matching M04 Polaroid Layout) */}
      {!showEmptySim && filteredPlaces.length > 0 && viewMode === 'scrapbook' && (
        <div className="relative p-4 sm:p-8 rounded-[36px] bg-gradient-to-br from-[#FFF5F8] via-[#FFF9F5] to-[#F5F3FF] dark:from-[#240612] dark:via-[#1A030C] dark:to-[#18051E] border border-[#FF4F7A]/15 overflow-hidden">
          {/* Subtle airplane trail decorative dashed line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 -z-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 150 Q 300 50, 600 200 T 1100 120" fill="none" stroke="#FF4F7A" strokeWidth="2" strokeDasharray="6,6" />
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {filteredPlaces.map((place, idx) => {
              const rotation = (idx % 3 === 0 ? -2 : idx % 3 === 1 ? 3 : -4);
              const noteColor = idx % 3 === 0 ? 'yellow' : idx % 3 === 1 ? 'pink' : 'peach';
              const stickyText = stickyNotes[idx % stickyNotes.length];

              return (
                <div key={place.id} className="flex justify-center">
                  <SavedPolaroidCard
                    title={place.name}
                    date="Saved Memory"
                    location={`${place.destination}, ${place.country}`}
                    imageUrl={place.image}
                    stickyNoteText={stickyText}
                    stickyNoteColor={noteColor}
                    rotation={rotation}
                    isFavorite={true}
                    onToggleFavorite={() => handleToggleFavorite(place.id)}
                    onDelete={() => setPlaceToDelete(place)}
                    onClick={() => setSelectedPlaceForDetail(place)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid View */}
      {!showEmptySim && filteredPlaces.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPlaces.map((place) => (
            <Card
              key={place.id}
              variant="elevated"
              isInteractive
              onClick={() => setSelectedPlaceForDetail(place)}
              className="flex flex-col h-full group cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-t-[20px]">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="sunset" size="sm">
                    {place.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaceToDelete(place);
                    }}
                    className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
                    title="Remove from saved"
                    aria-label="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-[#3E0717] dark:text-white">
                    {place.name}
                  </h3>
                  <p className="text-xs text-[#704250] dark:text-[#FFB3C6] mt-1">
                    {place.destination}, {place.country}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F4EBEF] dark:border-white/5 flex items-center justify-between text-xs font-semibold text-[#E61E50]">
                  <span>Plan this Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {placeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-[#200612] p-6 shadow-2xl border border-[#FF4F7A]/25 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFE5EC] dark:bg-[#3E0717] text-[#E61E50] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 id="delete-modal-title" className="text-base font-bold text-[#3E0717] dark:text-[#FFF7FA]">
                  Remove Saved Place?
                </h3>
                <p className="text-xs text-[#704250] dark:text-[#FFB3C6]">
                  Are you sure you want to remove this destination?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF0F4] dark:bg-[#18030C] border border-[#FF4F7A]/15 text-xs text-[#5B0B24] dark:text-[#FFB3C6]">
              <span className="font-bold text-[#3E0717] dark:text-white block truncate">
                {placeToDelete.name}
              </span>
              <span className="text-[11px] text-[#704250] dark:text-[#FF8BA7]/70">
                {placeToDelete.destination}, {placeToDelete.country}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPlaceToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5B0B24] dark:text-[#FFB3C6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await removePlace(placeToDelete.id);
                  setPlaceToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E61E50] to-[#C2185B] shadow-md shadow-[#E61E50]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Delete Destination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Destination Detail & Trip Filter Modal */}
      {selectedPlaceForDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="saved-detail-title"
          onClick={() => setSelectedPlaceForDetail(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-[32px] bg-white dark:bg-[#1E0610] border border-[#FF4F7A]/25 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual Destination Header */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
              <Image
                src={selectedPlaceForDetail.image}
                alt={selectedPlaceForDetail.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

              {/* Top Controls */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                <Badge variant="sunset" size="sm" className="shadow-md font-bold">
                  {selectedPlaceForDetail.category}
                </Badge>
                <button
                  type="button"
                  onClick={() => setSelectedPlaceForDetail(null)}
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  title="Close details"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Destination Caption on Photo */}
              <div className="absolute bottom-3.5 left-4 right-4 z-10">
                <span
                  className="text-[#FF7A3D] text-sm font-bold block"
                  style={{ fontFamily: 'var(--font-caveat, cursive)' }}
                >
                  Saved Destination
                </span>
                <h2 id="saved-detail-title" className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
                  {selectedPlaceForDetail.name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7A3D]" />
                  <span>{selectedPlaceForDetail.destination}, {selectedPlaceForDetail.country}</span>
                  {selectedPlaceForDetail.rating && (
                    <>
                      <span>•</span>
                      <span>⭐ {selectedPlaceForDetail.rating.toFixed(1)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable Content Body with Same Filter Options as Home Page */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {/* Highlight / Memory Note */}
              {selectedPlaceForDetail.notes && (
                <div className="p-3 rounded-2xl bg-[#FFF5F8] dark:bg-[#2C0817] border border-[#FF4F7A]/20 text-[#5B0B24] dark:text-[#FFB3C6] text-[11px] leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7A3D] shrink-0 mt-0.5" />
                  <p className="italic">&ldquo;{selectedPlaceForDetail.notes}&rdquo;</p>
                </div>
              )}

              {/* Criteria Section Title */}
              <div className="flex items-center justify-between pb-1 border-b border-[#5B0B24]/10 dark:border-white/10">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#FF7A3D]" />
                  <h3 className="font-extrabold text-sm text-[#3E0717] dark:text-[#FFF7FA]">
                    Trip Planning Criteria
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#FF4F7A] bg-[#FF4F7A]/10 px-2 py-0.5 rounded-full">
                  Same as Home Search
                </span>
              </div>

              {/* 1. Trip Rhythm */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[11px]">
                  Trip Rhythm:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {rhythmOptions.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setEnergyRhythm(r.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                        energyRhythm === r.id
                          ? 'bg-[#FF7A3D] text-white border-[#FF7A3D] shadow-xs'
                          : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF7A3D]/40'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Trip Duration */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[11px]">
                  Trip Duration:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[3, 5, 7, 10, 14].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTripDays(d)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        tripDays === d
                          ? 'bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] text-white border-transparent shadow-xs'
                          : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF4F7A]/40'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Budget Tier */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[11px]">
                  Budget Tier:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Budget Friendly', 'Moderate', 'Luxury Escapes'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetTier(b)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        budgetTier === b
                          ? 'bg-[#5B0B24] text-white border-[#5B0B24] shadow-xs'
                          : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#5B0B24]/30'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Companion & Travelers */}
              <div className="space-y-2">
                <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[11px]">
                  Companion & Party:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Solo', 'Couple', 'Family', 'Friends'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleSelectCompanion(c)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        companion === c
                          ? 'bg-[#FF4F7A] text-white border-[#FF4F7A] shadow-xs'
                          : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF4F7A]/30'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Tactile Adults & Kids Steppers */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center justify-between bg-white dark:bg-[#280814] rounded-xl px-3 py-1.5 border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15">
                    <span className="text-[11px] font-semibold text-[#5B0B24] dark:text-[#FFF7FA]">Adults</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAdultsCount((prev) => Math.max(1, prev - 1))}
                        disabled={adultsCount <= 1}
                        className="w-5 h-5 rounded-md flex items-center justify-center bg-[#5B0B24]/5 hover:bg-[#5B0B24]/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#5B0B24] dark:text-white font-bold text-xs disabled:opacity-30 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-[#5B0B24] dark:text-white w-3 text-center">{adultsCount}</span>
                      <button
                        type="button"
                        onClick={() => setAdultsCount((prev) => Math.min(10, prev + 1))}
                        disabled={adultsCount >= 10}
                        className="w-5 h-5 rounded-md flex items-center justify-center bg-[#5B0B24]/5 hover:bg-[#5B0B24]/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#5B0B24] dark:text-white font-bold text-xs disabled:opacity-30 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-[#280814] rounded-xl px-3 py-1.5 border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-[#5B0B24] dark:text-[#FFF7FA]">Kids &lt;5y</span>
                      <span className="text-[8px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 -mt-0.5">Hotel policy applies</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                        disabled={childrenCount <= 0}
                        className="w-5 h-5 rounded-md flex items-center justify-center bg-[#5B0B24]/5 hover:bg-[#5B0B24]/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#5B0B24] dark:text-white font-bold text-xs disabled:opacity-30 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-[#5B0B24] dark:text-white w-3 text-center">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => Math.min(6, prev + 1))}
                        disabled={childrenCount >= 6}
                        className="w-5 h-5 rounded-md flex items-center justify-center bg-[#5B0B24]/5 hover:bg-[#5B0B24]/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#5B0B24] dark:text-white font-bold text-xs disabled:opacity-30 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:p-5 bg-white/95 dark:bg-[#1E0610]/95 border-t border-[#FF4F7A]/15 backdrop-blur-sm flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedPlaceForDetail(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5B0B24] dark:text-[#FFB3C6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handlePlanThisTrip(selectedPlaceForDetail)}
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#FF4F7A] via-[#E91E63] to-[#FF7A3D] hover:from-[#E03A64] hover:to-[#E5662D] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Plan this Trip</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
