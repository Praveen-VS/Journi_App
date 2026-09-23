'use client';

import React, { useState } from 'react';
import MobileHeader from '@/components/navigation/MobileHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import EmptyState from '@/components/ui/EmptyState';
import { MOCK_PACKING_ITEMS } from '@/constants';
import { PackingItem } from '@/types';
import { CheckSquare, Plus, Check } from 'lucide-react';

export default function PackingPage() {
  const [items, setItems] = useState<PackingItem[]>(MOCK_PACKING_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Essentials' | 'Clothing' | 'Toiletries' | 'Tech'>('Essentials');
  const [showEmptySim, setShowEmptySim] = useState(false);

  const categories = ['All', 'Essentials', 'Clothing', 'Toiletries', 'Tech'];

  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPacked: !item.isPacked } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: PackingItem = {
      id: `pack_${Date.now()}`,
      title: newItemTitle.trim(),
      category: newItemCategory,
      isPacked: false,
    };

    setItems([newItem, ...items]);
    setNewItemTitle('');
    setIsAddOpen(false);
  };

  const packedCount = items.filter((i) => i.isPacked).length;
  const progressPercent = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (showEmptySim) return false;
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header */}
      <MobileHeader title="Packing Checklist" showBack />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="sunset" size="sm">
              Climate-Adapted
            </Badge>
            <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
              Kyoto Autumn (18°C Mild)
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
            Smart Packing List
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Empty State Simulator */}
          <button
            type="button"
            onClick={() => setShowEmptySim(!showEmptySim)}
            className="text-xs px-3 py-1.5 rounded-full border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/5"
          >
            {showEmptySim ? 'Show Checklist' : 'Simulate Empty'}
          </button>

          <Button
            variant="sunset"
            size="md"
            onClick={() => setIsAddOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-sunset"
          >
            Add Item
          </Button>
        </div>
      </div>

      {!showEmptySim ? (
        <>
          {/* Progress Overview Card */}
          <div className="rounded-[28px] bg-gradient-to-tr from-[#5B0B24] via-[#C2185B] to-[#FF7A3D] text-white p-6 sm:p-8 shadow-hover mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFC83D]">
                Packing Readiness
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  {packedCount} / {items.length}
                </span>
                <span className="text-sm sm:text-base text-white/80">
                  items packed ({progressPercent}%)
                </span>
              </div>
              <p className="text-xs text-white/80 mt-1">
                {items.length - packedCount === 0
                  ? 'All packed and ready for departure!'
                  : `${items.length - packedCount} items remaining before you leave.`}
              </p>
            </div>

            {/* Circular Ring or Pill Gauge */}
            <div className="w-full sm:w-64">
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFC83D] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5 max-w-3xl">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                variant="elevated"
                isInteractive
                onClick={() => handleToggleItem(item.id)}
                className={`p-4 flex items-center justify-between transition-all ${
                  item.isPacked
                    ? 'opacity-70 bg-[#FFF7FA] dark:bg-[#1f060f]'
                    : 'bg-white dark:bg-[#280814]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Custom Styled Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-[8px] flex items-center justify-center border transition-all ${
                      item.isPacked
                        ? 'bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] border-transparent text-white'
                        : 'border-[#5B0B24]/20 dark:border-[#FF8BA7]/30 bg-transparent'
                    }`}
                  >
                    {item.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <span
                      className={`text-sm font-semibold transition-all ${
                        item.isPacked
                          ? 'line-through text-[#5B0B24]/50 dark:text-[#FF8BA7]/50'
                          : 'text-[#5B0B24] dark:text-[#FFF7FA]'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 block">
                      {item.category}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={item.isPacked ? 'neutral' : 'pink'}
                  size="sm"
                >
                  {item.isPacked ? 'Packed' : 'To Pack'}
                </Badge>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8 text-[#FF4F7A]" />}
          title="Packing list empty (Simulation)"
          description="Journi automatically suggests packing items based on Kyoto's forecast, or you can add custom items."
          actionLabel="Add Custom Item"
          onAction={() => {
            setShowEmptySim(false);
            setIsAddOpen(true);
          }}
        />
      )}

      {/* Add Item Bottom Sheet */}
      <BottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Packing Item"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g. Travel adapter or warm sweater"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5B0B24]/80 dark:text-[#FF8BA7] mb-2 block">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Essentials', 'Clothing', 'Toiletries', 'Tech'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setNewItemCategory(
                      cat as 'Essentials' | 'Clothing' | 'Toiletries' | 'Tech'
                    )
                  }
                  className={`p-2.5 rounded-[14px] text-xs font-semibold border transition-all ${
                    newItemCategory === cat
                      ? 'bg-[#5B0B24] text-white border-[#5B0B24]'
                      : 'bg-white/60 dark:bg-[#280814] text-[#5B0B24] dark:text-[#FF8BA7] border-[#5B0B24]/15'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="sunset"
            size="lg"
            className="w-full font-bold shadow-sunset mt-4"
          >
            Add to Packing List
          </Button>
        </form>
      </BottomSheet>
    </main>
  );
}
