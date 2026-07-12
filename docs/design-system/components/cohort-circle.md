# Cohort circle

The signature component of Reconciliation Through Relationships. Each seat is
an eligible participant in a region; when the region reaches its threshold the
circle turns ochre and gains a dashed gathering ring — it is ready to form a
reconciliation cohort. Source: `src/components/cohort-circle.tsx`.

![Five cohort circles in a row showing the progression toward a gathering. "Beginning" has one spruce seat filled and reads 1 of 5; "Forming" has three spruce seats and reads 3 of 5; "One away" has four spruce seats and reads 4 of 5; "Ready to gather" is all five ochre seats inside a dashed ochre ring and reads 5 ready; and a small version for maps and lists shows five ochre seats and the number 5 with no caption.](../images/cohort-circle.png)

## Overview

The cohort circle answers one question at a glance: *how close is this region
to gathering?* Seats sit evenly around a ring, one per eligible participant, and
the centre always shows the running count. Nothing about the meaning depends on
colour alone — the number and the outlined empty seats carry the same
information for anyone who can't distinguish spruce from ochre.

The moment the count reaches the threshold, three things change together: the
filled seats turn from spruce to ochre, a dashed ochre ring appears around the
whole circle, and the caption switches from “of 5” to “ready.” That shift is the
emotional peak of the product — a region has enough people to begin.

The threshold is **configurable per deployment**. It defaults to 5
(`COHORT_MIN_PARTICIPANTS` in `src/domain/constants.ts`), and a facilitator can
change it on the [platform settings](../../mocks/page-30-facilitator-settings.html)
page, where the field accepts a whole number from **3 to 20**.

## Import

```tsx
import { CohortCircle } from "@/components/cohort-circle";

// A region with 4 of 5 seats filled — "one away"
<CohortCircle count={4} />

// Small variant on a map card, threshold pulled from settings
<CohortCircle count={r.eligibleCount} threshold={COHORT_MIN_PARTICIPANTS} />

// Compact circle inside a dashboard banner
<CohortCircle count={count} size="sm" />
```

## Seats

Every seat is a dot orbiting the centre; the component lays out exactly
`threshold` seats, one full turn apart, and fills the first `count` of them.
When `count` exceeds `threshold` the extra participants don’t add seats — the
ring stays full and only the centre number keeps climbing.

| Seat | Rendering |
| --- | --- |
| Empty | 2px `border-strong` outline on a parchment fill |
| Filled, below threshold | Solid spruce-600 |
| Filled, at or above threshold | Solid ochre-600 |
| Gathering ring | 2px dashed ochre-500 around the whole circle; appears **only** when ready |

The centre shows the count in Fraunces (spruce-800). At the default size a small
uppercase caption sits beneath it: `of {threshold}` while forming, `ready` once
the threshold is met.

## Status

The circle itself has one real state change — *forming* versus *ready*. The
words beneath each specimen (“Beginning,” “Forming,” “One away,” “Ready to
gather”) are editorial labels the surrounding UI chooses to narrate the
progression; they are **not** props. Everything is derived from `count` against
`threshold`.

| Editorial label | Example (threshold 5) | What the circle shows |
| --- | --- | --- |
| Beginning | 1 of 5 | One spruce seat, four outlines |
| Forming | 3 of 5 | Several spruce seats |
| One away | 4 of 5 | Every seat but one filled |
| **Ready to gather** | 5 of 5 | All seats ochre, dashed ring, caption reads “ready” |

The map page renders the same idea as a companion [Badge](badge.md): `Ready to
gather` when the region can form, or `{n} seats remaining` while it can’t.

## Sizes

| Size | Diameter | Seat | Centre caption |
| --- | --- | --- | --- |
| `default` | 104px | 16px | Count plus `of {threshold}` / `ready` |
| `sm` | 64px | 11px | Count only — no caption |

Use `default` where the circle is the focus of a card, as on the
[regional map](../../mocks/page-25-map.html). Use `sm` where it rides alongside
text in a dense row, as in the dashboard cohort banner
(`src/app/dashboard/components/CohortBanner.tsx`).

## API

```tsx
<CohortCircle
  count={number}          // eligible participants in the region (required)
  threshold={number}      // seats to fill before "ready"; default 5
  size="default | sm"     // default "default"
  className={string}
/>
```

There is no `status` or `ready` prop — readiness is computed as `count >=
threshold`. Passing a `count` above `threshold` is safe: the ring caps at
`threshold` seats and the centre keeps the true number.

## Writing guidelines

- Keep the surrounding copy in the register of gathering, not metrics: “one away
  from a reconciliation cohort,” “circles take time.” The number does the
  counting; the words carry the meaning.
- Reserve the celebratory “Ready to gather” language for the ochre state. While a
  circle is still forming, describe the distance left (“{n} seats remaining”),
  never a percentage.
- Don’t place two default-size circles side by side competing for attention; if a
  view lists many regions, use `sm`.

## Accessibility

- The component is a single labelled image: `role="img"` with an `aria-label` of
  the form `“{count} of {threshold} seats filled”`, plus `“, ready to gather”`
  when the threshold is met. A screen reader hears the state without seeing the
  colour.
- Meaning never rests on colour alone — the count is always spelled out and empty
  seats stay visible as outlines, satisfying the
  [colour-independence rule](../foundations/08-accessibility.md).
- The individual seats and the ring are decorative (`aria-hidden`), so the label
  is read once, not fifteen times.

## Related

- [Badge](badge.md) — the `Ready to gather` / `seats remaining` status pill shown beside the circle
- [Alert](alert.md) — the dashboard cohort banner that embeds a small circle
- [Brand & motifs](../foundations/06-brand-and-motifs.md) — the circle as a relationship motif
- [Colour](../foundations/03-color.md) — spruce and ochre roles
