# ADR-0009: Dynamic Budget Math, Hotel Child Policies, Universal Loaders & Menu Optimization

- **Status**: Accepted
- **Date**: 2026-09-25
- **Authors**: Antigravity Agent & Praveen-VS
- **Deciders**: User

---

## 1. Context & Problem Statement
As the Journi application grew with live AI trip options and dynamic budgets:
1. Party configuration needed to support adult counts and children under 5, with hotel child stay policies reflected in both UI cards and budget mathematics (total pack vs. per-person).
2. Users experienced jarring transitions or felt the UI was frozen during asynchronous AI generation, catalog search, or page navigation.
3. The standalone "Plan with AI" page was redundant with the Home page's central AI Console and fragmented the user experience.
4. When filtering on the Home page, the viewport stayed at the top instead of smoothly scrolling to the curated results.

---

## 2. Decision Drivers
- **Tactile Responsiveness**: Instant visual confirmation (progress bar, spinners, shimmers) at all wait points.
- **Family Travel Transparency**: Explicit hotel child policies (complimentary stay under 5 years vs chargeable extra bed rates).
- **Streamlined Navigation**: Eliminating duplicate questionnaire routes and establishing an intuitive, industry-standard menu hierarchy.
- **Zero Regression Risk**: Preserve full dynamic trip generation (`/ai?action=generate...` and `/ai?view=result`) while simplifying navigation.

---

## 3. Decision & Implementation
1. **Universal Loaders & Route Progress**:
   - Implemented `components/shared/RouteProgressBar.tsx` mounted globally in `app/providers.tsx` to provide immediate glowing feedback across all internal link transitions.
   - Added interactive `isLoading` states on all CTAs (`CompactTasteConsole`, `TasteMatchCard`, `DestinationCard`, `TripOptionCard`, `UnifiedBackButton`, `CategoryGrid`, and auth forms).
   - Added branded skeleton fallbacks for `/budget`, `/itinerary`, `/destinations`, and AI style options.
2. **Auto-Scroll to Results**:
   - In `CompactTasteConsole.tsx`, attached `resultsSectionRef` to `#curated-results-section` and triggered smooth scrolling upon filter selection or search.
3. **Menu Optimization & Direct AI Redirection**:
   - Removed "Plan with AI" from DesktopNavbar and MobileBottomNav.
   - Reordered Desktop navigation: Home &rarr; Destinations &rarr; How It Works &rarr; My Trips &rarr; Saved Places, with a glowing "Plan Trip" CTA linking to `/#plan`.
   - Reordered Mobile navigation: Home &rarr; Destinations &rarr; Center Floating "Plan Trip" (`/#plan`) &rarr; Trips &rarr; Saved.
   - Redirected raw `/ai` direct visits without generation parameters to `/#plan`.
4. **Enhanced "How It Works"**:
   - Rewrote `app/(public)/how-it-works/page.tsx` with updated 4-pillar narrative, live output preview with child policy, and an interactive FAQ accordion.

---

## 4. Affected Files & Boundaries (STRICT)
- `components/shared/RouteProgressBar.tsx`
- `app/providers.tsx`
- `components/forms/CompactTasteConsole.tsx`
- `components/cards/TasteMatchCard.tsx`
- `components/cards/DestinationCard.tsx`
- `components/cards/TripOptionCard.tsx`
- `components/shared/CategoryGrid.tsx`
- `components/navigation/UnifiedBackButton.tsx`
- `components/navigation/DesktopNavbar.tsx`
- `components/navigation/MobileBottomNav.tsx`
- `app/(app)/ai/page.tsx`
- `app/(app)/budget/page.tsx`
- `app/(app)/itinerary/page.tsx`
- `app/(public)/how-it-works/page.tsx`
- `app/(public)/page.tsx`
- `app/(public)/layout.tsx`
- `docs/adr/INDEX.md`
- `docs/adr/0009-budget-math-child-policies-loaders-menu.md`

---

## 5. Consequences & Invariants
- **Positive**: Every user interaction gives immediate visual feedback; menu order is intuitive and uncluttered; families have transparent pricing with child policies.
- **Invariants**: All internal links to trip generation preserve query parameters (`action=generate`, `view=result`, `optionId`); direct visits to `/ai` forward to `/#plan`.
