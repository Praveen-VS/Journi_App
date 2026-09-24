'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import JourniLogo from '../shared/JourniLogo';
import { ChevronLeft, Settings } from 'lucide-react';

export interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
}

export default function MobileHeader({
  title,
  showBack = false,
  onBack,
  showLogo = true,
  rightAction,
}: MobileHeaderProps) {
  const router = useRouter();

  return (
    <header className="md:hidden sticky top-0 z-30 w-full bg-white/90 dark:bg-[#280814]/90 backdrop-blur-md border-b border-[#5B0B24]/8 dark:border-[#FF8BA7]/15 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            type="button"
            onClick={() => (onBack ? onBack() : router.back())}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#5B0B24] dark:text-[#FF8BA7] active:bg-[#5B0B24]/5"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>
        ) : null}

        {showLogo && !title && <JourniLogo size="sm" />}

        {title && (
          <h1 className="text-base font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight truncate max-w-[220px]">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-1">
        {rightAction ? (
          rightAction
        ) : (
          <Link
            href="/settings"
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 active:bg-[#5B0B24]/5"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 stroke-[1.75]" />
          </Link>
        )}
      </div>
    </header>
  );
}
