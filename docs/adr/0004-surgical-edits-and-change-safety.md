# ADR-0004: Surgical Code Modification & Change Acceleration

- **Status**: Accepted
- **Date**: 2026-09-23
- **Authors**: Antigravity Agent & Core Team
- **Deciders**: User & Antigravity Agent

---

## 1. Context & Problem Statement
Rewriting entire files during minor UI or logic adjustments causes:
1. Significant latency and token waste.
2. High risk of accidental deletions of existing functionality or imports.
3. Difficult code reviews and merge conflicts.

---

## 2. Decision & Implementation
1. **Mandatory Surgical Modification**:
   - The agent MUST use `replace_file_content` targeting small, exact blocks of code.
   - Whole-file rewrites (`write_to_file` with Overwrite: true) are strictly forbidden for existing files unless completely re-architecting under explicit user instruction.
2. **Speed-Up Protocol for Small Changes**:
   - Step 1: Consult [docs/adr/INDEX.md](file:///c:/Users/NETCOM/Desktop/Journi%20App%20V1/docs/adr/INDEX.md) to locate the exact 1–2 target files.
   - Step 2: Use `view_file` with precise `StartLine` and `EndLine` to read only the lines requiring adjustment.
   - Step 3: Apply `replace_file_content` targeting only the modified block.
   - Step 4: Verify with `npx tsc --noEmit` on the file rather than triggering full multi-minute production builds for simple UI tweaks.
   - Step 5: Inform the user concisely.

---

## 3. Affected Files & Boundaries
- All files across the repository.

---

## 4. Consequences & Invariants
- **Positive**: Modifications execute in seconds rather than minutes.
- **Positive**: Zero accidental regressions or lost code.
- **Invariant**: Any edit touching more than 50 lines in an existing file should be evaluated carefully to confirm whether smaller targeted diffs are possible.
