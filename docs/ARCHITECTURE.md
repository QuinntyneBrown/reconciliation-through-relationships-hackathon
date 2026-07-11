# Architecture

A quick tour of how the pieces fit, so anyone can find where their work goes.

## The layers

```
┌─────────────────────────────────────────────────────────┐
│  app/  (routes, pages, /api)      ← UI + HTTP             │
│    imports domain types, calls getRepository()           │
├─────────────────────────────────────────────────────────┤
│  domain/  (types, constants, schema, matching)           │
│    pure, framework-free business vocabulary + logic      │
├─────────────────────────────────────────────────────────┤
│  data/  (Repository interface)    ← the swappable seam    │
│    ┌──────────────┐        ┌───────────────────────┐     │
│    │ MockRepository│  OR   │ SupabaseRepository     │     │
│    │ (in-memory)   │        │ (Postgres + auth)      │     │
│    └──────────────┘        └───────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

**The key idea:** UI depends on the `Repository` *interface*, never a concrete data source. `getRepository()` picks the implementation from the `DATA_SOURCE` env var. That's why frontend and backend can work fully in parallel.

## Data flow example (creating a participant)

```
onboarding form
  → validates with participantIntakeSchema (domain/schema.ts)
  → POST /api/participants (app/api/participants/route.ts)
  → re-validates with the same schema
  → getRepository().createParticipant(intake)
  → MockRepository stores in memory  (later: SupabaseRepository → Postgres)
```

One schema, validated on both client and server. One repository call, backend-agnostic.

## Domain rules that live in code (not scattered in the UI)

- **Eligibility** — `isEligible()` in `domain/types.ts`: only `learningStatus === "completed"` participants can be mapped/matched.
- **Privacy** — `listMappableParticipants()` returns only eligible **and** consented participants. The map never sees anyone who didn't opt in.
- **Cohort threshold** — `COHORT_MIN_PARTICIPANTS` in `domain/constants.ts` (default 5, pending RTR confirmation).
- **Matching** — `domain/matching.ts` is a pure function: pairs eligible Indigenous ↔ non-Indigenous participants, scores them with transparent reasons, and computes the registration imbalance / waitlist.

Keeping these in `domain/` means they're testable and consistent everywhere.

## Switching to Supabase (backend team)

1. Create a Supabase project. Enable email/password or magic-link auth.
2. Put the URL + anon key in `.env.local`, set `DATA_SOURCE=supabase`.
3. Implement each method in `data/supabase/supabase-repository.ts`. Match `MockRepository`'s behaviour exactly — it's the reference.
4. Add Row-Level Security so the privacy rules above are enforced at the database, not just in app code.

### Suggested tables (starting sketch — refine with the domain types)

- `participants` — mirrors `ParticipantProfile`. Store `categories`, `interests`, `languages` as arrays/jsonb.
- `matches` — mirrors `Match` (participant_a, participant_b, score, reasons, status, reviewed_by).
- Auth users map 1:1 to participants; facilitators/admins get a `role` column or a separate `roles` table.

Generate types once tables exist:

```bash
npx supabase gen types typescript --project-id <id> > src/data/supabase/database.types.ts
```

## Auth (to build)

Lightweight per the brief — Supabase magic-link **or** email+password (decision pending, see DECISIONS.md). Gate `/facilitator/*` to facilitator/admin roles via Next.js middleware once auth is live.

## Deployment

- **App** → DigitalOcean App Platform (or Vercel for the demo). Set the same env vars there.
- **Database/auth** → Supabase managed cloud.
