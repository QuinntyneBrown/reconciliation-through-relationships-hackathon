# Contributing

Written for a mixed team (frontend, backend, PM, design) moving fast together. The goal: **everyone can push to the same repo without stepping on each other.**

## Golden rules

1. **Never commit straight to `main`.** Always branch → PR.
2. **Small PRs, merged often.** A 100-line PR reviewed in 5 min beats a 1,000-line PR nobody understands.
3. **`main` must always run.** If your branch breaks `npm run build`, don't merge it.
4. **Talk in the open** — drop a message when you start on a file others touch.

## Git flow

```bash
git checkout main && git pull            # start from latest
git checkout -b feat/onboarding-form     # branch per task

# ...work, commit small...
git add -A && git commit -m "onboarding: add category checkboxes"

git push -u origin feat/onboarding-form  # open a PR on GitHub
```

**Branch names:** `feat/…`, `fix/…`, `docs/…`, `chore/…`.

**Before you open a PR**, run:

```bash
npm run typecheck && npm run lint && npm run build
```

Get one teammate to approve. Squash-merge. Delete the branch.

### Avoiding conflicts

- Work stays inside your squad's folders as much as possible (see below).
- Pull `main` into your branch at least once a day: `git merge main`.
- Shared files (`src/domain/*`, `src/data/repository.ts`) change rarely and affect everyone — **ping the team before editing them.**

## Who owns what

Each squad mainly lives in its own folders, so parallel work rarely collides.

| Squad | Owns | Talks to |
|-------|------|----------|
| **Onboarding** | `app/onboarding`, `app/api/participants`, intake form | Backend (schema, repo) |
| **Learning** | `app/learn`, learning progress | Backend (learningStatus) |
| **Map** | `app/map`, map component | Backend (regions, privacy) |
| **Matching** | `app/facilitator/*`, `domain/matching.ts` | Backend (matches) |
| **Backend** | `data/`, `domain/`, Supabase, auth | Everyone |
| **Design / PM** | `docs/DECISIONS.md`, synthetic data, tokens in `styles/design-tokens.css`, copy | Everyone |

Design & PM can contribute directly: edit demo data in [`src/data/mock/participants.ts`](src/data/mock/participants.ts), tweak theme values in [`src/styles/design-tokens.css`](src/styles/design-tokens.css), and keep [`docs/DECISIONS.md`](docs/DECISIONS.md) current as RTR answers open questions. `src/app/globals.css` maps those shared values into Tailwind utilities.

## The one rule that keeps us unblocked

**Frontend never imports Supabase (or mock data) directly.** Everything goes through the repository:

```ts
import { getRepository } from "@/data";
const repo = getRepository();
const participants = await repo.listParticipants();
```

This means frontend builds against mock data on day one, and backend swaps in Supabase later **without touching a single page.** See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Adding UI components

Use shadcn/ui to scaffold accessible primitives:

```bash
npx shadcn@latest add <component>   # e.g. dropdown-menu, form, calendar
```

Files under `src/components/ui` are owned application code after scaffolding. Adapt them to the
semantic tokens and component conventions already in the repository; do not overwrite customized
components during a shadcn update without reviewing the diff. Public visual variants belong in CVA,
component parts use `data-slot`, and repeated control styling belongs in a shared recipe.

The token values in `src/styles/design-tokens.css` are the single source of truth. Both the production
Tailwind theme and `docs/mocks/rtr.css` consume that file. Use semantic roles such as `bg-primary`,
`text-heading`, and `border-input` in components; reserve palette names such as `spruce` and `ochre`
for token definitions and deliberately branded artwork.

## Style

- Prettier + ESLint are configured. Run `npm run format` before committing.
- TypeScript strict mode is on. Prefer types from `src/domain` over redefining shapes.
