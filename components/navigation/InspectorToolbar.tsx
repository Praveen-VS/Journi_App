'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  Loader2,
  ChevronUp,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { UIStateMode } from '@/types';

interface InspectorToolbarProps {
  currentMode?: UIStateMode;
  onModeChange?: (mode: UIStateMode) => void;
}

export default function InspectorToolbar({
  currentMode = 'default',
  onModeChange,
}: InspectorToolbarProps) {
  // Hidden across desktop and mobile as requested
  if (true as boolean) return null;
  const isExpanded = false;
  const pathname = '';
  const router = { push: (_: string) => {} };
  const setIsExpanded = (_: any) => {};

  const mobileScreens = [
    { code: 'M01', label: 'Splash', href: '/onboarding?splash=1' },
    { code: 'M02', label: 'Discover Places', href: '/onboarding?step=1' },
    { code: 'M03', label: 'Plan with AI', href: '/onboarding?step=2' },
    { code: 'M04', label: 'Save Every Journey', href: '/onboarding?step=3' },
    { code: 'M05', label: 'Login', href: '/login' },
    { code: 'M06', label: 'Register', href: '/register' },
    { code: 'M07', label: 'AI Home', href: '/home' },
    { code: 'M08', label: 'AI Planning Result', href: '/ai?view=result' },
    { code: 'M09', label: 'Trip Dashboard', href: '/trips' },
    { code: 'M10', label: 'Trip Details', href: '/trips/trip_kyoto_autumn' },
    { code: 'M11', label: 'Day-wise Itinerary', href: '/itinerary' },
    { code: 'M12', label: 'Budget Planner', href: '/budget' },
    { code: 'M13', label: 'Packing Checklist', href: '/packing' },
    { code: 'M14', label: 'Weather', href: '/weather' },
    { code: 'M15', label: 'Map Explorer', href: '/map' },
    { code: 'M16', label: 'Saved Places', href: '/saved' },
    { code: 'M17', label: 'Profile', href: '/profile' },
    { code: 'M18', label: 'Settings', href: '/settings' },
  ];

  const desktopPages = [
    { code: 'D01', label: 'Landing Page', href: '/' },
    { code: 'D02', label: 'How Journi Works', href: '/how-it-works' },
    { code: 'D03', label: 'AI Planner', href: '/ai' },
    { code: 'D05', label: 'Login / Register', href: '/login' },
    { code: 'D06', label: 'AI Planning Result', href: '/ai?view=result' },
    { code: 'D07', label: 'Dashboard', href: '/home' },
    { code: 'D08', label: 'Trip Details', href: '/trips/trip_kyoto_autumn' },
    { code: 'D09', label: 'Itinerary Planner', href: '/itinerary' },
    { code: 'D10', label: 'Budget Planner', href: '/budget' },
    { code: 'D11', label: 'Map Explorer', href: '/map' },
    { code: 'D12', label: 'Profile & Settings', href: '/profile' },
  ];

  return (
    <aside
      aria-label="Journi V1 Inspector and Screen Switcher"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end pointer-events-auto"
    >
      {/* Expanded Quick Switcher Panel */}
      {isExpanded && (
        <div className="mb-3 w-84 sm:w-96 rounded-[24px] glass-panel border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 shadow-2xl p-4 text-xs select-none max-h-[75vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#5B0B24]/10 dark:border-[#FF8BA7]/15">
            <div className="flex items-center gap-2 font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
              <Layers className="w-4 h-4 text-[#FF4F7A]" />
              <span>Journi V1 Inspector</span>
            </div>
            <span className="text-[10px] bg-[#FF4F7A]/10 text-[#C2185B] dark:text-[#FF8BA7] font-semibold px-2 py-0.5 rounded-full">
              Final Locked
            </span>
          </div>

          {/* UI State Toggles */}
          {onModeChange && (
            <div className="my-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mb-2 block">
                Simulation UI State
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { mode: 'default', label: 'Loaded', icon: CheckCircle2, color: 'text-emerald-500' },
                  { mode: 'loading', label: 'Skeleton', icon: Loader2, color: 'text-amber-500' },
                  { mode: 'empty', label: 'Empty', icon: FileQuestion, color: 'text-blue-500' },
                  { mode: 'error', label: 'Error', icon: AlertCircle, color: 'text-rose-500' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = currentMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => onModeChange?.(item.mode as UIStateMode)}
                      className={`flex flex-col items-center py-2 px-1 rounded-[14px] transition-all ${
                        isSelected
                          ? 'bg-[#5B0B24] text-white shadow-soft font-semibold'
                          : 'bg-white/60 dark:bg-[#280814]/60 text-[#5B0B24] dark:text-[#FF8BA7] hover:bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : item.color}`} />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 18 Mobile Screens Quick Jump */}
          <div className="mt-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mb-1.5 block">
              18 Mobile Screens (M01 – M18)
            </label>
            <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-1">
              {mobileScreens.map((screen) => {
                const isActive = pathname === screen.href.split('?')[0];
                return (
                  <button
                    key={screen.code}
                    type="button"
                    onClick={() => {
                      router.push(screen.href);
                      setIsExpanded(false);
                    }}
                    className={`flex items-center justify-between p-1.5 rounded-[10px] text-[11px] transition-colors ${
                      isActive
                        ? 'bg-[#FF4F7A]/15 text-[#C2185B] dark:text-[#FF8BA7] font-bold'
                        : 'hover:bg-[#5B0B24]/5 text-[#5B0B24]/80 dark:text-[#FF8BA7]/80'
                    }`}
                  >
                    <span className="font-mono font-semibold text-[10px] text-[#FF7A3D]">
                      {screen.code}
                    </span>
                    <span className="truncate ml-1">{screen.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 12 Desktop Pages Quick Jump */}
          <div className="mt-3 pt-3 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mb-1.5 block">
              12 Desktop Pages (D01 – D12)
            </label>
            <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-1">
              {desktopPages.map((page) => {
                const isActive = pathname === page.href.split('?')[0];
                return (
                  <button
                    key={page.code}
                    type="button"
                    onClick={() => {
                      router.push(page.href);
                      setIsExpanded(false);
                    }}
                    className={`flex items-center justify-between p-1.5 rounded-[10px] text-[11px] transition-colors ${
                      isActive
                        ? 'bg-[#FF7A3D]/15 text-[#C2185B] dark:text-[#FF8BA7] font-bold'
                        : 'hover:bg-[#5B0B24]/5 text-[#5B0B24]/80 dark:text-[#FF8BA7]/80'
                    }`}
                  >
                    <span className="font-mono font-semibold text-[10px] text-[#FF4F7A]">
                      {page.code}
                    </span>
                    <span className="truncate ml-1">{page.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button: small compact circular icon under 780px, pill above 780px */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-10 h-10 min-[780px]:w-auto min-[780px]:h-11 min-[780px]:px-4 rounded-full bg-[#5B0B24] text-white shadow-hover flex items-center justify-center min-[780px]:justify-start min-[780px]:gap-2 text-xs font-semibold hover:bg-[#4a081d] active:scale-95 transition-all select-none border border-white/20 relative"
        aria-label="Toggle Journi Screen Inspector"
        title="V1 Screens & States"
      >
        {/* Under 780px: Small icon with pulsing dot */}
        <div className="relative flex items-center justify-center min-[780px]:hidden">
          <Layers className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF4F7A] ring-1 ring-[#5B0B24] animate-pulse" />
        </div>

        {/* 780px and wider: Full pill label */}
        <div className="hidden min-[780px]:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF4F7A] animate-pulse" />
          <span>V1 Screens & States</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </button>
    </aside>
  );
}
