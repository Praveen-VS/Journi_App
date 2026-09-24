# Architecture Decision Records (ADR) Index

> **AGENT NOTICE**: You must check this index before proposing or making changes. Identify the responsible ADR and the exact files mapped to the requested feature. Do NOT edit files outside the defined boundaries.

---

## 📋 ADR Registry

| ADR ID | Title | Status | Date | Scope / Feature Area |
| :--- | :--- | :--- | :--- | :--- |
| [ADR-0001](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0001-record-architecture-decisions.md) | Record Architecture Decisions & Surgical Changes | **Accepted** | 2026-09-23 | Architecture Governance |
| [ADR-0002](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0002-app-router-and-layer-boundaries.md) | Next.js App Router Structure & Layer Boundaries | **Accepted** | 2026-09-23 | Core Architecture |
| [ADR-0003](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0003-destinations-catalog-and-taste-matcher.md) | 100+ Destinations Catalog & AI Taste Profiler | **Accepted** | 2026-09-23 | AI Planning & Catalog |
| [ADR-0004](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0004-surgical-edits-and-change-safety.md) | Surgical Code Modification & Change Acceleration | **Accepted** | 2026-09-23 | Workflow & Productivity |
| [ADR-0005](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0005-location-scope-and-image-resilience.md) | Location Scope Selector & Direct Image Resilience | **Accepted** | 2026-09-23 | AI Customizer & Image Delivery |
| [ADR-0006](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0006-release-v1-and-vercel-deployment.md) | Release v1.0.0 & Vercel Free Hosting Configuration | **Accepted** | 2026-09-23 | Release & Deployment |
| [ADR-0007](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0007-expanded-catalog-and-unified-mock-data.md) | 1,680+ Expanded Catalog & Unified Mock Data | **Accepted** | 2026-09-24 | Catalog & Data Unification |
| [ADR-0008](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0008-supabase-database-integration.md) | Supabase Database Integration & Mobile-First Routing | **Accepted** | 2026-09-24 | Database & Mobile Routing |
| [ADR-0009](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0009-budget-math-child-policies-loaders-menu.md) | Dynamic Budget Math, Hotel Child Policies, Loaders & Menu | **Accepted** | 2026-09-25 | UI/UX & AI Options Flow |

---

## 🗺️ Component & File Ownership Map

When asked to make a change, locate the feature below and modify **ONLY** the designated files:

### 1. Brand Identity & Header
- **Logo Display & Sizing**: [components/shared/JourniLogo.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/shared/JourniLogo.tsx)
- **Top Mobile Header**: [components/navigation/MobileHeader.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/navigation/MobileHeader.tsx)
- **Desktop Navbar**: [components/navigation/DesktopNavbar.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/navigation/DesktopNavbar.tsx)
- **Logo Images**: [public/images/logo/journi-official-logo.png](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/public/images/logo/journi-official-logo.png)

### 2. Plan with AI & Taste Profiler
- **AI Planning Page UI & State**: [app/(app)/ai/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/ai/page.tsx)
- **Top 4 Taste Match Card**: [components/cards/TasteMatchCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/TasteMatchCard.tsx)
- **Taste Scoring Algorithm**: [lib/ai/tasteMatcher.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/ai/tasteMatcher.ts)
- **Trip Plan Signature Card**: [components/cards/AITravelPlanCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/AITravelPlanCard.tsx)
- **Prompt Suggestions Chip**: [components/ui/PromptSuggestionChip.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/ui/PromptSuggestionChip.tsx)
- **Trip Plan Generation API**: [app/api/ai/generate/route.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/api/ai/generate/route.ts)
- **Heuristic Fallback Engine**: [lib/ai/fallbackEngine.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/ai/fallbackEngine.ts)
- **AI Service Client**: [services/ai.service.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/services/ai.service.ts)

### 3. Destinations Database
- **Raw 1,680+ Destinations Catalog**: [data/destinations.json](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/data/destinations.json)
- **Lookup Helpers & Re-export**: [constants/destinationsData.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/constants/destinationsData.ts)
- **Public Destinations Page**: [app/(public)/destinations/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28public%29/destinations/page.tsx)
- **Destination Card Component**: [components/cards/DestinationCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/DestinationCard.tsx)

### 4. Trips, Itinerary, Budget & Saved Places
- **Home Dashboard**: [app/(app)/home/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/home/page.tsx)
- **Trips List**: [app/(app)/trips/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/trips/page.tsx)
- **Trip Card**: [components/cards/TripCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/TripCard.tsx)
- **Itinerary Flow**: [app/(app)/itinerary/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/itinerary/page.tsx)
- **Activity Timeline Card**: [components/cards/TimelineCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/TimelineCard.tsx)
- **Budget Planner**: [app/(app)/budget/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/budget/page.tsx)
- **Saved Places (Polaroid / Scrapbook)**: [app/(app)/saved/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/saved/page.tsx)
- **Polaroid Card**: [components/cards/SavedPolaroidCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/SavedPolaroidCard.tsx)

### 5. Types & Global Constants
- **TypeScript Types**: [types/index.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/types/index.ts)
- **Theme & Brand Constants**: [constants/index.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/constants/index.ts)
- **Persistent State Store**: [store/index.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/store/index.ts)

---

## ⚡ Fast-Path Change Protocol
When making any change:
1. Locate the component above.
2. Read ONLY the specific lines you need to edit with `view_file(StartLine, EndLine)`.
3. Use `replace_file_content` to apply a surgical change.
4. Run `npx tsc --noEmit` to verify type safety.
5. Done. Never touch unrelated files.
