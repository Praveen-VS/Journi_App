# ADR-0001: Record Architecture Decisions & Surgical Changes

- **Status**: Accepted
- **Date**: 2026-09-23
- **Authors**: Antigravity Agent & Core Team
- **Deciders**: User & Antigravity Agent

---

## 1. Context & Problem Statement
As Journi grows in feature complexity (AI planning, destinations database, budget tracking, scrapbook memories), code modifications risk regression, unintended file drift, and large unwieldy diffs if agents continuously rewrite full files or make decisions without referencing prior architectural intent.

---

## 2. Decision Drivers
- Need for a single source of truth for architectural choices.
- Need to prevent full-file overwrites and enforce surgical line edits.
- Need to accelerate agent turn-around times by mapping exact file boundaries.

---

## 3. Decision & Implementation
We will maintain an **Architecture Decision Record (ADR)** system in `docs/adr/` governed by `AGENTS.md` at workspace root.
1. Every architectural pattern, database expansion, or system design must be captured as a markdown ADR.
2. The agent is strictly mandated to inspect [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md) before implementing changes.
3. Code modifications must be strictly surgical using targeted diffs (`replace_file_content`), never rewriting whole files.

---

## 4. Affected Files & Boundaries
- [AGENTS.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/AGENTS.md)
- [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md)
- [docs/adr/template.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/template.md)
- [docs/adr/0001-record-architecture-decisions.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/0001-record-architecture-decisions.md)

---

## 5. Consequences & Invariants
- **Positive**: High speed, zero unintended churn, predictable code evolution, and clear boundaries for every feature.
- **Invariant**: No agent shall touch files outside the mapped feature boundary without explicit justification.
