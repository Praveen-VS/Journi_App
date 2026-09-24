import React from 'react';
import { SlidersHorizontal, MapPin, Clock, Users, Wallet, Activity, Utensils } from 'lucide-react';

export interface FilterPreferencesStripProps {
  destination?: string;
  scope?: string;
  daysCount?: number;
  companion?: string;
  adultsCount?: number;
  childrenCount?: number;
  budgetTier?: string;
  energyRhythm?: string;
  foodPreferences?: string[];
  className?: string;
}

export function FilterPreferencesStrip({
  destination,
  scope,
  daysCount = 5,
  companion = 'Couple',
  adultsCount,
  childrenCount,
  budgetTier = 'Moderate',
  energyRhythm = 'balanced',
  foodPreferences,
  className = '',
}: FilterPreferencesStripProps) {
  // Format scope label
  const formatScope = (s?: string) => {
    if (!s) return 'In-State';
    if (s === 'nearby_200km') return 'Within 200 km';
    if (s === 'in_state') return 'In-State';
    if (s === 'interstate') return 'Interstate';
    if (s === 'international') return 'International';
    return s;
  };

  // Format rhythm label
  const formatRhythm = (r?: string) => {
    if (!r) return 'Balanced Pace';
    if (r === 'peace') return 'Peace & Zen';
    if (r === 'chill') return 'Chill & Coastal';
    if (r === 'culture') return 'Culture & Heritage';
    if (r === 'adventure') return 'Active & Adventure';
    return r;
  };

  const effectiveAdults = adultsCount ?? (companion === 'Solo' ? 1 : companion === 'Friends' ? 3 : 2);
  const effectiveChildren = childrenCount ?? 0;

  return (
    <div
      className={`w-full rounded-2xl bg-white/95 dark:bg-[#200612]/95 backdrop-blur-md border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs ${className}`}
    >
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-lg bg-[#5B0B24]/10 dark:bg-[#FF8BA7]/15 text-[#5B0B24] dark:text-[#FF8BA7] flex items-center justify-center">
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider text-[#5B0B24] dark:text-[#FFF7FA]">
          Selected Trip Filters:
        </span>
      </div>

      {/* Badges List */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Scope */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/20 text-[11px] font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
          <MapPin className="w-3 h-3 text-[#FF7A3D]" />
          <span>{formatScope(scope)}</span>
        </span>

        {/* Duration */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/20 text-[11px] font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
          <Clock className="w-3 h-3 text-[#FF7A3D]" />
          <span>{daysCount} Days</span>
        </span>

        {/* Travelers Count (Adults & Kids) */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/20 text-[11px] font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
          <Users className="w-3 h-3 text-[#FF7A3D]" />
          <span>
            {effectiveAdults} {effectiveAdults === 1 ? 'Adult' : 'Adults'}
            {effectiveChildren > 0 ? `, ${effectiveChildren} ${effectiveChildren === 1 ? 'Child (<5y)' : 'Children (<5y)'}` : ''}
            {' '}({companion})
          </span>
        </span>

        {/* Budget */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/20 text-[11px] font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
          <Wallet className="w-3 h-3 text-[#FF7A3D]" />
          <span>{budgetTier}</span>
        </span>

        {/* Rhythm */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/20 text-[11px] font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
          <Activity className="w-3 h-3 text-[#FF7A3D]" />
          <span>{formatRhythm(energyRhythm)}</span>
        </span>

        {/* Foods if present */}
        {foodPreferences && foodPreferences.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/20 text-[11px] font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
            <Utensils className="w-3 h-3 text-[#FF7A3D]" />
            <span className="capitalize">{foodPreferences.slice(0, 2).join(', ').replace(/_/g, ' ')}</span>
          </span>
        )}
      </div>
    </div>
  );
}
