'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileHeader from '@/components/navigation/MobileHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TextToSpeechButton from '@/components/shared/TextToSpeechButton';
import {
  MOCK_TRIPS,
  MOCK_ITINERARY_DAYS,
  MOCK_PACKING_ITEMS,
} from '@/constants';
import {
  Calendar,
  MapPin,
  Wallet,
  CheckSquare,
  Sun,
  Map as MapIcon,
  ChevronRight,
} from 'lucide-react';

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;

  const trip = MOCK_TRIPS.find((t) => t.id === tripId) || MOCK_TRIPS[0];
  const packedCount = MOCK_PACKING_ITEMS.filter((i) => i.isPacked).length;
  const packingPercent = Math.round((packedCount / MOCK_PACKING_ITEMS.length) * 100);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header with Back Button */}
      <MobileHeader title={trip.destination} showBack />

      {/* Cover Banner with Sunset Gradient Overlay */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-[28px] overflow-hidden shadow-2xl mb-8">
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Top Floating Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Badge variant="sunset" size="md">
            {trip.daysCount} Days Planned
          </Badge>
          <div className="flex items-center gap-2">
            <span className="bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
              {trip.pace} Pace
            </span>
          </div>
        </div>

        {/* Bottom Banner Content */}
        <div className="absolute bottom-6 left-6 right-6 text-white max-w-3xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80 mb-2">
            <MapPin className="w-4 h-4 text-[#FF7A3D]" />
            <span>
              {trip.destination}, {trip.country}
            </span>
            <span>•</span>
            <Calendar className="w-4 h-4 text-[#FF4F7A]" />
            <span>
              {trip.startDate} — {trip.endDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm mb-3">
            {trip.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-2">
            {trip.description}
          </p>
        </div>
      </div>

      {/* Sub-Feature Quick Hub Grid (Itinerary, Budget, Packing, Weather, Map) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {/* Itinerary Quick Link */}
        <Link href={`/itinerary?tripId=${trip.id}`}>
          <Card variant="elevated" isInteractive className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#5B0B24] text-white flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#FFC83D]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                  Itinerary
                </h4>
                <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  {trip.daysCount} Days
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5B0B24]/40" />
          </Card>
        </Link>

        {/* Budget Quick Link */}
        <Link href={`/budget?tripId=${trip.id}`}>
          <Card variant="elevated" isInteractive className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-[#FF4F7A] to-[#FF7A3D] text-white flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                  Budget
                </h4>
                <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  ₹{trip.spentBudget.toLocaleString('en-IN')} / ₹{trip.estimatedBudget.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5B0B24]/40" />
          </Card>
        </Link>

        {/* Packing Quick Link */}
        <Link href={`/packing?tripId=${trip.id}`}>
          <Card variant="elevated" isInteractive className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-[#C2185B] to-[#FF4F7A] text-white flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                  Packing
                </h4>
                <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  {packingPercent}% Done
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5B0B24]/40" />
          </Card>
        </Link>

        {/* Weather Quick Link */}
        <Link href={`/weather?tripId=${trip.id}`}>
          <Card variant="elevated" isInteractive className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#FFC83D]/25 text-[#FF7A3D] flex items-center justify-center">
                <Sun className="w-5 h-5 text-[#FF7A3D]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                  Weather
                </h4>
                <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  21°C Mild
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5B0B24]/40" />
          </Card>
        </Link>
      </div>

      {/* Main Hub Split Layout: Left Days Timeline, Right Notes & Audio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Day-by-Day Quick List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
              Day-Wise Overview
            </h2>
            <TextToSpeechButton
              textToRead={`Overview of your ${trip.daysCount}-day journey to ${trip.destination}. Day 1 covers Arashiyama and Bamboo Grove. Day 2 features Gion and Fushimi Inari torii gates.`}
            />
          </div>

          {MOCK_ITINERARY_DAYS.map((day) => (
            <Card key={day.dayNumber} variant="elevated" className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] text-white font-bold text-xs flex items-center justify-center">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#5B0B24] dark:text-[#FF8BA7]">
                      {day.title}
                    </h3>
                    <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                      {day.date} • {day.theme}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/itinerary?tripId=${trip.id}&day=${day.dayNumber}`}
                  className="text-xs font-semibold text-[#FF4F7A] hover:underline"
                >
                  View Day
                </Link>
              </div>

              <div className="space-y-2">
                {day.activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between text-xs py-1 text-[#5B0B24]/80 dark:text-[#FF8BA7]/80"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[11px] font-semibold text-[#FF7A3D]">
                        {act.time}
                      </span>
                      <span className="truncate">{act.title}</span>
                    </div>
                    <span className="text-[11px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 whitespace-nowrap ml-2">
                      {act.duration}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column: Travel Notes & Map Teaser */}
        <div className="lg:col-span-4 space-y-6">
          {/* Map Preview Teaser */}
          <Card variant="elevated" className="p-5 text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                Trip Map Explorer
              </h3>
              <Link href={`/map?tripId=${trip.id}`} className="text-xs text-[#FF4F7A] font-semibold hover:underline">
                Full Map
              </Link>
            </div>
            <div className="h-40 rounded-[18px] bg-[#5B0B24]/5 dark:bg-[#FF8BA7]/10 flex flex-col items-center justify-center text-center p-4 border border-[#5B0B24]/10">
              <MapIcon className="w-8 h-8 text-[#FF7A3D] mb-2" />
              <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 font-medium">
                All 12 activity locations pinned across Kyoto.
              </p>
            </div>
          </Card>

          {/* Practical Trip Notes */}
          <Card variant="glass" className="p-5">
            <h3 className="text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7] mb-3">
              Important Reminders
            </h3>
            <ul className="space-y-2.5 text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/75">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F7A] mt-1.5 flex-shrink-0" />
                <span>Keep your passport accessible for JR Pass validation at train gates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A3D] mt-1.5 flex-shrink-0" />
                <span>Temples require shoes off before walking onto tatami mats; wear easy slip-on shoes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC83D] mt-1.5 flex-shrink-0" />
                <span>Carry cash (yen coins/notes) as many smaller noodle stalls and shrine souvenir booths do not take cards.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
