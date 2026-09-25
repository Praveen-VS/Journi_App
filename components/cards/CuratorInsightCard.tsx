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
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#FFF9F6] via-[#FFF2F5] to-[#FFFBF5] dark:from-[#2B0A18] dark:via-[#200713] dark:to-[#2F100B] border-2 border-[#FF7A3D]/35 dark:border-[#FF7A3D]/45 p-5 sm:p-6 shadow-[0_6px_24px_rgba(255,122,61,0.07)]">
      {/* Background Decorative Ambient Radial Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-[#FF7A3D]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-radial from-[#FF4F7A]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Badges Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF7A3D] via-[#FF5B48] to-[#FF4F7A] text-white text-[11px] font-black tracking-wider shadow-xs uppercase">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Curator Travel Intelligence</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-black/45 border border-[#FF7A3D]/25 dark:border-[#FF7A3D]/35 text-[11px] font-bold text-[#5B0B24] dark:text-[#FFB3C6] shadow-2xs backdrop-blur-xs">
          <MapPin className="w-3.5 h-3.5 text-[#FF7A3D]" />
          <span>{destination}{country ? `, ${country}` : ''}</span>
          {companion && (
            <>
              <span className="text-[#FF7A3D]">•</span>
              <span className="capitalize">{companion}</span>
            </>
          )}
          {budgetTier && (
            <>
              <span className="text-[#FF7A3D]">•</span>
              <span className="capitalize">{budgetTier}</span>
            </>
          )}
        </div>
      </div>

      {/* Primary Narrative Insight with Magazine Accent Line */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-start gap-3 sm:gap-3.5">
          <div className="w-1.5 self-stretch rounded-full bg-gradient-to-b from-[#FF7A3D] via-[#FF4F7A] to-transparent shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base font-semibold text-[#2E0513] dark:text-[#FFF7FA] leading-relaxed">
            {mainInsight}
          </p>
        </div>

        {/* Highlighted Special Advisory Callout if present */}
        {advisoryNote && (
          <div className="mt-3.5 flex items-start gap-3 p-3.5 sm:p-4 rounded-[18px] bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/10 border border-amber-500/35 dark:border-amber-400/40 backdrop-blur-xs shadow-xs">
            <div className="w-7 h-7 rounded-xl bg-amber-500/25 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                Crucial Local Insight:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-100 leading-relaxed">
                {advisoryNote}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Signature Row */}
      <div className="relative z-10 mt-4 pt-3 border-t border-[#FF7A3D]/20 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#8C4358] dark:text-[#FFAEC2]">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#FF7A3D]" />
          <span>Tailored by GPT 6 Astra with Real-Time Destination Nuances</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF7A3D] uppercase tracking-wider">
          ✦ Verified Curator Insight
        </span>
      </div>
    </div>
  );
}
