# ADR-0011: Saved Destination Planning Criteria Parity & Detail Modal

## Status
**Accepted** — 2026-09-25

## Context
When users saved destinations and clicked "Plan this trip" or clicked on saved place cards, the application previously redirected them immediately to `/ai?prompt=...` with a basic natural language string. This bypassed all structured trip criteria (Trip Duration, Budget Tier, Companion, Adults count, Kids count, and Trip Rhythm), causing inconsistency with the Home page search experience where users customize their travel profile before generating AI options.

## Decisions

1. **Saved Destination Detail Modal (`app/(app)/saved/page.tsx`)**:
   - Clicking any saved place card (Scrapbook polaroid card, Grid card, or the "Plan this Trip" card action) opens a rich Saved Destination Detail modal.
   - The modal presents the destination's photo, title, location, category, and personal notes.
   - It provides the **identical search criteria filter options as the Home page**:
     - **Trip Rhythm**: Peace & Zen (`peace`), Chill & Coastal (`chill`), Culture & Arts (`culture`), High Adventure (`adventure`).
     - **Trip Duration**: 3, 5, 7, 10, 14 Days.
     - **Budget Tier**: Budget Friendly, Moderate, Luxury Escapes.
     - **Companion & Party**: Solo, Couple, Family, Friends.
     - **Party Steppers**: Adults (1–10) and Kids (<5y, 0–6 with hotel policy notice). Selecting companion automatically synchronizes default adult/child counts.

2. **Session Storage Pre-population & Persistence**:
   - The modal automatically pre-populates from `sessionStorage.getItem('journi_hero_taste_search')` if the user previously selected criteria on the Home page.
   - Upon submitting "Plan this Trip", the updated criteria are synced back to `sessionStorage` for consistency across pages.

3. **Direct AI Generation Navigation**:
   - Clicking "Plan this Trip" in the modal routes to `/ai` with structured parameters:
     `action=generate&dest=...&country=...&days=...&budget=...&companion=...&adults=...&children=...&rhythm=...&from=saved`.
   - `/ai` immediately generates the 3 Smart Trip Options (Relaxed, Balanced, Fast-Paced) with dynamic budget calculations tailored to the travelers, duration, and budget tier.

4. **Bi-directional Back Navigation**:
   - Updated `app/(app)/ai/page.tsx` (`UnifiedBackButton` and `MobileHeader`) to recognize `fromSource === 'saved'`.
   - Clicking back from the 3 Trip Options returns cleanly to `/saved`.

## Affected File Boundaries
- [app/(app)/saved/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/saved/page.tsx)
- [app/(app)/ai/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/ai/page.tsx)
- [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md)
