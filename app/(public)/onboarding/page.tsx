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
      router.push('/home');
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
        className="fixed inset-0 z-50 w-full h-full flex flex-col items-center justify-between p-6 cursor-pointer overflow-hidden select-none bg-[#1F060F]"
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
    <main className="fixed inset-0 z-30 w-full h-full flex flex-col justify-between overflow-hidden select-none bg-[#FFF7FA] dark:bg-[#1A030C]">
      {/* Background Hero Stage */}
      <div className="relative flex-1 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6 pb-6">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 1.05 }}
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
              {/* Cinematic gradient overlay for pristine contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Header Bar */}
        <header className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto pt-1 sm:pt-2">
          <div className="bg-white/85 dark:bg-black/60 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-md border border-white/40">
            <JourniLogo size="sm" />
          </div>

          <Link
            href="/home"
            className="text-xs sm:text-sm font-semibold text-white drop-shadow-md hover:text-white bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 transition-all hover:bg-black/50 active:scale-95"
          >
            Skip
          </Link>
        </header>

        {/* Step Indicator & Headings Overlay */}
        <div className="relative z-20 max-w-lg mt-auto pb-2 sm:pb-4">
          <div className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-white bg-gradient-to-r from-[#FF4F7A]/90 to-[#FF7A3D]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-md mb-2">
            STEP {currentStep} OF 3
          </div>

          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                Discover <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A3D] via-[#FFC83D] to-[#FFF0A0]">
                  Amazing Places
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium max-w-sm mt-1 drop-shadow-md leading-relaxed">
                Explore breathtaking destinations crafted for your travel rhythm.
              </p>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                Plan Your Trip <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4F7A] via-[#FF7A3D] to-[#FFC83D]">
                  with AI
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium max-w-sm mt-1 drop-shadow-md leading-relaxed">
                Personalized itineraries, smart INR budgets, and local secrets in seconds.
              </p>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                Save Every <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4F7A] via-[#FF7A3D] to-[#FFC83D]">
                  Journey
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium max-w-sm mt-1 drop-shadow-md leading-relaxed">
                Keep your dream places, trips, and memories forever in one place.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Sheet Container (M02 / M03 / M04) */}
      <div className="relative z-30 w-full max-w-md mx-auto sm:max-w-2xl bg-white/95 dark:bg-[#200612]/95 backdrop-blur-xl rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_40px_rgba(62,7,23,0.15)] border-t border-[#FF4F7A]/20 p-4 sm:p-6 pb-20 sm:pb-22 shrink-0 flex flex-col justify-between">
        {/* Content specific to current step */}
        <div className="mb-4">
          {/* M02: 4 Category Boxes */}
          {currentStep === 1 && (
            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                type="button"
                onClick={() => router.push('/home?landscape=mountains')}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#FFE5EC] to-[#FFD0DE] text-[#C2185B] flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
                  <Mountain className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block group-hover:text-[#FF4F7A] transition-colors">
                  Mountains
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Find peace
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/home?landscape=beaches')}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#FFF2E2] to-[#FFE0C2] text-[#FF7A3D] flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
                  <Palmtree className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block group-hover:text-[#FF7A3D] transition-colors">
                  Beaches
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Feel breeze
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/home?landscape=metropolis')}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#F3E8FF] to-[#E5CCFF] text-[#9333EA] flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
                  <Building2 className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block group-hover:text-[#9333EA] transition-colors">
                  Cities
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Live culture
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/home?landscape=nature')}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#E6F4EA] to-[#C8ECD1] text-[#0D9488] flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
                  <Trees className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block group-hover:text-[#0D9488] transition-colors">
                  Nature
                </span>
                <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
                  Reconnect
                </span>
              </button>
            </div>
          )}

          {/* M03: 3 Feature Boxes */}
          {currentStep === 2 && (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
              <div className="flex flex-col items-center p-2 rounded-2xl bg-[#FFF5F8] dark:bg-white/5 border border-[#FF4F7A]/15">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#FFE5EC] text-[#FF4F7A] flex items-center justify-center mb-1.5 shadow-sm">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Personalized
                </span>
                <span className="text-[10px] text-[#5B0B24]/65 dark:text-[#FF8BA7]/65">
                  Tailored to you
                </span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-2xl bg-[#FFF9F5] dark:bg-white/5 border border-[#FF7A3D]/15">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF2E2] text-[#FF7A3D] flex items-center justify-center mb-1.5 shadow-sm">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Fast & Easy
                </span>
                <span className="text-[10px] text-[#5B0B24]/65 dark:text-[#FF8BA7]/65">
                  Plans in seconds
                </span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-2xl bg-[#FCF8FF] dark:bg-white/5 border border-[#9333EA]/15">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-1.5 shadow-sm">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Smart INR
                </span>
                <span className="text-[10px] text-[#5B0B24]/65 dark:text-[#FF8BA7]/65">
                  Live cost math
                </span>
              </div>
            </div>
          )}

          {/* M04: 3 Feature Boxes */}
          {currentStep === 3 && (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
              <div className="flex flex-col items-center p-2 rounded-2xl bg-[#FFF5F8] dark:bg-white/5 border border-[#FF4F7A]/15">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#FFE5EC] text-[#FF4F7A] flex items-center justify-center mb-1.5 shadow-sm">
                  <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Save Places
                </span>
                <span className="text-[10px] text-[#5B0B24]/65 dark:text-[#FF8BA7]/65">
                  Keep favorites
                </span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-2xl bg-[#FCF8FF] dark:bg-white/5 border border-[#9333EA]/15">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-1.5 shadow-sm">
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Scrapbook
                </span>
                <span className="text-[10px] text-[#5B0B24]/65 dark:text-[#FF8BA7]/65">
                  Photos & notes
                </span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-2xl bg-[#F4FBF7] dark:bg-white/5 border border-[#0D9488]/15">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#E6F4EA] text-[#0D9488] flex items-center justify-center mb-1.5 shadow-sm">
                  <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs font-bold text-[#5B0B24] dark:text-[#FFF7FA] block">
                  Cloud Sync
                </span>
                <span className="text-[10px] text-[#5B0B24]/65 dark:text-[#FF8BA7]/65">
                  Always with you
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Row: Back Circle, Dots, Next Button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#5B0B24]/8 dark:border-white/10">
          {/* Back Button (Only on Step 2 and 3) */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-11 h-11 rounded-full bg-[#FFE5EC] dark:bg-white/10 text-[#FF4F7A] flex items-center justify-center hover:bg-[#FFD4E1] active:scale-95 transition-all focus-visible:outline-none"
              aria-label="Previous Step"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-11 h-11" />
          )}

          {/* 3 Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((stepNum) => (
              <button
                key={stepNum}
                type="button"
                onClick={() => setCurrentStep(stepNum)}
                aria-label={`Go to step ${stepNum}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === stepNum
                    ? 'w-7 bg-gradient-to-r from-[#FF4F7A] via-[#E91E63] to-[#FF7A3D] shadow-sm'
                    : 'w-2 bg-[#5B0B24]/20 dark:bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Next / Get Started Arrow Circle or Wide Button */}
          {currentStep === 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF4F7A] via-[#E91E63] to-[#FF7A3D] text-white font-extrabold text-xs shadow-lg shadow-[#FF4F7A]/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-[#FF4F7A] via-[#E91E63] to-[#FF7A3D] text-white flex items-center justify-center shadow-md shadow-[#FF4F7A]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Next Step"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
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
