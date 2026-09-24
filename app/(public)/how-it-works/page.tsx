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
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'Location Scope & Taste Profiling',
      tagline: 'Instant GPS detection & travel party configuration',
      description:
        'Journi automatically detects your location (e.g. seated in Kerala, India) and tailors recommendations to your desired radius: Within 200 km, In-State, Interstate, or International. Configure your travel party with exact adults and children under 5.',
      icon: MapPin,
      highlight: '"Looking for peaceful hill retreats in-state for 2 adults and 1 child with scenic views and local culinary stops."',
    },
    {
      number: '02',
      title: 'Astra 6 Curates 1,680+ Destinations',
      tagline: 'Deep match scoring across verified catalogs',
      description:
        'Our Astra 6 AI engine analyzes real-world climate, peak vs pleasant seasons, historical landmarks, and regional dining culture across 1,680+ destinations to present your top 4 to 8 tailored matches with transparent match reasons.',
      icon: Sparkles,
      highlight: 'Matches evaluated for current weather, authentic local foods, and travel comfort for your party.',
    },
    {
      number: '03',
      title: '3 Smart Travel Styles & Hotel Child Policies',
      tagline: 'Relaxed Explorer • Balanced Story • Fast-Paced Highlights',
      description:
        'Pick from 3 distinct itinerary variants crafted by Astra 6. Every style includes total pack pricing, transparent per-person breakdowns, curated stay recommendations, and explicit hotel child policies (free stays vs chargeable extra beds).',
      icon: Layers,
      highlight: 'Clear hotel child policies displayed upfront: free child stays in boutique homestays or standard extra bed rates.',
    },
    {
      number: '04',
      title: 'Day-by-Day Story & Dynamic Budget',
      tagline: 'Timed morning, afternoon & golden hour pacing',
      description:
        'Every day is sequenced to prevent travel fatigue. Hear your plan aloud with built-in voice narration, discover nearby authentic dining, or open the Dynamic Budget Planner to track stays, dining, activities, transit, and buffer.',
      icon: Compass,
      highlight: 'Full audio narration, interactive budget allocation math, and one-click back navigation.',
    },
  ];

  const faqs = [
    {
      q: 'How does the Distance & Scope filter know my location?',
      a: 'Journi analyzes your current timezone and browser location in 0ms to detect your origin (e.g., Kerala, India). When you choose "In-State", it shows destinations strictly within your state; "Within 200 km" restricts results to a comfortable weekend drive; and "Interstate" or "International" opens broader horizons.',
    },
    {
      q: 'How are child and family costs calculated in hotels?',
      a: 'Journi factors in adults and kids under 5. For each hotel option, it checks the property child policy: properties with complimentary lodging for kids under 5 show "Free for Child", while properties requiring extra beds display clear per-child rates. The dynamic budget planner scales total pack and per-person estimates accordingly.',
    },
    {
      q: 'What is the difference between the 3 Trip Styles?',
      a: 'Astra 6 generates three distinct perspectives: "Relaxed Explorer" (unhurried mornings, scenic cafés, low travel fatigue), "Balanced Cultural Story" (the quintessential mix of famous sights and authentic neighborhood secrets), and "Fast-Paced Highlights" (maximizing photogenic landmarks and golden hour viewpoints).',
    },
    {
      q: 'Can I customize the generated budget and timeline?',
      a: 'Yes! From the itinerary page, you can launch the Dynamic Budget Planner to add custom expenses, adjust category allocations, or view expenses by category (Stays, Food, Activities, Transit, Buffer). You can also toggle between days and listen to the voice reader anytime.',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="sunset" size="md" className="mb-4 shadow-soft">
          Intelligent & Transparent
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#5B0B24] dark:text-[#FFF7FA] mb-4">
          How Journi Crafts Your Trip
        </h1>
        <p className="text-sm sm:text-base text-[#5B0B24]/75 dark:text-[#FF8BA7]/80 leading-relaxed">
          Journi transforms travel intent into complete, realistic journeys with localized scopes,
          child-friendly stay policies, and dynamic budget mathematics.
        </p>
      </div>

      {/* 4 Interactive Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === idx;
          return (
            <Card
              key={step.number}
              variant={isSelected ? 'elevated' : 'subtle'}
              isInteractive
              onClick={() => setActiveStep(idx)}
              className={`p-6 flex flex-col justify-between border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#FF4F7A] shadow-hover bg-white dark:bg-[#280814]'
                  : 'border-transparent hover:border-[#5B0B24]/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#FF4F7A]">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF4F7A]/15 to-[#FF7A3D]/20 flex items-center justify-center text-[#FF4F7A]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#5B0B24] dark:text-[#FF8BA7] mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-[#FF7A3D] font-medium mb-3">
                  {step.tagline}
                </p>
                <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 text-[11px] italic text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 bg-[#FFF7FA] dark:bg-[#1f060f] p-2.5 rounded-[14px]">
                {step.highlight}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Interactive Simulation: Live Sample Generated Experience */}
      <section className="rounded-[28px] bg-white dark:bg-[#280814] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 p-6 sm:p-12 shadow-soft mb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge variant="golden" size="sm" className="mb-2">
                Live Sample Output
              </Badge>
              <h2 className="text-xl sm:text-3xl font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                What a Journi Generated Plan Looks Like
              </h2>
            </div>
            <Link href="/#plan">
              <Button variant="sunset" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Plan with AI on Home
              </Button>
            </Link>
          </div>

          {/* Filter Preferences Strip Simulation */}
          <div className="rounded-2xl bg-[#FFF5F8] dark:bg-[#1e050f] border border-[#FF4F7A]/20 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#FF7A3D]" />
              <span className="font-bold text-[#5B0B24] dark:text-[#FFF7FA]">Selected Preferences:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#5B0B24]/80 dark:text-[#FF8BA7]">
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#280814] border border-[#5B0B24]/10">📍 In-State (Kerala)</span>
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#280814] border border-[#5B0B24]/10">📅 5 Days</span>
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#280814] border border-[#5B0B24]/10">👨‍👩‍👧 2 Adults, 1 Child (&lt;5y)</span>
              <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#280814] border border-[#5B0B24]/10">💰 Moderate (₹28,500 Total)</span>
            </div>
          </div>

          {/* Sample Generated Itinerary Card Simulation */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-[#FFF7FA] dark:bg-[#19050C] border border-[#5B0B24]/8 dark:border-[#FF8BA7]/15 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#5B0B24]/8 dark:border-[#FF8BA7]/12">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm sm:text-base text-[#5B0B24] dark:text-[#FF8BA7]">
                  Wayanad Highlands: 5-Day Relaxed Explorer
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                <span>₹28,500 Total Pack</span> • <span>₹14,250 / Head</span> • <span>Child Stay Free</span>
              </div>
            </div>

            {/* Hotel with Child Policy Highlight */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#240614] border border-[#FF4F7A]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#5B0B24]/10 dark:bg-white/10 text-[#5B0B24] dark:text-[#FF8BA7] flex items-center justify-center">
                  <Hotel className="w-5 h-5 text-[#FF7A3D]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
                    Misty Cloud Plantation Retreat
                  </h4>
                  <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                    Boutique family cottage • 4.8 ★
                  </span>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                🧒 Free for Child &lt;5y
              </span>
            </div>

            {/* Timeline Activities Sample */}
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-[18px] bg-white dark:bg-[#280814] shadow-xs flex items-start gap-3">
                <span className="text-xs font-bold text-[#FF4F7A] bg-[#FF4F7A]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                  07:30 AM
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                    Sunrise Stroll through Banasura Tea Trails
                  </h4>
                  <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-0.5">
                    Gentle morning mist walk along easy walking trails suitable for toddlers and families.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-[18px] bg-white dark:bg-[#280814] shadow-xs flex items-start gap-3">
                <span className="text-xs font-bold text-[#FF7A3D] bg-[#FF7A3D]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                  01:00 PM
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                    Traditional Kerala Sadhya at ClayHut
                  </h4>
                  <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-0.5">
                    Authentic regional Malabar dining with red rice, avial, and kid-friendly steamed plantain snacks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="max-w-4xl mx-auto mb-16 space-y-4">
        <div className="text-center mb-8">
          <Badge variant="sunset" size="sm" className="mb-2">
            Clear Answers
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#5B0B24] dark:text-[#FFF7FA]">
            Frequently Asked Questions
          </h2>
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

      {/* Bottom Call to Action */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#5B0B24] dark:text-[#FF8BA7]">
          Ready to experience effortless travel planning?
        </h2>
        <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 max-w-md mx-auto">
          Try the AI Planner right from the home page or browse through 1,680+ curated destinations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/#plan">
            <Button variant="sunset" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
              Plan Trip with AI
            </Button>
          </Link>
          <Link href="/destinations">
            <Button variant="secondary" size="lg" leftIcon={<Compass className="w-5 h-5" />}>
              Explore Destinations
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
