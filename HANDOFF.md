# RTR Platform — Handoff

This document is a practical guide for anyone taking over the **Reconciliation Through Relationships (RTR)** platform after the FaithTech hackathon. It covers what was built, how to run it, what still needs building, and where the sharp edges are.

**Production:** https://rtr-platform.vercel.app
**Slide deck:** https://rtr-platform.vercel.app/demo

---

## 1. What the app does

RTR pairs Indigenous and non-Indigenous participants for months of one-on-one conversation, facilitated learning, and a closing cohort gathering. This platform digitizes what previously ran on spreadsheets and phone calls.

**End-to-end journey:**

```
Sign up → Complete profile → Complete learning → Get matched
       → Both parties opt in → (Facilitator approves if auto-match off)
       → Real-time chat → Schedule Zoom calls → Cohort formation (future)
```

**Two roles:** `participant` (default) and `facilitator` (seeded).

---

## 2. Tech stack

| Layer         | Choice                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Framework     | **Next.js 16** (App Router, Server Components, Server Actions, edge middleware called `proxy.ts`)       |
| Database      | **Supabase Postgres** with Row-Level Security                                                           |
| Auth          | Supabase Auth (email + password; magic link infrastructure kept but not shown in UI)                    |
| Realtime      | Supabase Realtime channels for chat + notifications                                                     |
| Video calls   | **Zoom Server-to-Server OAuth** — mints fresh token per request                                         |
| Email         | Resend (transactional; used by Supabase Auth for SMTP)                                                  |
| Map           | Mapbox GL JS (regional participant map)                                                                 |
| Styling       | Tailwind CSS v4 + custom `@theme inline` tokens (`spruce`, `ochre`, `river`, `birch`, `parchment`, etc.) |
| UI primitives | shadcn/ui customized to `@base-ui/react` primitives                                                     |
| Deployment    | Vercel (project name: `rtr-platform`, connected to `main`)                                              |

---

## 3. Local development

### Prerequisites

- Node 20+ (Vercel builds on Node 22)
- npm (this project uses npm, not pnpm/yarn)

### Install & run

```bash
git clone https://github.com/QuinntyneBrown/reconciliation-through-relationships-hackathon.git
cd reconciliation-through-relationships-hackathon
npm install
npm run dev            # http://localhost:3000
```

### Required environment variables

Copy from Vercel with `npx vercel env pull .env.local` after linking, or set manually:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=            # from Supabase dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # from Supabase dashboard
SUPABASE_SERVICE_ROLE_KEY=           # optional, only for seed scripts

# Zoom (Server-to-Server OAuth app)
ZOOM_ACCOUNT_ID=                     # from Zoom marketplace S2S app
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=

# Email (Resend)
RESEND_API_KEY=                      # for Supabase custom SMTP

# Map
NEXT_PUBLIC_MAPBOX_TOKEN=            # public token
```

### Useful scripts

```bash
npm run dev        # local dev
npm run build      # production build (Turbopack)
npm run lint       # ESLint
```

---

## 4. Directory tour

```
src/
├── app/
│   ├── page.tsx                    # public landing page
│   ├── demo/page.tsx               # /demo — hackathon slide deck (public)
│   ├── auth/
│   │   ├── login/page.tsx          # email + password login
│   │   ├── signup/page.tsx         # account creation
│   │   └── callback/route.ts       # Supabase auth callback + role-based redirect
│   ├── onboarding/                 # 5-step profile form (gated)
│   ├── learn/                      # learning journey (gated) — LMS
│   ├── dashboard/                  # participant home (tabs: Recommended, Connections, All)
│   ├── connections/
│   │   ├── page.tsx                # connections list
│   │   └── [connectionId]/page.tsx # chat + zoom scheduling
│   ├── profile/
│   │   ├── [userId]/page.tsx       # public participant profile
│   │   └── me/page.tsx             # redirect to own profile
│   ├── facilitator/
│   │   ├── page.tsx                # facilitator overview (stats + actions)
│   │   ├── matching/               # match queue + mutual-connect approvals
│   │   ├── participants/           # searchable, paginated participant table
│   │   └── settings/               # auto-matching toggle, cohort threshold
│   ├── map/                        # regional cohort discovery map
│   └── api/
│       ├── zoom/create-meeting/    # server-to-server Zoom meeting creation
│       └── participants/           # legacy repository-backed API
├── components/
│   ├── ui/                         # shadcn primitives customized for RTR
│   ├── notification-center.tsx     # bell dropdown with realtime updates
│   ├── rtr-brand.tsx               # logo/wordmark
│   ├── app-header.tsx              # base header shell (nav items, roleLabel, actions slot)
│   └── page-intro.tsx              # eyebrow/title/description hero block
├── data/
│   ├── supabase/
│   │   ├── browser-client.ts       # createSupabaseBrowserClient()
│   │   ├── server-client.ts        # createSupabaseServerClient()  (RSC/actions)
│   │   ├── session-proxy.ts        # middleware — session refresh + gating
│   │   └── database.types.ts       # hand-maintained Supabase types
│   ├── repository.ts               # legacy interface (used only by /map)
│   └── mock/participants.ts        # deprecated — remove after cohort work lands
├── domain/
│   ├── profile-matching.ts         # weighted matching algorithm + criteria labels
│   ├── constants.ts                # COHORT_MIN_PARTICIPANTS, etc.
│   └── types.ts / schema.ts        # domain types + zod schemas
├── proxy.ts                        # top-level middleware entry point
└── styles/design-tokens.css        # RTR color palette + spacing tokens

supabase/
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_seed_data.sql
    ├── 003_api_grants.sql
    └── 006_add_age_to_profiles.sql
```

---

## 5. Key features at a glance

| Feature                        | Where                                                        |
| ------------------------------ | ------------------------------------------------------------ |
| **Landing + signup + login**   | `/`, `/auth/signup`, `/auth/login`                           |
| **5-step onboarding**          | `/onboarding` — gated until `profiles.onboarding_completed`  |
| **Learning journey**           | `/learn` — separate tracks by `profiles.is_indigenous`       |
| **Recommended matches**        | `/dashboard` → Recommended tab (weighted scoring)            |
| **All participants**           | `/dashboard` → All participants tab (list + map view)        |
| **Connections**                | `/dashboard` → Connections tab and `/connections/[id]`       |
| **Real-time chat**             | `/connections/[connectionId]` — Supabase Realtime            |
| **Zoom scheduling**            | Schedule call button in chat header                          |
| **Notification center**        | Bell icon in the top nav (realtime, deep-linked)             |
| **Facilitator overview**       | `/facilitator`                                               |
| **Match approval queue**       | `/facilitator/matching` — includes mutual connect review     |
| **Participant directory**      | `/facilitator/participants`                                  |
| **Regional map + cohort seeds**| `/map`                                                       |
| **Platform settings**          | `/facilitator/settings` — auto-matching + cohort threshold   |
| **Slide deck**                 | `/demo` (public, arrow-keys nav)                             |

---

## 6. Auth + routing gates

`src/proxy.ts` calls `updateSession()` in `src/data/supabase/session-proxy.ts`, which:

1. Refreshes the Supabase auth cookie so RLS sees the current user.
2. Redirects unauthenticated requests (except `/`, `/demo`, `/auth/*`) to `/auth/login`.
3. Redirects facilitators away from participant-only routes (`/onboarding`, `/learn`).
4. Forces participants through `/onboarding` → `/learn` → `/dashboard` in that order.
5. Blocks `/facilitator` for non-facilitator roles.

**Adding a new public page:** append its path to the `publicRoutes` array in `session-proxy.ts`.

---

## 7. Database

All tables live in the `public` schema with RLS on. Schema is in `supabase/migrations/`.

**Core tables:**

- `profiles` — extends `auth.users`; holds everything onboarding collects (bio, location, treaty area, interests, availability, matching prefs, `role`, `is_indigenous`, `onboarding_completed`, `learning_completed`, `map_consent`, `age`).
- `learning_modules` + `learning_progress` — LMS content and per-user completion.
- `matches` — facilitator-approved match rows; statuses: `suggested | approved | rejected | connected`.
- `connections` — chat threads created when a match is approved. Both parties must set `participant_a_connected` / `participant_b_connected = true`. Statuses: `pending | pending_review | active`.
- `messages` — real-time chat body.
- `meetings` — scheduled Zoom calls (id, join URL, start URL, `scheduled_at`, `duration_minutes`).
- `cohorts` + `cohort_members` — **placeholder tables — cohort UI is not yet built.**
- `system_settings` — `auto_matching_enabled` (bool), `cohort_threshold` (int).
- `notifications` — bell dropdown feed; types: `connect_request | match_approved | new_message | meeting_scheduled`.

**Realtime:** `messages` and `notifications` are added to the `supabase_realtime` publication in `001_initial_schema.sql`.

**Facilitator role:** currently seeded via SQL (see `002_seed_data.sql`). There's no UI to promote a participant to facilitator — set `profiles.role = 'facilitator'` directly.

---

## 8. Matching algorithm

`src/domain/profile-matching.ts` — pure function, no side effects.

```ts
score = locationPoints(30) + availabilityPoints(20) + sharedInterestsPoints(20)
      + languagePoints(10) + faithPoints(10) + formatPoints(10)
```

Only cross-background pairs are eligible (`is_indigenous !== other.is_indigenous`). See `criteriaLabels()` for the chips shown to facilitators and participants.

**Auto-matching setting** (`system_settings.auto_matching_enabled`):

- **ON** — mutual connect flow activates chat immediately.
- **OFF** — both parties clicking Connect moves the connection to `pending_review` for a facilitator to approve in the Matches tab.

---

## 9. Zoom integration

`src/app/api/zoom/create-meeting/route.ts`

- Uses **Server-to-Server OAuth** — no user-level OAuth. Requires all three env vars (`ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`).
- A fresh access token is minted on every request (tokens are ~1h).
- Meeting is scheduled under the app's owning account. The join URL is shared with both participants; the start URL is stored but currently unused in the UI.
- `Schedule call` button on the chat page auto-hides when there's an in-progress or future meeting; reappears once the meeting's end time passes.

**Rotating the client secret:** update in the Zoom marketplace app, then update `ZOOM_CLIENT_SECRET` in Vercel and redeploy.

---

## 10. Email (Supabase Auth via Resend)

Supabase Auth SMTP is configured in the Supabase dashboard to use Resend (`smtp.resend.com`, port `465`, username `resend`, password = Resend API key). Without this the default Supabase SMTP is rate-limited to a handful of emails per hour.

**Note:** the deployed demo uses `onboarding@resend.dev` as sender. Before going to production, verify a real domain in Resend and update the sender address.

---

## 11. Deployment

- **Vercel project:** `netverse-studio/rtr-platform` (linked to `main`).
- **Auto-deploy:** every push to `main` deploys to production and aliases `rtr-platform.vercel.app`.
- **Branch protection:** `main` is protected — push via PR only.
- **Vercel env vars:** managed via dashboard or `npx vercel env add`. Vercel marks them Sensitive when added via CLI, so you can't `env pull` the values back out.

To manually redeploy:

```bash
npx vercel --prod --scope netverse-studio
```

---

## 12. Test accounts

All demo accounts share the same password: **`RTRdemo2024!`**

| Role                     | Email                          |
| ------------------------ | ------------------------------ |
| Facilitator              | `facilitator@rtr-demo.ca`      |
| Facilitator              | `admin@rtr-demo.ca`            |
| Indigenous participant   | `mary.fineday@rtr-demo.ca`     |
| Non-Indigenous participant | `michael.chen@rtr-demo.ca`   |
| Fresh onboarding         | `test.new@rtr-demo.ca`         |
| Post-onboarding LMS test | `test.training@rtr-demo.ca`    |

Full list is in `supabase/seeds/participants.ts` (30+ synthetic profiles across every province).

---

## 13. What's NOT built yet — Cohorts

The map at `/map` already detects when a region has enough eligible participants (default 5, configurable in facilitator settings). The next milestone builds cohorts on top of that detection:

- [ ] Facilitator UI to **form a cohort** from a region on the map
- [ ] **Group invitations** to participants + accept/decline flow
- [ ] **Cohort event scheduling** (film screenings, blanket exercises)
  - June 21 (National Indigenous Peoples Day) and September 30 (Truth and Reconciliation Day) event templates
- [ ] **Group messaging** space for the cohort
- [ ] **Elected-leader banner** on the participant dashboard: "a cohort is ready in your city, would you like to lead it?"
- [ ] Cohort completion / graduation flow tied back to the RTR closing gathering

Tables `cohorts` and `cohort_members` already exist, so the schema is ready.

---

## 14. Known issues & gotchas

- **TypeScript version pinned to v5**: TypeScript 7 breaks Next.js's TS detection. If anyone bumps `typescript` in `package.json`, the Vercel build fails with `"required package(s) not installed"`.
- **Playwright tests** live under `boundary-interface-tests/` and are excluded from `tsconfig.json`. They're not wired into CI.
- **Zoom `start_url`** is stored but not surfaced — the "Join Zoom" link in chat uses `join_url` for everyone. Consider showing `start_url` to the scheduler so they can start the meeting as host.
- **Notifications** are only inserted from the app (chat, connect requests, meeting scheduled, match approved). No email or push notifications yet.
- **Learning content** is Markdown stored in `learning_modules.content_body`. Editing content today means running SQL updates — no admin CMS.
- **The `/map` page uses the legacy `getRepository()`** from `src/data/repository.ts` while everything else uses `createSupabaseServerClient()` directly. Consider migrating `/map` off the repository pattern so the mock repo can be deleted.
- **`.env.local`** is gitignored but was accidentally checked in early in history — audit if you rotate keys.

---

## 15. Design system

Color tokens live in `src/styles/design-tokens.css` and are exposed to Tailwind v4 via `@theme inline` in `src/app/globals.css`.

**Named palettes:**

- `spruce-{100..900}` — primary dark greens (nav, primary buttons)
- `ochre-{100..700}` — accent gold (badges, active tabs)
- `river-{100..700}` — accent teal
- `berry-{100,700}` — destructive/warning
- `birch`, `parchment`, `sand` — warm backgrounds
- `ink`, `ink-soft`, `ink-faint` — text hierarchy on light
- `on-dark`, `on-dark-soft` — text on the spruce nav

Typography: `Fraunces` (serif, headings), `Atkinson Hyperlegible Next` (sans, body), `Geist Mono`.

---

## 16. Handoff checklist

- [ ] Add new team members as collaborators on the GitHub repo
- [ ] Add new team members to the Vercel `netverse-studio` team
- [ ] Add new team members as owners of the Supabase project (`fwlkxtbehxwyykxtgusq`)
- [ ] Rotate: Zoom Client Secret, Supabase service role key, Resend API key
- [ ] Verify a real domain in Resend, update Supabase SMTP sender address
- [ ] Point a custom domain (e.g., `portal.rightrelationship.ca`) at the Vercel project
- [ ] Replace synthetic seed users with real facilitator accounts before opening signups
- [ ] Set up backups / point-in-time recovery on Supabase (Pro plan)
- [ ] Wire up an error reporting service (Sentry recommended) — currently only console.error
- [ ] Turn on Vercel Analytics or similar for real usage visibility
