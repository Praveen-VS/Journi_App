'use client';

import React, { useState } from 'react';
import MobileHeader from '@/components/navigation/MobileHeader';
import BudgetCard from '@/components/cards/BudgetCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import EmptyState from '@/components/ui/EmptyState';
import {
  MOCK_BUDGET_CATEGORIES,
  MOCK_EXPENSES,
} from '@/constants';
import { BudgetItem } from '@/types';
import {
  Wallet,
  Plus,
  Receipt,
} from 'lucide-react';

export default function BudgetPage() {
  const [categories, setCategories] = useState(MOCK_BUDGET_CATEGORIES);
  const [expenses, setExpenses] = useState<BudgetItem[]>(MOCK_EXPENSES);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showEmptySim, setShowEmptySim] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<'stay' | 'food' | 'activities' | 'transport'>('food');

  const totalAllocated = categories.reduce((acc, c) => acc + c.allocated, 0);
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const percentTotal = Math.round((totalSpent / totalAllocated) * 100);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const amountNum = parseFloat(newAmount);
    const newExp: BudgetItem = {
      id: `exp_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      amount: amountNum,
      date: new Date().toISOString().split('T')[0],
      paidBy: 'Elena',
    };

    setExpenses([newExp, ...expenses]);

    // Update category spent
    setCategories((prev) =>
      prev.map((cat) =>
        cat.category === newCategory
          ? { ...cat, spent: cat.spent + amountNum }
          : cat
      )
    );

    setNewTitle('');
    setNewAmount('');
    setIsAddOpen(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header */}
      <MobileHeader title="Budget Planner" showBack />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="sunset" size="sm">
              Kyoto Autumn Trip
            </Badge>
            <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
              INR (₹)
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
            Budget Planner
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Empty State Toggle */}
          <button
            type="button"
            onClick={() => setShowEmptySim(!showEmptySim)}
            className="text-xs px-3 py-1.5 rounded-full border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/5"
          >
            {showEmptySim ? 'Show Expenses' : 'Simulate Empty Budget'}
          </button>

          <Button
            variant="sunset"
            size="md"
            onClick={() => setIsAddOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-sunset"
          >
            Add Expense
          </Button>
        </div>
      </div>

      {!showEmptySim ? (
        <>
          {/* Total Budget Summary Card */}
          <div className="rounded-[28px] bg-gradient-to-tr from-[#5B0B24] via-[#C2185B] to-[#FF7A3D] text-white p-6 sm:p-8 shadow-hover mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFC83D]">
                  Total Trip Budget
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base sm:text-lg text-white/70">
                    / ₹{totalAllocated.toLocaleString('en-IN')} allocated
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-1">
                  ₹{(totalAllocated - totalSpent).toLocaleString('en-IN')} remaining for upcoming days
                </p>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#FFC83D]">
                  {percentTotal}%
                </span>
                <span className="text-xs text-white/80">Tracked So Far</span>
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-6">
              <div
                className="h-full bg-[#FFC83D] rounded-full transition-all duration-500"
                style={{ width: `${percentTotal}%` }}
              />
            </div>
          </div>

          {/* Category Breakdown Cards */}
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight mb-4">
              Category Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <BudgetCard key={cat.category} category={cat} />
              ))}
            </div>
          </section>

          {/* Recent Expense History */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
                Tracked Expenses ({expenses.length})
              </h2>
            </div>

            <div className="space-y-2.5">
              {expenses.map((item) => (
                <Card
                  key={item.id}
                  variant="elevated"
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[14px] bg-[#5B0B24]/6 dark:bg-[#FF8BA7]/10 flex items-center justify-center text-[#5B0B24] dark:text-[#FF8BA7]">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-extrabold text-sm sm:text-base text-[#5B0B24] dark:text-[#FF8BA7]">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          icon={<Wallet className="w-8 h-8 text-[#FF4F7A]" />}
          title="No expenses logged yet (Simulation)"
          description="Track accommodations, local ramen tastings, and museum tickets to keep your journey stress-free."
          actionLabel="Log Your First Expense"
          onAction={() => {
            setShowEmptySim(false);
            setIsAddOpen(true);
          }}
        />
      )}

      {/* Add Expense Bottom Sheet / Modal */}
      <BottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Trip Expense"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Input
            label="Expense Description"
            placeholder="e.g. Tenryu-ji entry ticket"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <Input
            label="Amount (INR ₹)"
            type="number"
            step="1"
            placeholder="1500"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5B0B24]/80 dark:text-[#FF8BA7] mb-2 block">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'stay', label: 'Accommodations' },
                { id: 'food', label: 'Dining & Cafes' },
                { id: 'activities', label: 'Activities' },
                { id: 'transport', label: 'Local Transit' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setNewCategory(
                      c.id as 'stay' | 'food' | 'activities' | 'transport'
                    )
                  }
                  className={`p-2.5 rounded-[14px] text-xs font-semibold border transition-all ${
                    newCategory === c.id
                      ? 'bg-[#5B0B24] text-white border-[#5B0B24]'
                      : 'bg-white/60 dark:bg-[#280814] text-[#5B0B24] dark:text-[#FF8BA7] border-[#5B0B24]/15'
                  }`}
                >
                  {c.label}
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
            Save Expense
          </Button>
        </form>
      </BottomSheet>
    </main>
  );
}
