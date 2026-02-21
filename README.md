# ALOS Secure Presentation Deck

A full-screen, gated presentation experience built with React, TypeScript, and Vite.

Visitors must submit an email and passcode before viewing the presentation. Once unlocked, the deck supports smooth section-to-section navigation, URL hash deep-linking, keyboard controls, and lightweight analytics events.

## Highlights

- Email + passcode gate before content access
- Local unlock session persistence via `localStorage`
- Full-screen section deck with:
  - scroll snapping behavior
  - keyboard navigation (`ArrowUp/Down/Left/Right`)
  - hash navigation (`#01`, `#02`, ...)
  - reduced-motion support
- Client-side tracking hooks for unlock, load, section views, and exit
- `/legal` route for legal/disclosure content
- API handlers for unlock validation and event intake

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Vercel serverless API routes (`/api/*`)

## Project Structure

```text
.
├── api/                  # Serverless API handlers
│   ├── unlock.js         # Email + passcode validation
│   └── track.js          # Tracking event intake endpoint
├── public/               # Static assets and media
├── src/
│   ├── gate/             # Gate UI + unlock flow
│   ├── legal/            # Legal page
│   ├── sections/         # Presentation sections
│   ├── lib/              # Tracking + hero sync helpers
│   └── PresentationDeck.tsx
├── vite.config.ts        # Vite config + local API middleware
└── vercel.json           # Vercel build/runtime config
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env.local` file in the project root:

```bash
PASSCODE=your-secure-passcode
AIRTABLE_API_TOKEN=pat_xxxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_VISITORS_TABLE=Visitors
```

`PASSCODE` is required. Airtable variables are optional but required for visitor logging persistence.

### 3. Run locally

```bash
npm run dev
```

Open the local URL printed by Vite.

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check and build production assets
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## API Endpoints

### `POST /api/unlock`

Validates email format and passcode.

Request body:

```json
{
  "email": "viewer@example.com",
  "passcode": "your-passcode",
  "sessionId": "browser-session-id"
}
```

Responses:

- `200` success
- `400` invalid email
- `401` invalid passcode
- `500` server not configured with `PASSCODE`

### `POST /api/track`

Accepts presentation telemetry events and returns `202`.

Example payload:

```json
{
  "sessionId": "browser-session-id",
  "eventName": "section_view",
  "payload": {
    "sectionIndex": 2,
    "totalSections": 4
  },
  "timestamp": "2026-02-21T00:00:00.000Z"
}
```

## Tracked Client Events

- `presentation_unlock`
- `presentation_load`
- `section_view`
- `presentation_exit`

## Deployment Notes

- Production deploy target is Vercel.
- Set these Vercel environment variables:
  - `PASSCODE`
  - `AIRTABLE_API_TOKEN`
  - `AIRTABLE_BASE_ID`
  - `AIRTABLE_VISITORS_TABLE` (optional, defaults to `Visitors`)
- Ensure your Airtable personal access token has write access to the selected base/table.

## Airtable Table Setup

Create a table named `Visitors` (or set your own name in `AIRTABLE_VISITORS_TABLE`) and add these fields:

- `Session ID` (single line text)
- `Email` (email)
- `Browser` (single line text)
- `Country` (single line text)
- `Date` (single line text)
- `Time` (single line text)
- `Visit Count` (number)
- `Returning` (checkbox)
- `Reached Last Section` (checkbox)

If Airtable is not configured, the app still works and API endpoints continue returning success responses.
