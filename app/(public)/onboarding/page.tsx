'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import JourniLogo from '@/components/shared/JourniLogo';
import {
  Mountain,
  Palmtree,
  Building2,
  Trees,
  Sparkles,
  Zap,
  Heart,
  Bookmark,
  Image as ImageIcon,
  Cloud,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStepParam = searchParams.get('step');
  
  // 0: Splash (M01), 1: Discover (M02), 2: AI Plan (M03), 3: Save (M04)
  const [currentStep, setCurrentStep] = useState(
    initialStepParam !== null ? parseInt(initialStepParam, 10) : 0
  );

  // Auto-advance splash screen to Step 1 after 2.8 seconds
  useEffect(() => {
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push('/login');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  // M01: Fullscreen Splash Screen
  if (currentStep === 0) {
    return (
      <main
        onClick={() => setCurrentStep(1)}
        className="fixed inset-0 z-40 w-full h-full flex flex-col items-center justify-between p-6 cursor-pointer overflow-hidden select-none bg-[#1F060F]"
      >
        {/* Background Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/onboarding/m01-splash-bg.png"
            alt="Journi Sunset Road Background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Top Spacer */}
        <div className="relative z-10 pt-12" />

        {/* Center Monogram & Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center text-center max-w-sm"
        >
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <JourniLogo size="lg" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/90 font-semibold mt-4 drop-shadow-md">
            Every journey begins a story
          </p>
        </motion.div>

        {/* Bottom Loading Indicator & Brand Tag */}
        <div className="relative z-10 flex flex-col items-center pb-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-white/30 border-t-[#FF4F7A] animate-spin flex items-center justify-center shadow-lg" />
            <span className="text-xs font-medium text-white/90 tracking-wide drop-shadow-md">
              Crafting amazing journeys...
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.25em] text-white/80 uppercase">
            <div className="w-12 h-px bg-white/40" />
            <span>Travel • Discover • Belong</span>
            <div className="w-12 h-px bg-white/40" />
          </div>
        </div>
      </main>
    );
  }

  // M02, M03, M04: Interactive Onboarding Flow
  return (
    <main className="fixed inset-0 z-40 w-full h-full flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none bg-[#FFF7FA]">
      {/* Background Hero Stage */}
      <div className="absolute top-0 inset-x-0 h-[62%] sm:h-[65%] z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <Image
              src={
                currentStep === 1
                  ? '/images/onboarding/m02-discover-bg.png'
                  : currentStep === 2
                  ? '/images/onboarding/m03-ai-bg.png'
                  : '/images/onboarding/m04-save-bg.png'
              }
              alt="Journi Travel Scene"
              fill
              priority
              className="object-cover object-top sm:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40 sm:to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Top Header Bar */}
        <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-sm border border-white/40">
            <JourniLogo size="sm" />
          </div>

          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-white/95 drop-shadow-md hover:text-white bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 transition-all hover:bg-black/40"
          >
            Skip
          </Link>
        </header>

        {/* Step Indicator & Headings Overlay for Mobile / Desktop */}
        <div className="absolute top-20 sm:top-24 left-4 sm:left-12 z-20 max-w-lg">
          <div className="inline-block text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C2185B] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm mb-2">
            STEP {currentStep} OF 3
          </div>

          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#5B0B24] drop-shadow-sm leading-tight">
                Discover <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D]">
                  Amazing Places
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5B0B24]/90 font-medium max-w-sm mt-1 drop-shadow-sm bg-white/40 backdrop-blur-xs p-1.5 rounded-lg inline-block">
                Explore breathtaking destinations crafted for your travel style.
              </p>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#5B0B24] drop-shadow-sm leading-tight">
                Plan Your Trip <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D]">
                  with AI
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5B0B24]/90 font-medium max-w-sm mt-1 drop-shadow-sm bg-white/40 backdrop-blur-xs p-1.5 rounded-lg inline-block">
                Get personalized itineraries, budget plans and smart recommendations in seconds.
              </p>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#5B0B24] drop-shadow-sm leading-tight">
                Save Every <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D]">
                  Journey
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5B0B24]/90 font-medium max-w-sm mt-1 drop-shadow-sm bg-white/40 backdrop-blur-xs p-1.5 rounded-lg inline-block">
                Keep your favorite places, trips and memories — all in one place.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Spacer to push Bottom Sheet */}
      <div className="h-[52vh] sm:h-[55vh]" />

      {/* Bottom Sheet Container (M02 / M03 / M04) */}
      <div className="relative z-30 w-full max-w-md mx-auto sm:max-w-2xl bg-white dark:bg-[#280814] rounded-t-[36px] shadow-2xl p-6 sm:p-8 flex flex-col justify-between border-t border-[#5B0B24]/8">
        {/* Content specific to current step */}
        <div className="mb-6">
          {/* M02: 4 Category Boxes */}
          {currentStep === 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#FFE5EC] text-[#FF4F7A] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Mountain className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Mountains
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Find peace
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#FFF2E2] text-[#FF7A3D] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Palmtree className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Beaches
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Feel breeze
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Cities
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Live culture
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#E6F4EA] text-[#0D9488] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Trees className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Nature
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Reconnect
                </span>
              </div>
            </div>
          )}

          {/* M03: 3 Feature Boxes */}
          {currentStep === 2 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#FFE5EC] text-[#FF4F7A] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Personalized
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Trips tailored for you
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#FFF2E2] text-[#FF7A3D] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Fast & Easy
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Plans in seconds
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Better Choices
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Curated by AI
                </span>
              </div>
            </div>
          )}

          {/* M04: 3 Feature Boxes */}
          {currentStep === 3 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#FFE5EC] text-[#FF4F7A] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Bookmark className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Save Places
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Keep favorites
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Organize Trips
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  All in one place
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#E6F4EA] text-[#0D9488] flex items-center justify-center mb-2 shadow-soft hover:scale-105 transition-transform">
                  <Cloud className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Access Anywhere
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Always with you
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Row: Back Circle, Dots, Next Circle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#5B0B24]/5">
          {/* Back Button (Only on Step 2 and 3) */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-[#FFE5EC] text-[#FF4F7A] flex items-center justify-center hover:bg-[#FFD4E1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F7A]"
              aria-label="Previous Step"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-12 h-12" />
          )}

          {/* 3 Pagination Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNum) => (
              <button
                key={stepNum}
                type="button"
                onClick={() => setCurrentStep(stepNum)}
                aria-label={`Go to step ${stepNum}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentStep === stepNum
                    ? 'w-7 bg-gradient-to-r from-[#FF4F7A] to-[#C2185B]'
                    : 'w-2.5 bg-[#5B0B24]/20 dark:bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Next / Get Started Arrow Circle */}
          <button
            type="button"
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF4F7A] via-[#FF7A3D] to-[#C2185B] text-white flex items-center justify-center shadow-lg shadow-[#FF4F7A]/30 hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F7A]"
            aria-label={currentStep === 3 ? 'Get Started' : 'Next Step'}
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF7FA]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF4F7A]" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
