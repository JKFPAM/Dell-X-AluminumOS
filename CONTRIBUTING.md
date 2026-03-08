# Contributing

This repository is a gated presentation application with serverless unlock/tracking endpoints and Airtable persistence.
The project moves quickly, so this guide exists to keep changes predictable, safe, and easy to review.

## Working Principles

- Keep user-facing behavior stable unless the task explicitly asks for behavior changes.
- Prefer small, focused pull requests over mixed "many-things-at-once" changes.
- Keep section quality high on desktop and mobile.
- Treat `lint`, `test`, and `build` as required quality gates.

## Architecture Overview

### Frontend

- Entry: `src/main.tsx`, `src/App.tsx`
- Deck shell: `src/features/presentation/PresentationDeck.tsx`
- Persistent narrative overlay: `src/features/presentation/components/NarrativePersistentOverlay.tsx`
- Hash routing helpers: `src/features/presentation/hashNavigation.ts`
- Gate UI: `src/gate/GateScreen.tsx`
- Legal route: `src/legal/LegalPage.tsx`

### Content Contracts (Source of Truth)

- Chapter labels: `src/content/chapters.ts`
- Section IDs and structure: `src/content/presentationStructure.ts`
- Tracking event names and payload contracts: `src/content/trackingEvents.ts`

Use these contract files instead of introducing free-form strings in components.

### Sections

Sections are grouped by domain:

- `src/sections/introduction`
- `src/sections/project-context`
- `src/sections/experience-enablers`
- `src/sections/outro`
- shared section primitives in `src/sections/shared`

Registry/mapping lives in `src/sections/index.ts`.

### Serverless API

- Unlock endpoint: `api/unlock.js`
- Tracking endpoint: `api/track.js`
- Airtable write logic: `api/_lib/airtable.js`
- Request parsing/meta: `api/_lib/request.js`
- Environment normalization: `api/_lib/env.js`

## Required Local Setup

Create `.env.local` at repo root.

Required:

- `PASSCODE`

Optional (required for Airtable persistence):

- `AIRTABLE_API_TOKEN`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_VISITORS_TABLE` (defaults to `Visitors`)
- `TRACKING_STRICT` (`true/false`, default non-strict)

If `PASSCODE` is missing, unlock requests fail (`500`) and you cannot enter the deck.

## NPM Scripts

- `npm run dev` starts Vite in host mode (shows local and LAN URLs)
- `npm run lint` runs ESLint
- `npm run test` runs Vitest in watch mode
- `npm run test:run` runs Vitest once (CI mode)
- `npm run build` runs TypeScript build + Vite production build

## Coding Standards

### Type Safety

- Avoid stringly-typed events and IDs.
- Use:
  - `TRACKING_EVENTS` from `src/content/trackingEvents.ts`
  - `PresentationSectionId` and definitions from `src/content/presentationStructure.ts`

### Imports

- Prefer path aliases (`@/...`) over deep relative imports.
- Prefer barrel exports where available:
  - `src/components/index.ts`
  - `src/lib/index.ts`
  - section-domain barrel files

### Naming

- Component files: PascalCase (`FutureVisionSection.tsx`)
- CSS files colocated with component (`FutureVisionSection.css`)
- Keep brand-specific naming out of reusable primitives unless required by content.

### Refactor Discipline

- "No behavior change" refactors should not alter API responses or visible interaction flow.
- If a refactor introduces behavior shifts, split it into a separate PR/commit.

## Section Change Playbook

When adding or changing sections:

1. Add/update the section component in the appropriate `src/sections/<domain>/` folder.
2. Register it in `src/sections/<domain>/index.ts` (barrel).
3. Add/update the `presentationSectionDefinitions` entry in `src/content/presentationStructure.ts`.
4. Keep `sectionId`, `component`, and `hashGroup` correct.
5. Validate hash behavior (`#05-i`, `#05-ii`, etc.) if group 5 flow is touched.

## Tracking and Analytics Notes

Current tracked events:

- `presentation_unlock`
- `presentation_load`
- `section_view`
- `presentation_exit`

`section_view` payload includes:

- `sectionId`
- `sectionIndex`
- `totalSections`
- `sectionHash`
- optional `email`

Do not remove fields from existing payloads without coordinating downstream Airtable/reporting consumers.

## Testing Expectations

Current critical tests:

- `api/unlock.test.js`
- `api/track.test.js`
- `src/features/presentation/hashNavigation.test.ts`

When touching these areas, update tests in the same change.

## Pull Request Checklist

Before opening a PR:

1. Run:
   - `npm run lint`
   - `npm run test:run`
   - `npm run build`
2. Confirm no accidental behavior changes (unless intended).
3. Include short notes:
   - What changed
   - Why it changed
   - Risk/impact
   - How it was validated

## Deployment Notes

- Production deploy target: Vercel
- CI workflow: `.github/workflows/ci.yml`
- Main branch should remain releasable at all times.

## Troubleshooting

Unlock fails locally:

- Check `.env.local` has `PASSCODE`
- Restart dev server after env changes

Tracking does not persist:

- Check Airtable token/base/table env vars
- Check table fields match expected names
- In strict mode (`TRACKING_STRICT=true`), writes return `503` on failures

Hash navigation unexpected:

- Verify `hashGroup` values in `presentationSectionDefinitions`
- Run `hashNavigation` tests

## For AI Agents

If you are using an AI coding agent, also read `AGENTS.md` at repo root.
`CONTRIBUTING.md` is human-oriented; `AGENTS.md` is execution-policy oriented.
