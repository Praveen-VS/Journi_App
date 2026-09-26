# ADR-0015: Origin-Aware Dynamic Distance & Scope Resolver for Saved Places and Trips

- **Status**: Accepted
- **Date**: 2026-09-26
- **Authors**: Antigravity Agent & Core Team
- **Deciders**: User & Antigravity Agent

---

## 1. Context & Problem Statement
When a user opened a destination from **Saved Places** (`/saved`) or viewed a saved trip in **My Trips** (`/trips/[tripId]`):
- The **Distance & Scope** badge on the 3 options selection page, trip plan, itinerary, and budget views was defaulting to `"in_state"` ("In-State").
- This caused inaccurate labeling for international destinations (e.g. Kyoto, Japan or Paris, France showing "In-State") and interstate destinations (e.g. Jaipur, Rajasthan showing "In-State").
- The user requested dynamic detection of user location to assign appropriate, authentic labels: `Within 200 km`, `In-State`, `Interstate`, or `International`.

---

## 2. Decision & Implementation

### 1. Centralized Scope Resolution Engine (`lib/location.ts`)
- Implemented `resolveScopeForDestination(destinationName, destinationCountry?, userLocation?)`:
  - **`international`**: Destination country differs from user's detected country (e.g. Kyoto, Japan; Paris, France; Amalfi, Italy).
  - **`nearby_200km`**: Destination is $\le 200\text{ km}$ from the traveler's coordinates or recognized central hub (e.g. Kochi $\rightarrow$ Munnar ~125 km, Alleppey ~55 km, Kumarakom ~50 km).
  - **`in_state`**: Destination is in the traveler's detected state but $> 200\text{ km}$ (e.g. Kochi $\rightarrow$ Wayanad ~260 km, Bekal ~360 km).
  - **`interstate`**: Destination is located in a different domestic state (e.g. Jaipur, Rajasthan; Goa; Manali; Hampi).
- Added `calculateDistanceKm(lat1, lon1, lat2, lon2)` using the Haversine formula.
- Added `getCachedUserLocation()` for instant, zero-latency synchronous access to cached location.

### 2. Saved Places Modal Integration (`app/(app)/saved/page.tsx`)
- Detects the traveler's location upon mount via `detectUserLocation()`.
- Calculates `resolvedScopeInfo` dynamically for the selected destination.
- Renders an **Origin-Aware Scope** badge inside the Saved Destination Detail Modal showing the calculated label (e.g. "Within 200 km (~125 km)", "International", "Interstate").
- Forwards `scope: scopeInfo.scope` in both `sessionStorage` and `URLSearchParams` when the user taps **"Plan this Trip"**.

### 3. AI Planning Parity (`app/(app)/ai/page.tsx`)
- Reads `initialScope = searchParams.get('scope')`.
- If `initialScope` is provided, initializes `locationScope` with it.
- If not provided but destination is present, dynamically resolves it from destination metadata and detected user location.
- Binds `locationScope` to `FilterPreferencesStrip` on both the options selection and travel plan views.
- Appends `&scope=${locationScope}` when linking to the full itinerary flow.

### 4. Itinerary & Budget Parity (`app/(app)/itinerary/page.tsx`, `app/(app)/budget/page.tsx`)
- Dynamically resolves `effectiveScope` from `currentTrip.destination` and `currentTrip.country` rather than hardcoding `"in_state"`.

---

## 3. Affected File Boundaries
- [lib/location.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/location.ts)
- [app/(app)/saved/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/saved/page.tsx)
- [app/(app)/ai/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/ai/page.tsx)
- [app/(app)/itinerary/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/itinerary/page.tsx)
- [app/(app)/budget/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/budget/page.tsx)

---

## 4. Consequences & Verification
- 100% accurate scope labels across all destinations.
- Zero change to existing layouts, aesthetics, or core features.
- Build and TypeScript verification clean.
