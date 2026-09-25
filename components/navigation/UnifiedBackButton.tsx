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
      {/* Elevated glassmorphic luxury bar with glowing arrow & badge */}
      {/* ========================================================= */}
      <div className="hidden md:flex items-center justify-between gap-4 p-3 px-5 rounded-[22px] bg-gradient-to-r from-white via-[#FFF7FA] to-white dark:from-[#200612] dark:via-[#260817] dark:to-[#200612] border-2 border-[#FF4F7A]/20 dark:border-[#FF8BA7]/30 shadow-[0_4px_20px_rgba(255,79,122,0.06)] hover:shadow-[0_8px_28px_rgba(255,79,122,0.12)] hover:border-[#FF4F7A]/40 transition-all backdrop-blur-md">
        <button
          type="button"
          onClick={handleAction}
          className="group flex items-center gap-3.5 text-left cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF4F7A]/15 to-[#FF7A3D]/20 border border-[#FF4F7A]/30 flex items-center justify-center text-[#C2185B] dark:text-[#FF8BA7] group-hover:scale-105 group-hover:bg-gradient-to-r group-hover:from-[#FF4F7A] group-hover:to-[#FF7A3D] group-hover:text-white transition-all shadow-xs shrink-0">
            {isNavigating ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#FF7A3D] group-hover:text-white" />
            ) : (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#2E0513] dark:text-[#FFF7FA] group-hover:text-[#FF4F7A] dark:group-hover:text-white transition-colors tracking-tight">
                {label}
              </span>
            </div>
            {description && (
              <p className="text-xs text-[#704250] dark:text-[#FFB3C6]/85 font-medium mt-0.5">
                {description}
              </p>
            )}
          </div>
        </button>

        <div className="flex items-center gap-3">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="text-xs font-black px-4 py-2 rounded-full border border-[#FF4F7A]/30 bg-white dark:bg-[#280814] hover:bg-gradient-to-r hover:from-[#FF4F7A] hover:to-[#FF7A3D] hover:text-white text-[#C2185B] dark:text-[#FF8BA7] transition-all cursor-pointer shadow-xs"
            >
              {secondaryAction.label}
            </button>
          )}

          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF4F7A]/10 to-[#FF7A3D]/10 border border-[#FF4F7A]/25 text-xs font-bold text-[#C2185B] dark:text-[#FF8BA7] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A3D]" />
              <span>{badgeText}</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MOBILE BACK BUTTON (< md screen size)                   */}
      {/* Touch-optimized tactile target with lively gradient sheen  */}
      {/* ========================================================= */}
      <div className="flex md:hidden items-center justify-between gap-2 p-2.5 px-3.5 rounded-[20px] bg-gradient-to-r from-white via-[#FFF7FA] to-white dark:from-[#200612] dark:via-[#260817] dark:to-[#200612] border-2 border-[#FF4F7A]/20 dark:border-[#FF8BA7]/30 shadow-xs">
        <button
          type="button"
          onClick={handleAction}
          className="flex items-center gap-2.5 active:scale-95 transition-transform text-left cursor-pointer min-h-[44px] flex-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF4F7A]/15 to-[#FF7A3D]/20 border border-[#FF4F7A]/30 flex items-center justify-center text-[#C2185B] dark:text-[#FF8BA7] shadow-xs shrink-0">
            {isNavigating ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#FF7A3D]" />
            ) : (
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-black text-[#2E0513] dark:text-[#FFF7FA] truncate">
              {mobileLabel}
            </span>
            <span className="block text-[11px] text-[#704250] dark:text-[#FFB3C6]/70 font-medium truncate">
              Keep current search options
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#FF4F7A]/20 bg-[#FFF5F8] dark:bg-[#2c0817] text-[#C2185B] dark:text-[#FF8BA7] active:scale-95"
            >
              {secondaryAction.label}
            </button>
          )}

          {badgeText && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF4F7A]/10 to-[#FF7A3D]/10 text-[#C2185B] dark:text-[#FF8BA7] border border-[#FF4F7A]/20">
              <Sparkles className="w-3 h-3 text-[#FF7A3D]" />
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
