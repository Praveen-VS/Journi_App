'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface PromptCardProps {
  prompt: string;
  onSelect?: (prompt: string) => void;
  className?: string;
}

export default function PromptCard({ prompt, onSelect, className = '' }: PromptCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect?.(prompt)}
      className={`group w-full text-left p-3.5 sm:p-4 rounded-[20px] bg-white dark:bg-[#280814] border border-[#5B0B24]/8 dark:border-[#FF8BA7]/15 shadow-soft hover:shadow-hover hover:border-[#FF4F7A]/30 transition-all flex items-center justify-between gap-3 select-none ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4F7A]/15 to-[#FF7A3D]/20 flex items-center justify-center text-[#FF4F7A] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
          <Sparkles className="w-4 h-4 text-[#FF7A3D]" />
        </div>
        <p className="text-xs sm:text-sm font-medium text-[#5B0B24] dark:text-[#FF8BA7] leading-snug line-clamp-2">
          &ldquo;{prompt}&rdquo;
        </p>
      </div>

      <span className="w-7 h-7 rounded-full bg-[#5B0B24]/5 dark:bg-[#FF8BA7]/10 flex items-center justify-center text-[#5B0B24] dark:text-[#FF8BA7] group-hover:bg-[#FF4F7A] group-hover:text-white transition-all flex-shrink-0">
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </motion.button>
  );
}
