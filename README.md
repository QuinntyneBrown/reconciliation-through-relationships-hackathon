# Reconciliation Through Relationships (RTR)

A welcoming digital platform that moves participants from **registration → learning → local relationship-building**, in partnership with [Reconciliation Through Relationships](https://rightrelationship.ca/).

> Hackathon build. Uses synthetic data and lightweight auth. See [`docs/challenge.txt`](docs/challenge.txt) for the full brief.

📖 **New to the app?** The [plain-language user guide](docs/guide/README.md) walks participants and facilitators through every screen, with screenshots.

## Quick start

```bash
npm install
cp .env.example .env.local   # add Supabase credentials for the full journey
npm run dev                  # http://localhost:3000
```

No database is needed for the landing page and mock-backed routes. Add Supabase credentials to use authentication and the full participant/facilitator journey.

## What's here

| Route | What it is | Owner |
|-------|-----------|-------|
| `/auth/login` | Supabase magic-link sign-in | Authentication |
| `/onboarding` | Five-step participant intake | Onboarding |
| `/learn` | Required learning journey | Learning |
| `/dashboard` | Recommendations, participants, and regional map | Participant experience |
| `/connections` | Mutual connection, chat, and meeting scheduling | Participant experience |
| `/map` | Mock-backed regional cohort map | Cohorts |
| `/facilitator` | Facilitator overview, participants, matching, and settings | Facilitation |

The landing page and mock-backed routes work without a database. The authenticated participant and facilitator journey requires the Supabase variables shown in `.env.example` and the migrations under `supabase/migrations`.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** components (`src/components/ui`)
- **Zod** for shared validation (`src/domain/schema.ts`)
- **Data layer**: the original repository seam remains available for mock-backed routes, while the authenticated journey uses generated database types and Supabase clients under `src/data/supabase`.
- **Integrations**: Mapbox for participant maps and Zoom for scheduled calls.

## Key commands

```bash
npm run dev           # dev server
npm run build         # production build
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
npm run format        # prettier --write
```

## Where things live

```
src/
  app/            # routes (pages + /api). One folder per feature.
  components/     # shared React components
    ui/           # owned design-system primitives, initially scaffolded with shadcn/ui
  styles/         # shared design tokens consumed by the app and static specimens
  domain/         # the shared vocabulary: types, constants, zod schema, matching logic
  data/           # repository seam plus typed Supabase access
    mock/         # in-memory synthetic data (default)
    supabase/     # Supabase clients + repository (backend team)
  lib/            # small utilities (env, cn)
docs/             # architecture, decisions, the challenge brief
supabase/         # database migrations and synthetic seed data
```

## New here?

1. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) — git flow + who owns what.
2. Skim [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the pieces fit.
3. Check [`docs/DECISIONS.md`](docs/DECISIONS.md) — open questions for RTR that affect your work.
