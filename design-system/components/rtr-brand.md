# RTR brand

The brand mark, the linked wordmark lockup, and the woven divider — the three
pieces that carry the identity of Reconciliation Through Relationships across
the app. All three are exported from `src/components/rtr-brand.tsx`.

![Three brand elements on parchment cards. "The mark" is two arcs — ochre on the right, teal-river on the left — forming one open circle around two dots, one ochre and one river. "The muted mark" is the same circle in birch-grey with the dots removed and one strand dashed. "The woven strand" is a horizontal band of two interlacing river and ochre strands, used as a divider.](../images/brand-marks.png)

## Overview

The mark is two arcs — ochre and river — that together form a single circle
around two dots: two people held by one relationship. The circle is **open at
the top and bottom**, so the relationship is never closed to others. A muted
variant drains the colour, removes the dots, and dashes one strand; it stands in
wherever a relationship hasn’t formed yet, most often inside an
[empty state](empty-state.md). The woven strand echoes the same two colours as an
interlacing divider.

These are geometric abstractions of gathering, not depictions of any specific
nation or tradition. Final iconography is to be reviewed with RTR’s Indigenous
leadership; treat the current marks as the working system, not the last word.

## Import

```tsx
import { BrandMark, RtrBrand, Weave } from "@/components/rtr-brand";

<BrandMark />                     // the colour mark
<BrandMark muted />               // birch-grey, dots removed, one strand dashed
<RtrBrand href="/dashboard" />    // linked mark + two-line wordmark
<Weave className="w-[120px]" />   // woven divider
<Weave onDark className="w-[240px]" />  // lightened for spruce panels
```

## BrandMark

The mark alone: a 32×32 SVG, `size-8` (32px) by default and resized with
`className`. Two round-capped arcs form the circle — ochre (`#E0A34E`) sweeping
the right, river (`#7FB5AE`) the left — with two dots at the centre, one in each
colour.

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| `muted` | `boolean` | `false` | Both strands become birch-grey (`#C9BCA3`), the two dots are removed, and the river strand is dashed |
| `className` | `string` | — | Sizing and layout (e.g. `size-16`) |

The mark is decorative (`aria-hidden="true"`): it carries no text alternative of
its own, because it always sits beside a wordmark or a heading that names the
context. The muted mark is the standard illustration at the top of every
[empty state](empty-state.md).

## RtrBrand

The lockup used as the app’s home link: the colour mark (30px) beside a two-line
wordmark — **“Reconciliation”** in Fraunces over **“Through Relationships”** in
small uppercase letterspacing. It wraps a Next.js `Link`.

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| `href` | `string` | `"/dashboard"` | Link destination |
| `className` | `string` | — | Layout overrides |

The wordmark is coloured for dark surfaces (`on-dark` parchment with an
`on-dark-soft` second line), so it belongs on the spruce
[app header](app-header.md) and the spruce signup aside, not on a light card.
The full name is always written in two lines exactly as above — never collapse
the wordmark itself to an abbreviation or a shortened product name. “RTR” is
fine as shorthand in running text.

## Weave

Two strands interlacing, rendered as a repeating background on a 12px-tall
`<div>`. It marks a threshold — under a page title, or as a section divider — and
appears **once per view**, never as wallpaper.

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| `onDark` | `boolean` | `false` | Lightens both strands (river and ochre) for spruce-800/900 panels |
| `className` | `string` | — | Sets the width (e.g. `w-[120px]`, `w-[240px]`) |

The weave is decorative (`aria-hidden`). It is baked into
[Page intro](page-intro.md), so most pages get their weave for free; add a
standalone `<Weave>` only for a deliberate second threshold, such as above the
footer’s land acknowledgment.

## Writing guidelines

- The wordmark reads “Reconciliation / Through Relationships” on two lines. Don’t
  reword, reorder, or abbreviate it in the lockup.
- One weave per view. If a page already has a [Page intro](page-intro.md), it
  already has its weave — resist adding more.
- Use the **muted** mark whenever the thing it introduces is empty or waiting; use
  the colour mark when something is present and active.

## Accessibility

- All three elements are `aria-hidden`: they are decorative and always
  accompanied by real text (the wordmark, a page heading, an empty-state title),
  so nothing meaningful is lost to a screen reader.
- `RtrBrand` is a genuine link — it is keyboard focusable and inherits the
  standard focus ring; the mark and wordmark are its visible label.

## Related

- [Brand & motifs](../foundations/06-brand-and-motifs.md) — the meaning behind the circle, strands, and dots
- [App header](app-header.md) — where `RtrBrand` anchors the top-left
- [Empty state](empty-state.md) — the muted mark’s primary home
- [Page intro](page-intro.md) — the weave under a page title
- [App footer](app-footer.md) — the on-dark weave above the land acknowledgment
