import React, { useState } from 'react';
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

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-[24px] bg-white dark:bg-[#200612] border-2 transition-all duration-300 p-5 sm:p-6 shadow-md hover:shadow-xl ${
        isSelected
          ? 'border-[#FF4F7A] ring-2 ring-[#FF4F7A]/20 shadow-lg'
          : 'border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 hover:border-[#FF4F7A]/40'
      }`}
    >
      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase text-white bg-gradient-to-r ${badgeGradient} shadow-xs`}>
            Option {index + 1}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#5B0B24]/5 dark:bg-white/5 text-[#5B0B24] dark:text-[#FF8BA7] border border-[#5B0B24]/10 dark:border-white/10">
            {option.badge}
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#3E0717] dark:text-white leading-snug tracking-tight">
            {option.title}
          </h3>
          <p className="text-xs font-medium text-[#704250] dark:text-[#FFB3C6]/80 mt-1">
            {option.tagline}
          </p>
        </div>

        {/* Accommodation Callout */}
        <div className="p-3 rounded-[16px] bg-[#FFF5F8] dark:bg-[#280814] border border-[#FF4F7A]/15 space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#FF4F7A]/10 text-[#FF4F7A] flex items-center justify-center shrink-0 mt-0.5">
              <Bed className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4F7A]">
                  Stay • {option.starRating || 'Curated'}
                </span>
                {option.stayInfo?.approxPerNight && (
                  <span className="text-[10px] font-bold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70">
                    ~₹{option.stayInfo.approxPerNight.toLocaleString('en-IN')}/night
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-[#3E0717] dark:text-[#FFF7FA]">
                {option.stayInfo?.name || option.stayType}
              </p>
              {option.stayInfo?.amenity && (
                <p className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 truncate">
                  {option.stayInfo.amenity}
                </p>
              )}
            </div>
          </div>

          {/* Child Policy Badge */}
          {option.stayInfo?.childPolicy && (
            <div className="pt-1 border-t border-[#FF4F7A]/10 flex items-center justify-between gap-1">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

        {/* Curated Nearby Dining */}
        {option.curatedRestaurants && option.curatedRestaurants.length > 0 && (
          <div className="p-3 rounded-[16px] bg-[#FFF9F5] dark:bg-[#250d18] border border-[#FF7A3D]/20 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7A3D] block">
              🍽️ Handpicked Dining & Local Eats
            </span>
            <div className="space-y-1.5">
              {option.curatedRestaurants.slice(0, 2).map((r, i) => (
                <div key={i} className="text-xs">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="font-bold text-[#3E0717] dark:text-[#FFF7FA] truncate">{r.name}</span>
                    <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 shrink-0">₹{r.priceForTwo} for 2</span>
                  </div>
                  <p className="text-[11px] text-[#704250] dark:text-[#FFB3C6]/80 truncate">
                    Specialty: {r.signatureDish}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-[#5B0B24]/80 dark:text-[#FF8BA7]/80 leading-relaxed">
          {option.description}
        </p>

        {/* Key Highlights */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 block">
            Signature Inclusions:
          </span>
          {option.highlights.slice(0, 3).map((hl, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#3E0717] dark:text-[#FFDFE7]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{hl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Pricing & CTA */}
      <div className="mt-6 pt-4 border-t border-[#5B0B24]/10 dark:border-white/10 space-y-4">
        {/* Dynamic Total Package Budget + Per Person Breakdown */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#704250] dark:text-[#FFB3C6]">
              <Wallet className="w-3.5 h-3.5 text-[#FF7A3D]" />
              Total Package Cost ({daysCount} Days)
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5 flex-wrap">
              <span className="text-2xl font-black text-[#C2185B] dark:text-[#FF8BA7] tracking-tight">
                ₹{option.estimatedBudget.toLocaleString('en-IN')}
              </span>
              {option.perPersonBudget && option.adultsCount && option.adultsCount > 1 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#C2185B]/10 text-[#C2185B] dark:text-[#FF8BA7]">
                  ₹{option.perPersonBudget.toLocaleString('en-IN')} / adult
                </span>
              )}
            </div>
            {option.adultsCount && (
              <span className="text-[10px] text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 block mt-0.5">
                Total for {option.adultsCount} {option.adultsCount === 1 ? 'Adult' : 'Adults'}
                {option.childrenCount && option.childrenCount > 0
                  ? `, ${option.childrenCount} ${option.childrenCount === 1 ? 'Child (<5y)' : 'Children (<5y)'}`
                  : ''}
              </span>
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#5B0B24]/50 dark:text-[#FF8BA7]/50 block">Per Day Rate</span>
            <span className="text-xs font-bold text-[#5B0B24] dark:text-white">
              ₹{option.dailyRate.toLocaleString('en-IN')} / day
            </span>
          </div>
        </div>

        {/* Select Button */}
        <Button
          type="button"
          variant="sunset"
          size="md"
          isLoading={loadingActive}
          onClick={() => {
            setIsLocalSelecting(true);
            onSelect(option);
          }}
          className="w-full font-bold text-xs shadow-md hover:shadow-lg transition-all group-hover:scale-[1.01] cursor-pointer"
          rightIcon={!loadingActive ? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : undefined}
        >
          <span>{loadingActive ? 'Loading Full Itinerary...' : 'Select & View Full Itinerary'}</span>
        </Button>
      </div>
    </div>
  );
}
