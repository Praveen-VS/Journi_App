'use client';

import React, { useState } from 'react';
import MobileHeader from '@/components/navigation/MobileHeader';
import WeatherCard from '@/components/cards/WeatherCard';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { MOCK_WEATHER_DAYS } from '@/constants';
import { Sun, Wind, Umbrella, Sparkles, MapPin } from 'lucide-react';

export default function WeatherPage() {
  const [showEmptySim, setShowEmptySim] = useState(false);
  const [showLoadingSim, setShowLoadingSim] = useState(false);

  const todayWeather = MOCK_WEATHER_DAYS[0];

  if (showLoadingSim) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <MobileHeader title="Weather Forecast" showBack />
        <Skeleton height={200} className="w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton height={180} />
          <Skeleton height={180} />
          <Skeleton height={180} />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header */}
      <MobileHeader title="Destination Weather" showBack />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="sunset" size="sm">
              <MapPin className="w-3 h-3 mr-1" />
              Kyoto, Japan
            </Badge>
            <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
              Trip Window: Oct 12 – 17
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
            Climate & Weather
          </h1>
        </div>

        {/* State Toggle Buttons for Review */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLoadingSim(!showLoadingSim)}
            className="text-xs px-3 py-1.5 rounded-full border border-[#5B0B24]/15 text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/5"
          >
            {showLoadingSim ? 'Loaded' : 'Simulate Skeleton'}
          </button>
          <button
            type="button"
            onClick={() => setShowEmptySim(!showEmptySim)}
            className="text-xs px-3 py-1.5 rounded-full border border-[#5B0B24]/15 text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/5"
          >
            {showEmptySim ? 'Show Forecast' : 'Simulate Offline/Empty'}
          </button>
        </div>
      </div>

      {!showEmptySim ? (
        <>
          {/* Today Overview Card */}
          <div className="rounded-[28px] bg-gradient-to-tr from-[#5B0B24] via-[#C2185B] to-[#FF7A3D] text-white p-6 sm:p-10 shadow-hover mb-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#FFC83D]">
                  Current Conditions • Kyoto
                </span>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-5xl sm:text-7xl font-extrabold tracking-tight">
                    {todayWeather.highTemp}°C
                  </span>
                  <span className="text-lg sm:text-2xl text-white/80 font-medium">
                    {todayWeather.condition}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/85 mt-2">
                  Low of {todayWeather.lowTemp}°C • High of {todayWeather.highTemp}°C
                </p>
              </div>

              {/* Weather Indicators Row */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white/10 backdrop-blur-md p-4 rounded-[20px] border border-white/15">
                <div className="flex items-center gap-2">
                  <Umbrella className="w-4 h-4 text-[#FFC83D]" />
                  <span>Rain: {todayWeather.precipitationPercent}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#FF7A3D]" />
                  <span>UV Index: {todayWeather.uvIndex}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-white" />
                  <span>Wind: 8 km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFC83D]" />
                  <span>Comfort: Ideal</span>
                </div>
              </div>
            </div>

            {/* AI Climate Insight Callout */}
            <div className="mt-6 pt-4 border-t border-white/15 flex items-start gap-2.5 text-xs text-white/90">
              <Sparkles className="w-4 h-4 text-[#FFC83D] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Journi Travel Tip:</strong> {todayWeather.advice}
              </span>
            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight mb-4">
              Trip Window Forecast
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_WEATHER_DAYS.map((day, idx) => (
                <WeatherCard key={day.date} day={day} isToday={idx === 0} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          icon={<Sun className="w-8 h-8 text-[#FF7A3D]" />}
          title="Weather data unavailable offline"
          description="We could not synchronize the latest satellite forecast. Connect to the internet or reload to refresh."
          actionLabel="Try Refreshing"
          onAction={() => setShowEmptySim(false)}
        />
      )}
    </main>
  );
}
