'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { TripSummary } from '@/types';
import { Calendar, MapPin, ArrowRight, Heart } from 'lucide-react';
import { useSavedStore } from '@/store';

export interface TripCardProps {
  trip: TripSummary;
  className?: string;
}

export default function TripCard({ trip, className = '' }: TripCardProps) {
  const { isSaved, toggleFavorite } = useSavedStore();
  const isTripSaved = isSaved(trip.id) || isSaved(trip.title) || isSaved(trip.destination);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite({
      id: trip.id,
      name: trip.title,
      destination: trip.destination,
      country: trip.country,
      coverImage: trip.coverImage,
      tagline: trip.description,
      idealDays: trip.daysCount,
      estimatedBudget: trip.estimatedBudget,
      continent: 'Global',
      bestTimeToVisit: trip.startDate,
      vibes: ['Adventure', 'Trip'],
      popularSpots: [trip.destination],
      rating: 4.9,
      reviewCount: 120,
    } as any);
  };

  const statusBadges = {
    upcoming: <Badge variant="sunset" size="sm">Upcoming</Badge>,
    ongoing: <Badge variant="golden" size="sm">Active Now</Badge>,
    completed: <Badge variant="neutral" size="sm">Memories</Badge>,
    draft: <Badge variant="pink" size="sm">Draft Idea</Badge>,
  };

  const budgetPercent =
    trip.estimatedBudget > 0
      ? Math.min(100, Math.round((trip.spentBudget / trip.estimatedBudget) * 100))
      : 0;

  return (
    <Link href={`/trips/${trip.id}`} className="block h-full group focus-visible:outline-none">
      <Card variant="elevated" isInteractive className={`flex flex-col h-full ${className}`}>
        {/* Cover Image Header */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gradient-to-tr from-[#5B0B24] to-[#FF7A3D]">
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Status Badge & Actions */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            {statusBadges[trip.status]}
            <div className="flex items-center gap-1.5">
              <span className="bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {trip.daysCount} Days
              </span>
              <button
                type="button"
                onClick={handleSaveClick}
                aria-label={isTripSaved ? 'Remove from saved' : 'Save to favorites'}
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    isTripSaved ? 'fill-[#FF4F7A] text-[#FF4F7A]' : 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Destination Header Text on Image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1 text-xs text-white/80 font-medium mb-0.5">
              <MapPin className="w-3 h-3 text-[#FF7A3D]" />
              <span>
                {trip.destination}, {trip.country}
              </span>
            </div>
            <h4 className="text-lg font-bold tracking-tight text-white drop-shadow-sm line-clamp-1">
              {trip.title}
            </h4>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#FF4F7A]" />
              <span>
                {trip.startDate} — {trip.endDate}
              </span>
            </div>

            <p className="text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          </div>

          {/* Budget Progress & CTA */}
          <div className="pt-3 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 font-medium">Budget Tracked</span>
              <span className="font-semibold text-[#5B0B24] dark:text-[#FF8BA7]">
                ₹{trip.spentBudget.toLocaleString('en-IN')} <span className="font-normal text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">/ ₹{trip.estimatedBudget.toLocaleString('en-IN')}</span>
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-1.5 bg-[#5B0B24]/10 dark:bg-[#FF8BA7]/15 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] rounded-full transition-all duration-500"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-[#C2185B] dark:text-[#FF8BA7] group-hover:text-[#FF4F7A] transition-colors">
              <span>View Itinerary & Details</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
