# ADR-0006: Release v1.0.0 & Vercel Free Hosting Configuration

- **Status**: Accepted
- **Date**: 2026-09-23
- **Authors**: Antigravity Agent & Core Team
- **Deciders**: User & Antigravity Agent

---

## 1. Context & Problem Statement
The user requested:
1. Lock the current version of the application as Version 1 (`v1.0.0`).
2. Deploy the application to Vercel for free to obtain a shareable live public URL.

---

## 2. Decision & Implementation
1. **Version Locking**:
   - Updated [package.json](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/package.json) version to `"1.0.0"`.
   - Initialized Git repository on branch `main`.
   - Staged all source code, assets, ADR documentation, and static data while ignoring `node_modules`, `.next`, and build artifacts via [.gitignore](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/.gitignore).
   - Committed root release: `release: v1.0.0 - Journi App V1 with 113 Destinations, AI Taste Matcher & Location Scope`.
   - Created annotated Git tag `v1.0.0`.
2. **Vercel Zero-Config Deployment Compatibility**:
   - The application is built on Next.js 15 App Router with zero mandatory external API dependencies (built-in 113-destination catalog, fallback AI synthesis, client-side taste matcher, and Zustand persistence).
   - It qualifies 100% for Vercel's Free Hobby Tier with zero environment configuration required for basic deployment.

---

## 3. Two Direct Paths to Deploy to Vercel (Free)

### Path A: Connect GitHub to Vercel (Recommended — Automatic Continuous Deployment)
1. Create a new repository on [GitHub](https://github.com/new) named `journi-app` (public or private).
2. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/journi-app.git
   git push -u origin main --tags
   ```
3. Visit [vercel.com](https://vercel.com) and log in for free using GitHub.
4. Click **"Add New..."** -> **"Project"** -> select `journi-app` -> click **"Deploy"**.
5. Within 60 seconds, Vercel will generate your live URL (e.g., `https://journi-app.vercel.app`) with automatic SSL.

### Path B: Deploy via Vercel CLI (Direct Terminal)
1. In your terminal run:
   ```bash
   npx vercel
   ```
2. Log in through the browser when prompted.
3. Accept the default options (Next.js detected automatically).
4. Run `npx vercel --prod` to receive your production live URL.

---

## 4. Consequences & Invariants
- `v1.0.0` is permanently tagged in Git history.
- The project is ready for immediate 1-click cloud deployment.
