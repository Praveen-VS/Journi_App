# ADR-0008: Supabase PostgreSQL Database Integration & Mobile-First Routing

## Status
**Accepted** — 2026-09-24

## Context
Journi requires cloud database storage for user profiles, saved favorite destinations, trips, and day-by-day itineraries. Additionally, on mobile devices, the site was rendering the desktop landing page (D01) without viewport metadata or mobile bottom navigation bars.

## Decision
1. **Database Provider**: Integrate **Supabase (PostgreSQL)** via `@supabase/supabase-js` and `@supabase/ssr`.
2. **Offline & Dev Resilience**: Implement fallback wrappers in `lib/supabase/client.ts` and `lib/supabase/server.ts` so the application continues to operate seamlessly with `localStorage` and mock data if Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are missing.
3. **Database Schema**:
   - `profiles`: Linked to `auth.users(id)` via cascade.
   - `saved_places`: Destination bookmarks with `UNIQUE(user_id, destination_id)`.
   - `trips`: User travel plans.
   - `itinerary_days`: Structured JSON activities for each day.
   - Row Level Security (RLS) enabled on all tables with user isolation policies.
4. **Mobile-First Experience**:
   - Added explicit `viewport: Viewport` export to `app/layout.tsx` for proper responsive scaling.
   - Configured `middleware.ts` to route mobile devices visiting `/` directly to `/home` (M07) unless explicit `?view=desktop` is passed.
   - Added `<MobileBottomNav />` to `app/(public)/layout.tsx` so public routes maintain persistent mobile navigation.
   - Added interactive Heart bookmark button on `DestinationCard` connected to `useSavedStore` and `services/saved.service.ts`.

## Consequences
- **Positive**: Complete persistence for saved places and trips, seamless cloud sync when credentials are supplied, 100% offline development capability, and flawless mobile experience.
- **Negative**: Adds Supabase dependencies (audited, 0 security conflicts).

## Affected File Boundaries
- `lib/supabase/*`
- `supabase/schema.sql`
- `services/saved.service.ts`
- `services/trip.service.ts`
- `store/saved.store.ts`
- `components/cards/DestinationCard.tsx`
- `app/(app)/saved/page.tsx`
- `app/layout.tsx`
- `app/(public)/layout.tsx`
- `middleware.ts`
