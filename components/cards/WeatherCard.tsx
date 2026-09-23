'use client';

import React from 'react';
import Card from '../ui/Card';
import { WeatherDay } from '@/types';
import { Sun, CloudSun, CloudRain, Wind, Umbrella, Sparkles } from 'lucide-react';

export interface WeatherCardProps {
  day: WeatherDay;
  isToday?: boolean;
  className?: string;
}

export default function WeatherCard({ day, isToday = false, className = '' }: WeatherCardProps) {
  const weatherIcons: Record<string, React.ReactNode> = {
    Sunny: <Sun className="w-6 h-6 text-[#FFC83D]" />,
    Sun: <Sun className="w-6 h-6 text-[#FFC83D]" />,
    Clear: <Sun className="w-6 h-6 text-[#FF7A3D]" />,
    'Partly Cloudy': <CloudSun className="w-6 h-6 text-[#FF7A3D]" />,
    Rainy: <CloudRain className="w-6 h-6 text-[#C2185B]" />,
    Breezy: <Wind className="w-6 h-6 text-[#FF4F7A]" />,
  };

  return (
    <Card
      variant={isToday ? 'glass' : 'elevated'}
      className={`p-4 sm:p-5 flex flex-col justify-between ${
        isToday ? 'border-[#FF4F7A]/30 ring-1 ring-[#FF4F7A]/20' : ''
      } ${className}`}
    >
      <div>
        {/* Header with Date and Condition */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
                {day.dayName}
              </h4>
              {isToday && (
                <span className="bg-[#FF4F7A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
              {day.date}
            </span>
          </div>

          <div className="p-2 rounded-full bg-[#5B0B24]/5 dark:bg-[#FF8BA7]/10">
            {weatherIcons[day.condition] || <Sun className="w-6 h-6 text-[#FFC83D]" />}
          </div>
        </div>

        {/* Temperature Range */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">
            {day.highTemp}°
          </span>
          <span className="text-sm font-medium text-[#5B0B24]/50 dark:text-[#FF8BA7]/50">
            / {day.lowTemp}°C
          </span>
          <span className="ml-auto text-xs font-semibold text-[#FF4F7A] dark:text-[#FF8BA7]">
            {day.condition}
          </span>
        </div>

        {/* Extra Weather Indicators */}
        <div className="flex items-center gap-4 text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 pt-2 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 mb-3">
          <div className="flex items-center gap-1">
            <Umbrella className="w-3.5 h-3.5 text-[#C2185B]" />
            <span>{day.precipitationPercent}% Rain</span>
          </div>
          <div className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-[#FF7A3D]" />
            <span>UV {day.uvIndex}</span>
          </div>
        </div>
      </div>

      {/* AI Packing Advice Snippet */}
      <div className="p-2.5 rounded-[16px] bg-[#FFF7FA] dark:bg-[#1f060f] border border-[#FF4F7A]/12 flex items-start gap-1.5 text-[11px] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80">
        <Sparkles className="w-3.5 h-3.5 text-[#FF7A3D] flex-shrink-0 mt-0.5" />
        <span className="line-clamp-2">{day.advice}</span>
      </div>
    </Card>
  );
}
