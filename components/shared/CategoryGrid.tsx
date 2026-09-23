'use client';

import React from 'react';
import { Mountain, Palmtree, Building2, Trees } from 'lucide-react';

export interface CategoryGridProps {
  selectedCategory?: string | null;
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export const JOURNI_CATEGORIES = [
  {
    id: 'Mountains',
    name: 'Mountains',
    tagline: 'Find your peace',
    bgColor: 'bg-[#FFE5EC]',
    textColor: 'text-[#C2185B]',
    iconColor: 'text-[#E61E50]',
    borderHover: 'hover:border-[#E61E50]',
    icon: Mountain,
  },
  {
    id: 'Beaches',
    name: 'Beaches',
    tagline: 'Feel the breeze',
    bgColor: 'bg-[#FFF2E2]',
    textColor: 'text-[#C75A18]',
    iconColor: 'text-[#FF7A3D]',
    borderHover: 'hover:border-[#FF7A3D]',
    icon: Palmtree,
  },
  {
    id: 'Cities',
    name: 'Cities',
    tagline: 'Live the culture',
    bgColor: 'bg-[#F3E8FF]',
    textColor: 'text-[#7C3AED]',
    iconColor: 'text-[#9333EA]',
    borderHover: 'hover:border-[#9333EA]',
    icon: Building2,
  },
  {
    id: 'Nature',
    name: 'Nature',
    tagline: 'Reconnect',
    bgColor: 'bg-[#E6F4EA]',
    textColor: 'text-[#1E7E34]',
    iconColor: 'text-[#16A34A]',
    borderHover: 'hover:border-[#16A34A]',
    icon: Trees,
  },
];

export default function CategoryGrid({
  selectedCategory,
  onSelectCategory,
  className = '',
}: CategoryGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {JOURNI_CATEGORIES.map((cat) => {
        const IconComponent = cat.icon;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory?.(cat.id)}
            className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer text-center border-2 ${
              isSelected
                ? 'border-[#E61E50] ring-2 ring-[#E61E50]/20 scale-[1.02] shadow-md bg-white dark:bg-[#280814]'
                : `border-transparent bg-white/80 dark:bg-[#1E0610]/80 shadow-sm hover:shadow-md ${cat.borderHover} hover:scale-[1.02]`
            }`}
          >
            {/* Pastel Icon Box (Identical to M02 mockup) */}
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-[20px] ${cat.bgColor} flex items-center justify-center mb-2.5 shadow-inner transition-transform group-hover:scale-105`}
            >
              <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${cat.iconColor}`} />
            </div>

            {/* Category Name */}
            <span className="text-xs sm:text-sm font-extrabold text-[#3E0717] dark:text-[#FFF7FA] tracking-tight">
              {cat.name}
            </span>

            {/* Tagline */}
            <span className="text-[10px] sm:text-xs text-[#704250] dark:text-[#FFB3C6] font-medium mt-0.5">
              {cat.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}
