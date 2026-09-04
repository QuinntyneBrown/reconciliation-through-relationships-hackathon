# Page intro

The unit that opens a page: an eyebrow, a heading, a lead sentence, and a woven
strand beneath — with optional actions to the side. Source:
`src/components/page-intro.tsx`.

![A page intro on a birch background. A small ochre uppercase eyebrow reads "RECONCILIATION THROUGH RELATIONSHIPS"; below it a large Fraunces heading reads "Design system & component library"; below that a muted lead paragraph; and beneath the lead a short woven strand of interlacing river and ochre marks the end of the intro.](../images/page-intro.png)

## Overview

Every page begins the same way, so people always know where the content starts:
a small ochre **eyebrow** names the section, a Fraunces **heading** names the
page, an optional **lead** sets the tone in one sentence, and a
[woven strand](rtr-brand.md) closes the unit like a threshold crossed. Actions —
a primary button, or a small settings control — sit to the right on wide screens
and drop below the heading on narrow ones.

Using one component for every page header keeps the rhythm identical across the
app and guarantees the “once per view” weave rule is honoured without anyone
having to remember it.

## Import

```tsx
import { PageIntro } from "@/components/page-intro";

<PageIntro
  eyebrow="Your relationship journey"
  title="Welcome, friend"
  description="Discover thoughtful recommendations, connect at your own pace, and see reconciliation circles forming near you."
/>

// With a side action
<PageIntro
  eyebrow="Facilitated introductions"
  title="Match management"
  description="Review, approve, or create matches between participants."
  actions={<Button>New match</Button>}
/>
```

## Anatomy

| Part | Prop | Rendering |
| --- | --- | --- |
| Eyebrow | `eyebrow` | `.rtr-eyebrow` — ochre-700, 12.5px, bold, uppercase, wide tracking |
| Heading | `title` | `<h1>` in Fraunces (required) |
| Lead | `description` | `.rtr-lead` — ink-soft, 19px, relaxed line height; accepts rich nodes |
| Weave | — | A 120px [woven strand](rtr-brand.md), always present, under the lead |
| Actions | `actions` | Right-aligned on `sm+`, wrapping; drops below on narrow screens |

The intro is a flex unit: heading block on the left (capped at `max-w-3xl` for
readable line length), actions on the right, aligned to the baseline of the
heading block on wide screens.

## API

```tsx
<PageIntro
  eyebrow={string}         // optional section label
  title={string}           // page heading (required)
  description={ReactNode}   // optional lead; string or rich nodes
  actions={ReactNode}       // optional right-side actions
  className={string}
/>
```

Only `title` is required. `description` is a `ReactNode`, so the map page passes a
full paragraph with emphasis rather than a bare string.

## In the app

The same unit opens every top-level page — a useful set of real examples:

| Page | Eyebrow | Title |
| --- | --- | --- |
| Dashboard | Your relationship journey | Welcome, {first name} |
| Connections | Walking together | My connections |
| Regional map | Consent-first discovery | Regional map & cohorts |
| Facilitator overview | Facilitator workspace | Community overview |
| Match management | Facilitated introductions | Match management |
| Platform settings | Platform administration | Platform settings |

## Writing guidelines

- The eyebrow is a *theme*, not a repeat of the title: “Walking together” over “My
  connections,” “Consent-first discovery” over “Regional map & cohorts.”
- Keep the lead to one sentence that sets tone and orients — it’s not a place for
  instructions.
- **One page intro per view, and therefore one weave.** Don’t add a second
  standalone [weave](rtr-brand.md) to the same screen; the intro already carries
  it.
- Heading and eyebrow are sentence and label case respectively — no trailing
  punctuation.

## Accessibility

- `title` renders the page’s single `<h1>`, anchoring the heading outline; don’t
  place another `<h1>` on the page.
- The weave is decorative (`aria-hidden`) and adds no reading noise.
- The eyebrow’s meaning is textual, not colour-borne — it reads as a label even
  without its ochre. See [Accessibility](../foundations/08-accessibility.md).

## Related

- [RTR brand](rtr-brand.md) — the weave the intro embeds
- [Typography](../foundations/04-typography.md) — the heading and lead scale
- [Brand & motifs](../foundations/06-brand-and-motifs.md) — the once-per-view weave rule
- [Button](button.md) — the actions that sit beside the heading
