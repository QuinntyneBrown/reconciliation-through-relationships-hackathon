# Contributing to Reconciliation Through Relationships

Thank you for helping improve Reconciliation Through Relationships (RTR). Contributions may include code, tests, design, documentation, issue triage, accessibility feedback, and product insight.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). For support or security concerns, use the channels in [SUPPORT.md](SUPPORT.md) and [SECURITY.md](SECURITY.md).

## Before contributing

- Search existing issues and pull requests before starting work.
- Open an issue for large features, schema changes, or changes affecting participant privacy, consent, Indigenous knowledge, safeguarding, or public positioning.
- Never include real participant information, credentials, access tokens, or other secrets in issues, fixtures, screenshots, commits, or logs.
- Use synthetic data in development and tests.

## Development setup

```bash
git clone https://github.com/QuinntyneBrown/reconciliation-through-relationships-hackathon.git
cd reconciliation-through-relationships-hackathon
npm ci
cp .env.example .env.local
npm run dev
```

The default mock data source supports local work without production services. See the [README](README.md) for prerequisites and environment details.

## Development workflow

1. Create a branch from the latest `main` using `feat/`, `fix/`, `docs/`, or `chore/` followed by a short description.
2. Keep the change focused and avoid unrelated formatting or refactoring.
3. For source behavior or public code-contract changes, follow acceptance test driven development: write or update an acceptance test, run it and confirm it fails for the expected reason, implement the smallest passing change, then refactor while green.
4. Documentation-only, repository metadata, configuration, and template changes do not require an acceptance test unless they alter runtime behavior. Run the smallest relevant formatting, link, schema, or configuration check instead.
5. Update user, architecture, operations, or changelog documentation when the public behavior or contributor workflow changes.
6. Open a pull request using the repository template and respond to review feedback.

Do not commit directly to `main`. Maintainers squash-merge approved pull requests after required checks pass.

## Quality gates

Install Chromium once before running the boundary suite on a new machine:

```bash
npx playwright install chromium
```

For changes to application behavior, run:

```bash
npm run test:boundary
npm run typecheck
npm run lint
npm run build
```

Use `npm run test:e2e` for critical full-stack journeys when the change requires it. The end-to-end suite needs configured external services; the [boundary suite](boundary-interface-tests/README.md) uses deterministic local doubles.

For non-behavior changes, run only the checks relevant to the files changed. Continuous integration runs type checking and a production build; contributors should also run lint locally for source changes.

## Architecture boundaries

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before changing module boundaries or data flow. Key conventions include:

- Routes and feature-specific components live under `src/app`.
- Shared domain types, schemas, and matching rules live under `src/domain`.
- Data access goes through repository or Supabase client boundaries under `src/data`; user interface components do not import mock datasets directly.
- External services must be replaceable with deterministic test doubles at the public boundary.
- Database changes require a forward migration under `supabase/migrations` and an update to [docs/DB_SCHEMA.md](docs/DB_SCHEMA.md).

## User interface contributions

Use the existing accessible primitives in `src/components/ui` and Lucide icons where available. Files scaffolded with shadcn/ui are owned application code; review diffs carefully instead of overwriting custom behavior during updates.

The values in `src/styles/design-tokens.css` are the shared design source of truth. Prefer semantic roles such as `bg-primary`, `text-heading`, and `border-input`. Public visual variants belong in CVA, component parts use `data-slot`, and repeated control styling belongs in a shared recipe.

Test keyboard interaction, focus visibility, responsive layouts, loading and error states, and text fitting for affected interfaces.

## Commits and pull requests

Write concise imperative commit subjects, for example `docs: clarify mock setup` or `onboarding: validate required location`. A pull request should:

- Explain the user or contributor problem and the resulting behavior
- Link related issues and architecture decisions
- Include acceptance evidence appropriate to the change
- Call out privacy, consent, accessibility, migration, deployment, and rollback implications
- Keep generated files and unrelated changes out of the diff

At least one maintainer approval is required. Maintainers may request additional stakeholder review for sensitive product, community, privacy, or data-governance changes.

## Recognition

Merged human contributions are recognized in [CONTRIBUTORS.md](CONTRIBUTORS.md) and the repository's contributors graph. Notable user-facing changes should also be added under `Unreleased` in [CHANGELOG.md](CHANGELOG.md).
