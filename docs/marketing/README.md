# Marketing materials

Short-form, on-brand PDF one-sheets for the Reconciliation Through
Relationships platform. Every document ships in two versions:

- **Desktop** — a single US Letter page for screens, email attachments, and
  print.
- **Mobile** — phone-aspect pages with large type, designed to be read on a
  phone (full-page cover, stacked capability cards, closing back cover).

## Documents

| Document | Covers | Desktop | Mobile |
| --- | --- | --- | --- |
| Platform overview | All six capabilities and the four-step journey | [PDF](rtr-platform-overview-desktop.pdf) | [PDF](rtr-platform-overview-mobile.pdf) |
| The journey | How it works end to end, plus the design commitments | [PDF](rtr-the-journey-desktop.pdf) | [PDF](rtr-the-journey-mobile.pdf) |
| Guided onboarding | Registration and the five-step introduction | [PDF](rtr-guided-onboarding-desktop.pdf) | [PDF](rtr-guided-onboarding-mobile.pdf) |
| Learning journey | Videos, readings, and progress tracking | [PDF](rtr-learning-journey-desktop.pdf) | [PDF](rtr-learning-journey-mobile.pdf) |
| Guided matching | Facilitator review and mutual consent | [PDF](rtr-guided-matching-desktop.pdf) | [PDF](rtr-guided-matching-mobile.pdf) |
| Community & regional map | Discovery, cohorts, and privacy | [PDF](rtr-community-map-desktop.pdf) | [PDF](rtr-community-map-mobile.pdf) |
| Messaging & meetings | Connection requests, messaging, scheduling | [PDF](rtr-messaging-meetings-desktop.pdf) | [PDF](rtr-messaging-meetings-mobile.pdf) |
| Facilitator tools | Dashboards, matching queue, cohort settings | [PDF](rtr-facilitator-tools-desktop.pdf) | [PDF](rtr-facilitator-tools-mobile.pdf) |

## Brand fidelity

The materials use the product design system directly — see
[docs/design-system](../design-system/README.md):

- **Color**: the spruce/ochre/river/birch palette from
  `src/styles/design-tokens.css`.
- **Type**: Fraunces for headings and quotes, Atkinson Hyperlegible for
  everything read at length, per the
  [typography foundation](../design-system/foundations/04-typography.md).
- **Motifs**: the two-arc brand mark, the woven strand (once per view), and
  the panel-on-dark figure at 5% opacity, per
  [brand & motifs](../design-system/foundations/06-brand-and-motifs.md).

All claims in the copy come from [README.md](../../README.md),
[the user guide](../guide/README.md), and the design-system principles.

## Regenerating

The PDFs are built from HTML templates by headless Chromium — no npm
dependencies:

```bash
node docs/marketing/src/build.mjs
```

Chromium is resolved from `$RTR_CHROMIUM`, then
`$PLAYWRIGHT_BROWSERS_PATH/chromium`, then `chromium` on `PATH`. Copy lives
in [src/content.mjs](src/content.mjs); layout in [src/desktop.css](src/desktop.css)
and [src/mobile.css](src/mobile.css); shared tokens and motifs in
[src/brand.css](src/brand.css).

## Font licensing

[Fraunces](https://fonts.google.com/specimen/Fraunces) and
[Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible)
are bundled in [src/fonts](src/fonts) under the
[SIL Open Font License 1.1](https://openfontlicense.org/), which permits
bundling and redistribution.
