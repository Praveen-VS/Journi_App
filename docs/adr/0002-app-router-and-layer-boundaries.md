# ADR-0002: Next.js App Router Structure & Layer Boundaries

- **Status**: Accepted
- **Date**: 2026-09-23
- **Authors**: Antigravity Agent & Core Team
- **Deciders**: User & Antigravity Agent

---

## 1. Context & Problem Statement
Journi uses Next.js 15 with the App Router (`app/`). A clear separation between route pages, presentation components, business logic, state stores, and data layers is required to prevent spaghetti code and circular dependencies.

---

## 2. Decision & Implementation
The application is organized into strictly bounded layers:
1. **Routing Layer (`app/`)**:
   - `app/(app)`: Application features for authenticated/active user flows (`/ai`, `/home`, `/trips`, `/budget`, `/saved`, `/weather`, `/map`, `/itinerary`).
   - `app/(auth)`: Onboarding, login, register, and password reset flows.
   - `app/(public)`: Landing page and informational destinations overview.
   - `app/api/`: Route handlers for backend AI and data operations.
2. **Component Layer (`components/`)**:
   - Pure UI presentation. Divided into `ui/` (atoms: Button, Card, Badge, Chip), `navigation/` (MobileHeader, DesktopNavbar), `cards/` (TripCard, TasteMatchCard, TimelineCard), and `forms/`.
3. **Data & State Layer (`data/`, `store/`, `constants/`)**:
   - `data/`: Raw structured data (e.g. `destinations.json`).
   - `store/`: Zustand persistent client stores (`useTripStore`).
   - `constants/`: Read-only design tokens, routes, and catalogs.
4. **Service & Engine Layer (`services/`, `lib/`)**:
   - `services/`: API client singletons (`aiService`).
   - `lib/`: Algorithms (`tasteMatcher.ts`) and AI generators (`fallbackEngine.ts`, `gemini.ts`).

---

## 3. Affected Files & Boundaries
- [app/](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app)
- [components/](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components)
- [services/](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/services)
- [store/](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/store)
- [lib/](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/lib)

---

## 4. Consequences & Invariants
- **Rule**: Route pages in `app/` should not contain heavy inline helper logic; delegate to `lib/` or `services/`.
- **Rule**: Components in `components/ui/` must remain reusable and not import feature-specific state stores directly.
