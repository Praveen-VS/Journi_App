'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface PromptSuggestionChipProps {
  prompt: string;
  onClick: (prompt: string) => void;
  variant?: 'light' | 'glass' | 'subtle';
  popoverPosition?: 'top' | 'bottom';
  className?: string;
}

export default function PromptSuggestionChip({
  prompt,
  onClick,
  variant = 'light',
  popoverPosition = 'top',
  className = '',
}: PromptSuggestionChipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Variant styling for the chip container
  const variantStyles = {
    light:
      'bg-white/95 dark:bg-[#280814]/95 text-[#5B0B24] dark:text-[#FF8BA7] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 hover:border-[#FF4F7A] shadow-sm hover:shadow-soft',
    glass:
      'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 shadow-sm',
    subtle:
      'bg-[#FFF5F8] dark:bg-[#2A0815] text-[#5B0B24] dark:text-[#FF8BA7] border border-[#FF4F7A]/20 hover:border-[#FF4F7A] shadow-sm',
  };

  const isTop = popoverPosition === 'top';

  return (
    <div
      className="relative group inline-block max-w-[calc(100vw-3rem)] xs:max-w-[280px] sm:max-w-[340px] md:max-w-[420px]"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Pod / Pill Button: strictly 1 line, no 2 lines, trailing dots with text-ellipsis */}
      <button
        type="button"
        onClick={() => onClick(prompt)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className={`w-full text-left px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF4F7A]/50 ${variantStyles[variant]} ${className}`}
        aria-label={`Prompt: ${prompt}`}
      >
        <span className="shrink-0 text-[#FF4F7A] text-[11px]">✨</span>
        <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis block min-w-0 flex-1">
          &ldquo;{prompt}&rdquo;
        </span>
      </button>

      {/* Floating Popover showing complete prompt text on hover / focus */}
      <div
        role="tooltip"
        aria-hidden={!isOpen}
        className={`absolute left-1/2 -translate-x-1/2 w-64 sm:w-80 max-w-[calc(100vw-2rem)] p-3.5 rounded-2xl bg-[#240612] text-white text-xs shadow-2xl border border-[#FF4F7A]/30 transition-all duration-200 z-50 pointer-events-none ${
          isTop
            ? 'bottom-full mb-2.5 origin-bottom'
            : 'top-full mt-2.5 origin-top'
        } ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-1 invisible pointer-events-none'
        }`}
      >
        <div className="flex items-start gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#FFC83D] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-white/95 whitespace-normal break-words font-medium">
            &ldquo;{prompt}&rdquo;
          </p>
        </div>

        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-[#FF8BA7]">
          <span>Click to plan this trip</span>
          <span className="inline-flex items-center gap-1 font-semibold text-white/80">
            <span>Use</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Popover Caret Arrow */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent ${
            isTop
              ? 'top-full border-t-[6px] border-t-[#240612]'
              : 'bottom-full border-b-[6px] border-b-[#240612]'
          }`}
        />
      </div>
    </div>
  );
}
