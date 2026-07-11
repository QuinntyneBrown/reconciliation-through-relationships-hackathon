# RTR Platform — Implementation Plan

**Reconciliation Through Relationships**
**Stack:** Next.js 15 (App Router) · Supabase · Tailwind CSS · shadcn/ui · Mapbox GL JS · Zoom OAuth · Resend

---

## Architecture Overview

```
app/
  (public)/            Landing page, magic link login, email verify
  (onboarding)/        Multi-step profile form (blocked until auth)
  (learning)/          LMS — sidebar + content (blocked until profile complete)
  (participant)/       Dashboard, profile views, connections, chat
  (facilitator)/       Admin dashboard, matches, cohorts, settings
```

### User Roles

| Role | Description |
|---|---|
| `participant` | Indigenous or Non-Indigenous. Completes onboarding → LMS → Dashboard. |
| `facilitator` | Seeded admin. No LMS required. Full access to all participants, matches, cohorts. |

### Journey Gates

```
Sign Up
  └─► Complete Profile (onboarding)
        └─► Complete Learning Journey (LMS — different track per background)
              └─► Dashboard (matches, all participants, map, chat, Zoom)
```

---

## Database Schema

### `profiles` (extends `auth.users`)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | = auth.users.id |
| first_name | text | |
| last_name | text | |
| bio | text | free-text |
| additional_matching_info | text | free-text |
| is_indigenous | boolean | |
| sex | text | 'male' \| 'female' \| 'prefer_not_to_say' |
| participation_categories | text[] | multi-select |
| city | text | |
| province | text | |
| treaty_area | text | free-text; native-land.ca link helper |
| faith_tradition | text | enum value |
| faith_tradition_other | text | when 'other' selected |
| interests | text[] | tags/keywords |
| availability | jsonb | {days: [], times: []} |
| participation_format | text[] | 'in_person' \| 'online' \| 'chat_only' |
| language_preferences | text[] | 'english' \| 'french' |
| personal_boundaries | text | free-text |
| matching_preferences | jsonb | {weight_sex, weight_interests, weight_location} |
| role | text | 'participant' \| 'facilitator' |
| onboarding_completed | boolean | |
| learning_completed | boolean | |
| map_consent | boolean | |
| lat | float | city-level only |
| lng | float | city-level only |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `learning_modules`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| title | text | |
| description | text | |
| content_type | text | 'video' \| 'text' |
| content_url | text | YouTube embed URL |
| content_body | text | rich text for text modules |
| duration_minutes | int | |
| order_index | int | |
| audience | text | 'non_indigenous' \| 'indigenous' \| 'all' |
| is_required | boolean | |

### `learning_progress`
| Column | Type |
|---|---|
| id | uuid PK |
| user_id | uuid → profiles.id |
| module_id | uuid → learning_modules.id |
| completed | boolean |
| completed_at | timestamptz |
| UNIQUE | (user_id, module_id) |

### `matches`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| indigenous_participant_id | uuid → profiles.id | |
| non_indigenous_participant_id | uuid → profiles.id | |
| match_score | float | 0–100 |
| match_criteria | jsonb | per-criterion breakdown |
| status | text | 'suggested' \| 'approved' \| 'rejected' \| 'connected' |
| auto_generated | boolean | true if system-generated |
| created_by | uuid → profiles.id | facilitator who created/approved |
| approved_by | uuid → profiles.id | |
| approved_at | timestamptz | |

### `connections`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| match_id | uuid → matches.id | |
| participant_a_id | uuid → profiles.id | |
| participant_b_id | uuid → profiles.id | |
| participant_a_connected | boolean | clicked "Connect" |
| participant_b_connected | boolean | clicked "Connect" |
| connected_at | timestamptz | when both clicked |
| status | text | 'pending' \| 'active' |

### `messages`
| Column | Type |
|---|---|
| id | uuid PK |
| connection_id | uuid → connections.id |
| sender_id | uuid → profiles.id |
| content | text |
| read_at | timestamptz |
| created_at | timestamptz |

### `meetings`
| Column | Type |
|---|---|
| id | uuid PK |
| connection_id | uuid → connections.id |
| zoom_meeting_id | text |
| zoom_join_url | text |
| zoom_start_url | text |
| scheduled_at | timestamptz |
| duration_minutes | int |
| topic | text |
| created_by | uuid → profiles.id |

### `cohorts`
| Column | Type |
|---|---|
| id | uuid PK |
| name | text |
| city | text |
| province | text |
| facilitator_id | uuid → profiles.id |
| status | text ('forming' \| 'active') |

### `cohort_members`
| Column | Type |
|---|---|
| id | uuid PK |
| cohort_id | uuid → cohorts.id |
| participant_id | uuid → profiles.id |
| joined_at | timestamptz |

### `system_settings`
| Column | Type |
|---|---|
| key | text PK |
| value | jsonb |
| updated_by | uuid → profiles.id |
| updated_at | timestamptz |

---

## Matching Algorithm (server-side, weighted)

| Criterion | Max Points |
|---|---|
| Same city | 30 |
| Same province (if not same city) | 15 |
| Availability overlap | 20 |
| Shared interests (proportional count) | 20 |
| Language match | 10 |
| Faith tradition match | 10 |
| Participation format compatible | 10 |

- Score range: 0–100
- Only Indigenous ↔ Non-Indigenous matches are suggested
- Facilitator sees per-criterion breakdown before approving
- `auto_matching_enabled` in `system_settings` controls whether the algorithm runs on schedule or manually only

---

## Implementation Phases

### Phase 1 — Foundation ✅ (in progress)
- [x] Next.js 15 project init (TypeScript, Tailwind, shadcn/ui)
- [ ] Supabase DB schema migrations
- [ ] Magic link auth flow (Supabase Auth)
- [ ] Middleware: route protection + role-based redirects
- [ ] Landing page
- [ ] `.env.local` template

### Phase 2 — Onboarding
- [ ] Step 1: Basic Info (name, bio, additional_matching_info, sex, is_indigenous, participation_categories)
- [ ] Step 2: Location & Treaty (city, province, treaty_area with native-land.ca helper link)
- [ ] Step 3: Faith & Interests (faith_tradition, interests tags)
- [ ] Step 4: Availability & Format (days/times, participation_format, language_preferences)
- [ ] Step 5: Matching Preferences (personal_boundaries, matching_preferences weights, map_consent)
- [ ] Profile completion gate (middleware blocks LMS until onboarding_completed = true)

### Phase 3 — Learning Journey / LMS
- [ ] LMS layout: left sidebar (module list + progress bar) + main content area
- [ ] Video module: YouTube embed
- [ ] Text module: rich text display
- [ ] Per-module completion tracking (mark complete button + time tracking)
- [ ] Resume from last incomplete module
- [ ] Different tracks: Non-Indigenous (4 modules) vs Indigenous (2 modules)
- [ ] Dashboard gate (middleware blocks dashboard until learning_completed = true)
- [ ] Placeholder content seeded

### Phase 4 — Participant Dashboard + Matching
- [ ] "Recommended" tab: top 5 matches with % score and per-criterion chips
- [ ] "All Participants" tab: list view + Mapbox map (city-level)
- [ ] Filters: province, interests, faith, format, language
- [ ] Profile view page with all public info
- [ ] Connect button + mutual consent logic
- [ ] Waitlist state for non-Indigenous with no available match
- [ ] Supabase Realtime notifications (connect request received)

### Phase 5 — Connections, Chat & Zoom
- [ ] Real-time chat UI per connection (Supabase Realtime)
- [ ] Unread message badge
- [ ] Zoom OAuth flow: app-level OAuth, create meeting via API
- [ ] "Schedule First Call" button creates Zoom meeting, surfaces join links
- [ ] Subsequent call scheduling with availability display

### Phase 6 — Facilitator Dashboard
- [ ] All participants table (sortable, searchable) + progress status
- [ ] Participant map view
- [ ] Suggested matches queue with approve / reject / manual override
- [ ] Create manual match UI
- [ ] Auto-matching toggle (system_settings key)
- [ ] Regional cohort detection: highlight cities with 5+ eligible participants
- [ ] Cohort formation + member management
- [ ] Elected leader cohort banner on participant dashboard

### Phase 7 — Seed Data + Polish
- [ ] Seed script: 30 synthetic participants (mix of Indigenous/Non-Indigenous, various provinces)
- [ ] 2 facilitator accounts seeded
- [ ] Email reminders via Resend (incomplete onboarding, incomplete LMS)
- [ ] Mobile responsiveness audit
- [ ] Cultural design: warm earth tones, welcoming copy

---

## Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Auth | Magic link (Supabase Auth) | Simplest UX, no password reset needed |
| Map | Mapbox GL JS | Best visual quality, free tier adequate |
| Chat | Supabase Realtime | Already in stack, no extra service |
| Meetings | Zoom OAuth API | Real integration, org has dev account |
| Email | Resend | Simple API, generous free tier |
| Map privacy | City-level only | Protect participant location |
| Treaty area | Free-text + native-land.ca link | API too limited for hackathon |
| Facilitators | Seeded, not self-signup | Controlled access |

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_MAPBOX_TOKEN=

ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_REDIRECT_URI=

RESEND_API_KEY=
```
