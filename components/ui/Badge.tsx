import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sunset' | 'burgundy' | 'pink' | 'orange' | 'golden' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'pink',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantStyles = {
    sunset: 'bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] text-white shadow-sm',
    burgundy: 'bg-[#5B0B24] text-white',
    pink: 'bg-[#FF4F7A]/12 text-[#C2185B] dark:text-[#FF8BA7] border border-[#FF4F7A]/20',
    orange: 'bg-[#FF7A3D]/12 text-[#D35400] dark:text-[#FDBA74] border border-[#FF7A3D]/20',
    golden: 'bg-[#FFC83D]/18 text-[#996500] dark:text-[#FDE047] border border-[#FFC83D]/30',
    neutral: 'bg-[#5B0B24]/6 dark:bg-[#FF8BA7]/10 text-[#5B0B24] dark:text-[#FF8BA7]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full uppercase tracking-wider select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
