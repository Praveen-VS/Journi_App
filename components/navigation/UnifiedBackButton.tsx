'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, ChevronLeft, Loader2 } from 'lucide-react';

export interface UnifiedBackButtonProps {
  /** Main desktop label, e.g. "Back to Recommendations" */
  label?: string;
  /** Sub-description on desktop, e.g. "Preserving your 8 options" */
  description?: string;
  /** Mobile compact title, e.g. "Back to Results" */
  mobileLabel?: string;
  /** Custom onClick handler, e.g. switching internal mode */
  onBack?: () => void;
  /** Fallback URL if history is empty */
  fallbackHref?: string;
  /** Badge text to show on desktop, e.g. "8 Matches Ready" */
  badgeText?: string;
  /** Optional secondary action button, e.g. "Edit in Prompt Studio" */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function UnifiedBackButton({
  label = 'Back to Recommendations',
  description = 'Preserving your curated search results',
  mobileLabel = 'Back to Results',
  onBack,
  fallbackHref = '/',
  badgeText,
  secondaryAction,
  className = '',
}: UnifiedBackButtonProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    if (onBack) {
      onBack();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    } else {
      router.back();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* ========================================================= */}
      {/* 1. DESKTOP BACK BUTTON (>= md screen size)                 */}
      {/* Elevated glassmorphic pill bar with arrow & badge         */}
      {/* ========================================================= */}
      <div className="hidden md:flex items-center justify-between gap-4 p-2.5 px-4 rounded-2xl bg-white dark:bg-[#200612] border-2 border-[#5B0B24]/15 dark:border-[#FF8BA7]/25 shadow-xs hover:shadow-md hover:border-[#5B0B24]/35 dark:hover:border-[#FF8BA7]/50 transition-all">
        <button
          type="button"
          onClick={handleAction}
          className="group flex items-center gap-3 text-left cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-[#5B0B24]/10 dark:bg-[#FF4F7A]/20 border border-[#5B0B24]/20 dark:border-[#FF4F7A]/30 flex items-center justify-center text-[#5B0B24] dark:text-[#FF8BA7] group-hover:bg-[#5B0B24] group-hover:text-white dark:group-hover:bg-[#FF4F7A] dark:group-hover:text-white transition-all shadow-xs">
            {isNavigating ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#FF7A3D]" />
            ) : (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-[#2E0513] dark:text-[#FFF7FA] group-hover:text-[#5B0B24] dark:group-hover:text-white transition-colors">
                {label}
              </span>
            </div>
            {description && (
              <p className="text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/80 font-semibold">
                {description}
              </p>
            )}
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="text-xs font-black px-3.5 py-1.5 rounded-xl border border-[#5B0B24]/20 dark:border-[#FF8BA7]/30 bg-white dark:bg-[#280814] hover:bg-[#5B0B24] hover:text-white dark:hover:bg-[#FF8BA7] dark:hover:text-[#280814] text-[#5B0B24] dark:text-[#FF8BA7] transition-all cursor-pointer shadow-xs"
            >
              {secondaryAction.label}
            </button>
          )}

          {badgeText && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B0B24]/5 dark:bg-white/10 border border-[#5B0B24]/15 dark:border-white/15 text-[11px] font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
              <Sparkles className="w-3 h-3 text-[#FF7A3D]" />
              <span>{badgeText}</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MOBILE BACK BUTTON (< md screen size)                   */}
      {/* Touch-optimized tactile target (min 44px) with clear text */}
      {/* ========================================================= */}
      <div className="flex md:hidden items-center justify-between gap-2 p-2 rounded-2xl bg-white/95 dark:bg-[#240614]/95 backdrop-blur-md border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 shadow-sm">
        <button
          type="button"
          onClick={handleAction}
          className="flex items-center gap-2.5 active:scale-95 transition-transform text-left cursor-pointer min-h-[44px] flex-1"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFF5F8] to-[#FFF0F4] dark:from-[#2e0919] dark:to-[#38091C] border border-[#FF4F7A]/30 flex items-center justify-center text-[#FF4F7A] shadow-xs shrink-0">
            {isNavigating ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#FF7A3D]" />
            ) : (
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-black text-[#5B0B24] dark:text-[#FFF7FA] truncate">
              {mobileLabel}
            </span>
            <span className="block text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 font-medium truncate">
              Keep current search options
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="text-[10px] font-bold px-2 py-1 rounded-lg border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 bg-[#FFF5F8] dark:bg-[#2c0817] text-[#5B0B24] dark:text-[#FF8BA7] active:scale-95"
            >
              {secondaryAction.label}
            </button>
          )}

          {badgeText && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF4F7A]/10 text-[#FF4F7A] border border-[#FF4F7A]/20">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
