# Detailed Designs — Index

Detailed software design documents for the **Reconciliation Through Relationships** platform. Each feature has its own folder containing a design document (`README.md`) and rendered PlantUML diagrams (`diagrams/*.png`). The documents describe the **as-built** system: what the code does today, how the pieces fit together, and — in each document's "Open Questions" section — anything a reviewer should weigh in on.

## System overview

Reconciliation Through Relationships is a web platform that connects Indigenous and non-Indigenous participants for one-to-one relationship building: participants sign up, complete a profile and a learning journey, receive match recommendations, connect, chat, and schedule video calls; facilitators oversee matching and platform settings.

**Tech stack:** Next.js 16 (App Router) · React 19 · TypeScript · Supabase (Auth, Postgres with row-level security, Realtime) · Zod 4 · Tailwind CSS v4 + shadcn/Base UI · Mapbox GL · Zoom Server-to-Server OAuth · Playwright (boundary-interface and E2E suites).

There are no server actions: server components read data, and almost all writes are client-side Supabase calls guarded by row-level security. The exceptions are three route handlers (`/auth/callback`, `/api/zoom/create-meeting`, `/api/participants`), each documented in its feature's design.

## Feature designs

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 01 | [Authentication & Access](01-auth-and-access/README.md) | Implemented | Landing page, email/password sign-up and sign-in, auth code exchange, and the middleware gate that routes users by role and journey completion |
| 02 | [Onboarding](02-onboarding/README.md) | Implemented | Five-step profile intake wizard with accessible per-step validation, writing the participant profile |
| 03 | [Learning Journey](03-learning-journey/README.md) | Implemented | Audience-filtered learning modules with progress tracking; completion opens the dashboard gate |
| 04 | [Participant Dashboard & Discovery](04-participant-dashboard-and-discovery/README.md) | Implemented | Recommended matches (fixed-weight scoring), participant search with list/map views, cohort banner and waitlist states |
| 05 | [Profiles & Connect Requests](05-profiles-and-connect-requests/README.md) | Implemented | Participant profile pages and the connect-request state machine (send, cancel, respond) |
| 06 | [Connections: Chat & Meetings](06-connections-chat-and-meetings/README.md) | Implemented | Mutual-connect handshake, realtime messaging, and Zoom meeting scheduling via the server-side API route |
| 07 | [Facilitator Console](07-facilitator-console/README.md) | Implemented | Overview stats, participant management, match approval/rejection, manual matching, connection review queue, and platform settings |
| 08 | [Regional Map & Cohorts](08-regional-map-and-cohorts/README.md) | Implemented | Consent-filtered, city-aggregated regional discovery with a cohort-readiness threshold, served through the mock-backed repository seam |
| 09 | [Notifications](09-notifications/README.md) | Implemented | Realtime notification delivery: bell dropdown, toasts, and click-through navigation for events produced by features 05–07 |

## Shared UI platform

The design-system layer is presentation-only and shared by every feature, so it is catalogued here rather than given its own design document.

| Component | Purpose | Consumers |
|-----------|---------|-----------|
| `src/components/app-header.tsx` | Authenticated navigation shell with responsive sheet menu and active-link logic | All authenticated pages |
| `src/components/app-footer.tsx` | Site footer | Landing and app pages |
| `src/components/notification-center.tsx` | Realtime notification bell (see [09](09-notifications/README.md)) | Passed into `AppHeader`'s `actions` slot by `DashboardNav` and `FacilitatorNav` |
| `src/components/rtr-brand.tsx` | Brand logo and the "Weave" SVG motif | Header, footer, landing |
| `src/components/page-intro.tsx` | Page title/introduction block | Most feature pages |
| `src/components/empty-state.tsx` | Empty-state placeholder | Dashboard, connections |
| `src/components/cohort-circle.tsx` | Cohort circle visual (see [08](08-regional-map-and-cohorts/README.md)) | Regional map |
| `src/components/ui/*` | ~24 shadcn/Base-UI primitives (button, card, dialog, tabs, sheet, select, …) | Every feature |
| `src/styles/design-tokens.css` | Single source of truth for color/type/spacing tokens (also consumed by the `docs/mocks/` suite) | Global styles |

## Architecture notes

- **Two data layers exist.** A repository seam (`src/data/index.ts` → `Repository` interface → `MockRepository`) with its own camelCase domain model (`src/domain/types.ts`) serves only the regional map and the demo `/api/participants` route; its `SupabaseRepository` implementation is an unfilled stub. Every other feature talks to Supabase directly from server/client components using the snake_case generated types. See [08 — Regional Map & Cohorts](08-regional-map-and-cohorts/README.md) for the full discussion.
- **Dead code, documented nowhere else:** `src/components/site-nav.tsx`, `src/components/journey-stepper.tsx`, and `src/components/theme-provider.tsx` exist in the repo but are unreferenced at runtime.

## Related documentation

- [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) — concise layer overview
- [`docs/SOFTWARE_ARCHITECTURE_DESCRIPTION.md`](../SOFTWARE_ARCHITECTURE_DESCRIPTION.md) — formal ISO/IEC/IEEE 42010 architecture description
- [`docs/DB_SCHEMA.md`](../DB_SCHEMA.md) — database schema reference
- [`docs/mocks/index.html`](../mocks/index.html) — HTML mock suite mirroring the implemented UI
- [`docs/DECISIONS.md`](../DECISIONS.md) — open product decisions to confirm with RTR
