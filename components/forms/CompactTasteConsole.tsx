'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  Navigation,
  Sliders,
  ChevronDown,
  Loader2,
  Check,
  Compass,
  ArrowRight,
} from 'lucide-react';
import TasteMatchCard from '@/components/cards/TasteMatchCard';
import Badge from '@/components/ui/Badge';
import type { UserTasteProfile, TasteMatchResult, LocationScope, Destination } from '@/types';
import { detectUserLocation } from '@/lib/location';

export interface CompactTasteConsoleProps {
  initialLandscape?: string;
  initialQuery?: string;
  externalLandscape?: string | null;
  searchTrigger?: number;
  onLandscapeChange?: (landscape: string) => void;
}

export default function CompactTasteConsole({
  initialLandscape,
  initialQuery,
  externalLandscape,
  searchTrigger,
  onLandscapeChange,
}: CompactTasteConsoleProps = {}) {
  const router = useRouter();

  // Search input state
  const [promptQuery, setPromptQuery] = useState(initialQuery || '');

  // Taste Profiler states
  const [locationScope, setLocationScope] = useState<LocationScope>('interstate');
  const [userOrigin, setUserOrigin] = useState('Kerala, India');
  const [customLocation, setCustomLocation] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const [energyRhythm, setEnergyRhythm] = useState('chill');
  const [landscape, setLandscape] = useState(initialLandscape || 'beaches');
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [companion, setCompanion] = useState('Couple');
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [ageGroup, setAgeGroup] = useState('25-34');
  const [foodPreferences, setFoodPreferences] = useState<string[]>(['seafood', 'street_food']);
  const [tripDays, setTripDays] = useState<number>(5);

  const handleSelectCompanion = (c: string) => {
    setCompanion(c);
    if (c === 'Solo') {
      setAdultsCount(1);
      setChildrenCount(0);
    } else if (c === 'Couple') {
      setAdultsCount(2);
      setChildrenCount(0);
    } else if (c === 'Family') {
      setAdultsCount(2);
      setChildrenCount(1);
    } else if (c === 'Friends') {
      setAdultsCount(3);
      setChildrenCount(0);
    }
  };

  // UI accordion / expander states
  const [showAdvancedTastes, setShowAdvancedTastes] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [planningCardId, setPlanningCardId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const [aiCuratorSummary, setAiCuratorSummary] = useState<string | null>(null);
  const [astraMatches, setAstraMatches] = useState<TasteMatchResult[] | null>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll down to results section whenever filter/search is triggered
  useEffect(() => {
    if (isPlanning) {
      const timer = setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isPlanning]);

  // Quick Scope options
  const scopeOptions: Array<{ id: LocationScope; label: string; icon: string }> = [
    { id: 'nearby_200km', label: 'Within 200 km', icon: '🚗' },
    { id: 'in_state', label: 'In-State', icon: '📍' },
    { id: 'interstate', label: 'Interstate', icon: '✈️' },
    { id: 'international', label: 'International', icon: '🌍' },
    { id: 'custom', label: 'Other', icon: '✏️' },
  ];

  // Quick Rhythm options
  const rhythmOptions = [
    { id: 'peace', label: 'Peace & Zen', icon: '🧘' },
    { id: 'chill', label: 'Chill & Coastal', icon: '🌊' },
    { id: 'culture', label: 'Culture & Arts', icon: '🏛️' },
    { id: 'adventure', label: 'High Adventure', icon: '🧗' },
  ];

  // Quick Landscape options
  const landscapeOptions = [
    { id: 'beaches', label: 'Beaches', icon: '🏝️' },
    { id: 'mountains', label: 'Mountains', icon: '🏔️' },
    { id: 'historic', label: 'Old Towns', icon: '🏰' },
    { id: 'nature', label: 'Lush Nature', icon: '🌿' },
    { id: 'metropolis', label: 'Metropolis', icon: '🏙️' },
  ];

  // Food options for expandable tray
  const foodOptions = [
    { id: 'street_food', label: 'Street Food 🍢' },
    { id: 'seafood', label: 'Fresh Seafood 🦞' },
    { id: 'fine_dining', label: 'Fine Dining 🍷' },
    { id: 'authentic_spicy', label: 'Authentic Local 🌶️' },
    { id: 'cafes_bakeries', label: 'Cafes & Bakeries ☕' },
  ];

  // Automatically analyze current location on mount
  useEffect(() => {
    detectUserLocation()
      .then((loc) => {
        if (loc?.display) {
          setUserOrigin(loc.display);
        }
      })
      .catch(() => {
        setUserOrigin('Kerala, India');
      });
  }, []);

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const loc = await detectUserLocation();
      setUserOrigin(loc.display || `${loc.state}, ${loc.country}`);
    } catch {
      setUserOrigin('Kerala, India');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSelectScope = async (scopeId: LocationScope) => {
    setLocationScope(scopeId);
    // When selecting distance & scope (except 'custom' / 'other'), automatically analyze location first
    if (scopeId !== 'custom') {
      setIsDetectingLocation(true);
      try {
        const detected = await detectUserLocation();
        setUserOrigin(detected.display || `${detected.state}, ${detected.country}`);
      } catch {
        setUserOrigin('Kerala, India');
      } finally {
        setIsDetectingLocation(false);
      }
    }
  };

  const toggleFoodPreference = (id: string) => {
    setFoodPreferences((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((k) => k !== id) : prev) : [...prev, id]
    );
  };

  // Compile user taste profile
  const currentProfile: UserTasteProfile = useMemo(
    () => ({
      ageGroup,
      energyRhythm,
      foodPreferences,
      landscape,
      budgetTier,
      companion,
      adultsCount,
      childrenCount,
      locationScope,
      userOrigin,
      customLocation,
    }),
    [ageGroup, energyRhythm, foodPreferences, landscape, budgetTier, companion, adultsCount, childrenCount, locationScope, userOrigin, customLocation]
  );

  // Restore saved search session if returning from subpage with same content
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('journi_hero_taste_search');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.promptQuery) setPromptQuery(parsed.promptQuery);
          if (parsed.locationScope) setLocationScope(parsed.locationScope);
          if (parsed.userOrigin) setUserOrigin(parsed.userOrigin);
          if (parsed.customLocation) setCustomLocation(parsed.customLocation);
          if (parsed.energyRhythm) setEnergyRhythm(parsed.energyRhythm);
          if (parsed.landscape) setLandscape(parsed.landscape);
          if (parsed.budgetTier) setBudgetTier(parsed.budgetTier);
          if (parsed.companion) setCompanion(parsed.companion);
          if (parsed.adultsCount !== undefined) setAdultsCount(parsed.adultsCount);
          if (parsed.childrenCount !== undefined) setChildrenCount(parsed.childrenCount);
          if (parsed.ageGroup) setAgeGroup(parsed.ageGroup);
          if (parsed.foodPreferences) setFoodPreferences(parsed.foodPreferences);
          if (parsed.tripDays) setTripDays(parsed.tripDays);
          if (parsed.hasSearched) setHasSearched(parsed.hasSearched);
          if (parsed.showMoreResults !== undefined) setShowMoreResults(parsed.showMoreResults);
          if (parsed.aiCuratorSummary) setAiCuratorSummary(parsed.aiCuratorSummary);
          if (parsed.astraMatches && parsed.astraMatches.length > 0) {
            setAstraMatches(parsed.astraMatches);
          }
        }
      } catch (err) {
        console.warn('Could not restore taste search session:', err);
      }
    }
  }, []);

  // Sync showMoreResults & tripDays to session storage
  useEffect(() => {
    if (typeof window !== 'undefined' && astraMatches && astraMatches.length > 0) {
      try {
        const saved = sessionStorage.getItem('journi_hero_taste_search');
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.showMoreResults = showMoreResults;
          parsed.tripDays = tripDays;
          parsed.adultsCount = adultsCount;
          parsed.childrenCount = childrenCount;
          sessionStorage.setItem('journi_hero_taste_search', JSON.stringify(parsed));
        }
      } catch {}
    }
  }, [showMoreResults, tripDays, adultsCount, childrenCount, astraMatches]);

  // Synchronize externalLandscape
  useEffect(() => {
    if (externalLandscape && externalLandscape !== landscape) {
      setLandscape(externalLandscape);
    }
  }, [externalLandscape, landscape]);

  // Synchronize initialQuery
  useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== promptQuery) {
      setPromptQuery(initialQuery);
    }
  }, [initialQuery, promptQuery]);

  // Execute Astra 6 Plan Search
  const handlePlanWithAstra = async (
    e?: React.FormEvent,
    overrideLandscape?: string,
    overrideQuery?: string
  ) => {
    if (e) e.preventDefault();
    setIsPlanning(true);
    setHasSearched(true);
    setAstraMatches(null);
    setShowMoreResults(false);

    try {
      const activeLandscape = overrideLandscape || landscape;
      const q = (overrideQuery !== undefined ? overrideQuery : promptQuery).trim();
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          scope: locationScope,
          origin: userOrigin,
          customLocation: locationScope === 'custom' ? (customLocation || '').trim() : undefined,
          rhythm: energyRhythm,
          landscape: activeLandscape,
          budgetTier,
          companion,
          adultsCount,
          childrenCount,
          cuisines: foodPreferences,
          ageGroup,
          limit: 8,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAiCuratorSummary(json.data.summary || null);

          // If AI search returned enriched destinations, format into TasteMatchResults
          if (json.data.destinations && json.data.destinations.length > 0) {
            const mapped: TasteMatchResult[] = json.data.destinations.map((d: Destination) => ({
              destination: d,
              score: d.matchScore || 96,
              matchReason: d.matchReason || `Matches your chosen travel preferences`,
              matchedTags: d.vibes?.slice(0, 3) || ['Curated Escape'],
            }));
            setAstraMatches(mapped);

            if (typeof window !== 'undefined') {
              try {
                sessionStorage.setItem('journi_hero_taste_search', JSON.stringify({
                  promptQuery: q,
                  locationScope,
                  userOrigin,
                  customLocation,
                  energyRhythm,
                  landscape: activeLandscape,
                  budgetTier,
                  companion,
                  adultsCount,
                  childrenCount,
                  ageGroup,
                  foodPreferences,
                  tripDays,
                  hasSearched: true,
                  showMoreResults: false,
                  aiCuratorSummary: json.data.summary || null,
                  astraMatches: mapped,
                }));
              } catch {}
            }
          } else {
            setAstraMatches([]);
          }
        } else {
          setAstraMatches([]);
        }
      } else {
        setAstraMatches([]);
      }
    } catch (err) {
      console.warn('Astra 6 search encountered error:', err);
      setAstraMatches([]);
    } finally {
      setIsPlanning(false);
    }
  };

  // Trigger search on external searchTrigger
  const prevTriggerRef = useRef(searchTrigger);
  useEffect(() => {
    if (searchTrigger !== undefined && searchTrigger > 0 && searchTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = searchTrigger;
      handlePlanWithAstra(undefined, externalLandscape || undefined, initialQuery !== undefined ? initialQuery : undefined);
    }
  }, [searchTrigger, externalLandscape, initialQuery]);

  const handleSelectLandscape = (lId: string) => {
    setLandscape(lId);
    onLandscapeChange?.(lId);
  };

  const handlePlanTripCard = (match: TasteMatchResult) => {
    setPlanningCardId(match.destination.id);
    const dest = match.destination;
    const craftedPrompt = `Plan a ${tripDays}-day ${dest.energyRhythm || energyRhythm || 'curated'} trip to ${dest.name}, ${dest.country} featuring ${(dest.highlights || []).slice(0, 3).join(', ') || 'iconic landmarks'} with authentic ${(dest.foodTypes || []).slice(0, 3).join(' and ') || 'regional dining'}.`;

    // Save exact session state so clicking Back returns with exact same 4-8 cards
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          'journi_hero_taste_search',
          JSON.stringify({
            promptQuery,
            locationScope,
            userOrigin,
            customLocation,
            energyRhythm,
            landscape,
            budgetTier,
            companion,
            adultsCount,
            childrenCount,
            ageGroup,
            foodPreferences,
            tripDays,
            hasSearched: true,
            showMoreResults,
            aiCuratorSummary,
            astraMatches,
          })
        );
      } catch {}
    }

    // Direct generation route - bypass intermediate prompt studio page
    const params = new URLSearchParams({
      action: 'generate',
      prompt: craftedPrompt,
      dest: dest.name,
      country: dest.country,
      days: String(tripDays),
      vibe: dest.vibes?.[0] || 'Cultural',
      budget: budgetTier || 'Moderate',
      companion: companion || 'Couple',
      adults: String(adultsCount),
      children: String(childrenCount),
      from: 'home',
      reason: match.matchReason || dest.tagline || dest.description || '',
    });
    router.push(`/ai?${params.toString()}`);
  };

  // Determine active matches to display (Derived strictly from Astra 6 AI results)
  const displayedMatches = useMemo(() => {
    if (!astraMatches || astraMatches.length === 0) return [];
    return astraMatches.slice(0, showMoreResults ? 8 : 4);
  }, [astraMatches, showMoreResults]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* ===================== COMPACT TASTE CONSOLE ===================== */}
      <div className="rounded-[28px] bg-white/95 dark:bg-[#200612]/95 backdrop-blur-md p-4 sm:p-6 border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 shadow-xl space-y-4">
        {/* Row 1: Search Input (Spacious Full Width) */}
        <div className="relative flex items-center rounded-2xl bg-[#FFF5F8]/70 dark:bg-[#2c0817]/70 border border-[#FF4F7A]/25 px-4 py-2.5 focus-within:border-[#FF4F7A] focus-within:ring-2 focus-within:ring-[#FF4F7A]/20 transition-all shadow-xs">
          <Sparkles className="w-4 h-4 text-[#FF7A3D] mr-2.5 shrink-0 animate-pulse" />
          <input
            type="text"
            value={promptQuery}
            onChange={(e) => setPromptQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handlePlanWithAstra();
              }
            }}
            placeholder="Where do you want to explore or what vibe do you dream of? (e.g. peaceful mountain village or coastal seafood)"
            className="w-full bg-transparent border-none text-xs sm:text-sm text-[#2E0513] dark:text-[#FFF7FA] placeholder:text-[#5B0B24]/40 dark:placeholder:text-[#FF8BA7]/40 focus:outline-none"
          />
          {promptQuery && (
            <button
              type="button"
              onClick={() => setPromptQuery('')}
              className="text-xs text-[#5B0B24]/40 hover:text-[#5B0B24] dark:text-[#FF8BA7]/40 ml-1 px-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Row 2: Location Scope Segmented Control */}
        <div className="pt-2 border-t border-[#5B0B24]/8 dark:border-white/10 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] flex items-center gap-1.5 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#FF7A3D]" />
              Distance & Scope:
            </span>

            {/* Origin display & GPS detect */}
            <div className="flex items-center gap-2 text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
              <span className="truncate max-w-[180px]">{userOrigin}</span>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="text-[10px] font-bold text-[#FF4F7A] hover:underline cursor-pointer"
              >
                {isDetectingLocation ? 'Locating...' : 'Detect GPS'}
              </button>
            </div>
          </div>

          {/* Scope Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {scopeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectScope(opt.id)}
                className={`px-3 py-2 rounded-xl text-center border text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  locationScope === opt.id
                    ? 'border-[#FF4F7A] bg-white dark:bg-[#38091C] text-[#C2185B] dark:text-[#FF8BA7] font-black ring-1 ring-[#FF4F7A]/30 shadow-xs'
                    : 'border-[#5B0B24]/10 dark:border-white/10 bg-white/50 dark:bg-[#280814]/50 text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 hover:border-[#FF4F7A]/30'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Conditional Custom Place input */}
          {locationScope === 'custom' && (
            <div className="pt-1 flex items-center gap-2 animate-in fade-in duration-200">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePlanWithAstra();
                  }
                }}
                autoFocus
                placeholder="Enter exact destination: e.g. Kyoto, Japan or Swiss Alps or Goa..."
                className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-[#280814] text-[#5B0B24] dark:text-[#FFF7FA] placeholder-[#5B0B24]/40 dark:placeholder-[#FF8BA7]/40 border border-[#FF4F7A]/30 focus:outline-none focus:ring-1 focus:ring-[#FF4F7A]"
              />
              <button
                type="button"
                onClick={() => handlePlanWithAstra()}
                disabled={isPlanning}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] text-white font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <span>Find</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Row 3: Visual Taste Selectors (Rhythm, Landscape, Budget, Companion, Duration) */}
        <div className="pt-3 pb-1 border-t border-[#5B0B24]/8 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Rhythm */}
          <div className="space-y-3">
            <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[12px] tracking-wide mb-2">
              Trip Rhythm:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {rhythmOptions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setEnergyRhythm(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    energyRhythm === r.id
                      ? 'bg-[#FF7A3D] text-white border-[#FF7A3D] shadow-xs'
                      : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF7A3D]/40'
                  }`}
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Landscape */}
          <div className="space-y-3">
            <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[12px] tracking-wide mb-2">
              Landscape:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {landscapeOptions.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => handleSelectLandscape(l.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    landscape === l.id
                      ? 'bg-[#C2185B] text-white border-[#C2185B] shadow-xs'
                      : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#C2185B]/40'
                  }`}
                >
                  {l.icon} {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[12px] tracking-wide mb-2">
              Budget Tier:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Budget Friendly', 'Moderate', 'Luxury Escapes'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudgetTier(b)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    budgetTier === b
                      ? 'bg-[#5B0B24] text-white border-[#5B0B24] shadow-xs'
                      : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#5B0B24]/30'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Companion & Travelers */}
          <div className="space-y-2">
            <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[12px] tracking-wide mb-1">
              Companion & Party:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Solo', 'Couple', 'Family', 'Friends'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleSelectCompanion(c)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    companion === c
                      ? 'bg-[#FF4F7A] text-white border-[#FF4F7A] shadow-xs'
                      : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF4F7A]/30'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Tactile Adults & Kids (<5 yrs) Steppers */}
            <div className="pt-1.5 space-y-1.5">
              <div className="flex items-center justify-between bg-white dark:bg-[#280814] rounded-xl px-2.5 py-1 border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15">
                <span className="text-[11px] font-semibold text-[#5B0B24] dark:text-[#FFF7FA]">Adults</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAdultsCount((prev) => Math.max(1, prev - 1))}
                    disabled={adultsCount <= 1}
                    className="w-5 h-5 rounded-md flex items-center justify-center bg-[#5B0B24]/5 hover:bg-[#5B0B24]/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#5B0B24] dark:text-white font-bold text-xs disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-[#5B0B24] dark:text-white w-3 text-center">{adultsCount}</span>
                  <button
                    type="button"
                    onClick={() => setAdultsCount((prev) => Math.min(10, prev + 1))}
                    disabled={adultsCount >= 10}
                    className="w-5 h-5 rounded-md flex items-center justify-center bg-[#5B0B24]/5 hover:bg-[#5B0B24]/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#5B0B24] dark:text-white font-bold text-xs disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-[#280814] rounded-xl px-2.5 py-1 border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#5B0B24] dark:text-[#FFF7FA]">Kids &lt;5y</span>
                  <span className="text-[8px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 -mt-0.5">Hotel policy applies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                    disabled={childrenCount <= 0}
                    className="w-5 h-5 rounded-md flex items-center justify-center bg-[#5B0B24]/5 hover:bg-[#5B0B24]/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#5B0B24] dark:text-white font-bold text-xs disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-[#5B0B24] dark:text-white w-3 text-center">{childrenCount}</span>
                  <button
                    type="button"
                    onClick={() => setChildrenCount((prev) => Math.min(6, prev + 1))}
                    disabled={childrenCount >= 6}
                    className="w-5 h-5 rounded-md flex items-center justify-center bg-[#5B0B24]/5 hover:bg-[#5B0B24]/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#5B0B24] dark:text-white font-bold text-xs disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[12px] tracking-wide mb-2">
              Trip Duration:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[3, 5, 7, 10, 14].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setTripDays(d)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    tripDays === d
                      ? 'bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] text-white border-transparent shadow-xs'
                      : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF4F7A]/40'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Expandable More Tastes (Cuisines & Age Demographic) */}
        <div className="pt-2 border-t border-[#5B0B24]/8 dark:border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvancedTastes((prev) => !prev)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#C2185B] dark:text-[#FF8BA7] hover:underline cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FF7A3D]" />
            <span>{showAdvancedTastes ? 'Hide Cuisines & Age Demographic' : 'Fine-Tune Cuisines & Age Demographic'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvancedTastes ? 'rotate-180' : ''}`} />
          </button>

          <span className="text-[10px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 font-medium">
            1,680+ destinations catalog
          </span>
        </div>

        {/* Expandable Advanced Tastes Tray */}
        {showAdvancedTastes && (
          <div className="p-3.5 rounded-2xl bg-[#FFF5F8]/50 dark:bg-[#280814]/50 border border-[#FF4F7A]/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200">
            {/* Cuisines */}
            <div className="space-y-2">
              <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[11px]">
                Favorite Food & Dining Styles:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {foodOptions.map((f) => {
                  const isSelected = foodPreferences.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFoodPreference(f.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#5B0B24] text-white border-[#5B0B24] shadow-xs'
                          : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF4F7A]/30'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#FFC83D]" />}
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age Group */}
            <div className="space-y-2">
              <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA] block text-[11px]">
                Traveler Age Demographic:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['18-24', '25-34', '35-49', '50+'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setAgeGroup(age)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      ageGroup === age
                        ? 'bg-[#FF4F7A] text-white border-[#FF4F7A] shadow-xs'
                        : 'bg-white dark:bg-[#280814] text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 border-[#5B0B24]/10 hover:border-[#FF4F7A]/30'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Row 5: Universal "Plan with Journi" Action Button */}
        <div className="pt-3 border-t border-[#5B0B24]/8 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A3D]" />
            <span>Customize any options above, then click to generate your curated destinations.</span>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handlePlanWithAstra()}
              disabled={isPlanning}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#FF4F7A] via-[#E91E63] to-[#FF7A3D] hover:from-[#E03A64] hover:to-[#E5662D] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isPlanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Curating with Journi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Plan with Journi</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/60 font-medium tracking-wide">
              powered by <span className="font-semibold text-[#5B0B24]/70 dark:text-[#FFF7FA]/80">GPT 6 Astra</span>
            </span>
          </div>
        </div>
      </div>

      {/* ===================== ASTRA 6 CURATED RESULTS ===================== */}
      {(hasSearched || isPlanning) && (
        <div ref={resultsSectionRef} id="curated-results-section" className="space-y-4 pt-2 animate-in fade-in duration-300 scroll-mt-24">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="sunset" size="sm">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A3D]" />
                {showMoreResults ? 'Top 8 Curated Matches' : 'Top 4 Curated Matches'}
              </Badge>
              <span className="text-xs font-semibold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                Astra 6 AI Curator
              </span>
            </div>

            {aiCuratorSummary && (
              <p className="text-xs italic text-[#C2185B] dark:text-[#FF8BA7] max-w-md sm:text-right">
                &quot;{aiCuratorSummary}&quot;
              </p>
            )}
          </div>

          {/* Skeleton loading when isPlanning */}
          {isPlanning && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 rounded-[24px] bg-[#FFF5F8]/80 dark:bg-[#280814]/80 border border-[#FF4F7A]/20 p-4 animate-pulse flex flex-col justify-between">
                  <div className="h-44 rounded-2xl bg-[#5B0B24]/10 dark:bg-white/10" />
                  <div className="space-y-2 pt-3">
                    <div className="h-4 bg-[#5B0B24]/10 dark:bg-white/10 rounded-full w-3/4" />
                    <div className="h-3 bg-[#5B0B24]/10 dark:bg-white/10 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Grid when loaded */}
          {!isPlanning && displayedMatches.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedMatches.map((match, idx) => (
                  <TasteMatchCard
                    key={match.destination.id}
                    match={match}
                    rank={idx + 1}
                    isPlanning={planningCardId === match.destination.id}
                    onPlanTrip={handlePlanTripCard}
                  />
                ))}
              </div>

              {/* Show More / Show Less Toggle Button */}
              {astraMatches && astraMatches.length > 4 && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMoreResults((prev) => !prev)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#FF4F7A]/30 bg-white dark:bg-[#280814] text-[#C2185B] dark:text-[#FF8BA7] hover:bg-[#FF4F7A]/5 font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF7A3D]" />
                    <span>{showMoreResults ? 'Show Top 4 Only' : 'Show 8 Recommendations'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMoreResults ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty state if search returned 0 results */}
          {!isPlanning && displayedMatches.length === 0 && (
            <div className="text-center py-8 rounded-2xl bg-[#FFF5F8]/50 dark:bg-[#280814]/50 border border-[#FF4F7A]/20 p-6 space-y-2">
              <Compass className="w-8 h-8 text-[#FF7A3D] mx-auto opacity-70 animate-bounce" />
              <p className="text-sm font-semibold text-[#5B0B24] dark:text-[#FFF7FA]">
                No matching destinations returned for this search.
              </p>
              <p className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                Try adjusting your custom destination or travel vibe and click &quot;Plan with Astra 6&quot;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
