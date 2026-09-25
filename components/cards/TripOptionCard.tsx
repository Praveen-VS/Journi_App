import React, { useState } from 'react';
import Image from 'next/image';
import { TripOptionVariant } from '@/types';
import { Bed, CheckCircle2, ArrowRight, Wallet, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

interface TripOptionCardProps {
  option: TripOptionVariant;
  index: number;
  daysCount: number;
  isSelected?: boolean;
  isSelecting?: boolean;
  onSelect: (option: TripOptionVariant) => void;
}

export function TripOptionCard({
  option,
  index,
  daysCount,
  isSelected = false,
  isSelecting = false,
  onSelect,
}: TripOptionCardProps) {
  const [isLocalSelecting, setIsLocalSelecting] = useState(false);
  const loadingActive = isSelecting || isLocalSelecting;
  const gradientBadges = [
    'from-[#FF4F7A] to-[#FF7A3D]',
    'from-[#FF7A3D] to-[#FFC83D]',
    'from-[#C2185B] to-[#FF4F7A]',
  ];
  const badgeGradient = gradientBadges[index % gradientBadges.length];
  const cardImage = option.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-[28px] bg-white dark:bg-[#200612] border-2 transition-all duration-300 overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 ${
        isSelected
          ? 'border-[#FF4F7A] ring-2 ring-[#FF4F7A]/25 shadow-xl'
          : 'border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 hover:border-[#FF4F7A]/50'
      }`}
    >
      {/* Top Destination Visual Header */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-black/10">
        <Image
          src={cardImage}
          alt={option.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />

        {/* Floating Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase text-white bg-gradient-to-r ${badgeGradient} shadow-md tracking-wider`}>
            Option {index + 1}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20 shadow-sm">
            {option.badge}
          </span>
        </div>

        {/* Floating Bottom Info on Image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/25">
            <Sparkles className="w-3 h-3 text-amber-300" />
            {option.pace} Pace
          </span>
          <span className="text-xs font-semibold text-white/90 drop-shadow-sm">
            {daysCount} Days Flow
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Option Title & Tagline */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#3E0717] dark:text-[#FFF7FA] leading-snug tracking-tight">
              {option.title}
            </h3>
            <p className="text-sm font-medium text-[#704250] dark:text-[#FFB3C6]/85 mt-1.5 leading-relaxed">
              {option.tagline}
            </p>
          </div>

          {/* Clean Stay Callout */}
          <div className="p-3.5 rounded-2xl bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/15 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FF4F7A]/10 text-[#FF4F7A] flex items-center justify-center shrink-0 mt-0.5">
                <Bed className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#FF4F7A]">
                    Stay • {option.starRating || 'Curated Hotel'}
                  </span>
                  {option.stayInfo?.approxPerNight && (
                    <span className="text-[11px] font-bold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                      ~₹{option.stayInfo.approxPerNight.toLocaleString('en-IN')}/night
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-[#3E0717] dark:text-[#FFF7FA] truncate">
                  {option.stayInfo?.name || option.stayType}
                </p>
              </div>
            </div>

            {/* Child Policy Badge */}
            {option.stayInfo?.childPolicy && (
              <div className="pt-1.5 border-t border-[#FF4F7A]/10 flex items-center justify-between gap-1">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  option.stayInfo.childPolicy.isFree
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  {option.stayInfo.childPolicy.isFree ? '✓ ' : '• '}
                  {option.stayInfo.childPolicy.description}
                </span>
              </div>
            )}
          </div>

          {/* Signature Inclusions (Clean, spacious bullets) */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 block">
              Signature Inclusions:
            </span>
            {option.highlights.slice(0, 3).map((hl, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[#3E0717] dark:text-[#FFDFE7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Pricing & CTA */}
        <div className="pt-5 border-t border-[#5B0B24]/10 dark:border-white/10 space-y-4">
          {/* Dynamic Total Package Budget + Per Person Breakdown */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#704250] dark:text-[#FFB3C6]">
                <Wallet className="w-3.5 h-3.5 text-[#FF7A3D]" />
                Total Package ({daysCount} Days)
              </span>
              <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-[#C2185B] dark:text-[#FF8BA7] tracking-tight">
                  ₹{option.estimatedBudget.toLocaleString('en-IN')}
                </span>
                {option.perPersonBudget && option.adultsCount && option.adultsCount > 1 && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C2185B]/10 text-[#C2185B] dark:text-[#FF8BA7]">
                    ₹{option.perPersonBudget.toLocaleString('en-IN')} / adult
                  </span>
                )}
              </div>
              {option.adultsCount && (
                <span className="text-[11px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 block mt-1">
                  For {option.adultsCount} {option.adultsCount === 1 ? 'Adult' : 'Adults'}
                  {option.childrenCount && option.childrenCount > 0
                    ? `, ${option.childrenCount} ${option.childrenCount === 1 ? 'Child (<5y)' : 'Children (<5y)'}`
                    : ''}
                </span>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 block">Per Day Rate</span>
              <span className="text-xs sm:text-sm font-bold text-[#5B0B24] dark:text-white">
                ₹{option.dailyRate.toLocaleString('en-IN')} / day
              </span>
            </div>
          </div>

          {/* Select Button */}
          <Button
            type="button"
            variant="sunset"
            size="lg"
            isLoading={loadingActive}
            onClick={() => {
              setIsLocalSelecting(true);
              onSelect(option);
            }}
            className="w-full font-bold text-sm shadow-md hover:shadow-lg transition-all group-hover:scale-[1.01] cursor-pointer py-3.5"
            rightIcon={!loadingActive ? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : undefined}
          >
            <span>{loadingActive ? 'Loading Full Itinerary...' : 'Select & View Full Itinerary'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
