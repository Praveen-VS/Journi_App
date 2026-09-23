'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileHeader from '@/components/navigation/MobileHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { MOCK_USER, MOCK_TRIPS } from '@/constants';
import {
  MapPin,
  Calendar,
  Bookmark,
  Globe,
  Settings,
  ArrowRight,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header */}
      <MobileHeader title="Traveler Profile" showBack />

      {/* Profile Header Card */}
      <div className="rounded-[28px] bg-white dark:bg-[#280814] border border-[#5B0B24]/8 dark:border-[#FF8BA7]/15 p-6 sm:p-10 shadow-soft mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with Sunset Ring */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#FF4F7A] to-[#FF7A3D] shadow-sunset flex-shrink-0">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
              <Image
                src={MOCK_USER.avatarUrl!}
                alt={MOCK_USER.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </div>

          {/* User Bio Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
                  {MOCK_USER.name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7A3D]" />
                  <span>{MOCK_USER.homeCity}</span>
                  <span>•</span>
                  <span>Member since {MOCK_USER.createdAt}</span>
                </div>
              </div>

              <Link href="/settings">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Settings className="w-3.5 h-3.5" />}
                  className="border-[#5B0B24]/15"
                >
                  Edit Settings
                </Button>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 leading-relaxed max-w-xl my-4">
              {MOCK_USER.bio}
            </p>

            {/* Travel Preferences Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
              {MOCK_USER.preferences.map((pref) => (
                <span
                  key={pref}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#FF4F7A]/10 text-[#C2185B] dark:text-[#FF8BA7]"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Travel Stats Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <Card variant="elevated" className="p-4 sm:p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF4F7A]/15 to-[#FF7A3D]/20 text-[#FF4F7A] flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7] block">
            {MOCK_USER.tripsCount}
          </span>
          <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
            Trips Planned
          </span>
        </Card>

        <Card variant="elevated" className="p-4 sm:p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#FFC83D]/20 text-[#996500] dark:text-[#FFC83D] flex items-center justify-center mx-auto mb-2">
            <Bookmark className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7] block">
            {MOCK_USER.savedPlacesCount}
          </span>
          <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
            Places Saved
          </span>
        </Card>

        <Card variant="elevated" className="p-4 sm:p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#5B0B24]/10 text-[#5B0B24] dark:text-[#FF8BA7] flex items-center justify-center mx-auto mb-2">
            <Globe className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7] block">
            {MOCK_USER.countriesExplored}
          </span>
          <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
            Countries Explored
          </span>
        </Card>
      </div>

      {/* Recent Activity / Travel History */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
            Journi Travel Passport
          </h2>
          <Link href="/trips" className="text-xs font-semibold text-[#FF4F7A] hover:underline">
            All Trips
          </Link>
        </div>

        <div className="space-y-3">
          {MOCK_TRIPS.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <Card variant="elevated" isInteractive className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-[#5B0B24] to-[#FF7A3D] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {trip.destination.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                      {trip.destination}, {trip.country} • {trip.startDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={trip.status === 'upcoming' ? 'sunset' : 'neutral'} size="sm">
                    {trip.status}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-[#5B0B24]/40" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
