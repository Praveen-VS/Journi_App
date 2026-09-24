'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import JourniLogo from '../shared/JourniLogo';
import Button from '../ui/Button';
import { Home, Compass, Sparkles, Map, Bookmark, Settings } from 'lucide-react';

export default function DesktopNavbar() {
  const pathname = usePathname();

  // Primary navigation links in logical user order (Plan with AI removed; accessed via Home AI Console)
  const navLinks = [
    { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Destinations', href: '/destinations', icon: <Compass className="w-4 h-4" /> },
    { label: 'How It Works', href: '/how-it-works', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'My Trips', href: '/trips', icon: <Map className="w-4 h-4" /> },
    { label: 'Saved Places', href: '/saved', icon: <Bookmark className="w-4 h-4" /> },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-40 w-full glass-panel border-b border-[#5B0B24]/8 dark:border-[#FF8BA7]/15">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <JourniLogo size="md" showTagline />

        {/* Primary Navigation Links (Max 5 items) */}
        <nav className="flex items-center gap-1.5" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? (pathname === '/' || pathname === '/home') : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF4F7A]/12 to-[#FF7A3D]/12 text-[#C2185B] dark:text-[#FF8BA7] border border-[#FF4F7A]/25'
                    : 'text-[#5B0B24]/75 dark:text-[#FF8BA7]/75 hover:text-[#5B0B24] dark:hover:text-white hover:bg-[#5B0B24]/4 dark:hover:bg-[#FF8BA7]/10'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Account Links */}
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/5 dark:hover:bg-[#FF8BA7]/10 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF4F7A] to-[#FF7A3D] text-white flex items-center justify-center shadow-soft hover:opacity-90 transition-opacity font-bold text-xs"
            aria-label="User Profile"
          >
            ER
          </Link>

          <Link href="/#plan">
            <Button variant="sunset" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Plan Trip
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
