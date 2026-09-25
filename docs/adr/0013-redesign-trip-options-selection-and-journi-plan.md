# 13. Redesign 3 Trip Options Selection Page & Your Journi Travel Plan Sidebar

Date: 2026-09-25

## Status
**Accepted**

## Context
User feedback indicated that the 3 Options Selection page (`options_select` mode in `app/(app)/ai/page.tsx` and `components/cards/TripOptionCard.tsx`) felt congested, cramped, and text-dense due to heavy 2-restaurant dining modules and long multi-sentence descriptions embedded directly within each card.
Furthermore, users needed more visual attraction to highlight the destination, requiring high-quality, lightweight, compressed destination imagery (<500KB) placed at an apt position on each option card.

To eliminate congestion and create an inviting, lively experience:
1. The 3 option selection cards must present streamlined, essential data with generous spacing and enlarged typography.
2. The detailed accommodation data and curated dining spots are relocated to the inner itinerary page's left sidebar.
3. The left sidebar card heading is renamed to **"Your Journi Travel Plan"**.

## Decisions
1. **Top Destination Visual Header on Selection Cards (`TripOptionCard.tsx`)**:
   - Integrated an optimized Next.js `Image` header (`h-48 sm:h-52`, WebP compression <150KB via Unsplash parameters and Next.js image optimizer).
   - Elevated floating badges: Option gradient badge (`Option 1`, `Option 2`, `Option 3`), travel style badge, and pace indicator on image overlay.

2. **Spacious, Lively Card Typography & Streamlined Contents**:
   - Enlarged title (`text-xl sm:text-2xl font-black`) and clean tagline.
   - Streamlined stay pill showing property name, approx per-night rate, and child policy badge.
   - 3 clean signature inclusions with emerald checkmarks.
   - Removed the dense dining box and description paragraph from selection cards.
   - Bold, high-contrast pricing section with per-adult and per-day breakdowns.
   - Prominent full-width CTA button (`Select & View Full Itinerary →`).

3. **Renamed Sidebar & Relocated Deep Data (`AITravelPlanCard.tsx`)**:
   - Header title updated to **"Your Journi Travel Plan"**.
   - Added full **Curated Accommodations** section (property name, approx rate, amenities, child policy).
   - Added full **Handpicked Dining & Local Eats** section (restaurant names, cuisines, signature dishes, price for 2, and ambience vibes).

4. **Wider Layout & Grid Breathing Room (`app/(app)/ai/page.tsx`)**:
   - Increased container spacing to `space-y-8`.
   - Grid spacing widened to `gap-8`.
   - Header typography enlarged to `text-2xl sm:text-4xl font-black`.
   - Synchronized skeleton loaders to reflect the image-topped layout.

5. **Top Controls & Header Premium Redesign**:
   - `UnifiedBackButton.tsx`: Elevated to luxury glassmorphic navigation bar with sunset glow, glowing arrow container, and sparkling preserved status badge.
   - `FilterPreferencesStrip.tsx`: Vibrant filter ribbon with distinct, colorful micro-gradient pills for Scope, Duration, Travelers, Budget, Rhythm, and Food.
   - Section Header Showcase (`app/(app)/ai/page.tsx`): Transformed into a grand showcase card with ambient radial glows, gradient highlight on the destination title, and integrated meta specs.
   - `CuratorInsightCard.tsx`: Redesigned with magazine-editorial vertical gradient accent, ambient radial lights, and rich verification footer.

6. **Locked Functionalities Preserved**:
   - Dynamic budget math, traveler counts, child policy rates, store states, and back-navigation remain completely intact.

## Affected File Boundaries
- [types/index.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/types/index.ts): Added optional `imageUrl` to `TripOptionVariant`.
- [lib/ai/tripOptionsEngine.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/ai/tripOptionsEngine.ts): Added `getOptionDestinationImage` helper and populated `imageUrl`.
- [components/cards/TripOptionCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/TripOptionCard.tsx): Redesigned with photo header, enlarged fonts, spacious layout, and streamlined contents.
- [components/cards/AITravelPlanCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/AITravelPlanCard.tsx): Renamed header to "Your Journi Travel Plan", added detailed stay & dining sections.
- [components/navigation/UnifiedBackButton.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/navigation/UnifiedBackButton.tsx): Elevated desktop and mobile back navigation with gradient styling.
- [components/shared/FilterPreferencesStrip.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/shared/FilterPreferencesStrip.tsx): Vibrant ribbon with distinct micro-gradient pills.
- [components/cards/CuratorInsightCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/CuratorInsightCard.tsx): Magazine-editorial layout with vertical gradient accent.
- [app/(app)/ai/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/(app)/ai/page.tsx): Grand header showcase card, widened grid, and deep data connection.
