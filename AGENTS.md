# Agent Rules & Architecture Governance for Journi

This document contains **mandatory operating rules** for any AI agent working on this codebase. You must follow these guidelines strictly on every task.

---

## 1. MANDATORY: Check ADRs Before Any Changes

Before reading unneeded files, proposing architecture, or writing any code:
1. **Always read [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md)** first.
2. Locate the relevant ADR for the feature, page, or subsystem you are about to touch.
3. Review the constraints, decisions, and **Affected File Boundaries** defined in that ADR.
4. If the user requests a new fundamental architectural change (e.g. adding a new database, changing auth scheme, introducing state management), create or update an ADR in `docs/adr/` using [docs/adr/template.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/template.md).

---

## 2. STRICT: Surgical Edits Only — No Full-File Rewriting

- **NEVER overwrite or rewrite an entire file** unless you are creating a brand new file from scratch.
- Always use targeted block replacements (`replace_file_content`) to modify **only the specific lines** that require changes.
- Preserve all existing code, imports, comments, docstrings, and formatting that are not directly related to your task.
- Minimize diff surface area. A smaller, cleaner diff is faster to execute, safer to review, and eliminates regression risks.

---

## 3. STRICT: Touch Only the Needed Files

- Consult the **Component & File Ownership Map** in [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md).
- Identify the exact 1–2 files responsible for the requested change.
- **Do not modify unrelated files** "just in case". If a bug or tweak is in a specific card component, only edit that card component.

---

## 4. Speed & Execution Efficiency

To ensure changes are completed as quickly and reliably as possible:
1. **Targeted Research**: Use `view_file` with precise line ranges (e.g., `StartLine: 40, EndLine: 90`) rather than reading entire 800+ line files.
2. **Fast Validation**: Run `npx tsc --noEmit` to verify type safety immediately after surgical edits.
3. **Avoid Unnecessary Rebuilds**: During active development and feature iteration, verify changes through targeted checks rather than repetitive multi-minute production builds. Only run `npm run build` when validating final production readiness.

---

## 5. Architectural Directory Layout Quick Reference

| Directory | Purpose | Rule |
| :--- | :--- | :--- |
| `app/(app)/` | Protected application routes (AI, Home, Trips, Budget, etc.) | Uses App Router; keep UI state lightweight. |
| `app/(auth)/` | Authentication pages (Login, Register, Forgot Password) | Keep auth flow modular and consistent. |
| `app/(public)/`| Landing & marketing routes (How It Works, Destinations) | Fast, static-friendly, SEO-optimized. |
| `components/` | Reusable UI atoms, navigation, and cards | Pure components; avoid heavy business logic inside cards. |
| `constants/` | Global mock data, route definitions, brand colors | Read-only catalogs and configurations. |
| `data/` | Structured data JSONs (e.g. `destinations.json`) | Central data store for static & catalog items. |
| `lib/` | Core business logic, algorithms, AI engines | Keep functions pure, testable, and well-typed. |
| `services/` | API communication clients (`ai.service.ts`) | Single source of truth for network calls. |
| `store/` | Zustand state management | Keep persistent user state normalized. |
| `types/` | TypeScript interfaces & type definitions | Update shared types before implementing features. |
| `docs/adr/` | Architectural Decision Records | **Must be checked before making changes.** |
