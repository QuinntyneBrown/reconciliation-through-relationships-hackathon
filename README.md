# Reconciliation Through Relationships (RTR)

A welcoming digital platform that moves participants from **registration → learning → local relationship-building**, in partnership with [Reconciliation Through Relationships](https://rightrelationship.ca/).

> Hackathon build. Uses synthetic data and lightweight auth. See [`docs/challenge.txt`](docs/challenge.txt) for the full brief.

## Quick start

```bash
npm install
cp .env.example .env.local   # defaults work out of the box (mock data, no DB)
npm run dev                  # http://localhost:3000
```

That's it — no database needed to start. The app runs on in-memory synthetic data.

## What's here

| Route | What it is | Owner |
|-------|-----------|-------|
| `/onboarding` | Account creation + participant intake | Onboarding squad |
| `/learn` | Required video learning journey | Learning squad |
| `/map` | Regional map + cohort formation | Map squad |
| `/facilitator/matching` | Facilitator-reviewed matching | Matching squad |

Every screen is a working scaffold you can build on. Look for `⚠️` comments marking each squad's workspace.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** components (`src/components/ui`)
- **Zod** for shared validation (`src/domain/schema.ts`)
- **Data layer**: a `Repository` interface with a mock impl (default) and a Supabase impl (to build). Swap via `DATA_SOURCE` env var — **no UI code changes**.

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
  data/           # data access. Everything goes through getRepository()
    mock/         # in-memory synthetic data (default)
    supabase/     # Supabase clients + repository (backend team)
  lib/            # small utilities (env, cn)
docs/             # architecture, decisions, the challenge brief
```

## New here?

1. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) — git flow + who owns what.
2. Skim [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the pieces fit.
3. Check [`docs/DECISIONS.md`](docs/DECISIONS.md) — open questions for RTR that affect your work.
