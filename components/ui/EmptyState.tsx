'use client';

import React from 'react';
import Button from './Button';
import { Compass } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-[24px] border border-dashed border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-white/50 dark:bg-[#280814]/40 max-w-lg mx-auto ${className}`}
    >
      {/* Icon with Sunset Glow Circle */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF4F7A]/15 to-[#FF7A3D]/20 flex items-center justify-center text-[#FF4F7A] mb-5 shadow-sm">
        {icon || <Compass className="w-8 h-8 stroke-[1.75]" />}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {actionLabel && (
        <Button variant="sunset" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
