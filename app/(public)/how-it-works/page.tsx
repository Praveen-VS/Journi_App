'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  MapPin,
  Sparkles,
  Layers,
  Compass,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  Hotel,
  Volume2,
  Wallet,
  CheckSquare,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Sun,
  Bookmark,
  Users,
  Clock,
  Car,
  Plane,
  Heart,
  Luggage,
  Sparkle,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeSimTab, setActiveSimTab] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const workflowSteps = [
    {
      number: '01',
      title: 'Origin Discovery & Radius Scoping',
      tagline: 'Instant location detection & customizable travel distance',
      description:
        'Journi automatically detects your departure origin (e.g. seated in Kerala, India) and provides four intuitive distance scopes: Within 200 km for comfortable weekend road trips, In-State for exploring regional territory, Interstate for cross-border escapes, or Global for world-renowned destinations.',
      technicalHighlight:
        'Configures exact adult and under-5 child counts. This activates transparent hotel child policy calculations across all subsequent stays.',
      highlight:
        '"Weekend road trip within 200 km for 2 adults and 1 toddler with peaceful mountain scenery, cool climates, and authentic local cuisine."',
      featurePills: ['Instant GPS Scope', 'Under-5 Child Tracking', 'Trip Rhythm Pacing', 'Live Budget Estimates'],
      icon: MapPin,
    },
    {
      number: '02',
      title: 'Astra AI Taste Match & Seasonality Engine',
      tagline: 'Climate analysis, weather radar & curated match scoring',
      description:
        'Our Astra AI engine cross-references real-time climate data, monsoon cycles, crowd density, and seasonal highlights to curate top destination matches with transparent match percentages (e.g. 96% Match) and personalized match justifications.',
      technicalHighlight:
        'Evaluates travel fatigue, road conditions, and scenic viability tailored specifically to your chosen party composition.',
      highlight:
        '"Wayanad scored 96%: peak pleasant weather, low humidity, child-safe nature trails, and misty tea plantations."',
      featurePills: ['Real-Time Weather Radar', 'Curated Match Scoring', 'Monsoon & Peak Tracking', 'High-Res Destination Imagery'],
      icon: Sparkles,
    },
    {
      number: '03',
      title: '3 Smart Travel Styles & Hotel Child Policies',
      tagline: 'Relaxed Explorer • Balanced Story • Fast-Paced Highlights',
      description:
        'Instead of rigid, one-size-fits-all suggestions, Journi crafts 3 distinct travel styles. Each style features high-quality photo headers, explicit hotel child policies (complimentary stay vs extra bed rates), and transparent per-adult & per-day pricing.',
      technicalHighlight:
        'Hotel child rules are surfaced upfront so parents never encounter hidden fees or unexpected charges upon hotel check-in.',
      highlight:
        '"Misty Cloud Plantation Retreat: Boutique family cottage (4.8 ★) • Free for Child <5y • ₹14,250 per adult."',
      featurePills: ['3 Pacing Variations', 'Upfront Hotel Child Policies', 'Per-Adult Cost Breakdown', 'Compressed Visual Headers'],
      icon: Layers,
    },
    {
      number: '04',
      title: 'Your Journi Travel Plan & Sequenced Daily Story',
      tagline: 'Timed morning, afternoon & golden hour flow with local dining',
      description:
        'Every day is logically sequenced to eliminate zigzag transit and prevent travel fatigue. Discover handpicked regional dining spots for authentic meals, and use the integrated voice reader to listen to your itinerary hands-free while packing or driving.',
      technicalHighlight:
        'Curated local culinary picks feature authentic regional delicacies, family-friendly eateries, and signature dishes for every meal.',
      highlight:
        '"Day 1 Morning: Sunrise walk at Banasura Tea Trails • Lunch: Authentic Malabar Sadhya with kid-friendly steamed plantain."',
      featurePills: ['Morning-to-Night Pacing', 'Handpicked Dining Picks', 'Built-in Voice Reader (TTS)', 'Interactive Day Switcher'],
      icon: Compass,
    },
    {
      number: '05',
      title: 'Dynamic Budgeting, Packing & Scrapbook Memories',
      tagline: 'Real-time category splits, interactive checklist & Polaroid saves',
      description:
        'Take full control of your journey with the Dynamic Budget Planner (categorized into Stays, Dining, Activities, Transit, and Buffer). Check off smart packing essentials by category, and pin dream destinations to your Polaroid scrapbook to plan anytime.',
      technicalHighlight:
        'The "Plan This Trip" button on any saved destination inherits identical filter options as the home page for seamless continuity.',
      highlight:
        '"Dynamic budget breakdown: ₹12,000 Stays (42%) • ₹6,500 Dining (23%) • ₹4,000 Activities (14%) • ₹3,500 Transit • ₹2,500 Buffer."',
      featurePills: ['Dynamic Budget Allocation', 'Interactive Packing Checklist', 'Polaroid Scrapbook Pinboard', 'Direct Saved-Trip Planning'],
      icon: Wallet,
    },
  ];

  const coreFeatures = [
    {
      icon: MapPin,
      badge: 'Intelligent Scopes',
      title: 'Radius-Based Smart Scoping',
      description:
        'Choose how far you wish to venture: Within 200 km for comfortable road trips, In-State for exploring local regions, Interstate for regional travel, or Global for international wonders.',
      pills: ['Within 200km', 'In-State', 'Interstate', 'Global'],
    },
    {
      icon: Sparkles,
      badge: 'Dynamic Matching',
      title: 'Climate & Season Match Scoring',
      description:
        'Astra evaluates real-time weather conditions, monsoon windows, and cultural vibes to calculate transparent match scores and explain why a place fits your group.',
      pills: ['Weather Radar', 'Match Reasoning', 'Seasonality', 'Crowd Levels'],
    },
    {
      icon: Layers,
      badge: 'Tailored Pacing',
      title: '3 Distinct Travel Styles',
      description:
        'Select the travel rhythm that matches your energy: leisurely family escapes, well-rounded cultural journeys, or landmark-packed high-efficiency adventures.',
      pills: ['Relaxed Explorer', 'Balanced Story', 'Fast-Paced', 'Per-Adult Math'],
    },
    {
      icon: ShieldCheck,
      badge: 'Family Peace of Mind',
      title: 'Transparent Hotel Child Policies',
      description:
        'Explicit badges highlight complimentary lodging for children under 5 or clear extra-bed pricing, ensuring families know the exact financial commitment beforehand.',
      pills: ['Free Under 5y', 'No Hidden Fees', 'Extra Bed Rates', 'Family Stays'],
    },
    {
      icon: Volume2,
      badge: 'Hands-Free Audio',
      title: 'Day Sequencing & Voice Reader',
      description:
        'Morning, midday, and golden hour activities arranged to avoid rush and exhaustion. Listen to your daily schedule aloud with the built-in text-to-speech reader.',
      pills: ['TTS Voice Reader', 'Transit Pacing', 'Handpicked Dining', 'Activity Check-off'],
    },
    {
      icon: Bookmark,
      badge: 'Complete Control',
      title: 'Dynamic Budget & Polaroid Scrapbook',
      description:
        'Track Stays, Food, Activities, Transit, and Safety Buffer with real-time calculations. Pin favorite journeys to your Polaroid scrapbook and plan anytime with criteria parity.',
      pills: ['Dynamic Budget', 'Packing Checklist', 'Polaroid Scrapbook', 'Criteria Parity'],
    },
  ];

  const simulationTabs = [
    {
      label: '1. Scopes & Filter Input',
      badge: 'Step 01',
      title: 'Instinct Location & Scope Controls',
      description: 'Travelers configure their home departure point, destination distance radius, exact companions, and rhythm.',
    },
    {
      label: '2. 3 Selection Cards',
      badge: 'Step 02-03',
      title: 'High-Impact Trip Options with Child Policies',
      description: 'Review 3 distinct curated travel styles featuring photo headers, explicit child stay rules, and per-head math.',
    },
    {
      label: '3. Your Journi Plan',
      badge: 'Step 04',
      title: 'Day-by-Day Sequenced Story & Local Dining',
      description: 'Explore the daily itinerary sequenced morning-to-night, discover authentic local meals, or listen via voice narration.',
    },
    {
      label: '4. Dynamic Budget & Packing',
      badge: 'Step 05',
      title: 'Real-Time Financial Control & Travel Readiness',
      description: 'Track expenses categorized into stays, meals, activities, and transit while checking off your packing checklist.',
    },
  ];

  const faqs = [
    {
      q: 'How does the Distance & Scope filter know my location?',
      a: 'Journi analyzes your browser location and local timezone in 0ms to detect your origin (e.g., Kerala, India). When you choose "In-State", it shows destinations strictly within your state; "Within 200 km" restricts results to a comfortable weekend drive; and "Interstate" or "Global" opens broader horizons.',
    },
    {
      q: 'How are child and family costs calculated for hotels?',
      a: 'Journi factors in adults and kids under 5. For each hotel option, it checks the property child policy: properties with complimentary lodging for kids under 5 show "Free for Child <5y", while properties requiring extra beds display clear per-child rates. The dynamic budget planner scales total pack and per-person estimates accordingly.',
    },
    {
      q: 'What is the difference between the 3 Trip Styles?',
      a: 'Astra AI generates three distinct perspectives: "Relaxed Explorer" (unhurried mornings, scenic cafés, low travel fatigue, ideal for families), "Balanced Cultural Story" (the quintessential mix of famous sights and authentic neighborhood secrets), and "Fast-Paced Highlights" (maximizing photogenic landmarks and golden hour viewpoints).',
    },
    {
      q: 'Can I listen to my itinerary hands-free on the go?',
      a: 'Yes! Journi includes a built-in text-to-speech audio reader. On the itinerary page, simply tap the audio narration button to hear the day’s scheduled activities, transit tips, and local dining advice read aloud while you are driving or packing.',
    },
    {
      q: 'Can I customize the generated budget and timeline?',
      a: 'Yes! From the itinerary page, you can launch the Dynamic Budget Planner to add custom expenses, adjust category allocations, or view expenses by category (Stays, Food, Activities, Transit, Buffer). You can also toggle between days and mark completed sights anytime.',
    },
    {
      q: 'How does "Plan this trip" work from saved destinations?',
      a: 'When you save destinations to your Polaroid Scrapbook and later tap "Plan this trip", Journi opens the identical custom search criteria modal as the home page. Your selected origin, party size, travel rhythm, and budget tier carry over seamlessly.',
    },
  ];

  const currentStep = workflowSteps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. Hero Header */}
      <section className="text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF4F7A]/15 to-[#FF7A3D]/15 border border-[#FF4F7A]/30 text-[#FF4F7A] text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkle className="w-3.5 h-3.5 fill-[#FF4F7A]" />
          <span>The Journi Intelligence Platform</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#5B0B24] dark:text-[#FFF7FA] leading-[1.15]">
          How Journi Crafts Realistic,{' '}
          <span className="bg-gradient-to-r from-[#FF4F7A] via-[#FF7A3D] to-[#F59E0B] bg-clip-text text-transparent">
            Effortless Escapes
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#5B0B24]/75 dark:text-[#FF8BA7]/80 max-w-2xl mx-auto leading-relaxed">
          From origin-aware radius scopes and Astra AI taste intelligence to 3 distinct travel styles,
          transparent hotel child policies, and dynamic budget mathematics — see how every journey comes together.
        </p>

        {/* Highlight Stats Strip */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#200612] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 shadow-xs text-center">
            <span className="block text-xl sm:text-2xl font-black text-[#5B0B24] dark:text-[#FF8BA7]">0 ms</span>
            <span className="text-[11px] font-semibold text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">GPS Origin Scoping</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#200612] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 shadow-xs text-center">
            <span className="block text-xl sm:text-2xl font-black text-[#FF4F7A]">3 Styles</span>
            <span className="text-[11px] font-semibold text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">Relaxed • Balanced • Fast</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#200612] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 shadow-xs text-center">
            <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">100% Upfront</span>
            <span className="text-[11px] font-semibold text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">Hotel Child Policies</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#200612] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 shadow-xs text-center">
            <span className="block text-xl sm:text-2xl font-black text-[#FF7A3D]">Full Audio</span>
            <span className="text-[11px] font-semibold text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">TTS Itinerary Reader</span>
          </div>
        </div>
      </section>

      {/* 2. Interactive 5-Step Workflow Journey */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="sunset" size="sm">
            Step-by-Step Architecture
          </Badge>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA]">
            The 5-Stage Journi Workflow
          </h2>
          <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
            Click through any stage below to inspect how Journi constructs each phase of your trip.
          </p>
        </div>

        {/* Step Selector Horizontal Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-5xl mx-auto">
          {workflowSteps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-white dark:bg-[#280814] border-[#FF4F7A] shadow-soft scale-[1.02]'
                    : 'bg-[#FFF7FA] dark:bg-[#1a040d] border-[#5B0B24]/10 hover:border-[#FF4F7A]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-mono text-xs font-extrabold ${
                      isSelected ? 'text-[#FF4F7A]' : 'text-[#5B0B24]/50 dark:text-[#FF8BA7]/50'
                    }`}
                  >
                    {step.number}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      isSelected
                        ? 'bg-[#FF4F7A] text-white'
                        : 'bg-[#5B0B24]/8 dark:bg-white/10 text-[#5B0B24] dark:text-[#FF8BA7]'
                    }`}
                  >
                    ✓
                  </div>
                </div>
                <div
                  className={`text-xs font-bold truncate ${
                    isSelected ? 'text-[#5B0B24] dark:text-[#FFF7FA]' : 'text-[#5B0B24]/70 dark:text-[#FF8BA7]/70'
                  }`}
                >
                  {step.title.split('&')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card Showcase */}
        <div className="max-w-5xl mx-auto rounded-[28px] bg-white dark:bg-[#200612] border border-[#5B0B24]/12 dark:border-[#FF8BA7]/20 p-6 sm:p-10 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Number, Title, Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4F7A]/20 to-[#FF7A3D]/25 flex items-center justify-center text-[#FF4F7A] shadow-xs">
                  <StepIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-[#FF4F7A] tracking-wider uppercase">
                    Stage {currentStep.number} of 05
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
                    {currentStep.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#FF7A3D] font-semibold">
                {currentStep.tagline}
              </p>

              <p className="text-xs sm:text-sm text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 leading-relaxed">
                {currentStep.description}
              </p>

              {/* Technical / Under the hood box */}
              <div className="p-3.5 rounded-2xl bg-[#FFF7FA] dark:bg-[#18040c] border border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Architecture & Precision Logic:</span>
                </div>
                <p className="text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 leading-relaxed">
                  {currentStep.technicalHighlight}
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {currentStep.featurePills.map((pill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FF4F7A]/10 text-[#5B0B24] dark:text-[#FF8BA7] border border-[#FF4F7A]/20"
                  >
                    ✦ {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Live Concrete Example Box */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#FFF7FA] to-[#FFF0F4] dark:from-[#280814] dark:to-[#1a040d] border border-[#FF4F7A]/20 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#5B0B24]/8 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4F7A]">
                  Real-World Example Output
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1a030b] border border-[#5B0B24]/10 dark:border-white/10 shadow-xs">
                <p className="text-xs italic text-[#5B0B24]/85 dark:text-[#FFF7FA]/90 leading-relaxed font-serif">
                  {currentStep.highlight}
                </p>
              </div>

              <div className="space-y-2 pt-1 text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Evaluated against verified regional destination data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Eliminates guesswork with upfront financial calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Synchronized across mobile and desktop workflows</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Showcase (6 Intelligent Pillars) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="golden" size="sm">
            Core Features Deep Dive
          </Badge>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA]">
            Built with Every Traveler in Mind
          </h2>
          <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
            Journi provides total transparency, intelligent pacing, and zero hidden costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => {
            const FeatIcon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-[24px] bg-white dark:bg-[#200612] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 shadow-soft hover:shadow-hover transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4F7A]/15 to-[#FF7A3D]/20 flex items-center justify-center text-[#FF4F7A]">
                      <FeatIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF7A3D] px-2.5 py-1 rounded-full bg-[#FF7A3D]/10">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#5B0B24]/8 dark:border-white/10 flex flex-wrap gap-1.5">
                  {feat.pills.map((pill, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#5B0B24]/5 dark:bg-white/5 text-[#5B0B24]/70 dark:text-[#FF8BA7]/70"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Simulation Showcase */}
      <section className="rounded-[28px] bg-white dark:bg-[#200612] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 p-6 sm:p-12 shadow-soft space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5B0B24]/10 dark:border-white/10 pb-6">
          <div>
            <Badge variant="sunset" size="sm" className="mb-2">
              Interactive Preview
            </Badge>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA]">
              Experience the Journi Output
            </h2>
            <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-1">
              Toggle between the 4 views below to see what a generated plan looks like inside Journi.
            </p>
          </div>
          <Link href="/#plan">
            <Button variant="sunset" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Try Planner on Home
            </Button>
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {simulationTabs.map((tab, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSimTab(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSimTab === idx
                  ? 'bg-[#5B0B24] text-white shadow-soft'
                  : 'bg-[#5B0B24]/5 dark:bg-white/5 text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 0: Scopes & Filter Input */}
        {activeSimTab === 0 && (
          <div className="p-6 rounded-2xl bg-[#FFF7FA] dark:bg-[#1a040d] border border-[#5B0B24]/10 dark:border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
                📍 Detected Departure: <strong className="text-[#FF4F7A]">Kochi, Kerala (India)</strong>
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                GPS Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#250614] border-2 border-[#FF4F7A] text-center shadow-xs">
                <span className="text-base block mb-0.5">🚗</span>
                <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA]">Within 200 km</span>
                <span className="text-[10px] block text-[#FF7A3D]">Weekend Drive</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#250614] border border-[#5B0B24]/10 text-center opacity-75">
                <span className="text-base block mb-0.5">🌿</span>
                <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA]">In-State</span>
                <span className="text-[10px] block text-[#5B0B24]/60">Kerala Wide</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#250614] border border-[#5B0B24]/10 text-center opacity-75">
                <span className="text-base block mb-0.5">✈️</span>
                <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA]">Interstate</span>
                <span className="text-[10px] block text-[#5B0B24]/60">Across India</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#250614] border border-[#5B0B24]/10 text-center opacity-75">
                <span className="text-base block mb-0.5">🌐</span>
                <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA]">Global</span>
                <span className="text-[10px] block text-[#5B0B24]/60">Worldwide</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#250614] border border-[#5B0B24]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[#5B0B24] dark:text-[#FFF7FA]">Companions Configured:</span>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#5B0B24]/5 dark:bg-white/10 font-bold">2 Adults</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold">
                  1 Child (&lt;5y) • Free Stays
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#5B0B24]/5 dark:bg-white/10 font-bold">Relaxed Rhythm</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: 3 Selection Cards Preview */}
        {activeSimTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Relaxed Explorer */}
            <div className="p-4 rounded-2xl bg-[#FFF7FA] dark:bg-[#1a040d] border-2 border-[#FF4F7A] shadow-soft space-y-3">
              <div className="h-28 rounded-xl bg-gradient-to-tr from-[#5B0B24] to-[#FF4F7A] relative overflow-hidden flex items-end p-3 text-white">
                <span className="text-xs font-bold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  🌿 Relaxed Explorer
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#5B0B24] dark:text-[#FFF7FA]">Misty Plantation Hideaway</h4>
                <p className="text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">Low transit • 2 curated sights/day</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                <span>🧒 Hotel Child Policy:</span>
                <span>Free for Child &lt;5y</span>
              </div>
              <div className="pt-2 border-t border-[#5B0B24]/10 dark:border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-sm font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">₹28,500</span>
                  <span className="text-[10px] text-[#5B0B24]/60 block">₹14,250 / adult</span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-[#5B0B24] text-white text-[11px] font-bold">Selected</span>
              </div>
            </div>

            {/* Card 2: Balanced Cultural Story */}
            <div className="p-4 rounded-2xl bg-[#FFF7FA] dark:bg-[#1a040d] border border-[#5B0B24]/10 shadow-xs space-y-3 opacity-90">
              <div className="h-28 rounded-xl bg-gradient-to-tr from-[#FF7A3D] to-[#F59E0B] relative overflow-hidden flex items-end p-3 text-white">
                <span className="text-xs font-bold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  🏛️ Balanced Story
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#5B0B24] dark:text-[#FFF7FA]">Highland Heritage Trail</h4>
                <p className="text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">Iconic landmarks + local secrets</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                <span>🧒 Hotel Child Policy:</span>
                <span>Free for Child &lt;5y</span>
              </div>
              <div className="pt-2 border-t border-[#5B0B24]/10 dark:border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-sm font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">₹32,400</span>
                  <span className="text-[10px] text-[#5B0B24]/60 block">₹16,200 / adult</span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-white dark:bg-[#200612] border border-[#5B0B24]/20 text-[11px] font-bold">Preview</span>
              </div>
            </div>

            {/* Card 3: Fast-Paced Highlights */}
            <div className="p-4 rounded-2xl bg-[#FFF7FA] dark:bg-[#1a040d] border border-[#5B0B24]/10 shadow-xs space-y-3 opacity-90">
              <div className="h-28 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] relative overflow-hidden flex items-end p-3 text-white">
                <span className="text-xs font-bold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  ⚡ Fast-Paced
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#5B0B24] dark:text-[#FFF7FA]">Peak Summit Expedition</h4>
                <p className="text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">Max sights • Golden hour viewpoints</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center justify-between">
                <span>🧒 Hotel Child Policy:</span>
                <span>Extra Bed Rate</span>
              </div>
              <div className="pt-2 border-t border-[#5B0B24]/10 dark:border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-sm font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">₹35,800</span>
                  <span className="text-[10px] text-[#5B0B24]/60 block">₹17,900 / adult</span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-white dark:bg-[#200612] border border-[#5B0B24]/20 text-[11px] font-bold">Preview</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Your Journi Plan */}
        {activeSimTab === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFF5F8] dark:bg-[#1b040d] border border-[#FF4F7A]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF4F7A] text-white flex items-center justify-center shadow-xs">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
                    Voice Narration Ready
                  </h4>
                  <span className="text-[11px] text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                    Listen to Day 1 schedule hands-free while driving
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-[#5B0B24] text-white text-xs font-bold hover:bg-[#48081c] transition-all"
              >
                ▶ Play Voice Narration
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFF7FA] dark:bg-[#1a040d] border border-[#5B0B24]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF4F7A]/10 text-[#FF4F7A]">
                    🌅 08:00 AM • Morning Mist
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">Easy Trail</span>
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-[#5B0B24] dark:text-[#FFF7FA]">
                  Banasura Sagar Dam & Tea Gardens
                </h5>
                <p className="text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/75">
                  Gentle walking trail through fragrant eucalyptus tea estates with toddler-friendly golf cart rides.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF7FA] dark:bg-[#1a040d] border border-[#5B0B24]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF7A3D]/10 text-[#FF7A3D]">
                    🍽️ 01:00 PM • Handpicked Dining
                  </span>
                  <span className="text-[10px] text-[#FF7A3D] font-bold">Local Gem</span>
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-[#5B0B24] dark:text-[#FFF7FA]">
                  Traditional Kerala Sadhya at ClayHut
                </h5>
                <p className="text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/75">
                  Authentic 24-dish plantain leaf banquet featuring red rice, sweet payasam, and kid-friendly mild lentil dishes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dynamic Budget & Packing */}
        {activeSimTab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 p-5 rounded-2xl bg-[#FFF7FA] dark:bg-[#1a040d] border border-[#5B0B24]/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#5B0B24]/10 dark:border-white/10">
                <span className="font-bold text-xs sm:text-sm text-[#5B0B24] dark:text-[#FFF7FA]">
                  Dynamic Budget Breakdown
                </span>
                <span className="font-extrabold text-sm text-[#FF4F7A]">₹28,500 Total</span>
              </div>

              <div className="space-y-2">
                <div className="h-3 rounded-full bg-[#5B0B24]/10 overflow-hidden flex">
                  <div className="bg-[#5B0B24] w-[42%]" title="Stays (42%)" />
                  <div className="bg-[#FF4F7A] w-[23%]" title="Food (23%)" />
                  <div className="bg-[#FF7A3D] w-[14%]" title="Activities (14%)" />
                  <div className="bg-[#F59E0B] w-[12%]" title="Transit (12%)" />
                  <div className="bg-emerald-500 w-[9%]" title="Buffer (9%)" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] pt-1 font-semibold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                  <span>🏨 Stays: ₹12,000 (42%)</span>
                  <span>🍽️ Food: ₹6,500 (23%)</span>
                  <span>🎟️ Sights: ₹4,000 (14%)</span>
                  <span>🚕 Transit: ₹3,500 (12%)</span>
                  <span>🛡️ Buffer: ₹2,500 (9%)</span>
                  <span className="text-emerald-600">🧒 Child Stay: ₹0 Free</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 p-5 rounded-2xl bg-[#FFF7FA] dark:bg-[#1a040d] border border-[#5B0B24]/10 space-y-3">
              <span className="font-bold text-xs text-[#5B0B24] dark:text-[#FFF7FA] block">
                Interactive Packing Checklist
              </span>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#FF4F7A] focus:ring-0" />
                  <span className="line-through text-[#5B0B24]/50 dark:text-[#FF8BA7]/50">Light woolen jacket & shawl</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#FF4F7A] focus:ring-0" />
                  <span className="line-through text-[#5B0B24]/50 dark:text-[#FF8BA7]/50">Child travel stroller / baby carrier</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#FF4F7A] focus:ring-0" />
                  <span className="font-medium text-[#5B0B24] dark:text-[#FFF7FA]">Comfortable walking shoes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#FF4F7A] focus:ring-0" />
                  <span className="font-medium text-[#5B0B24] dark:text-[#FFF7FA]">Waterproof phone pouch</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Frequently Asked Questions Accordion */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="sunset" size="sm">
            Everything Explained
          </Badge>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
            Answers to key questions regarding Journi’s intelligence and itinerary flow.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#200612] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FFF7FA] pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#FF7A3D] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#5B0B24]/75 dark:text-[#FF8BA7]/80 leading-relaxed border-t border-[#5B0B24]/5 dark:border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. High-Conversion Call to Action */}
      <section className="text-center rounded-[32px] bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F4] dark:from-[#250614] dark:via-[#1c040e] dark:to-[#160309] border border-[#FF4F7A]/20 p-8 sm:p-14 shadow-soft space-y-5">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA]">
          Ready to experience effortless travel planning?
        </h2>
        <p className="text-xs sm:text-sm text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 max-w-lg mx-auto leading-relaxed">
          Launch our AI planner on the home page to turn your dream destination into a fully paced,
          budget-calculated travel reality in seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/#plan">
            <Button variant="sunset" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
              Plan Trip with AI
            </Button>
          </Link>
          <Link href="/trips">
            <Button variant="outline" size="lg">
              Explore Demo Trips
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
