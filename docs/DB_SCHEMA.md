# Database Schema

The Postgres (Supabase) schema that backs the RTR platform. It mirrors the
framework-free domain model in `src/domain/` — when the two disagree, the domain
types (`types.ts`, `constants.ts`, `schema.ts`) are the source of truth and this
file follows.

- **Naming:** tables and columns are `snake_case`; the app maps them to the
  `camelCase` domain types in `src/data/supabase/supabase-repository.ts`.
- **Keys:** every table has a `uuid` primary key (`gen_random_uuid()`).
- **Timestamps:** `created_at timestamptz not null default now()`; add `updated_at`
  where rows are mutated.
- **Enums:** modelled as Postgres `enum` types so the DB and the option lists in
  `domain/constants.ts` stay aligned. Adding an option means an `ALTER TYPE`.

---

## Enum types

| Enum type              | Values                                                                                                          | Domain source                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `user_role`            | `participant`, `facilitator`, `admin`                                                                          | `UserRole`                   |
| `learning_status`      | `not-started`, `in-progress`, `completed`                                                                      | `LearningStatus`             |
| `sex`                  | `female`, `male`, `self-described`                                                                             | `SEX_OPTIONS`                |
| `participation_category` | `indigenous-leader`, `indigenous-individual`, `non-indigenous-individual`, `elected-leader`, `religious-leader`, `artist` | `PARTICIPATION_CATEGORIES` |
| `faith_tradition`      | `indigenous-traditional`, `atheist`, `christian`, `jewish`, `muslim`, `hindu`, `buddhist`, `other`            | `FAITH_TRADITIONS`           |
| `participation_format` | `in-person`, `virtual`, `hybrid`                                                                               | `PARTICIPATION_FORMATS`      |
| `province`             | `AB`, `BC`, `MB`, `NB`, `NL`, `NS`, `NT`, `NU`, `ON`, `PE`, `QC`, `SK`, `YT`                                   | `CANADIAN_PROVINCES`         |
| `match_status`         | `suggested`, `approved`, `rejected`, `connected`                                                               | `MatchStatus`                |

> **Deployed portal compatibility:** the current Supabase migrations store the
> application role directly in `public.profiles.role` as constrained `text`.
> Migration `007_add_admin_role.sql` permits `participant`, `facilitator`, and
> `admin`. The dedicated admin API authorizes against this column. The normalized
> `user_role`/`roles` design below remains the target domain model, not a claim
> that those objects already exist in the migrated database.

---

## `participants`

One row per participant. Mirrors `ParticipantProfile`. Auth users map 1:1 to
participants via `auth_user_id`.

| Column               | Type                       | Constraints / notes                                                                 | Domain field           |
| -------------------- | -------------------------- | ----------------------------------------------------------------------------------- | ---------------------- |
| `id`                 | `uuid`                     | PK, `default gen_random_uuid()`                                                      | `id`                   |
| `auth_user_id`       | `uuid`                     | FK → `auth.users(id)`, unique, nullable until account linked                         | —                      |
| `name`               | `text`                     | not null                                                                            | `name`                 |
| `email`              | `text`                     | not null, unique (citext recommended)                                               | `email`                |
| `sex`                | `sex`                      | not null                                                                            | `sex`                  |
| `sex_self_described` | `text`                     | nullable; expected only when `sex = 'self-described'`                                | `sexSelfDescribed`     |
| `categories`         | `participation_category[]` | not null, `check (array_length(categories, 1) >= 1)` — brief requires ≥1             | `categories`           |
| `city`               | `text`                     | not null                                                                            | `location.city`        |
| `province`           | `province`                 | not null                                                                            | `location.province`    |
| `treaty_area`        | `text`                     | nullable (from native-land.ca)                                                       | `location.treatyArea`  |
| `lat`                | `double precision`         | nullable until geocoded                                                             | `location.lat`         |
| `lng`                | `double precision`         | nullable until geocoded                                                             | `location.lng`         |
| `faith_tradition`    | `faith_tradition`          | not null                                                                            | `faithTradition`       |
| `faith_other`        | `text`                     | nullable; expected only when `faith_tradition = 'other'`                             | `faithOther`           |
| `interests`          | `text[]`                   | not null default `'{}'`                                                             | `interests`            |
| `availability`       | `jsonb`                    | not null default `'{}'` — `{ notes?, weekdays?, weekends?, evenings? }`              | `availability`         |
| `preferred_format`   | `participation_format`     | not null                                                                            | `preferredFormat`      |
| `languages`          | `text[]`                   | not null, `check (array_length(languages, 1) >= 1)`                                  | `languages`            |
| `boundaries`         | `text`                     | nullable — personal boundaries / matching preferences                               | `boundaries`           |
| `consent_to_map`     | `boolean`                  | not null default `false` — privacy first; gates map visibility                      | `consentToMap`         |
| `learning_status`    | `learning_status`          | not null default `'not-started'`                                                    | `learningStatus`       |
| `created_at`         | `timestamptz`              | not null default `now()`                                                            | `createdAt`            |
| `updated_at`         | `timestamptz`              | not null default `now()`                                                            | —                      |

**Notes**
- `categories`, `interests`, `languages` are Postgres arrays (per the
  ARCHITECTURE sketch); `availability` is `jsonb` because it's a small optional
  bag. A GIN index on `interests` / `languages` helps shared-interest matching at
  scale.
- Eligibility (`isEligible`) = `learning_status = 'completed'`. It is derived, not
  stored.

---

## `roles`

User roles, kept separate from `participants` so a facilitator/admin need not be a
participant and one account can hold multiple roles.

| Column         | Type          | Constraints / notes                          |
| -------------- | ------------- | -------------------------------------------- |
| `id`           | `uuid`        | PK                                            |
| `auth_user_id` | `uuid`        | FK → `auth.users(id)`, not null              |
| `role`         | `user_role`   | not null                                      |
| `created_at`   | `timestamptz` | not null default `now()`                     |

`unique (auth_user_id, role)`. Absence of a row implies the default `participant`
role. RLS policies read this table to authorize facilitator/admin actions.

---

## `matches`

Facilitator-reviewed suggested pairings. Mirrors `Match`.

| Column                       | Type          | Constraints / notes                                         | Domain field              |
| ---------------------------- | ------------- | ---------------------------------------------------------- | ------------------------- |
| `id`                         | `uuid`        | PK                                                          | `id`                      |
| `participant_a_id`           | `uuid`        | FK → `participants(id)`, not null (Indigenous side)        | `participantAId`          |
| `participant_b_id`           | `uuid`        | FK → `participants(id)`, not null (non-Indigenous side)    | `participantBId`          |
| `score`                      | `integer`     | not null, `check (score between 0 and 100)`                | `score`                   |
| `reasons`                    | `text[]`      | not null default `'{}'` — human-readable match rationale   | `reasons`                 |
| `status`                     | `match_status`| not null default `'suggested'`                             | `status`                  |
| `reviewed_by_facilitator_id` | `uuid`        | FK → `auth.users(id)`, nullable until reviewed             | `reviewedByFacilitatorId` |
| `created_at`                 | `timestamptz` | not null default `now()`                                   | `createdAt`               |

**Constraints**
- `check (participant_a_id <> participant_b_id)`.
- `unique (participant_a_id, participant_b_id)` to avoid duplicate suggestions.
- `score`, `reasons`, and the Indigenous ↔ non-Indigenous pairing are produced by
  `domain/matching.ts`; the DB stores the outcome for facilitator review.

---

## Derived / not stored

- **`Region`** (`domain/types.ts`) is an aggregation, not a table. Compute it from
  `participants` where `learning_status = 'completed'` and `consent_to_map = true`,
  grouped by `(province, city)`, with `can_form_cohort = eligible_count >=
  COHORT_MIN_PARTICIPANTS` (currently 5, pending RTR — `domain/constants.ts`).
  Expose it as a SQL `view` or compute in the repository.
- **Matching balance / waitlist** (`matchingBalance`) is likewise derived at query
  time, not persisted.

---

## Row-Level Security (privacy safeguards)

RLS enforces the domain privacy rules at the database, not just in app code
(ARCHITECTURE.md). Enable RLS on every table. Sketch of policies:

| Table          | participant                                              | facilitator / admin                    |
| -------------- | ------------------------------------------------------- | -------------------------------------- |
| `participants` | select/update **own** row (`auth_user_id = auth.uid()`) | select all; update review-related cols |
| `participants` (map) | select rows where `consent_to_map AND learning_status = 'completed'` (via a restricted `mappable_participants` view) | full select |
| `roles`        | select own rows                                         | admin manages all                      |
| `matches`      | select rows where the participant is a party            | full select + update `status`          |

The map surface must **never** expose a participant who didn't opt in — enforce
`consent_to_map = true AND learning_status = 'completed'` in the view/policy, not
only in `listMappableParticipants()`.

---

## Suggested indexes

- `participants (learning_status)` — eligibility filters.
- `participants (consent_to_map, learning_status)` — map/cohort queries.
- `participants (province, city)` — regional grouping.
- GIN on `participants (interests)` and `participants (languages)` — shared-signal matching.
- `matches (status)` — facilitator queue.

---

## Open decisions affecting the schema

Tracked in `docs/DECISIONS.md` / the brief's "Decisions to confirm with RTR":

- Cohort threshold (`COHORT_MIN_PARTICIPANTS`) — affects the derived region view only.
- Which participation categories are mandatory beyond "at least one".
- Exact per-role permissions → RLS policy detail.
- Consent / data-retention rules → may add `consent_*` columns and a retention job.
- Learning-journey completion definition → may warrant a `learning_progress` table
  (per-video tracking) rather than a single `learning_status` enum.
