'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Destination } from '@/types';
import { Sparkles, Calendar, Thermometer, Heart } from 'lucide-react';
import { useSavedStore } from '@/store';

export interface DestinationCardProps {
  destination: Destination;
  onSelect?: (destination: Destination) => void;
  className?: string;
}

export default function DestinationCard({
  destination,
  onSelect,
  className = '',
}: DestinationCardProps) {
  const router = useRouter();
  const { isSaved, toggleFavorite } = useSavedStore();
  const isFavorite = isSaved(destination.id) || isSaved(destination.name);

  const handlePlanClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(destination);
    } else {
      router.push(`/ai?prompt=${encodeURIComponent(`Plan a ${destination.idealDays}-day trip to ${destination.name}, ${destination.country}`)}`);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(destination);
  };

  return (
    <Card
      variant="elevated"
      isInteractive
      onClick={() => onSelect ? onSelect(destination) : router.push(`/destinations?id=${destination.id}`)}
      className={`group flex flex-col h-full ${className}`}
    >
      {/* Visual Cover with Sunset Gradient Fallback & Overlay */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gradient-to-tr from-[#5B0B24] to-[#FF7A3D]">
        <Image
          src={destination.coverImage}
          alt={`${destination.name}, ${destination.country}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Soft Darkened Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <Badge variant="sunset" size="sm">
            {destination.continent}
          </Badge>
          <div className="flex items-center gap-1.5">
            {destination.trending && (
              <span className="bg-white/90 backdrop-blur-md text-[#5B0B24] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#FF7A3D]" />
                Trending
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveClick}
              aria-label={isFavorite ? 'Remove from saved' : 'Save to favorites'}
              className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavorite ? 'fill-[#FF4F7A] text-[#FF4F7A]' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h4 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
            {destination.name}
          </h4>
          <p className="text-xs text-white/80 font-medium">
            {destination.country}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <p className="text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 line-clamp-2 leading-relaxed">
            {destination.tagline}
          </p>

          {/* Key Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#FF7A3D]" />
              <span>{destination.bestSeason}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-[#FF4F7A]" />
              <span>Avg {destination.averageTemp}</span>
            </div>
          </div>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {Array.from(new Set(destination.vibes)).map((vibe, idx) => (
              <span
                key={`${destination.id}-${vibe}-${idx}`}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#5B0B24]/5 dark:bg-[#FF8BA7]/10 text-[#5B0B24] dark:text-[#FF8BA7] font-medium"
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePlanClick}
          className="w-full mt-1 border-[#FF4F7A]/30 text-[#C2185B] dark:text-[#FF8BA7] hover:bg-[#FF4F7A]/5 font-semibold"
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#FF7A3D]" />}
        >
          Plan Trip with AI
        </Button>
      </div>
    </Card>
  );
}
