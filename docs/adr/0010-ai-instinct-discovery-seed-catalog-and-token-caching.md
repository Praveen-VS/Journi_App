# ADR-0010: Dynamic AI Instinct Discovery, 20-Destination Seed Catalog & Client-Side Token Caching

## Status
**Accepted** — 2026-09-25

## Context
Journi previously loaded a large static catalog (1,680+ destinations) in `data/destinations.json`. While this provided fast local lookups, the core vision of Journi is to empower travelers with live, unconstrained AI exploration ("Instinct Search") that can discover authentic places anywhere on Earth rather than being tethered to a static JSON dataset.

However, calling LLMs on every query carries latency and token consumption. Without a caching layer, repeated searches (such as quick inspiration chips or back-and-forth browsing) would unnecessarily burn tokens and degrade responsiveness.

## Decisions

1. **20 Iconic World Destinations Seed (`data/destinations.json`)**:
   - Streamline `data/destinations.json` from 1,680+ entries down to exactly **20 hand-curated world-class destinations** (Kyoto, Amalfi Coast, Paris, Banff, Santorini, Rome, Bali, Swiss Alps, Cape Town, Tokyo, Machu Picchu, Reykjavik, Maui, Petra, Queenstown, Barcelona, Rio de Janeiro, Prague, Dubai, Maldives).
   - These 20 destinations represent the default landing state of the Destinations catalog before any search is conducted.
   - Anchor definitions in `constants/index.ts` (`MOCK_TRIPS`, `MOCK_SAVED_PLACES`) bind directly to these 20 destinations.

2. **Live AI Instinct Search Across the Globe**:
   - Active searches on the Destinations page, taste profile matches, and trip options are executed via Astra 6 AI (`/api/ai/search` and `lib/ai/openrouter.ts`).
   - The AI operates as an unconstrained discovery agent, returning structured travel cards for any village, region, country, or vibe requested.

3. **Multi-Layer Client-Side Token Caching**:
   - Implement an in-memory and `sessionStorage` cache on the client keyed by `normalized(query + vibe + continent)`.
   - Repeated queries (or users clicking previous filter suggestions) resolve in **0ms** with **0 tokens consumed**.
   - Preserves API quotas and guarantees an instant experience for frequent queries.

## Affected File Boundaries
- [data/destinations.json](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/data/destinations.json)
- [constants/destinationsData.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/constants/destinationsData.ts)
- [constants/index.ts](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/constants/index.ts)
- [app/(public)/destinations/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28public%29/destinations/page.tsx)
- [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md)
