# ADR-0012: Removal of Public Destinations Page and Catalog Routes

## Status
**Accepted** — 2026-09-25

## Context
With the adoption of live AI Instinct Discovery and the AI Planning Console on the Home page (ADR-0010), the static catalog Destinations page (`/destinations`) became redundant. Users discover, match tastes, and plan trips dynamically directly through the Home AI Console and Saved Places. Maintaining a separate dedicated Destinations page created split navigation paths across desktop and mobile.

## Decisions

1. **Remove Public Destinations Route**:
   - Deleted `app/(public)/destinations/page.tsx` and removed the route folder.
   - Configured safe Next.js redirect in `next.config.ts` mapping `/destinations` and `/destinations/:path*` to `/home` (HTTP 307) so existing links and bookmarks resolve seamlessly.

2. **Clean Desktop Navigation (`components/navigation/DesktopNavbar.tsx`)**:
   - Removed the "Destinations" tab from `navLinks`.
   - Desktop navigation now cleanly features: Home, How It Works, My Trips, Saved Places.

3. **Clean Mobile Navigation (`components/navigation/MobileBottomNav.tsx`)**:
   - Removed the "Destinations" tab from mobile bottom navigation.
   - Restored balanced 5-tab symmetry with floating center action button: Home, Trips, [Plan Trip], Saved, Profile.

4. **Update Shared Components & Public Layout**:
   - Removed "Destinations" link from public footer ([app/(public)/layout.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28public%29/layout.tsx)).
   - Removed "Explore Destinations" CTA button from [app/(public)/how-it-works/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28public%29/how-it-works/page.tsx).
   - Updated [components/cards/DestinationCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/DestinationCard.tsx) card click fallback to route directly to AI trip generation rather than `/destinations`.
   - Updated [components/navigation/InspectorToolbar.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/navigation/InspectorToolbar.tsx) removing D04 and redirecting M02 to onboarding slide.

## Affected File Boundaries
- `app/(public)/destinations/page.tsx` (Deleted)
- [components/navigation/DesktopNavbar.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/navigation/DesktopNavbar.tsx)
- [components/navigation/MobileBottomNav.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/navigation/MobileBottomNav.tsx)
- [app/(public)/layout.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28public%29/layout.tsx)
- [app/(public)/how-it-works/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28public%29/how-it-works/page.tsx)
- [components/cards/DestinationCard.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/cards/DestinationCard.tsx)
- [components/navigation/InspectorToolbar.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/navigation/InspectorToolbar.tsx)
- [next.config.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/next.config.ts)
- [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md)
