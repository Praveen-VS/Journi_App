'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  count?: number;
  className?: string;
}

export default function Chip({
  label,
  selected = false,
  onClick,
  icon,
  count,
  className = '',
}: ChipProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral ${
        selected
          ? 'bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] text-white shadow-sunset font-semibold'
          : 'bg-white dark:bg-[#280814] text-[#5B0B24] dark:text-[#FF8BA7] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 hover:border-[#FF4F7A]/40'
      } ${className}`}
    >
      {icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>}
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
            selected ? 'bg-white/20 text-white' : 'bg-[#5B0B24]/10 text-[#5B0B24] dark:text-[#FF8BA7]'
          }`}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}
