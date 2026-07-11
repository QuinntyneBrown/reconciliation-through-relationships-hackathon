# Boundary interface tests

This directory contains Playwright tests for the user-visible frontend boundary. Tests use page
objects from `pages/` and never call production backend services.

The test harness starts:

- the Next.js app on `http://127.0.0.1:3100`;
- a deterministic Supabase-compatible HTTP double on `http://127.0.0.1:54329`.

The backend double serves auth and PostgREST requests made by both Next.js Server Components and
browser clients. It resets before every test. The Zoom route is mocked at the browser-to-Next API
boundary so no Zoom request can leave the suite. The regional map uses the app's in-memory
repository with Mapbox disabled.

## Run

```sh
npm run test:boundary
```

Install the browser once on a new machine if needed:

```sh
npx playwright install chromium
```

## Coverage map

| Area | Covered behavior |
| --- | --- |
| Landing and auth | Calls to action, anchor navigation, invalid login, role/gate routing, anonymous redirect |
| Shared navigation | Responsive menu, current-page state, participant account menu, sign-out |
| Onboarding | Required-field gates, all five steps, back/preserved state, profile payload, save failure |
| Learning | Module switching, progress persistence, automatic advance, completion redirect, failure retry |
| Dashboard | Recommendations, scores, connection states, tabs, combined filters, empty state, list/map modes |
| Profiles | Self profile, existing connection, approved-match connection request and notifications |
| Connections | Active/pending list, mutual acceptance, message history/send, call validation/error/success |
| Regional discovery | Consent/eligibility aggregates, cohort-ready and waiting regions, privacy exclusion |
| Facilitator | Overview counts, participant journey table, matching switch/create/approve/reject, settings |
| Access control | Participant/facilitator destinations and facilitator-route protection |
