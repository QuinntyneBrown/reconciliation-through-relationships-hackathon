# Open decisions to confirm with RTR

## Accepted architecture decisions

- **Dedicated administration application (2026-07-12):** administrator tooling
  is implemented in the separate
  [`reconciliation-through-relationships-admin`](https://github.com/QuinntyneBrown/reconciliation-through-relationships-admin)
  repository. See its `docs/adr/0001-admin-dotnet-angular-app.md` for the .NET 8,
  Angular, MediatR 12.5.0, and database-first rationale. This portal remains the
  source of truth for Supabase migrations.


These come straight from the brief's "Decisions to confirm with RTR." They affect real code — each row notes the current placeholder and where it lives. **PM/Design: keep this current as Joel Gordon / RTR answer.**

| # | Question | Current placeholder in code | Where |
|---|----------|-----------------------------|-------|
| 1 | Which participation categories are mandatory at registration? | At least **one** of any category required | `domain/schema.ts` |
| 2 | What are the three user roles + permissions? | `participant`, `facilitator`, `admin` (permissions TBD) | `domain/types.ts` |
| 3 | Magic-link or email + password auth? | Not yet built; Supabase supports both | `data/supabase/*` |
| 4 | What participant info shows on the map, and to whom? | Eligible + consented only; names hidden until a facilitator view is built | `data/.../listMappableParticipants` |
| 5 | Consent / privacy / safeguarding / retention rules? | `consentToMap` flag defaults to **false** | `domain/types.ts` |
| 6 | How many eligible participants form a cohort? | **5** | `domain/constants.ts` → `COHORT_MIN_PARTICIPANTS` |
| 7 | Which learning materials are mandatory; what = "complete"? | 5 placeholder modules; completion = `learningStatus: "completed"` | `app/learn`, `domain/types.ts` |
| 8 | How do facilitators manage the waitlist + approve matches? | Imbalance surfaced; approve/reject buttons not yet wired | `app/facilitator/matching` |

## Product / cultural notes

- **Cultural appropriateness is a first-class requirement**, not a nice-to-have. Consult Joel Gordon (domain steward) on tone, terminology, and imagery before shipping copy. He is not the technical lead — go to the technical mentors for architecture.
- **Privacy-first defaults.** When unsure whether to show participant data, don't. Map consent is opt-in.
- **Human in the loop.** No two participants are ever auto-connected — a facilitator approves every match.

## Hackathon scope reminder (from the brief)

Focus on the **primary end-to-end journey**: register → learn → become eligible → appear on map / get matched by a facilitator. Synthetic data + lightweight auth are fine. Depth on the happy path beats breadth of half-features.
