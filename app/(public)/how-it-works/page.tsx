'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  MessageSquareHeart,
  Sparkles,
  Sliders,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Describe Your Dream in Natural Words',
      tagline: 'No rigid dropdowns or endless forms',
      description:
        'Simply write like you are talking to a seasoned travel companion. Mention your dream destinations, preferred pace (relaxed vs packed), travel party (solo, couple, family), or special interests like historic architecture, specialty cafes, or scenic hikes.',
      icon: MessageSquareHeart,
      highlight: '"Plan 5 days in Kyoto for a couple seeking quiet morning temples and artisan matcha spots."',
    },
    {
      number: '02',
      title: 'AI Sequences Every Hour Intelligently',
      tagline: 'Balanced morning, afternoon & golden hour pacing',
      description:
        'Journi evaluates opening hours, geographic proximity, realistic transit routes, and crowd patterns to build an organic day-wise timeline. It prevents travel exhaustion and leaves space for spontaneous discoveries.',
      icon: Sparkles,
      highlight: 'Morning in Arashiyama at dawn, midday garden tofu lunch, sunset walk over Togetsukyo Bridge.',
    },
    {
      number: '03',
      title: 'Seamless Budget, Packing & Weather',
      tagline: 'All logistics automatically synchronized',
      description:
        'Your itinerary dynamically connects with estimated budgets (accommodations, dining, tickets), seasonal weather forecasts, and interactive packing checklists customized to your activities.',
      icon: Sliders,
      highlight: 'Real-time category spending gauges and climate-tailored packing reminders.',
    },
    {
      number: '04',
      title: 'Travel with Confidence Everywhere',
      tagline: 'Save places, read itinerary audio, offline ready',
      description:
        'Keep your trip stored in your pocket. Listen to your daily plan using the built-in "Read Itinerary" voice audio, pin favorite spots, and navigate smoothly without distraction.',
      icon: Compass,
      highlight: 'High-contrast accessible views, clean edge-to-edge UI, and text-to-speech audio support.',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="sunset" size="md" className="mb-4 shadow-soft">
          Simple & Intelligent
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#5B0B24] dark:text-[#FFF7FA] mb-4">
          How Journi Crafts Your Trip
        </h1>
        <p className="text-sm sm:text-base text-[#5B0B24]/75 dark:text-[#FF8BA7]/80 leading-relaxed">
          Journi bridges the gap between boundless travel imagination and real-world logistics.
          Here is how natural language becomes a finished trip story in seconds.
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
              className={`p-6 flex flex-col justify-between border-2 transition-all ${
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

      {/* Interactive Playground Simulation */}
      <section className="rounded-[28px] bg-white dark:bg-[#280814] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 p-6 sm:p-12 shadow-soft mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="golden" size="sm" className="mb-2">
                Live Sample Output
              </Badge>
              <h2 className="text-xl sm:text-3xl font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                What a Journi Output Looks Like
              </h2>
            </div>
            <Link href="/ai">
              <Button variant="sunset" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Create Your Own Trip
              </Button>
            </Link>
          </div>

          {/* Sample Generated Itinerary Card Simulation */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-[#FFF7FA] dark:bg-[#19050C] border border-[#5B0B24]/8 dark:border-[#FF8BA7]/15">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm sm:text-base text-[#5B0B24] dark:text-[#FF8BA7]">
                  Kyoto Autumn: 5-Day Cultural & Zen Journey
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                <span>5 Days</span> • <span>₹1,54,000 Budget</span> • <span>Balanced Pace</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-[18px] bg-white dark:bg-[#280814] shadow-sm flex items-start gap-3">
                <span className="text-xs font-bold text-[#FF4F7A] bg-[#FF4F7A]/10 px-2 py-1 rounded-full whitespace-nowrap">
                  07:30 AM
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                    Arashiyama Bamboo Grove at Dawn
                  </h4>
                  <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-0.5">
                    Avoid mid-day crowds by arriving early. Sunlight filters gently through the stalks.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-[18px] bg-white dark:bg-[#280814] shadow-sm flex items-start gap-3">
                <span className="text-xs font-bold text-[#FF7A3D] bg-[#FF7A3D]/10 px-2 py-1 rounded-full whitespace-nowrap">
                  12:30 PM
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-[#FF8BA7]">
                    Garden Yudofu Lunch at Seizan Sodo
                  </h4>
                  <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mt-0.5">
                    Silken tofu hot pot in a quiet temple garden courtyard. ~₹2,500 per person.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#5B0B24] dark:text-[#FF8BA7] mb-4">
          Ready to tell your travel story?
        </h2>
        <Link href="/ai">
          <Button variant="sunset" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
            Start Free with AI Planner
          </Button>
        </Link>
      </div>
    </main>
  );
}
