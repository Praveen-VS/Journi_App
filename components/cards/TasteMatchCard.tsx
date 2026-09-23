'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { TasteMatchResult } from '@/types';
import { Sparkles, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

interface TasteMatchCardProps {
  match: TasteMatchResult;
  rank: number;
  onPlanTrip: (match: TasteMatchResult) => void;
  className?: string;
}

export default function TasteMatchCard({
  match,
  rank,
  onPlanTrip,
  className = '',
}: TasteMatchCardProps) {
  const { destination, score, matchReason, matchedTags } = match;
  const [imageError, setImageError] = useState(false);
  const fallbackUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  const rankBadgeColors = [
    'from-[#FF4F7A] to-[#FF7A3D]', // #1
    'from-[#FF7A3D] to-[#FFC83D]', // #2
    'from-[#C2185B] to-[#FF4F7A]', // #3
    'from-[#5B0B24] to-[#C2185B]', // #4
  ];

  const currentGradient = rankBadgeColors[(rank - 1) % rankBadgeColors.length];

  return (
    <Card
      variant="elevated"
      className={`group flex flex-col h-full overflow-hidden border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 hover:border-[#FF4F7A]/40 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(230,30,80,0.12)] ${className}`}
    >
      {/* Visual Image Header */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-gradient-to-tr from-[#5B0B24] to-[#FF7A3D]">
        <Image
          src={imageError ? fallbackUrl : (destination.coverImage || fallbackUrl)}
          alt={`${destination.name}, ${destination.country}`}
          fill
          unoptimized
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Soft Darkened Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Badges: Match % and Rank */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className={`px-3 py-1 rounded-full text-white text-xs font-black shadow-md flex items-center gap-1.5 bg-gradient-to-r ${currentGradient}`}>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{score}% Taste Match</span>
          </div>

          <span className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-black flex items-center justify-center border border-white/20">
            #{rank}
          </span>
        </div>

        {/* Bottom Image Overlay: Destination Name & Country */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#FFC83D] mb-0.5">
            <MapPin className="w-3 h-3" />
            <span>{destination.country} • {destination.continent}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Personalized Match Rationale */}
          <div className="p-2.5 rounded-[14px] bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/20">
            <p className="text-xs text-[#5B0B24] dark:text-[#FFB3C6] font-medium leading-relaxed">
              <span className="font-bold text-[#FF4F7A]">Why it matches you: </span>
              {matchReason}
            </p>
          </div>

          {/* Quick Metrics (Days, Weather, Best Time) */}
          <div className="flex items-center gap-3 text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FF7A3D]" />
              {destination.idealDays} Days Ideal
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#FF7A3D]" />
              {destination.bestSeason}
            </span>
          </div>

          {/* Matched Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchedTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#5B0B24]/5 dark:bg-white/5 text-[#5B0B24] dark:text-[#FF8BA7] border border-[#5B0B24]/10 dark:border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Top Highlights Preview */}
          {destination.highlights && destination.highlights.length > 0 && (
            <div className="pt-2 border-t border-[#5B0B24]/8 dark:border-white/5">
              <span className="text-[11px] font-bold text-[#5B0B24]/80 dark:text-[#FF8BA7] block mb-1">
                Top Experiences:
              </span>
              <p className="text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 line-clamp-2 leading-relaxed">
                {destination.highlights.join(' • ')}
              </p>
            </div>
          )}
        </div>

        {/* CTA Button: Plan Full Itinerary With AI */}
        <div className="pt-3 border-t border-[#5B0B24]/8 dark:border-white/5">
          <Button
            type="button"
            variant="sunset"
            size="sm"
            onClick={() => onPlanTrip(match)}
            className="w-full font-bold text-xs shadow-sm hover:shadow-md"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Plan {destination.name} with AI
          </Button>
        </div>
      </div>
    </Card>
  );
}
