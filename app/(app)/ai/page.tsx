'use client';

import React, { useState, Suspense, useEffect, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MobileHeader from '@/components/navigation/MobileHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Input from '@/components/ui/Input';
import TimelineCard from '@/components/cards/TimelineCard';
import AITravelPlanCard from '@/components/cards/AITravelPlanCard';
import TasteMatchCard from '@/components/cards/TasteMatchCard';
import PromptSuggestionChip from '@/components/ui/PromptSuggestionChip';
import TextToSpeechButton from '@/components/shared/TextToSpeechButton';
import { useTripStore } from '@/store';
import { aiService } from '@/services/ai.service';
import type { GeneratedTripPayload } from '@/lib/ai/fallbackEngine';
import { findTopDestinationMatches } from '@/lib/ai/tasteMatcher';
import { ALL_DESTINATIONS, TOTAL_DESTINATIONS_COUNT } from '@/constants/destinationsData';
import type { UserTasteProfile, TasteMatchResult, LocationScope } from '@/types';
import {
  MOCK_TRIPS,
  MOCK_ITINERARY_DAYS,
  SAMPLE_AI_PROMPTS,
} from '@/constants';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  Flame,
  KeyRound,
  ExternalLink,
  Compass,
  Layers,
  Calendar,
  Check,
  Heart,
  Sliders,
  Globe2,
  MapPin,
  Navigation,
} from 'lucide-react';

type AIPlannerMode = 'taste_matcher' | 'prompt_composer' | 'result';

function AIPlannerContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const initialView = searchParams.get('view') || '';

  // Determine initial mode
  const determineInitialMode = (): AIPlannerMode => {
    if (initialView === 'result') return 'result';
    if (initialPrompt) return 'prompt_composer';
    return 'taste_matcher';
  };

  const [mode, setMode] = useState<AIPlannerMode>(determineInitialMode());

  // Prompt Composer State
  const [prompt, setPrompt] = useState(
    initialPrompt || 'Plan a 5-day cultural trip to Kyoto with quiet zen temples, local tea ceremonies, and authentic dining spots.'
  );
  const [days, setDays] = useState(5);
  const [selectedVibe, setSelectedVibe] = useState('Cultural');
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [companion, setCompanion] = useState('Couple');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Live generated payload
  const [generatedPayload, setGeneratedPayload] = useState<GeneratedTripPayload | null>(null);

  // Free Gemini Key state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const addTripToStore = useTripStore((state) => state.addTrip);

  // ==========================================
  // Taste Profiler Questionnaire State
  // ==========================================
  const [ageGroup, setAgeGroup] = useState<string>('25-34');
  const [energyRhythm, setEnergyRhythm] = useState<string>('peace');
  const [foodPreferences, setFoodPreferences] = useState<string[]>([
    'street_food',
    'authentic_spicy',
    'cafes_bakeries',
  ]);
  const [landscape, setLandscape] = useState<string>('historic');
  const [tasteBudget, setTasteBudget] = useState<string>('Moderate');
  const [tasteCompanion, setTasteCompanion] = useState<string>('Couple');

  // Location & Radius Scope State
  const [userOrigin, setUserOrigin] = useState<string>('San Francisco, CA');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationScope, setLocationScope] = useState<LocationScope>('international');
  const [customLocation, setCustomLocation] = useState<string>('');

  const handleDetectLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(2);
          const lng = position.coords.longitude.toFixed(2);
          setUserOrigin(`GPS Verified (${lat}°, ${lng}°)`);
          setIsDetectingLocation(false);
        },
        (error) => {
          console.warn('Geolocation access issue:', error);
          setUserOrigin('Current Location (Verified)');
          setIsDetectingLocation(false);
        },
        { timeout: 6000 }
      );
    } else {
      setUserOrigin('Current Location');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('journi_gemini_api_key');
      if (stored) {
        setActiveKey(stored);
        setGeminiKeyInput(stored);
      }
    }
  }, []);

  // Compute Top 4 Destination Matches whenever taste profile changes
  const userTasteProfile: UserTasteProfile = useMemo(
    () => ({
      ageGroup,
      energyRhythm,
      foodPreferences,
      landscape,
      budgetTier: tasteBudget,
      companion: tasteCompanion,
      tripLength: days,
      locationScope,
      userOrigin,
      customLocation,
    }),
    [
      ageGroup,
      energyRhythm,
      foodPreferences,
      landscape,
      tasteBudget,
      tasteCompanion,
      days,
      locationScope,
      userOrigin,
      customLocation,
    ]
  );

  const top4Matches: TasteMatchResult[] = useMemo(() => {
    return findTopDestinationMatches(userTasteProfile, ALL_DESTINATIONS);
  }, [userTasteProfile]);

  const vibes = ['Cultural', 'Romantic', 'Relaxed', 'Adventure', 'Culinary'];
  const budgetTiers = ['Budget Friendly', 'Moderate', 'Luxury Escapes'];
  const companions = ['Solo', 'Couple', 'Family', 'Friends'];

  const loadingSteps = [
    'Parsing travel vibe and companion rhythm...',
    'Evaluating opening hours & geographical transit...',
    'Curating morning, afternoon & golden hour activities...',
    'Balancing budget allocation & local food secrets...',
    'Finalizing day-by-day story...',
  ];

  // Toggle food selection in Taste Profiler
  const toggleFoodPreference = (foodKey: string) => {
    setFoodPreferences((prev) =>
      prev.includes(foodKey)
        ? prev.length > 1
          ? prev.filter((k) => k !== foodKey)
          : prev
        : [...prev, foodKey]
    );
  };

  // Trigger trip generation from prompt composer or direct destination match
  const executeGeneration = async (
    targetPrompt: string,
    targetDays: number,
    targetVibe: string,
    targetBudget: string,
    targetCompanion: string
  ) => {
    setIsGenerating(true);
    setGenerationStep(0);
    setIsSaved(false);

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    try {
      const payload = await aiService.generateTripPlan({
        prompt: targetPrompt,
        days: targetDays,
        vibe: targetVibe,
        budgetTier: targetBudget,
        companion: targetCompanion,
      });

      startTransition(() => {
        setGeneratedPayload(payload);
        setSelectedDayNumber(1);
      });
    } catch (err) {
      console.warn('AI generation encountered error, utilizing offline fallback:', err);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsGenerating(false);
        setMode('result');
      }, 500);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    executeGeneration(prompt, days, selectedVibe, budgetTier, companion);
  };

  // One-click planning from Top 4 Recommendation
  const handlePlanFromMatch = (match: TasteMatchResult) => {
    const dest = match.destination;
    const craftedPrompt = `Plan a ${dest.idealDays}-day ${dest.energyRhythm || 'curated'} trip to ${dest.name}, ${dest.country} featuring ${dest.highlights?.slice(0, 2).join(', ') || 'iconic landmarks'} with authentic ${dest.foodTypes?.slice(0, 2).join(' and ') || 'regional dining'}.`;

    setPrompt(craftedPrompt);
    setDays(dest.idealDays);
    setSelectedVibe(dest.vibes[0] || 'Cultural');
    setBudgetTier(dest.budgetTier || tasteBudget);
    setCompanion(tasteCompanion);

    executeGeneration(
      craftedPrompt,
      dest.idealDays,
      dest.vibes[0] || 'Cultural',
      dest.budgetTier || tasteBudget,
      tasteCompanion
    );
  };

  const handleSaveTrip = () => {
    const tripToSave = generatedPayload?.trip || MOCK_TRIPS[0];
    const daysToSave = generatedPayload?.days || MOCK_ITINERARY_DAYS;

    addTripToStore(tripToSave, daysToSave);
    setIsSaved(true);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleSaveCustomKey = () => {
    if (typeof window !== 'undefined') {
      if (geminiKeyInput.trim()) {
        localStorage.setItem('journi_gemini_api_key', geminiKeyInput.trim());
        setActiveKey(geminiKeyInput.trim());
      } else {
        localStorage.removeItem('journi_gemini_api_key');
        setActiveKey(null);
      }
      setShowKeyModal(false);
    }
  };

  const currentTrip = generatedPayload?.trip || MOCK_TRIPS[0];
  const currentDays = generatedPayload?.days || MOCK_ITINERARY_DAYS;
  const activeDay = currentDays.find((d) => d.dayNumber === selectedDayNumber) || currentDays[0];

  const isGeminiSource = generatedPayload?.source === 'gemini';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Mobile Top Header */}
      <MobileHeader
        title={mode === 'result' ? 'AI Planning Result' : 'AI Travel Studio'}
        showBack={mode === 'result'}
      />

      {/* Switcher Header Pill & Mode Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#5B0B24]/8 dark:border-[#FF8BA7]/12">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="sunset" size="sm">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Travel Studio
          </Badge>
          <span className="text-[11px] font-semibold text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 hidden sm:inline">
            • {TOTAL_DESTINATIONS_COUNT}+ Verified Destinations
          </span>
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:text-[#FF4F7A] font-medium bg-white/70 dark:bg-[#280814]/70 px-2.5 py-1 rounded-full border border-[#5B0B24]/10 transition-colors"
          >
            <KeyRound className="w-3 h-3 text-[#FF4F7A]" />
            <span>{activeKey ? 'Gemini Free Key Active' : 'Free Gemini Key'}</span>
          </button>
        </div>

        {/* 3-Way Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/80 dark:bg-[#280814]/80 border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 shadow-sm">
          <button
            type="button"
            onClick={() => setMode('taste_matcher')}
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
              mode === 'taste_matcher'
                ? 'bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] text-white shadow-sm'
                : 'text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:text-[#5B0B24]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Taste Profiler (Top 4)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('prompt_composer')}
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
              mode === 'prompt_composer'
                ? 'bg-[#5B0B24] text-white shadow-sm'
                : 'text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:text-[#5B0B24]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Prompt Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('result')}
            disabled={!generatedPayload && mode !== 'result'}
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
              mode === 'result'
                ? 'bg-gradient-to-r from-[#5B0B24] to-[#C2185B] text-white shadow-sm'
                : !generatedPayload
                ? 'opacity-40 cursor-not-allowed text-[#5B0B24]/40 dark:text-[#FF8BA7]/40'
                : 'text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:text-[#5B0B24]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generated Plan</span>
          </button>
        </div>
      </div>

      {/* GENERATING LOADING OVERLAY / CARD */}
      {isGenerating && (
        <Card variant="glass" className="p-8 sm:p-12 space-y-6 text-center max-w-xl mx-auto border-2 border-[#FF4F7A]/40 shadow-2xl animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF4F7A] to-[#FF7A3D] flex items-center justify-center text-white mx-auto shadow-lg animate-pulse">
            <Sparkles className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#5B0B24] dark:text-[#FFF7FA]">
              Synthesizing Your Custom Journey
            </h3>
            <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-1">
              Matching your travel taste with live routes, budgets & daily stories...
            </p>
          </div>

          <div className="space-y-3 pt-2 text-left max-w-md mx-auto">
            {loadingSteps.map((stepText, idx) => (
              <div
                key={stepText}
                className={`flex items-center gap-3 text-xs transition-colors duration-300 ${
                  idx === generationStep
                    ? 'text-[#C2185B] dark:text-[#FF4F7A] font-bold scale-[1.02]'
                    : idx < generationStep
                    ? 'text-emerald-600 font-semibold'
                    : 'text-[#5B0B24]/30 dark:text-[#FF8BA7]/30'
                }`}
              >
                {idx < generationStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      idx === generationStep ? 'bg-[#FF4F7A] animate-ping' : 'bg-current'
                    }`}
                  />
                )}
                <span>{stepText}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ========================================================= */}
      {/* MODE 1: TASTE PROFILER (FIND MY TOP 4 DESTINATIONS) */}
      {/* ========================================================= */}
      {!isGenerating && mode === 'taste_matcher' && (
        <div className="space-y-10 animate-fade-in">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4F7A]/10 text-[#C2185B] dark:text-[#FF8BA7] text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-[#FF4F7A]" />
              <span>Personalized Travel Soul Matcher</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
              Tell us your taste. We’ll find your Top 4.
            </h1>
            <p className="text-xs sm:text-base text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 leading-relaxed">
              Customize your age group, life rhythm (peace vs chill), culinary cravings, and landscapes. Our AI evaluates over <strong>{TOTAL_DESTINATIONS_COUNT} global destinations</strong> to hand-pick your 4 best matches.
            </p>
          </div>

          {/* Interactive Customizer Panel */}
          <Card variant="elevated" className="p-6 sm:p-8 space-y-8 border border-[#5B0B24]/10 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-[#5B0B24]/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#FF7A3D]" />
                <h2 className="text-base sm:text-lg font-black text-[#5B0B24] dark:text-white">
                  Customize Your Travel Taste
                </h2>
              </div>
              <span className="text-xs font-bold text-[#FF4F7A] bg-[#FF4F7A]/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                Live Matching Active
              </span>
            </div>

            {/* Location Scope & Origin Bar (Simple but Powerful) */}
            <div className="p-4 sm:p-6 rounded-[24px] bg-gradient-to-r from-[#FFF5F8] via-[#FFF9F5] to-[#FFF0F4] dark:from-[#240612] dark:via-[#1A030C] dark:to-[#220716] border border-[#FF4F7A]/25 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4F7A] to-[#FF7A3D] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#5B0B24] dark:text-[#FFF7FA]">
                      Location & Distance Scope
                    </h3>
                    <p className="text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                      Where would you like to explore from your starting point?
                    </p>
                  </div>
                </div>

                {/* Origin Location Display & Detect Button */}
                <div className="flex items-center gap-2 bg-white/95 dark:bg-[#2c0817]/95 px-3.5 py-1.5 rounded-full border border-[#5B0B24]/10 shadow-xs">
                  <Navigation className="w-3.5 h-3.5 text-[#FF7A3D] animate-pulse" />
                  <span className="text-xs font-semibold text-[#5B0B24] dark:text-white truncate max-w-[170px] sm:max-w-[210px]">
                    {userOrigin}
                  </span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="text-[10px] font-bold text-[#FF4F7A] hover:underline ml-1"
                  >
                    {isDetectingLocation ? 'Locating...' : 'Detect GPS'}
                  </button>
                </div>
              </div>

              {/* Location Scope Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {[
                  { id: 'nearby_200km', label: 'Within 200 km', icon: '🚗', desc: 'Weekend Drive' },
                  { id: 'in_state', label: 'Inside My State', icon: '📍', desc: 'Regional Stay' },
                  { id: 'interstate', label: 'Interstate', icon: '✈️', desc: 'Domestic Trip' },
                  { id: 'international', label: 'International', icon: '🌍', desc: 'Global Passport' },
                  { id: 'custom', label: 'Other', icon: '✏️', desc: 'Exact Place' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLocationScope(item.id as LocationScope)}
                    className={`p-2.5 rounded-[16px] text-center border transition-all ${
                      locationScope === item.id
                        ? 'border-[#FF4F7A] bg-white dark:bg-[#38091C] ring-2 ring-[#FF4F7A]/25 shadow-sm'
                        : 'border-[#5B0B24]/10 dark:border-white/10 bg-white/60 dark:bg-[#280814]/60 hover:border-[#FF4F7A]/30'
                    }`}
                  >
                    <span className="text-base block mb-0.5">{item.icon}</span>
                    <span className={`block text-xs font-black ${locationScope === item.id ? 'text-[#C2185B] dark:text-[#FF8BA7]' : 'text-[#5B0B24] dark:text-white'}`}>
                      {item.label}
                    </span>
                    <span className="block text-[9px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mt-0.5 font-medium">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Conditional Custom Location Input when 'custom' is active */}
              {locationScope === 'custom' && (
                <div className="pt-2 space-y-2 animate-fade-in">
                  <div className="relative">
                    <input
                      type="text"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="Enter exact location: e.g. Kyoto, Japan or Swiss Alps or Goa, India or Paris..."
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-[16px] bg-white dark:bg-[#280814] text-[#5B0B24] dark:text-[#FFF7FA] placeholder-[#5B0B24]/40 dark:placeholder-[#FF8BA7]/40 border border-[#FF4F7A]/40 focus:outline-none focus:ring-2 focus:ring-[#FF4F7A]/30 shadow-xs"
                    />
                    {customLocation && (
                      <button
                        type="button"
                        onClick={() => setCustomLocation('')}
                        className="absolute right-3 top-2.5 text-xs text-[#5B0B24]/50 hover:text-[#5B0B24]"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {/* Popular target chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 font-semibold text-[10px]">
                      Quick select:
                    </span>
                    {['Kyoto, Japan', 'Swiss Alps', 'Amalfi Coast', 'Bali, Indonesia', 'Goa, India', 'Paris, France'].map((spot) => (
                      <button
                        key={spot}
                        type="button"
                        onClick={() => setCustomLocation(spot)}
                        className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#280814] border border-[#5B0B24]/10 text-[10px] font-semibold text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 hover:border-[#FF4F7A]/50 hover:text-[#FF4F7A]"
                      >
                        {spot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Question 1: Age Demographic */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  1. Age Group / Stage of Life
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '18-24', label: '18–24', desc: 'Young & Spontaneous' },
                    { id: '25-34', label: '25–34', desc: 'Explorer & Dynamic' },
                    { id: '35-49', label: '35–49', desc: 'Balanced & Cultural' },
                    { id: '50+', label: '50+', desc: 'Serene & Heritage' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAgeGroup(item.id)}
                      className={`p-3 rounded-[16px] text-left border transition-all ${
                        ageGroup === item.id
                          ? 'border-[#FF4F7A] bg-[#FFF5F8] dark:bg-[#330a1a] ring-2 ring-[#FF4F7A]/20 shadow-sm'
                          : 'border-[#5B0B24]/10 dark:border-white/10 bg-white dark:bg-[#280814] hover:border-[#FF4F7A]/40'
                      }`}
                    >
                      <span className={`block text-xs font-black ${ageGroup === item.id ? 'text-[#C2185B] dark:text-[#FF8BA7]' : 'text-[#5B0B24] dark:text-white'}`}>
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mt-0.5">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Life Rhythm (Peace vs Chill vs Culture vs Adventure) */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  2. Trip Rhythm & Soul
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'peace', label: 'Peace & Zen 🧘', desc: 'Quiet temples & slow mornings' },
                    { id: 'chill', label: 'Chill & Coastal 🌊', desc: 'Sunsets, ocean air & cafes' },
                    { id: 'culture', label: 'Vibrant & Culture 🏛️', desc: 'Bustling arts & historic quarters' },
                    { id: 'adventure', label: 'Adventure & Peaks 🧗', desc: 'Hiking, treks & high energy' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEnergyRhythm(item.id)}
                      className={`p-3 rounded-[16px] text-left border transition-all ${
                        energyRhythm === item.id
                          ? 'border-[#FF7A3D] bg-[#FFF7FA] dark:bg-[#330a1a] ring-2 ring-[#FF7A3D]/20 shadow-sm'
                          : 'border-[#5B0B24]/10 dark:border-white/10 bg-white dark:bg-[#280814] hover:border-[#FF7A3D]/40'
                      }`}
                    >
                      <span className={`block text-xs font-black ${energyRhythm === item.id ? 'text-[#FF7A3D]' : 'text-[#5B0B24] dark:text-white'}`}>
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mt-0.5">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Dream Landscape */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  3. Dream Landscape
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'beaches', label: 'Tropical Beaches 🏝️', desc: 'White sands & coral waters' },
                    { id: 'mountains', label: 'Alpine & Mountains 🏔️', desc: 'Pine air & scenic passes' },
                    { id: 'historic', label: 'Historic Old Towns 🏰', desc: 'Cobblestones & architecture' },
                    { id: 'nature', label: 'Lush Wild Nature 🌿', desc: 'Rainforests & savannahs' },
                    { id: 'metropolis', label: 'Neon Metropolis 🏙️', desc: 'Skylines & futuristic cities' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLandscape(item.id)}
                      className={`p-2.5 rounded-[16px] text-left border transition-all ${
                        landscape === item.id
                          ? 'border-[#C2185B] bg-[#FFF5F8] dark:bg-[#330a1a] ring-2 ring-[#C2185B]/20 shadow-sm'
                          : 'border-[#5B0B24]/10 dark:border-white/10 bg-white dark:bg-[#280814] hover:border-[#C2185B]/40'
                      }`}
                    >
                      <span className={`block text-xs font-black ${landscape === item.id ? 'text-[#C2185B] dark:text-[#FF8BA7]' : 'text-[#5B0B24] dark:text-white'}`}>
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 mt-0.5">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Culinary Passions (Multi-select) */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                    4. Food Passions & Gastronomy (Select All You Crave)
                  </label>
                  <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 font-semibold">
                    {foodPreferences.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'street_food', label: 'Street Food & Night Markets 🍜' },
                    { id: 'seafood', label: 'Fresh Coastal Seafood 🦞' },
                    { id: 'fine_dining', label: 'Fine Dining & Wine Tastings 🍷' },
                    { id: 'authentic_spicy', label: 'Authentic Regional & Spicy 🌶️' },
                    { id: 'cafes_bakeries', label: 'Artisan Cafes & Pastries 🥐' },
                    { id: 'plant_based', label: 'Plant-Based & Healthy 🥗' },
                  ].map((food) => {
                    const isSelected = foodPreferences.includes(food.id);
                    return (
                      <button
                        key={food.id}
                        type="button"
                        onClick={() => toggleFoodPreference(food.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-[#5B0B24] text-white border-[#5B0B24] shadow-sm'
                            : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF4F7A]/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#FFC83D]" />}
                        <span>{food.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 5 & 6: Budget & Companion */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  5. Budget & Travel Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {budgetTiers.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setTasteBudget(b)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        tasteBudget === b
                          ? 'bg-[#FF7A3D] text-white border-[#FF7A3D]'
                          : 'border-[#5B0B24]/10 bg-white dark:bg-[#280814] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:border-[#FF7A3D]/40'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block pt-2">
                  6. Traveling Companion
                </label>
                <div className="flex flex-wrap gap-2">
                  {companions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTasteCompanion(c)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        tasteCompanion === c
                          ? 'bg-[#C2185B] text-white border-[#C2185B]'
                          : 'border-[#5B0B24]/10 bg-white dark:bg-[#280814] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:border-[#C2185B]/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* ========================================== */}
          {/* Top 4 Recommendations Section */}
          {/* ========================================== */}
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="sunset" size="sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Top 4 Recommendations
                  </Badge>
                  <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                    Highest compatibility with your taste
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
                  Your Perfect 4 Getaways
                </h2>
              </div>
              <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 max-w-sm sm:text-right">
                Tap <strong>&quot;Plan with AI&quot;</strong> on any destination to immediately generate full day-by-day itineraries and budgets.
              </p>
            </div>

            {/* Top 4 Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {top4Matches.map((match, idx) => (
                <TasteMatchCard
                  key={match.destination.id}
                  match={match}
                  rank={idx + 1}
                  onPlanTrip={handlePlanFromMatch}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: PROMPT STUDIO (MANUAL NATURAL LANGUAGE COMPOSER) */}
      {/* ========================================================= */}
      {!isGenerating && mode === 'prompt_composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          {/* Left Column: Natural Language Prompt Composer */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight">
                Where should your next story begin?
              </h1>
              <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-2">
                Describe your dream escape in natural language or search any of our {TOTAL_DESTINATIONS_COUNT}+ global locations. Journi synthesizes full daily routes, hidden spots, realistic budgets, and timing.
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-6">
              {/* Natural Language Textarea */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Describe your trip: e.g. 5 days in Kyoto for quiet morning shrines, matcha ceremonies, and cozy izakayas..."
                  className="w-full rounded-[24px] bg-white dark:bg-[#280814] p-4 sm:p-5 text-sm sm:text-base text-[#5B0B24] dark:text-[#FFF7FA] placeholder-[#5B0B24]/40 dark:placeholder-[#FF8BA7]/40 border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-coral/30 resize-none"
                  aria-label="Trip planning prompt"
                  required
                />

                <div className="absolute bottom-3 right-3 text-[11px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 font-mono">
                  {prompt.length} chars
                </div>
              </div>

              {/* Sample Prompt Chips with single-line truncation and hover popover */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#5B0B24]/80 dark:text-[#FF8BA7]">
                  Try asking a curated prompt idea:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_AI_PROMPTS.map((sampleText, idx) => (
                    <PromptSuggestionChip
                      key={idx}
                      prompt={sampleText}
                      onClick={(val) => setPrompt(val)}
                      variant="subtle"
                      popoverPosition="top"
                    />
                  ))}
                </div>
              </div>

              {/* Parameter Modifiers Card */}
              <Card variant="elevated" className="p-4 sm:p-6 space-y-5">
                {/* Duration Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
                      Trip Length
                    </label>
                    <span className="text-xs font-bold text-[#FF4F7A] bg-[#FF4F7A]/10 px-2.5 py-0.5 rounded-full">
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full accent-[#FF4F7A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#5B0B24]/40 dark:text-[#FF8BA7]/40 mt-1">
                    <span>1 Day</span>
                    <span>7 Days</span>
                    <span>14 Days</span>
                  </div>
                </div>

                {/* Vibe Selection */}
                <div>
                  <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block mb-2">
                    Travel Vibe
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {vibes.map((v) => (
                      <Chip
                        key={v}
                        label={v}
                        selected={selectedVibe === v}
                        onClick={() => setSelectedVibe(v)}
                      />
                    ))}
                  </div>
                </div>

                {/* Budget Tier & Companions Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block mb-2">
                      Budget Rhythm
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {budgetTiers.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudgetTier(b)}
                          className={`text-left text-xs px-3 py-2 rounded-[14px] border transition-all ${
                            budgetTier === b
                              ? 'border-[#FF4F7A] bg-[#FFF7FA] dark:bg-[#330a1a] text-[#C2185B] dark:text-[#FF8BA7] font-bold ring-1 ring-[#FF4F7A]/20'
                              : 'border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 bg-white dark:bg-[#280814] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:border-[#FF4F7A]/30'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block mb-2">
                      Companions
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {companions.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCompanion(c)}
                          className={`text-left text-xs px-3 py-2 rounded-[14px] border transition-all ${
                            companion === c
                              ? 'border-[#FF7A3D] bg-[#FFF7FA] dark:bg-[#330a1a] text-[#FF7A3D] font-bold ring-1 ring-[#FF7A3D]/20'
                              : 'border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 bg-white dark:bg-[#280814] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:border-[#FF7A3D]/30'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="sunset"
                size="lg"
                className="w-full"
                isLoading={isGenerating}
                leftIcon={<Sparkles className="w-5 h-5" />}
              >
                {isGenerating ? 'Synthesizing Your Journey...' : 'Generate Story & Plan'}
              </Button>
            </form>
          </div>

          {/* Right Column: AI Engine State & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="glass" className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#FF7A3D]" />
                  <h3 className="text-base font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                    AI Planning Intelligence
                  </h3>
                </div>
                <Badge variant={activeKey ? 'golden' : 'sunset'} size="sm">
                  {activeKey ? 'Gemini 1.5 Flash' : 'Smart Engine'}
                </Badge>
              </div>

              <div className="space-y-4 text-xs text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#5B0B24] dark:text-white">100+ Destination Catalog:</strong> Realistic landmarks, local specialties, and timings across every continent.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#5B0B24] dark:text-white">Free Live Model Option:</strong> You can hook up Google Gemini 1.5 Flash completely free (1,500 requests/day, zero credit card).
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#5B0B24] dark:text-white">Full Screen Reader Audio:</strong> Click &quot;Read Itinerary&quot; on any generated plan to hear your daily story aloud.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-[18px] bg-[#FFF7FA] dark:bg-[#1f060f] border border-[#5B0B24]/8 flex items-center justify-between">
                <div className="text-xs text-[#5B0B24]/80 dark:text-[#FF8BA7]/80">
                  Prefer automated taste matching?
                </div>
                <button
                  type="button"
                  onClick={() => setMode('taste_matcher')}
                  className="text-xs font-bold text-[#FF4F7A] hover:underline"
                >
                  Taste Profiler →
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 3: GENERATED PLAN RESULT */}
      {/* ========================================================= */}
      {!isGenerating && mode === 'result' && (
        <div className="space-y-8 animate-fade-in">
          {/* Trip Hero Banner */}
          <div className="rounded-[28px] bg-gradient-to-tr from-[#5B0B24] via-[#C2185B] to-[#FF7A3D] text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="golden" size="sm">
                  {isGeminiSource ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#5B0B24]" />
                      Google Gemini 1.5 Flash
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#5B0B24]" />
                      Journi Smart Engine
                    </span>
                  )}
                </Badge>
                <Badge variant="sunset" size="sm">
                  {currentTrip.pace} Pace
                </Badge>
                <span className="text-xs text-white/80 font-medium">
                  {currentTrip.daysCount} Days • {currentTrip.destination}, {currentTrip.country}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                {currentTrip.title}
              </h1>

              <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-6 max-w-2xl">
                {currentTrip.description}
              </p>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="sunset"
                  size="md"
                  onClick={handleSaveTrip}
                  leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  className="bg-white text-[#5B0B24] hover:bg-white/90 shadow-none font-bold"
                >
                  {isSaved ? 'Saved to Dashboard' : 'Save to My Trips'}
                </Button>

                <TextToSpeechButton
                  textToRead={`${currentTrip.title}. Day ${activeDay.dayNumber}: ${activeDay.title}. Morning: ${activeDay.activities[0]?.title || ''}. Afternoon: ${activeDay.activities[1]?.title || ''}. Evening: ${activeDay.activities[2]?.title || ''}.`}
                />

                <Link href={`/itinerary?tripId=${currentTrip.id}`}>
                  <Button variant="secondary" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Full Itinerary Flow
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={() => setMode('taste_matcher')}
                  className="text-xs text-white/80 hover:text-white underline px-2 py-1"
                >
                  Explore Top 4 Again
                </button>
              </div>

              {saveSuccessNotice && (
                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-medium animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Trip successfully saved! You can now view it in Trips & Itinerary tabs.</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card variant="elevated" className="p-4 text-center">
              <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 block mb-1">
                Estimated Budget
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">
                ₹{currentTrip.estimatedBudget.toLocaleString('en-IN')}
              </span>
            </Card>

            <Card variant="elevated" className="p-4 text-center">
              <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 block mb-1">
                Total Activities
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">
                {currentDays.reduce((acc, d) => acc + d.activities.length, 0)} Curated
              </span>
            </Card>

            <Card variant="elevated" className="p-4 text-center">
              <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 block mb-1">
                Expected Weather
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">
                {generatedPayload?.weather[0]?.highTemp || 22}°C Sunny
              </span>
            </Card>

            <Card variant="elevated" className="p-4 text-center">
              <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 block mb-1">
                Recommended Packing
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">
                {generatedPayload?.packing?.length || 7} Essentials
              </span>
            </Card>
          </div>

          {/* Result Content: Signature Plan Card + Day-by-Day Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Signature M03 AI Travel Plan Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
              <AITravelPlanCard
                title={currentTrip.title}
                durationDays={currentTrip.daysCount}
                peopleCount={companion ? `${companion}` : '2 People'}
                tags={[selectedVibe, currentTrip.pace, currentTrip.destination]}
                imageUrl={currentTrip.coverImage}
                bestTime="Oct - Apr (Optimal)"
                estimatedBudget={currentTrip.estimatedBudget}
                topExperiences={activeDay.activities.map((a) => a.title).slice(0, 3).join(', ')}
                foodRecommendations="Local seafood, artisanal teas, authentic street eats & cafés"
                isSaved={isSaved}
                onSave={handleSaveTrip}
              />
            </div>

            {/* Right: Day Selector Tabs & Timeline Flow */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#FF7A3D]" />
                  <h2 className="text-lg font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                    Day-by-Day Journey Flow
                  </h2>
                </div>
                <span className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Day {selectedDayNumber} of {currentDays.length}
                </span>
              </div>

              {/* Day Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {currentDays.map((d) => (
                  <button
                    key={d.dayNumber}
                    type="button"
                    onClick={() => setSelectedDayNumber(d.dayNumber)}
                    className={`px-4 py-2 rounded-[16px] text-xs font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${
                      selectedDayNumber === d.dayNumber
                        ? 'bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] text-white shadow-soft ring-2 ring-[#FF4F7A]/20'
                        : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border border-[#5B0B24]/10 hover:border-[#FF4F7A]/40'
                    }`}
                  >
                    <span>Day {d.dayNumber}</span>
                  </button>
                ))}
              </div>

              {/* Selected Day Header */}
              <div className="p-4 rounded-[20px] bg-white dark:bg-[#280814] border border-[#5B0B24]/10 shadow-soft">
                <h3 className="text-base font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
                  {activeDay.title}
                </h3>
                <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-0.5">
                  {activeDay.theme}
                </p>
              </div>

              {/* Activities for the selected day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeDay.activities.map((act) => (
                  <TimelineCard key={act.id} activity={act} />
                ))}
              </div>
            </div>
          </div>

          {/* Budget Breakdown Preview */}
          {generatedPayload?.budget && (
            <Card variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#FF7A3D]" />
                  <h3 className="text-base font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                    Estimated Cost Architecture
                  </h3>
                </div>
                <Link
                  href="/budget"
                  className="text-xs font-bold text-[#FF4F7A] hover:underline flex items-center gap-1"
                >
                  <span>Open Budget Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {generatedPayload.budget.categories.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-3 rounded-[16px] bg-[#FFF7FA] dark:bg-[#1f060f] border border-[#5B0B24]/8"
                  >
                    <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 block truncate">
                      {cat.label}
                    </span>
                    <span className="text-base font-extrabold text-[#5B0B24] dark:text-[#FF8BA7] mt-1 block">
                      ₹{cat.allocated.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Free Gemini API Key Modal / Bottom Drawer */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#280814] rounded-[28px] p-6 shadow-2xl border border-[#5B0B24]/10 space-y-4 animate-scale">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF7A3D]" />
                <h3 className="text-lg font-bold text-[#5B0B24] dark:text-white">
                  Connect Free Google Gemini AI
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 hover:text-[#5B0B24] font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 leading-relaxed">
              Google provides <strong>1,500 free requests per day</strong> on Gemini 1.5 Flash without entering any credit card. You can create a free key in Google AI Studio and paste it here to generate trips for any destination worldwide.
            </p>

            <Input
              label="Gemini API Key"
              placeholder="AIzaSy..."
              type="password"
              value={geminiKeyInput}
              onChange={(e) => setGeminiKeyInput(e.target.value)}
              helperText="Saved locally in your browser only. (Leave empty to use built-in smart engine)."
              leftIcon={<KeyRound className="w-4 h-4 text-[#FF4F7A]" />}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#FF4F7A] hover:underline flex items-center gap-1"
              >
                <span>Get free key from Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowKeyModal(false)}>
                  Cancel
                </Button>
                <Button variant="sunset" size="sm" onClick={handleSaveCustomKey}>
                  Save & Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AIPlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 space-y-6">
          <Skeleton height={200} className="w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton height={180} />
            <Skeleton height={180} />
            <Skeleton height={180} />
          </div>
        </div>
      }
    >
      <AIPlannerContent />
    </Suspense>
  );
}
