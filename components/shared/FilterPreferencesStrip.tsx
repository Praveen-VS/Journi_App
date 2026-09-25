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
  destination: _destination,
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
      className={`w-full rounded-[22px] bg-gradient-to-r from-white via-[#FFF8FA] to-white dark:from-[#200612] dark:via-[#260817] dark:to-[#200612] border-2 border-[#FF4F7A]/20 dark:border-[#FF8BA7]/25 p-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_20px_rgba(255,79,122,0.05)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#5B0B24] via-[#8E1038] to-[#C2185B] text-white text-xs font-black uppercase tracking-wider shadow-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF7A3D]" />
          <span>Selected Trip Filters</span>
        </div>
      </div>

      {/* Distinct & Lively Badges List */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Scope */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFF0F4] to-[#FFF5F8] dark:from-[#32081C] dark:to-[#280616] border border-[#FF4F7A]/30 text-xs font-bold text-[#8B1538] dark:text-[#FFB3C6] shadow-2xs hover:scale-105 transition-transform">
          <MapPin className="w-3.5 h-3.5 text-[#FF4F7A]" />
          <span>{formatScope(scope)}</span>
        </span>

        {/* Duration */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFF8EE] to-[#FFFDF5] dark:from-[#2E1508] dark:to-[#241006] border border-[#FFB84D]/40 text-xs font-bold text-[#8A5200] dark:text-[#FFD188] shadow-2xs hover:scale-105 transition-transform">
          <Clock className="w-3.5 h-3.5 text-[#FFB84D]" />
          <span>{daysCount} Days</span>
        </span>

        {/* Travelers Count (Adults & Kids) */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFF0F7] to-[#FFF8FC] dark:from-[#340820] dark:to-[#2A061A] border border-[#FF4F9E]/40 text-xs font-bold text-[#9E1458] dark:text-[#FFAED6] shadow-2xs hover:scale-105 transition-transform">
          <Users className="w-3.5 h-3.5 text-[#FF4F9E]" />
          <span>
            {effectiveAdults} {effectiveAdults === 1 ? 'Adult' : 'Adults'}
            {effectiveChildren > 0 ? `, ${effectiveChildren} ${effectiveChildren === 1 ? 'Child (<5y)' : 'Children (<5y)'}` : ''}
            {' '}({companion})
          </span>
        </span>

        {/* Budget */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F0FDF4] to-[#F7FEFA] dark:from-[#0B2516] dark:to-[#071E11] border border-emerald-500/35 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-2xs hover:scale-105 transition-transform">
          <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{budgetTier}</span>
        </span>

        {/* Rhythm */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FAF5FF] to-[#FDFBFF] dark:from-[#220F38] dark:to-[#1B0B2C] border border-purple-500/35 text-xs font-bold text-purple-800 dark:text-purple-300 shadow-2xs hover:scale-105 transition-transform">
          <Activity className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>{formatRhythm(energyRhythm)}</span>
        </span>

        {/* Foods if present */}
        {foodPreferences && foodPreferences.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFF5ED] to-[#FFFBF8] dark:from-[#331307] dark:to-[#290F05] border border-[#FF7A3D]/40 text-xs font-bold text-[#A03D07] dark:text-[#FFBA94] shadow-2xs hover:scale-105 transition-transform">
            <Utensils className="w-3.5 h-3.5 text-[#FF7A3D]" />
            <span className="capitalize">{foodPreferences.slice(0, 2).join(', ').replace(/_/g, ' ')}</span>
          </span>
        )}
      </div>
    </div>
  );
}
