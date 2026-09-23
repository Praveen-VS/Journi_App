'use client';

import React from 'react';
import Card from '../ui/Card';
import { BudgetCategorySummary } from '@/types';
import { Hotel, Utensils, Compass, Train, CircleDollarSign } from 'lucide-react';

export interface BudgetCardProps {
  category: BudgetCategorySummary;
  className?: string;
}

export default function BudgetCard({ category, className = '' }: BudgetCardProps) {
  const icons = {
    stay: <Hotel className="w-4 h-4" />,
    food: <Utensils className="w-4 h-4" />,
    activities: <Compass className="w-4 h-4" />,
    transport: <Train className="w-4 h-4" />,
    other: <CircleDollarSign className="w-4 h-4" />,
  };

  const percent =
    category.allocated > 0
      ? Math.min(100, Math.round((category.spent / category.allocated) * 100))
      : 0;

  const isOver = category.spent > category.allocated;

  return (
    <Card variant="elevated" className={`p-4 sm:p-5 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: category.color }}
          >
            {icons[category.category]}
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
              {category.label}
            </h4>
            <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
              {percent}% of budget spent
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
            ₹{category.spent.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
            of ₹{category.allocated.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div>
        <div className="w-full h-2 bg-[#5B0B24]/8 dark:bg-[#FF8BA7]/12 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              backgroundColor: isOver ? '#DC2626' : category.color,
            }}
          />
        </div>
        {isOver && (
          <p className="text-[10px] text-red-500 font-semibold mt-1">
            Over budget by ₹{(category.spent - category.allocated).toLocaleString('en-IN')}
          </p>
        )}
      </div>
    </Card>
  );
}
