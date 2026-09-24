'use client';

import React from 'react';
import DesktopNavbar from '@/components/navigation/DesktopNavbar';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';
import InspectorToolbar from '@/components/navigation/InspectorToolbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-[#2E0513] dark:text-[#FFF7FA] overflow-x-hidden w-full max-w-full">
      {/* Top Desktop Navigation Header (md+) */}
      <DesktopNavbar />

      {/* Main Dynamic Screen Content with mobile bottom-padding for bar */}
      <div className="flex-1 pb-20 md:pb-8">{children}</div>

      {/* Mobile Bottom Navigation Bar (<md) */}
      <MobileBottomNav />

      {/* Reviewer Inspector Toolbar */}
      <InspectorToolbar />
    </div>
  );
}
