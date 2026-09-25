'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Wallet, Star, Utensils, ArrowRight, Bookmark, Bed } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { CuratedStayInfo, CuratedRestaurant } from '@/types';

export interface AITravelPlanCardProps {
  title: string;
  durationDays: number;
  peopleCount?: number | string;
  tags?: string[];
  imageUrl?: string;
  bestTime?: string;
  estimatedBudget: number | string;
  topExperiences?: string;
  foodRecommendations?: string;
  isSaved?: boolean;
  onSave?: () => void;
  onExplore?: () => void;
  className?: string;
  headerTitle?: string;
  stayInfo?: CuratedStayInfo;
  curatedRestaurants?: CuratedRestaurant[];
}

export default function AITravelPlanCard({
  title,
  durationDays,
  peopleCount = '2 People',
  tags = ['Beaches', 'Adventure', 'Relaxation'],
  imageUrl = 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80',
  bestTime = 'Nov - Apr',
  estimatedBudget,
  topExperiences = 'Snorkeling, Island Hopping, Sunset Cruise',
  foodRecommendations = 'Local Seafood, Coconut Curries, Cafés',
  isSaved = false,
  onSave,
  onExplore,
  className = '',
  headerTitle = 'Your Journi Travel Plan',
  stayInfo,
  curatedRestaurants,
}: AITravelPlanCardProps) {
  const displayBudget =
    typeof estimatedBudget === 'number'
      ? formatINR(estimatedBudget)
      : estimatedBudget.startsWith('₹')
      ? estimatedBudget
      : `₹ ${estimatedBudget}`;

  return (
    <div
      className={`bg-white dark:bg-[#240612] rounded-[26px] p-5 sm:p-6 shadow-[0_12px_36px_rgba(230,30,80,0.12)] border border-[#FF4F7A]/20 transition-all hover:shadow-[0_16px_44px_rgba(230,30,80,0.18)] ${className}`}
    >
      {/* Card Header: ✦ Your Journi Travel Plan ✨ */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F4EBEF] dark:border-[#FF4F7A]/15">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#C2185B] dark:text-[#FF8BA7] tracking-tight">
          <span className="text-[#FF2A6D] text-sm">✦</span>
          <span>{headerTitle}</span>
          <span className="text-amber-400">✨</span>
        </div>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className="p-1.5 rounded-full hover:bg-[#FFF0F4] dark:hover:bg-[#38091C] text-[#FF4F7A] transition-colors"
            title={isSaved ? 'Saved to trips' : 'Save trip'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Hero Destination Image */}
      <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-4 shadow-inner">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg sm:text-xl font-black drop-shadow-md leading-tight">
            {title}
          </h3>
          <p className="text-xs text-white/90 font-medium drop-shadow-sm">
            {durationDays} Days • {peopleCount}
          </p>
        </div>
      </div>

      {/* Category Tag Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FFF0F4] dark:bg-[#38091C] text-[#C2185B] dark:text-[#FF8BA7] border border-[#FFD3DF] dark:border-[#FF4F7A]/25"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Structured Details matching M03 specs */}
      <div className="space-y-2.5 text-xs sm:text-[13px] text-[#5B0B24] dark:text-[#FFD3DF]">
        {/* Best Time */}
        <div className="flex items-center justify-between py-1 border-b border-[#FAF2F5] dark:border-white/5">
          <span className="flex items-center gap-2 text-[#704250] dark:text-[#FFB3C6] font-medium">
            <Calendar className="w-4 h-4 text-[#FF4F7A]" />
            Best Time
          </span>
          <span className="font-bold text-[#3E0717] dark:text-white">{bestTime}</span>
        </div>

        {/* Estimated Budget */}
        <div className="flex items-center justify-between py-1 border-b border-[#FAF2F5] dark:border-white/5">
          <span className="flex items-center gap-2 text-[#704250] dark:text-[#FFB3C6] font-medium">
            <Wallet className="w-4 h-4 text-[#FF7A3D]" />
            Estimated Budget
          </span>
          <span className="font-black text-[#C2185B] dark:text-[#FF8BA7] text-sm">
            {displayBudget}
          </span>
        </div>

        {/* Top Experiences */}
        <div className="flex items-start justify-between py-1 border-b border-[#FAF2F5] dark:border-white/5">
          <span className="flex items-center gap-2 text-[#704250] dark:text-[#FFB3C6] font-medium min-w-[130px]">
            <Star className="w-4 h-4 text-[#FFC83D] shrink-0" />
            Top Experiences
          </span>
          <span className="font-medium text-right text-[#3E0717] dark:text-white line-clamp-2">
            {topExperiences}
          </span>
        </div>

        {/* Food Recommendations */}
        <div className="flex items-start justify-between py-1">
          <span className="flex items-center gap-2 text-[#704250] dark:text-[#FFB3C6] font-medium min-w-[140px]">
            <Utensils className="w-4 h-4 text-[#E61E50] shrink-0" />
            Food Recommendations
          </span>
          <span className="font-medium text-right text-[#3E0717] dark:text-white line-clamp-2">
            {foodRecommendations}
          </span>
        </div>

        {/* Curated Accommodations & Stay Details */}
        {stayInfo && (
          <div className="pt-3 border-t border-[#FAF2F5] dark:border-white/5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF4F7A]">
              <Bed className="w-4 h-4 text-[#FF4F7A]" />
              <span>Curated Accommodations</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/15 space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-[#3E0717] dark:text-[#FFF7FA]">
                  {stayInfo.name}
                </span>
                {stayInfo.approxPerNight && (
                  <span className="text-[11px] font-bold text-[#C2185B] dark:text-[#FF8BA7] shrink-0">
                    ~₹{stayInfo.approxPerNight.toLocaleString('en-IN')}/night
                  </span>
                )}
              </div>
              {stayInfo.amenity && (
                <p className="text-[11px] text-[#704250] dark:text-[#FFB3C6]/80 leading-relaxed">
                  {stayInfo.amenity}
                </p>
              )}
              {stayInfo.childPolicy && (
                <div className="pt-1 border-t border-[#FF4F7A]/10">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      stayInfo.childPolicy.isFree
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {stayInfo.childPolicy.isFree ? '✓ ' : '• '}
                    {stayInfo.childPolicy.description}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Handpicked Regional Dining & Local Eats */}
        {curatedRestaurants && curatedRestaurants.length > 0 && (
          <div className="pt-3 border-t border-[#FAF2F5] dark:border-white/5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A3D]">
              <Utensils className="w-4 h-4 text-[#FF7A3D]" />
              <span>Handpicked Dining & Local Eats</span>
            </div>
            <div className="space-y-2">
              {curatedRestaurants.map((r, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[#FFF9F5] dark:bg-[#250d18] border border-[#FF7A3D]/20 space-y-1"
                >
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="font-bold text-xs text-[#3E0717] dark:text-[#FFF7FA] truncate">
                      {r.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#FF7A3D] shrink-0">
                      ₹{r.priceForTwo} for 2
                    </span>
                  </div>
                  <p className="text-[11px] text-[#704250] dark:text-[#FFB3C6]/85">
                    <span className="font-semibold text-[#5B0B24] dark:text-[#FFDFE7]">Specialty:</span>{' '}
                    {r.signatureDish}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 pt-0.5">
                    <span>{r.cuisine}</span>
                    <span className="italic">{r.vibe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {onExplore && (
        <div className="mt-5 pt-3 border-t border-[#F4EBEF] dark:border-[#FF4F7A]/15">
          <button
            type="button"
            onClick={onExplore}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#C2185B] via-[#E91E63] to-[#FF5252] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Day-by-Day Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
