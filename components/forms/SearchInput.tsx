'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search destinations, activities, or tags...',
  onClear,
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-4 w-4 h-4 text-[#5B0B24]/40 dark:text-[#FF8BA7]/50 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[44px] rounded-[18px] bg-white dark:bg-[#280814] pl-11 pr-10 py-2.5 text-sm text-[#2E0513] dark:text-[#FFF7FA] placeholder:text-[#5B0B24]/40 dark:placeholder:text-[#FF8BA7]/40 border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-coral/30 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3.5 w-6 h-6 rounded-full flex items-center justify-center text-[#5B0B24]/50 dark:text-[#FF8BA7]/60 hover:text-[#5B0B24] dark:hover:text-white"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
