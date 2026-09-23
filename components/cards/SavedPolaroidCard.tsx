'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MapPin, Calendar } from 'lucide-react';

export interface SavedPolaroidCardProps {
  title: string;
  date: string;
  location?: string;
  imageUrl: string;
  stickyNoteText?: string;
  stickyNoteColor?: 'yellow' | 'pink' | 'peach';
  rotation?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
  className?: string;
}

export default function SavedPolaroidCard({
  title,
  date,
  location,
  imageUrl,
  stickyNoteText,
  stickyNoteColor = 'yellow',
  rotation = 0,
  isFavorite = true,
  onToggleFavorite,
  onClick,
  className = '',
}: SavedPolaroidCardProps) {
  const stickyColors = {
    yellow: 'bg-[#FFF3B0] text-[#7A5B00] border-[#F0DC82]',
    pink: 'bg-[#FFE5EC] text-[#9E1B46] border-[#FFC2D4]',
    peach: 'bg-[#FFE8D6] text-[#8C4A19] border-[#FFD0B0]',
  };

  return (
    <div
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`relative inline-block bg-white dark:bg-[#1E0610] p-3 pb-5 rounded-2xl shadow-[0_10px_28px_rgba(0,0,0,0.12)] border border-black/5 dark:border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_36px_rgba(230,30,80,0.22)] hover:z-20 cursor-pointer ${className}`}
    >
      {/* Sticky Note Badge (from M04 design: "Amazing places", "Dream bigger", etc.) */}
      {stickyNoteText && (
        <div
          className={`absolute -top-3 -left-3 px-2.5 py-1 rounded-md shadow-md text-[11px] font-bold tracking-tight border ${stickyColors[stickyNoteColor]} select-none z-10 rotate-[-6deg]`}
          style={{ fontFamily: 'var(--font-caveat, cursive)' }}
        >
          {stickyNoteText}
        </div>
      )}

      {/* Floating Pink Heart Badge */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.();
        }}
        className="absolute top-5 right-5 z-10 w-7 h-7 rounded-full bg-[#E61E50] text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
        title="Saved place"
      >
        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* Photo Frame */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-neutral-100">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      {/* Caption Area (Polaroid style) */}
      <div className="px-1">
        <h4 className="font-extrabold text-sm sm:text-base text-[#3E0717] dark:text-[#FFF7FA] tracking-tight line-clamp-1">
          {title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-[#704250] dark:text-[#FFB3C6] mt-0.5 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#FF4F7A]" />
            {date}
          </span>
          {location && (
            <span className="flex items-center gap-1 text-[#8C7580] truncate max-w-[100px]">
              <MapPin className="w-3 h-3 text-[#FF7A3D]" />
              {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
