# AGENTS.md

This file defines operating rules for AI coding agents working in this repository.
Apply these instructions for every task unless the user explicitly overrides them.

## Mission

Deliver safe, high-quality changes quickly while preserving presentation behavior, interaction quality, and deploy stability.

## Priority Order

1. Do not break production behavior.
2. Keep main branch releasable.
3. Preserve visual quality and interaction polish.
4. Keep codebase maintainable and consistent.

## Default Execution Mode

- Assume "no behavior change" unless the user explicitly asks for behavior changes.
- Prefer direct implementation over long planning once requirements are clear.
- Make smallest coherent change set that fully solves the task.

## Mandatory Pre-Edit Discovery

Before editing, inspect only relevant sources:

- Section/content contracts:
  - `src/content/chapters.ts`
  - `src/content/presentationStructure.ts`
  - `src/content/trackingEvents.ts`
- Section registry:
  - `src/sections/index.ts`
- Deck behavior:
  - `src/features/presentation/PresentationDeck.tsx`
  - `src/features/presentation/hashNavigation.ts`
- API behavior:
  - `api/unlock.js`
  - `api/track.js`
  - `api/_lib/airtable.js`
  - `api/_lib/env.js`

Do not broad-scan unrelated files unless needed.

## Required Quality Gates

For any code change, run:

1. `npm run lint`
2. `npm run test:run`
3. `npm run build`

Rules:

- If any command fails, fix or clearly report blocker details.
- Do not claim completion without reporting command outcomes.
- For docs-only changes, tests/build may be skipped, but state that explicitly.

## Source-of-Truth Rules

- Section identity comes from `PresentationSectionId` in `src/content/presentationStructure.ts`.
- Tracking event names come from `TRACKING_EVENTS` in `src/content/trackingEvents.ts`.
- Do not introduce new magic strings for section IDs or tracking events.

## Import and File Conventions

- Prefer `@/...` path alias imports.
- Prefer barrel imports where available:
  - `@/components`
  - `@/lib`
  - section-domain barrels in `src/sections/*/index.ts`
- Keep section files inside domain folders:
  - `introduction`, `project-context`, `experience-enablers`, `outro`
- Shared section primitives belong in `src/sections/shared`.

## Env and Config Rules

- Server-side env parsing is centralized in `api/_lib/env.js`.
- Do not duplicate env parsing logic in new files.
- Preserve compatibility for existing env keys:
  - `PASSCODE`
  - `AIRTABLE_API_TOKEN`
  - `AIRTABLE_BASE_ID`
  - `AIRTABLE_VISITORS_TABLE`
  - `TRACKING_STRICT`
  - legacy alias `AIRTABLE_EVENTS_TABLE` (fallback compatibility)

## API Safety Rules

- Keep unlock endpoint semantics stable:
  - invalid method -> `405`
  - invalid email -> `400`
  - missing passcode config -> `500`
  - invalid passcode -> `401`
  - success -> `200`
- Keep tracking endpoint response semantics stable:
  - success write -> `202` `{ ok: true, stored: true }`
  - strict failures -> `503`
  - non-strict failures -> `202` with `stored: false` and error code

## Section and Hash Rules

- Hash mapping semantics are critical:
  - Normal sections: `#01`, `#02`, ...
  - Group 5 substeps: `#05-i`, `#05-ii`, ...
- If hash logic changes, update and run:
  - `src/features/presentation/hashNavigation.test.ts`

## Presentation/Animation Guardrails

- Preserve reduced-motion support.
- Avoid introducing heavy layout thrash (prefer transform/opacity animation patterns).
- Preserve keyboard navigation behavior and hash deep-linking.
- Avoid adding large assets without clear need.

## Refactor Rules

- Separate refactors from feature changes whenever possible.
- Keep commits logically scoped and reviewable.
- Do not rename/move files and change behavior in the same commit unless required.

## Testing Rules

- Add/adjust tests when touching:
  - unlock logic -> `api/unlock.test.js`
  - track logic -> `api/track.test.js`
  - section/hash navigation -> `hashNavigation.test.ts`

When fixing bugs, include a regression test for the failing path.

## Git and Change Management

- Never reset/revert unrelated user changes.
- Avoid destructive git operations.
- Keep commit messages specific, e.g.:
  - `refactor: centralize env parsing for api + dev`
  - `test: add coverage for track strict/non-strict failures`
  - `docs: expand contributor and agent operating guides`

## Communication Contract

When reporting completion, include:

1. What changed (files/modules)
2. Why it changed
3. Validation run and outcomes
4. Any follow-up risks or next steps

Keep updates concise and factual.

## Human Handoff

If uncertainty remains (missing requirements, conflicting behavior), stop and ask a direct clarifying question instead of guessing on high-impact logic.
