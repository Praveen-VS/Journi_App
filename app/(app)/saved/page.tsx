'use client';

import React, { useState } from 'react';
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
import { Bookmark, Sparkles, LayoutGrid, Layers, ArrowRight, Trash2 } from 'lucide-react';
import type { SavedPlace } from '@/types';

export default function SavedPlacesPage() {
  const router = useRouter();
  const { savedPlaces, removePlace } = useSavedStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'scrapbook' | 'grid'>('scrapbook');
  const [showEmptySim, setShowEmptySim] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState<SavedPlace | null>(null);

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
              onClick={() => router.push('/ai?prompt=Plan+a+custom+trip+visiting+my+saved+places')}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              className="font-bold text-xs shrink-0 whitespace-nowrap shadow-sm"
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
                    onClick={() => router.push(`/ai?prompt=${encodeURIComponent(`Plan a day itinerary visiting ${place.name} in ${place.destination}, ${place.country}`)}`)}
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
              onClick={() => router.push(`/ai?prompt=${encodeURIComponent(`Plan a day itinerary around ${place.name}`)}`)}
              className="flex flex-col h-full group"
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
                    className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
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
                  <span>Plan visit</span>
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
    </main>
  );
}
