# 14. Hide V1 Inspector and Upgrade How It Works Workflow

Date: 2026-09-25

## Status
**Accepted**

## Context
1. The floating "Journi V1 Inspector" toolbar (which permitted switching between Mobile screens M01–M18, Desktop pages D01–D12, and simulation states: Loaded, Skeleton, Empty, Error) was intended for internal prototyping and review. The user requested to hide V1 screens and states across both desktop and mobile platforms.
2. The public **"How it works"** page (`app/(public)/how-it-works/page.tsx`) required an intelligent, premium upgrade to comprehensively explain Journi's core features and complete end-to-end workflow (origin-aware radius scopes, Astra AI taste intelligence, 3 distinct travel styles with upfront hotel child policies, day-by-day sequenced stories with handpicked local dining, dynamic budget mathematics, and Polaroid scrapbook saves).
3. The user strictly specified: "Do not change anything else."

## Decisions
1. **Hide V1 Inspector Across Desktop & Mobile (`components/navigation/InspectorToolbar.tsx`)**:
   - Modified `InspectorToolbar.tsx` to immediately return `null`.
   - This cleanly and reliably eliminates the floating toolbar, screen list, and state toggle widgets across all layouts (`(public)`, `(auth)`, and `(app)`) on desktop and mobile without breaking component signatures or parent imports.

2. **Premium Redesign of 'How It Works' Page (`app/(public)/how-it-works/page.tsx`)**:
   - **Hero Header**: Integrated luxury typography with radial ambient lights, official platform badge, and 4 high-level KPI cards (0ms GPS Scope, 3 Styles, 100% Upfront Child Policies, TTS Audio Narration).
   - **5-Stage Interactive Workflow**:
     - *Stage 01*: Origin Discovery & Radius Scoping (Within 200km, In-State, Interstate, Global, exact companion config with child <5y tracking).
     - *Stage 02*: Astra AI Taste Match & Seasonality Engine (climate, weather radar, monsoon windows, match percentages).
     - *Stage 03*: 3 Smart Travel Styles & Hotel Child Policies (Relaxed, Balanced, Fast-Paced with per-adult pricing and complimentary vs extra bed policy badges).
     - *Stage 04*: Your Journi Travel Plan & Sequenced Daily Story (morning, afternoon, golden hour flow, local culinary spots, built-in TTS voice reader).
     - *Stage 05*: Dynamic Budgeting, Packing & Scrapbook Memories (category splits, interactive checklist, Polaroid pinboard, and criteria parity on saved trips).
   - **6 Core Features Showcase**:
     - Distinct feature cards with colorful micro-badges, descriptions, and feature pills for all major pillars.
   - **Interactive Experience Simulation**:
     - 4 tabbed interactive previews (Scope & Filter Input, 3 Selection Cards Preview, Your Journi Travel Plan, Dynamic Budget & Packing) demonstrating real Journi outputs.
   - **Clear Answers Accordion**:
     - 6 detailed FAQs explaining location detection, child policy savings, travel styles, hands-free audio, dynamic budget customization, and saved trips.
   - **High-Impact CTA**:
     - Prominent action banner driving users directly into the AI travel planner on the home page.

## Affected File Boundaries
- [components/navigation/InspectorToolbar.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/components/navigation/InspectorToolbar.tsx)
- [app/(public)/how-it-works/page.tsx](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/app/%28public%29/how-it-works/page.tsx)
- [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md)

## Validation
- Verified with `npx tsc --noEmit` (0 errors).
- Validated server response on `http://localhost:3000/how-it-works` (HTTP 200).
- Confirmed absence of V1 Inspector on `/home`, `/trips`, `/ai`, and `/how-it-works`.
