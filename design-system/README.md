# RTR Design System

`design-system/` is now a standalone Vite product for the Reconciliation Through Relationships hackathon project.

## Run locally

```bash
cd design-system
npm ci
npm start
```

The catalog serves at `http://127.0.0.1:5175/`.

## Validate and test

```bash
npm run validate
npm run test:browser
npm test
```

- `validate` checks version parity, manifest coverage, demo coverage, file references, and custom-element attribute drift.
- `test:browser` runs Playwright against the built static site at mobile, tablet, and desktop widths.
- `test` runs validation first, then the browser suite.

## Build and deploy

```bash
npm run build
npm run preview
```

`vite build` emits a static `dist/` folder with relative paths (`base: './'`) so the catalog can be deployed independently, including Azure Static Web Apps.

The repository workflow `.github/workflows/deploy-design-system.yml` deploys
this folder to Azure Static Web Apps when `main` changes. Configure the
`AZURE_STATIC_WEB_APPS_API_TOKEN` repository secret with the deployment token
from the Static Web App resource before enabling the workflow.

## Architecture overview

- `component-manifest.json` is the single source of truth for foundations, component metadata, API summaries, and examples.
- `assets/tokens.css` is copied from `src/styles/design-tokens.css` so the design-system deploys without the Next.js app.
- `assets/catalog.js` provides hash routing, navigation, search, and manifest-driven page rendering.
- `assets/catalog-content.js` owns the live fixtures used by `index.html` and `preview.html`.
- `assets/components/` contains native custom elements for the core interactive primitives.
- Existing long-form references remain in `components/*.md` and `foundations/*.md`.

## Existing authored documentation

The catalog complements the markdown documentation already in this folder. Each catalog page links back to its corresponding markdown reference so detailed design writing and the interactive catalog stay aligned.
