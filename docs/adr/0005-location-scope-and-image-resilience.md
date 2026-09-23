# ADR-0005: Location Scope Selector & Direct Image Resilience

- **Status**: Accepted
- **Date**: 2026-09-23
- **Authors**: Antigravity Agent & Core Team
- **Deciders**: User & Antigravity Agent

---

## 1. Context & Problem Statement
1. **Location Customization**: Users customizing their travel taste need distance and scope boundaries (e.g. within 200 km, inside state, interstate, international, or custom destination) so the Top 4 AI recommendations accurately reflect their proximity preference.
2. **Image Loading Timeouts**: The Next.js image optimization proxy (`/_next/image?url=...`) was timing out against external Unsplash CDN endpoints when serving images in 'Your Perfect 4 Getaways', causing cards to display broken image icons or fail silently with 504 timeouts.

---

## 2. Decision & Implementation
1. **Location Scope & Origin Detection**:
   - Extended `UserTasteProfile` in [types/index.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/types/index.ts) with `locationScope` (`nearby_200km`, `in_state`, `interstate`, `international`, `custom`), `userOrigin`, and `customLocation`.
   - Added browser Geolocation API detection in [app/(app)/ai/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/ai/page.tsx) with automatic city/region reverse-geocoding fallback.
   - Enhanced [lib/ai/tasteMatcher.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/ai/tasteMatcher.ts) to score and filter destinations according to the selected distance scope and user-specified custom locations.
2. **Direct Image Delivery & Graceful Fallback**:
   - Configured `images: { unoptimized: true }` in [next.config.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/next.config.ts). This bypasses the node server proxy bottleneck and allows client browsers to load Unsplash CDN images directly with HTTP/2 and client caching.
   - Added `unoptimized` flag and an `onError` state handler in [components/cards/TasteMatchCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/TasteMatchCard.tsx) to automatically swap broken or timed-out images for verified fallback travel imagery.

---

## 3. Affected Files & Boundaries
- [types/index.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/types/index.ts)
- [lib/ai/tasteMatcher.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib/ai/tasteMatcher.ts)
- [app/(app)/ai/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28app%29/ai/page.tsx)
- [next.config.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/next.config.ts)
- [components/cards/TasteMatchCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/TasteMatchCard.tsx)

---

## 4. Consequences & Invariants
- **Zero Proxy Timeouts**: Destination images load quickly and reliably directly from CDN without server-side proxy timeouts.
- **Top 4 Dynamic Relevance**: Adjusting distance scope (e.g. from International to Within 200 km) immediately re-ranks the Top 4 getaways to respect geographic scope.
