'use client';

import React, { useState } from 'react';
import MobileHeader from '@/components/navigation/MobileHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import { MOCK_ITINERARY_DAYS } from '@/constants';
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPinId, setSelectedPinId] = useState('act_101');

  const categories = ['All', 'Sightseeing', 'Culture', 'Dining', 'Leisure'];

  // Flatten activities from itinerary for map pins
  const allActivities = MOCK_ITINERARY_DAYS.flatMap((day) =>
    day.activities.map((act) => ({
      ...act,
      dayNumber: day.dayNumber,
    }))
  );

  const filteredActivities = allActivities.filter((act) => {
    if (selectedCategory === 'All') return true;
    return act.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const selectedActivity =
    allActivities.find((a) => a.id === selectedPinId) || allActivities[0];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header */}
      <MobileHeader title="Map Explorer" showBack />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="sunset" size="sm">
              <MapPin className="w-3 h-3 mr-1" />
              Kyoto Interactive Map
            </Badge>
            <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
              12 Clustered Pins
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
            Map Explorer
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Main Map Explorer Layout (Desktop Split / Mobile Full-Bleed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Desktop Sidebar): List of Pinned Locations */}
        <div className="hidden lg:block lg:col-span-4 space-y-3 max-h-[650px] overflow-y-auto pr-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mb-2">
            Trip Locations ({filteredActivities.length})
          </h2>

          {filteredActivities.map((act) => {
            const isSelected = act.id === selectedPinId;
            return (
              <Card
                key={act.id}
                variant="elevated"
                isInteractive
                onClick={() => setSelectedPinId(act.id)}
                className={`p-3.5 transition-all border ${
                  isSelected
                    ? 'border-[#FF4F7A] ring-2 ring-[#FF4F7A]/20 bg-white dark:bg-[#280814]'
                    : 'border-[#5B0B24]/8 hover:border-[#FF4F7A]/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-semibold text-[#FF7A3D]">
                    {act.time} • Day {act.dayNumber}
                  </span>
                  <span className="capitalize text-[10px] bg-[#5B0B24]/5 dark:bg-[#FF8BA7]/10 px-2 py-0.5 rounded-full text-[#5B0B24] dark:text-[#FF8BA7]">
                    {act.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight mb-1 truncate">
                  {act.title}
                </h4>
                <p className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 truncate">
                  {act.location}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Stylized Interactive SVG Map Canvas */}
        <div className="lg:col-span-8 relative rounded-[28px] overflow-hidden bg-[#FAF1F3] dark:bg-[#1a050d] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 h-[480px] sm:h-[620px] shadow-soft">
          {/* Stylized SVG Map Topography Grid */}
          <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(91,11,36,0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#grid)" />

            {/* Stylized River Contour (Kamo River) */}
            <path
              d="M 520,0 C 490,150 460,300 480,450 C 490,520 510,600 520,600"
              fill="none"
              stroke="#FF4F7A"
              strokeWidth="12"
              strokeOpacity="0.15"
              strokeLinecap="round"
            />
            {/* River label */}
            <text x="500" y="280" fill="#FF4F7A" fillOpacity="0.4" fontSize="12" fontWeight="bold" transform="rotate(75, 500, 280)">
              Kamo River (鴨川)
            </text>

            {/* Arashiyama Hills Blob */}
            <circle cx="160" cy="180" r="110" fill="#FFC83D" fillOpacity="0.08" />
            <text x="120" y="160" fill="#996500" fillOpacity="0.5" fontSize="12" fontWeight="bold">
              Arashiyama Western Hills
            </text>

            {/* Higashiyama Historic Foothills */}
            <circle cx="680" cy="380" r="140" fill="#C2185B" fillOpacity="0.07" />
            <text x="640" y="360" fill="#C2185B" fillOpacity="0.5" fontSize="12" fontWeight="bold">
              Higashiyama Foothills
            </text>
          </svg>

          {/* Interactive Floating Location Pins */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { id: 'act_101', title: 'Arashiyama Bamboo', x: 22, y: 32 },
              { id: 'act_102', title: 'Tenryu-ji Garden', x: 26, y: 38 },
              { id: 'act_105', title: 'Togetsukyo Bridge', x: 24, y: 46 },
              { id: 'act_201', title: 'Fushimi Inari-Taisha', x: 62, y: 78 },
              { id: 'act_202', title: 'Kiyomizu-dera', x: 74, y: 52 },
              { id: 'act_204', title: 'Gion Shirakawa', x: 68, y: 44 },
              { id: 'act_301', title: 'Golden Pavilion', x: 38, y: 18 },
              { id: 'act_303', title: 'Philosophers Path', x: 78, y: 28 },
            ].map((pin) => {
              const isSelected = pin.id === selectedPinId;
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setSelectedPinId(pin.id)}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  aria-label={`Select ${pin.title}`}
                  className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 group focus-visible:outline-none"
                >
                  <div
                    className={`relative flex items-center justify-center transition-all ${
                      isSelected
                        ? 'w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF4F7A] to-[#FF7A3D] text-white shadow-hover scale-125 z-20'
                        : 'w-7 h-7 rounded-full bg-[#5B0B24] text-white shadow-soft group-hover:scale-110 z-10'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 ${isSelected ? 'animate-bounce' : ''}`} />
                  </div>
                  <span
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-sm pointer-events-none transition-all ${
                      isSelected
                        ? 'bg-[#5B0B24] text-white opacity-100'
                        : 'bg-white/90 text-[#5B0B24] opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {pin.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Map Controls Overlay (Zoom & Layers) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white dark:bg-[#280814] shadow-soft border border-[#5B0B24]/10 flex items-center justify-center text-[#5B0B24] dark:text-white hover:bg-[#FFF7FA]"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white dark:bg-[#280814] shadow-soft border border-[#5B0B24]/10 flex items-center justify-center text-[#5B0B24] dark:text-white hover:bg-[#FFF7FA]"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Floating Place Card Preview (Mobile & Desktop) */}
          {selectedActivity && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-20">
              <Card variant="glass" className="p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#FF7A3D]">
                      {selectedActivity.time}
                    </span>
                    <Badge variant="sunset" size="sm">
                      {selectedActivity.category}
                    </Badge>
                    <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                      {selectedActivity.duration}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
                    {selectedActivity.title}
                  </h3>
                  <p className="text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 line-clamp-1 mt-0.5">
                    {selectedActivity.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-[#5B0B24] dark:text-white mr-2">
                    {selectedActivity.cost === 0 ? 'Free Entry' : `₹${selectedActivity.cost.toLocaleString('en-IN')}`}
                  </span>
                  <Button
                    variant="sunset"
                    size="sm"
                    onClick={() => alert(`Navigating to ${selectedActivity.location}`)}
                    leftIcon={<Navigation className="w-3.5 h-3.5" />}
                  >
                    Directions
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
