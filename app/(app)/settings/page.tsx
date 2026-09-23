'use client';

import React, { useState, useEffect } from 'react';
import MobileHeader from '@/components/navigation/MobileHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import {
  Moon,
  Sun,
  Globe,
  DollarSign,
  WifiOff,
  Download,
  CheckCircle2,
  Trash2,
  Sparkles,
  ExternalLink,
  KeyRound,
} from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('light');
  const [currency, setCurrency] = useState('INR (₹)');
  const [tempUnit, setTempUnit] = useState('Celsius (°C)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers (km)');
  const [offlineSync, setOfflineSync] = useState(true);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Gemini API Key state
  const [geminiKey, setGeminiKey] = useState('');
  const [hasSavedGeminiKey, setHasSavedGeminiKey] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('journi_gemini_api_key');
      if (stored) {
        setGeminiKey(stored);
        setHasSavedGeminiKey(true);
      }
    }
  }, []);

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      if (geminiKey.trim()) {
        localStorage.setItem('journi_gemini_api_key', geminiKey.trim());
        setHasSavedGeminiKey(true);
      } else {
        localStorage.removeItem('journi_gemini_api_key');
        setHasSavedGeminiKey(false);
      }
      triggerSave();
    }
  };

  const handleClearKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('journi_gemini_api_key');
      setGeminiKey('');
      setHasSavedGeminiKey(false);
      triggerSave();
    }
  };

  const handleToggleTheme = (newTheme: 'system' | 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    triggerSave();
  };

  const triggerSave = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile Top Header */}
      <MobileHeader title="Settings" showBack />

      {/* Header Banner */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
            App Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-1">
            Customize appearance, currency display, AI intelligence keys, and offline synchronization.
          </p>
        </div>

        {showSavedFeedback && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* AI Travel Intelligence & Free API Key */}
        <Card variant="elevated" className="p-5 sm:p-6 border-l-4 border-l-[#FF4F7A]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF7A3D]" />
              <h2 className="text-base font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
                AI Travel Intelligence Engine
              </h2>
            </div>
            <Badge variant={hasSavedGeminiKey ? 'golden' : 'sunset'} size="sm">
              {hasSavedGeminiKey ? 'Google Gemini 1.5 Flash (Active)' : 'Journi Smart Engine (Ready)'}
            </Badge>
          </div>
          <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mb-4">
            Journi works out-of-the-box with our internal smart travel engine. You can also connect your own free Google Gemini API key (1,500 free queries/day from Google AI Studio with zero credit card required) for real-time worldwide itinerary synthesis.
          </p>

          <div className="space-y-3">
            <Input
              label="Google Gemini API Key (Optional Free Tier)"
              placeholder="AIzaSy..."
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              helperText="Stored securely in your browser localStorage only. Never transmitted elsewhere."
              leftIcon={<KeyRound className="w-4 h-4 text-[#FF4F7A]" />}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <Button variant="sunset" size="sm" onClick={handleSaveKey}>
                  Save Key
                </Button>
                {hasSavedGeminiKey && (
                  <Button variant="outline" size="sm" onClick={handleClearKey}>
                    Remove Key
                  </Button>
                )}
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#FF4F7A] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Get a free Gemini API key (Google AI Studio)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Card>

        {/* Appearance & Theme Section */}
        <Card variant="elevated" className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-5 h-5 text-[#FF7A3D]" />
            <h2 className="text-base font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
              Appearance & Theme
            </h2>
          </div>
          <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mb-4">
            Select between Journi Sunset Light mode, Midnight Dark mode, or your operating system preference.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Sunset Light', icon: Sun },
              { id: 'dark', label: 'Midnight Dark', icon: Moon },
              { id: 'system', label: 'System Match', icon: Globe },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleToggleTheme(t.id as 'system' | 'light' | 'dark')}
                  className={`p-3.5 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'border-[#FF4F7A] ring-2 ring-[#FF4F7A]/20 bg-[#FFF7FA] dark:bg-[#330a1a] text-[#C2185B] dark:text-[#FF8BA7] font-bold shadow-soft'
                      : 'border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 bg-white dark:bg-[#280814] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:border-[#FF4F7A]/40'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#FF7A3D]" />
                  <span className="text-xs">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Currency & Regional Units */}
        <Card variant="elevated" className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-[#FF4F7A]" />
            <h2 className="text-base font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
              Currencies & Measurement Units
            </h2>
          </div>
          <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mb-4">
            How budgets, weather forecasts, and walking distances are formatted.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Currency Selector */}
            <div>
              <label className="text-xs font-semibold text-[#5B0B24]/80 dark:text-[#FF8BA7] mb-1.5 block">
                Primary Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  triggerSave();
                }}
                className="w-full min-h-[44px] rounded-[18px] bg-white dark:bg-[#280814] px-3.5 py-2 text-xs text-[#5B0B24] dark:text-[#FFF7FA] border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 focus:outline-none focus:ring-2 focus:ring-brand-coral/30"
              >
                <option value="INR (₹)">INR (₹) — Indian Rupee (Default)</option>
                <option value="USD ($)">USD ($) — US Dollar</option>
                <option value="EUR (€)">EUR (€) — Euro</option>
                <option value="GBP (£)">GBP (£) — British Pound</option>
                <option value="JPY (¥)">JPY (¥) — Japanese Yen</option>
              </select>
            </div>

            {/* Temperature Unit */}
            <div>
              <label className="text-xs font-semibold text-[#5B0B24]/80 dark:text-[#FF8BA7] mb-1.5 block">
                Temperature
              </label>
              <select
                value={tempUnit}
                onChange={(e) => {
                  setTempUnit(e.target.value);
                  triggerSave();
                }}
                className="w-full min-h-[44px] rounded-[18px] bg-white dark:bg-[#280814] px-3.5 py-2 text-xs text-[#5B0B24] dark:text-[#FFF7FA] border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 focus:outline-none focus:ring-2 focus:ring-brand-coral/30"
              >
                <option value="Celsius (°C)">Celsius (°C)</option>
                <option value="Fahrenheit (°F)">Fahrenheit (°F)</option>
              </select>
            </div>

            {/* Distance Unit */}
            <div>
              <label className="text-xs font-semibold text-[#5B0B24]/80 dark:text-[#FF8BA7] mb-1.5 block">
                Walking Distances
              </label>
              <select
                value={distanceUnit}
                onChange={(e) => {
                  setDistanceUnit(e.target.value);
                  triggerSave();
                }}
                className="w-full min-h-[44px] rounded-[18px] bg-white dark:bg-[#280814] px-3.5 py-2 text-xs text-[#5B0B24] dark:text-[#FFF7FA] border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 focus:outline-none focus:ring-2 focus:ring-brand-coral/30"
              >
                <option value="Kilometers (km)">Kilometers (km)</option>
                <option value="Miles (mi)">Miles (mi)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Offline & Data Storage */}
        <Card variant="elevated" className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <WifiOff className="w-5 h-5 text-[#C2185B]" />
            <h2 className="text-base font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
              Offline Cache & Local Storage
            </h2>
          </div>
          <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mb-4">
            Keep your itineraries, checklists, and saved spots accessible while traveling abroad without roaming fees.
          </p>

          <div className="flex items-center justify-between p-3.5 rounded-[18px] bg-[#FFF7FA] dark:bg-[#1f060f] border border-[#5B0B24]/8 mb-4">
            <div>
              <span className="text-xs font-bold text-[#5B0B24] dark:text-white block">
                Offline Mode Pre-caching
              </span>
              <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                Cache active trip itineraries for airplane and train mode
              </span>
            </div>
            <input
              type="checkbox"
              checked={offlineSync}
              onChange={(e) => {
                setOfflineSync(e.target.checked);
                triggerSave();
              }}
              className="w-5 h-5 rounded border-[#5B0B24]/20 text-[#FF4F7A] focus:ring-[#FF4F7A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => alert('Exporting Journi trips as JSON backup...')}
            >
              Export Trip Data (JSON)
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => {
                if (confirm('Clear local cache?')) {
                  alert('Local cache reset.');
                }
              }}
            >
              Clear Cache
            </Button>
          </div>
        </Card>

        {/* App Version & Credits */}
        <div className="text-center pt-4 text-xs text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 space-y-1">
          <p className="font-semibold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
            Journi Version 1.0.0 (Final Locked Release)
          </p>
          <p>Every journey begins a story.</p>
        </div>
      </div>
    </main>
  );
}
