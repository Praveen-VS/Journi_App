'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AIPromptInput from '@/components/forms/AIPromptInput';
import DestinationCard from '@/components/cards/DestinationCard';
import AITravelPlanCard from '@/components/cards/AITravelPlanCard';
import SavedPolaroidCard from '@/components/cards/SavedPolaroidCard';
import CategoryGrid from '@/components/shared/CategoryGrid';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import PromptSuggestionChip from '@/components/ui/PromptSuggestionChip';
import {
  MOCK_DESTINATIONS,
  SAMPLE_AI_PROMPTS,
} from '@/constants';
import {
  Sparkles,
  Calendar,
  Wallet,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handlePromptSubmit = (promptText: string) => {
    router.push(`/ai?prompt=${encodeURIComponent(promptText)}`);
  };

  const handlePromptChipClick = (promptText: string) => {
    setSelectedPrompt(promptText);
    router.push(`/ai?prompt=${encodeURIComponent(promptText)}`);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    router.push(`/ai?prompt=${encodeURIComponent(`Plan a scenic trip focused on ${category.toLowerCase()} with serene landscapes and authentic stays.`)}`);
  };

  return (
    <main className="w-full overflow-hidden">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Journi',
            url: 'https://journi.travel',
            description: 'Every journey begins a story. AI-first travel planner.',
            applicationCategory: 'TravelApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
            },
          }),
        }}
      />

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        {/* Ambient Sunset Glow Background Blob */}
        <div
          aria-hidden="true"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-[#FF4F7A]/25 via-[#FF7A3D]/20 to-[#FFC83D]/25 rounded-full blur-3xl pointer-events-none -z-10"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Tagline Badge + Angled Cursive Script */}
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="sunset" size="md" className="shadow-soft">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              AI-Powered Travel Planning
            </Badge>
            <span
              className="text-[#FF2A6D] text-lg sm:text-xl font-bold tracking-tight select-none rotate-[-6deg]"
              style={{ fontFamily: 'var(--font-caveat, cursive)' }}
            >
              Explore a Better Tomorrow
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#3E0717] dark:text-[#FFF7FA] max-w-4xl leading-[1.08] mb-5">
            Every journey <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2185B] via-[#E91E63] to-[#FF7A3D]">
              begins a story.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#704250] dark:text-[#FFB3C6] max-w-2xl font-normal leading-relaxed mb-8 sm:mb-10">
            Tell Journi how you want to travel. Our AI crafts personalized,
            day-by-day itineraries with smart INR budgets, packing checklists, and local secrets.
          </p>

          {/* Central AI Prompt Bar */}
          <div className="w-full max-w-3xl mb-5">
            <AIPromptInput
              initialPrompt={selectedPrompt}
              onSubmit={handlePromptSubmit}
            />
          </div>

          {/* Sample Prompt Pills with single-line truncation and hover popover */}
          <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#704250] dark:text-[#FFB3C6] font-semibold mr-1 shrink-0">
              Try asking:
            </span>
            {SAMPLE_AI_PROMPTS.slice(0, 3).map((prompt, idx) => (
              <PromptSuggestionChip
                key={idx}
                prompt={prompt}
                onClick={handlePromptChipClick}
                variant="light"
                popoverPosition="top"
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===================== M02 DISCOVER CATEGORIES SECTION ===================== */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <Badge variant="pink" size="sm" className="mb-2">
            Explore Destinations
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight">
            Discover Amazing Places
          </h2>
          <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] mt-1">
            Choose your travel style to unlock curated journeys and instant itineraries
          </p>
        </div>

        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </section>

      {/* ===================== SIGNATURE M03 & M04 SHOWCASE ===================== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left: Interactive M03 AI Travel Plan Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="golden" size="sm">
                M03 Signature AI Plan
              </Badge>
              <span className="text-xs font-semibold text-[#FF4F7A]">
                Instant Turnkey Itineraries
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight mb-4">
              Plan Your Trip with AI
            </h2>
            <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] leading-relaxed mb-6">
              Get personalized itineraries, smart INR budget allocation, and local secrets in seconds.
              Powered by Google Gemini and our built-in offline smart engine.
            </p>

            <AITravelPlanCard
              title="Maldives Getaway"
              durationDays={5}
              peopleCount="2 People"
              tags={['Beaches', 'Adventure', 'Relaxation']}
              imageUrl="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80"
              bestTime="Nov - Apr"
              estimatedBudget={240000}
              topExperiences="Snorkeling, Island Hopping, Sunset Cruise"
              foodRecommendations="Local Seafood, Coconut Curries, Cafés"
              onExplore={() => router.push('/ai?prompt=Plan+a+5-day+Maldives+Getaway+for+2+people')}
            />
          </div>

          {/* Right: M04 Save Every Journey Scrapbook Preview */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="pink" size="sm">
                  M04 Scrapbook Feature
                </Badge>
                <span className="text-xs font-semibold text-[#C2185B] dark:text-[#FF8BA7]">
                  Keep Memories Alive
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight mb-4">
                Save Every Journey
              </h2>
              <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] leading-relaxed mb-6">
                Keep your favorite places, trips, and memories all in one place with handwritten sticky notes and polaroid scrapbooks.
              </p>
            </div>

            {/* Floating Polaroids Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <SavedPolaroidCard
                title="Santorini Sunset"
                date="12 Jun 2026"
                location="Greece"
                imageUrl="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80"
                stickyNoteText="Dream bigger"
                stickyNoteColor="peach"
                rotation={-2}
                onClick={() => router.push('/saved')}
              />
              <SavedPolaroidCard
                title="Swiss Alpine Lakes"
                date="03 Apr 2026"
                location="Switzerland"
                imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"
                stickyNoteText="Beautiful memories"
                stickyNoteColor="pink"
                rotation={3}
                onClick={() => router.push('/saved')}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ===================== FEATURE HIGHLIGHTS ===================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="golden" size="sm" className="mb-3">
            Unified Trip Architecture
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#3E0717] dark:text-[#FFF7FA]">
            Everything you need for the road ahead.
          </h2>
          <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] mt-2">
            Journi seamlessly binds every part of your adventure into one harmonious,
            distraction-free planner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Card variant="elevated" className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[18px] bg-gradient-to-tr from-[#FF4F7A] to-[#FF7A3D] text-white flex items-center justify-center mb-5 shadow-sunset">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#3E0717] dark:text-white mb-2">
                Natural Language AI
              </h3>
              <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] leading-relaxed">
                Describe your dream vibes, budget, and travel companions in plain sentences.
                Journi plans the exact sequence without tedious manual research.
              </p>
            </div>
            <Link href="/ai" className="mt-6 pt-4 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 text-xs font-semibold text-[#FF4F7A] flex items-center gap-1">
              <span>Try the AI Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card variant="elevated" className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[18px] bg-[#5B0B24] text-white flex items-center justify-center mb-5 shadow-soft">
                <Calendar className="w-6 h-6 text-[#FFC83D]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#3E0717] dark:text-white mb-2">
                Day-Wise Timelines & Audio
              </h3>
              <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] leading-relaxed">
                Balanced morning, afternoon, and evening activities with realistic transit
                times, location pins, and accessibility-first audio narration.
              </p>
            </div>
            <Link href="/itinerary" className="mt-6 pt-4 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 text-xs font-semibold text-[#5B0B24] dark:text-[#FF8BA7] flex items-center gap-1">
              <span>View Itinerary Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card variant="elevated" className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[18px] bg-gradient-to-tr from-[#C2185B] to-[#FFC83D] text-white flex items-center justify-center mb-5 shadow-soft">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#3E0717] dark:text-white mb-2">
                Smart INR Budget & Packing
              </h3>
              <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] leading-relaxed">
                Categorized spending breakdown in Indian Rupees (₹) for stay, dining, and sights. Plus dynamic
                checklists tailored to destination climate forecasts.
              </p>
            </div>
            <Link href="/budget" className="mt-6 pt-4 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 text-xs font-semibold text-[#FF7A3D] flex items-center gap-1">
              <span>Explore Budget & Packing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      </section>

      {/* ===================== TRENDING DESTINATIONS ===================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <Badge variant="golden" size="sm" className="mb-2">
              Curated Escapes
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#3E0717] dark:text-[#FFF7FA]">
              Trending Destinations
            </h2>
            <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] mt-1">
              Hand-picked journeys planned with seasonal pacing and local secrets.
            </p>
          </div>

          <Link href="/home">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Explore All Destinations
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DESTINATIONS.slice(0, 4).map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* ===================== STORYTELLING FOOTER BANNER ===================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-[32px] sm:rounded-[36px] bg-gradient-to-tr from-[#3E0717] via-[#C2185B] to-[#FF7A3D] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FFC83D]">
                The Journi Philosophy
              </span>
              <span className="text-xs text-white/50">•</span>
              <span
                className="text-white/90 text-sm font-bold rotate-[-4deg]"
                style={{ fontFamily: 'var(--font-caveat, cursive)' }}
              >
                Explore a Better Tomorrow
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
              &ldquo;We don&apos;t just organize schedules. We craft space for the unexpected moments you&apos;ll remember forever.&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-8">
              From early dawn in the Arashiyama bamboo grove to cliffside trattorias
              along the Amalfi coast, Journi handles the logistics so you can live the story.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/ai">
                <Button variant="sunset" size="lg" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Start Planning with AI
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Log In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
