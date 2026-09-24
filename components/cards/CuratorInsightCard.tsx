import React from 'react';
import { Compass, Lightbulb, Sparkles, MapPin } from 'lucide-react';

interface CuratorInsightCardProps {
  destination: string;
  country?: string;
  insight: string;
  companion?: string;
  budgetTier?: string;
}

export function CuratorInsightCard({
  destination,
  country,
  insight,
  companion,
  budgetTier,
}: CuratorInsightCardProps) {
  if (!insight) return null;

  // Detect "One note:" or "Note:" to highlight as a dedicated advice callout
  const noteMatch = insight.match(/(?:one note|note|insider tip|tip):\s*([^.]+?\.[^.]*|\S.*)/i);
  const mainInsight = noteMatch ? insight.replace(noteMatch[0], '').trim() : insight;
  const advisoryNote = noteMatch ? noteMatch[1].trim() : null;

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#FFF9F6] via-[#FFF2F5] to-[#FFF7EC] dark:from-[#2B0A18] dark:via-[#220713] dark:to-[#33110E] border-2 border-[#FF7A3D]/30 dark:border-[#FF7A3D]/40 p-5 sm:p-7 shadow-lg shadow-[#FF7A3D]/5">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#FF7A3D]/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-radial from-[#FF4F7A]/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF7A3D] to-[#FF4F7A] text-white text-xs font-black tracking-wide shadow-sm uppercase">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Curator Travel Intelligence</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#5B0B24]/70 dark:text-[#FFB3C6]/80">
          <MapPin className="w-3.5 h-3.5 text-[#FF7A3D]" />
          <span>{destination}{country ? `, ${country}` : ''}</span>
          {companion && (
            <>
              <span>•</span>
              <span className="capitalize">{companion}</span>
            </>
          )}
          {budgetTier && (
            <>
              <span>•</span>
              <span className="capitalize">{budgetTier}</span>
            </>
          )}
        </div>
      </div>

      {/* Primary Narrative Insight */}
      <div className="relative z-10 space-y-3">
        <p className="text-sm sm:text-base font-medium text-[#3E0717] dark:text-[#FFF5F8] leading-relaxed">
          {mainInsight}
        </p>

        {/* Highlighted Special Advisory Callout if present */}
        {advisoryNote && (
          <div className="mt-3.5 flex items-start gap-3 p-3.5 sm:p-4 rounded-[18px] bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 dark:border-amber-400/30 backdrop-blur-xs">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                Crucial Local Insight:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-100 leading-snug">
                {advisoryNote}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Subtle Signature */}
      <div className="relative z-10 mt-4 pt-3 border-t border-[#5B0B24]/10 dark:border-white/10 flex items-center justify-between text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#FF7A3D]" />
          <span>Tailored by GPT 6 Astra with Real-Time Destination Nuances</span>
        </span>
      </div>
    </div>
  );
}
