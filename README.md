<div align="center">
  <img src="public/rtr-logo.png" alt="Reconciliation Through Relationships" width="220">

# Reconciliation Through Relationships

A digital platform for learning, listening, and building meaningful relationships between Indigenous and non-Indigenous people.

[![Build](https://github.com/QuinntyneBrown/reconciliation-through-relationships-hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/QuinntyneBrown/reconciliation-through-relationships-hackathon/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-107C10.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Code style: Prettier](https://img.shields.io/badge/code_style-Prettier-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-0078D4.svg)](CONTRIBUTING.md)

[User guide](docs/guide/README.md) | [Architecture](docs/ARCHITECTURE.md) | [Contributing](CONTRIBUTING.md) | [Deployment](docs/deployment/README.md)
</div>

## About the project

Reconciliation Through Relationships (RTR) helps participants move from registration and a shared learning journey to facilitator-supported, local relationship building. The application is developed in partnership with [Reconciliation Through Relationships](https://rightrelationship.ca/) in response to the Truth and Reconciliation Commission of Canada's Calls to Action.

This repository began as a hackathon project. It uses synthetic data for development and demonstration; it must not be treated as a production system of record without an independent privacy, security, accessibility, and operational review. The original challenge is available in [docs/challenge.txt](docs/challenge.txt).

## Features

- Guided participant registration and five-step onboarding
- Shared reconciliation learning journey with progress tracking
- Facilitator-reviewed participant recommendations and mutual consent
- Participant discovery, regional cohort map, and privacy controls
- Connection requests, direct messaging, and meeting scheduling
- Facilitator dashboards for participant progress, matching, and cohort settings
- Mock data mode for local development without external services

See the [illustrated user guide](docs/guide/README.md) for the complete participant and facilitator journeys.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm (included with Node.js)
- [Supabase](https://supabase.com/) credentials for authentication and persistent journeys

### Local development

```bash
git clone https://github.com/QuinntyneBrown/reconciliation-through-relationships-hackathon.git
cd reconciliation-through-relationships-hackathon
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page and mock-backed routes work with the default `DATA_SOURCE=mock`; authenticated participant and facilitator journeys require the Supabase values documented in [.env.example](.env.example) and migrations in [supabase/migrations](supabase/migrations).

Never commit `.env.local`, service-role keys, access tokens, or participant data.

## Technology

| Area | Technologies |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Interface | Tailwind CSS 4, shadcn/ui, Base UI, Lucide |
| Validation | Zod |
| Data and authentication | Supabase, PostgreSQL, row-level security |
| Integrations | Mapbox, Zoom |
| Quality | Playwright, ESLint, Prettier, TypeScript |

## Testing

Before opening a pull request that changes application behavior, run the complete local quality gate:

```bash
npm run test:boundary
npm run typecheck
npm run lint
npm run build
```

The boundary suite uses deterministic local doubles and does not call production services. See the [boundary test guide](boundary-interface-tests/README.md) for its coverage and one-time browser setup. The slower browser journeys are available through `npm run test:e2e` and require the environment described under [e2e](e2e).

## Project structure

```text
src/app/                    Next.js routes and feature-specific components
src/components/             Shared application and UI components
src/domain/                 Domain types, validation, and matching rules
src/data/                   Mock and Supabase data implementations
src/styles/                 Shared design tokens
supabase/                   Database migrations and seed tooling
boundary-interface-tests/   Fast public-boundary acceptance suite
e2e/                        Critical end-to-end browser journeys
docs/                       Architecture, product, and operations documentation
```

## Documentation

| Document | Purpose |
| --- | --- |
| [User guide](docs/guide/README.md) | Screen-by-screen participant and facilitator instructions |
| [Design system](docs/design-system/README.md) | Foundations and UI component reference with screenshots |
| [Architecture](docs/ARCHITECTURE.md) | Concise system layers and data flow |
| [Architecture description](docs/SOFTWARE_ARCHITECTURE_DESCRIPTION.md) | Detailed ISO/IEC/IEEE 42010-aligned system description |
| [Database schema](docs/DB_SCHEMA.md) | Tables, relationships, privacy safeguards, and open decisions |
| [Architecture decisions](docs/DECISIONS.md) | Product and technical decisions requiring alignment |
| [Deployment guide](docs/deployment/README.md) | Provider comparison, deployment options, and cost controls |
| [Marketing materials](docs/marketing/README.md) | On-brand PDF one-sheets for the platform and each capability |

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the acceptance-test-first workflow, branch conventions, quality gates, and project boundaries. Participation is governed by the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

The people who have helped build the project are recognized in [CONTRIBUTORS.md](CONTRIBUTORS.md), and notable changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## Security

Do not report vulnerabilities in a public issue. Follow [SECURITY.md](SECURITY.md) to submit a private report. For usage questions and non-sensitive problems, see [SUPPORT.md](SUPPORT.md).

## Governance

Maintainer responsibilities, decision making, and the path to becoming a maintainer are described in [GOVERNANCE.md](GOVERNANCE.md).

## License

Copyright (c) 2026 Reconciliation Through Relationships contributors. Released under the [MIT License](LICENSE).
