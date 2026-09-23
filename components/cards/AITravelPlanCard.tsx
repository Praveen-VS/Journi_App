'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Wallet, Star, Utensils, ArrowRight, Bookmark } from 'lucide-react';
import { formatINR } from '@/lib/utils';

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
      {/* Card Header matching M03 mockup: ✦ Your AI Travel Plan ✨ */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F4EBEF] dark:border-[#FF4F7A]/15">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#C2185B] dark:text-[#FF8BA7] tracking-tight">
          <span className="text-[#FF2A6D] text-sm">✦</span>
          <span>Your AI Travel Plan</span>
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
