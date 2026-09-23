# ADR-0003: 100+ Destinations Catalog & AI Taste Profiler

- **Status**: Accepted
- **Date**: 2026-09-23
- **Authors**: Antigravity Agent & Core Team
- **Deciders**: User & Antigravity Agent

---

## 1. Context & Problem Statement
Users need realistic, rich destination discovery tailored to their specific lifestyle stage (age, travel rhythm like peace vs chill, food preferences, landscapes, companions, and budget) rather than generic search results.

---

## 2. Decision & Implementation
1. **Catalog Layer**:
   - Stored in [data/destinations.json](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/data/destinations.json) with 113 real-world global destinations across 5 continents.
   - Re-exported with TypeScript types and search utilities via [constants/destinationsData.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/constants/destinationsData.ts).
   - Global `MOCK_DESTINATIONS` in `constants/index.ts` points directly to this dataset.
2. **Matching Algorithm**:
   - Implemented in [lib/ai/tasteMatcher.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/ai/tasteMatcher.ts).
   - Multi-criteria weighted scoring:
     - Energy Rhythm (Peace vs Chill vs Culture vs Adventure): **30%**
     - Culinary Preferences: **25%**
     - Landscape / Atmosphere: **20%**
     - Age Demographic Fit: **10%**
     - Budget Tier Fit: **10%**
     - Companion Fit: **5%**
   - Strictly surfaces the **Top 4 Destinations** with customized match score percentage and personalized rationale.
3. **UI Integration**:
   - Interactive questionnaire in [app/(app)/ai/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/ai/page.tsx).
   - Rendered using [components/cards/TasteMatchCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/TasteMatchCard.tsx).
   - Clicking **"Plan with AI"** automatically launches itinerary synthesis for that destination.

---

## 3. Affected Files & Boundaries
- [data/destinations.json](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/data/destinations.json)
- [constants/destinationsData.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/constants/destinationsData.ts)
- [lib/ai/tasteMatcher.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/ai/tasteMatcher.ts)
- [components/cards/TasteMatchCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/TasteMatchCard.tsx)
- [app/(app)/ai/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/ai/page.tsx)
- [lib/ai/fallbackEngine.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/ai/fallbackEngine.ts)

---

## 4. Consequences & Invariants
- **Invariant**: The taste matcher must always return exactly the Top 4 unique matches.
- **Invariant**: Whenever a destination is planned, the generated itinerary must reference real landmarks and food specialties from the destination's profile.
