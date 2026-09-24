import React from 'react';
import DesktopNavbar from '@/components/navigation/DesktopNavbar';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';
import InspectorToolbar from '@/components/navigation/InspectorToolbar';
import Link from 'next/link';
import JourniLogo from '@/components/shared/JourniLogo';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-[#2E0513] dark:text-[#FFF7FA]">
      {/* Desktop Navigation */}
      <DesktopNavbar />

      {/* Clean Mobile Public Header */}
      <header className="md:hidden sticky top-0 z-30 w-full bg-white/90 dark:bg-[#280814]/90 backdrop-blur-md border-b border-[#5B0B24]/8 px-4 h-14 flex items-center justify-between">
        <JourniLogo size="sm" />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-xs font-semibold text-[#5B0B24] dark:text-[#FF8BA7] px-3 py-1.5 rounded-full hover:bg-[#5B0B24]/5"
          >
            Sign In
          </Link>
          <Link
            href="/ai"
            className="text-xs font-semibold text-white bg-gradient-to-r from-[#FF4F7A] to-[#FF7A3D] px-3 py-1.5 rounded-full shadow-sunset"
          >
            Plan Trip
          </Link>
        </div>
      </header>

      {/* Main Public Content */}
      <div className="flex-1 pb-16 md:pb-0">{children}</div>

      {/* Mobile Bottom Navigation Bar (<md) */}
      <MobileBottomNav />

      {/* Reviewer Inspector Toolbar */}
      <InspectorToolbar />

      {/* Public Footer */}
      <footer className="w-full border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 py-12 px-6 bg-white/40 dark:bg-[#280814]/40 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
          <div className="flex flex-col items-center md:items-start gap-2">
            <JourniLogo size="sm" showTagline />
            <p className="max-w-xs text-center md:text-left mt-1 text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
              AI-first travel planner transforming natural language dreams into memorable itineraries.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <Link href="/destinations" className="hover:text-[#5B0B24] dark:hover:text-white transition-colors">
              Destinations
            </Link>
            <Link href="/how-it-works" className="hover:text-[#5B0B24] dark:hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/ai" className="hover:text-[#5B0B24] dark:hover:text-white transition-colors">
              AI Planner
            </Link>
            <Link href="/login" className="hover:text-[#5B0B24] dark:hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="hover:text-[#5B0B24] dark:hover:text-white transition-colors">
              Get Started
            </Link>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50">
            <p>© {new Date().getFullYear()} Journi. All rights reserved.</p>
            <p className="mt-0.5">Every journey begins a story.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
