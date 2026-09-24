'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Sparkles, Bookmark, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Do not show bottom nav on onboarding/splash flow
  if (pathname.startsWith('/onboarding')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/home', icon: Home },
    { label: 'Trips', href: '/trips', icon: Map },
    { label: 'AI Plan', href: '/ai', icon: Sparkles, isCenterCta: true },
    { label: 'Saved', href: '/saved', icon: Bookmark },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#280814]/95 backdrop-blur-xl border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/15 px-3 py-1 shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenterCta) {
            return (
              <div key={item.href} className="relative -top-5 flex flex-col items-center">
                <Link
                  href={item.href}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF4F7A] via-[#FF7A3D] to-[#FFC83D] flex items-center justify-center text-white shadow-sunset hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Create Trip with AI"
                >
                  <Sparkles className="w-6 h-6 stroke-[2.25]" />
                </Link>
                <span className="text-[10px] font-bold text-[#FF7A3D] mt-1 tracking-tight">
                  AI Plan
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
                isActive
                  ? 'text-[#C2185B] dark:text-[#FF8BA7]'
                  : 'text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 hover:text-[#5B0B24] dark:hover:text-[#FFF7FA]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF4F7A]" />
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
