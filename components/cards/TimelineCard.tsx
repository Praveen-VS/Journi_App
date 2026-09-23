'use client';

import React from 'react';
import Card from '../ui/Card';
import { ActivityItem } from '@/types';
import { Clock, MapPin, Lightbulb, Compass, Utensils, Landmark, Coffee, Car } from 'lucide-react';

export interface TimelineCardProps {
  activity: ActivityItem;
  className?: string;
}

export default function TimelineCard({ activity, className = '' }: TimelineCardProps) {
  const categoryIcons = {
    sightseeing: <Compass className="w-3.5 h-3.5" />,
    dining: <Utensils className="w-3.5 h-3.5" />,
    culture: <Landmark className="w-3.5 h-3.5" />,
    leisure: <Coffee className="w-3.5 h-3.5" />,
    transport: <Car className="w-3.5 h-3.5" />,
  };

  const periodColors = {
    Morning: 'bg-[#FFC83D]/15 text-[#996500] dark:text-[#FFC83D] border-[#FFC83D]/30',
    Afternoon: 'bg-[#FF7A3D]/15 text-[#D35400] dark:text-[#FF7A3D] border-[#FF7A3D]/30',
    Evening: 'bg-[#C2185B]/15 text-[#C2185B] dark:text-[#FF4F7A] border-[#C2185B]/30',
  };

  return (
    <Card variant="elevated" className={`p-4 sm:p-5 relative ${className}`}>
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Time Badge */}
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5B0B24] dark:text-[#FF8BA7] bg-[#5B0B24]/6 dark:bg-[#FF8BA7]/10 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-[#FF4F7A]" />
            {activity.time}
          </span>

          {/* Period Pill */}
          <span
            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              periodColors[activity.period]
            }`}
          >
            {categoryIcons[activity.category]}
            {activity.period}
          </span>
        </div>

        {/* Cost & Duration Tag */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
          <span className="text-[11px] bg-[#5B0B24]/5 dark:bg-[#FF8BA7]/10 px-2 py-0.5 rounded-full">
            {activity.duration}
          </span>
          <span className="font-semibold text-[#5B0B24] dark:text-[#FF8BA7]">
            {activity.cost === 0 ? 'Free' : `₹${activity.cost.toLocaleString('en-IN')}`}
          </span>
        </div>
      </div>

      {/* Activity Title */}
      <h4 className="text-base sm:text-lg font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight mb-1.5">
        {activity.title}
      </h4>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 leading-relaxed mb-3">
        {activity.description}
      </p>

      {/* Location Bar */}
      <div className="flex items-center gap-1.5 text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mb-2">
        <MapPin className="w-3.5 h-3.5 text-[#FF7A3D] flex-shrink-0" />
        <span className="truncate">{activity.location}</span>
      </div>

      {/* Optional Travel Tip Callout */}
      {activity.tips && (
        <div className="mt-3 p-2.5 rounded-[16px] bg-[#FFF7FA] dark:bg-[#1f060f] border border-[#FF4F7A]/15 flex items-start gap-2 text-xs text-[#5B0B24]/80 dark:text-[#FF8BA7]/80">
          <Lightbulb className="w-3.5 h-3.5 text-[#FF7A3D] flex-shrink-0 mt-0.5" />
          <span className="italic">{activity.tips}</span>
        </div>
      )}
    </Card>
  );
}
