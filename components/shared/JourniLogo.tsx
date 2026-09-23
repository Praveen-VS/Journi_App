'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface JourniLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  href?: string;
  className?: string;
  isDarkTheme?: boolean;
}

export default function JourniLogo({
  size = 'md',
  href = '/',
  className = '',
}: JourniLogoProps) {
  const dimensions = {
    sm: { width: 120, height: 60 },
    md: { width: 160, height: 80 },
    lg: { width: 220, height: 110 },
  };

  const current = dimensions[size];

  const content = (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/images/logo/journi-official-logo.png"
        alt="Journi - Every journey begins a story"
        width={current.width}
        height={current.height}
        className="object-contain h-auto transition-transform hover:scale-[1.02]"
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
