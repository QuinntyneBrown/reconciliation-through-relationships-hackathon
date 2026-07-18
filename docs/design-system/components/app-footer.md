# App footer

The dark spruce band that closes every page: the brand line, a link home, the
two-strand weave, and the territorial acknowledgment. Rendered from
`src/components/app-footer.tsx`.

![A deep spruce-green footer: at left the heading "Reconciliation Through Relationships" over a one-line description and a "rightrelationship.ca" link, at right a woven ochre-and-teal border strip, and beneath a dividing rule an italic territorial acknowledgment paragraph. A faint pair of facing figures rises from the panel's edge.](../images/app-footer.png)

## Overview

The footer is a `bg-spruce-900` band that mirrors the [app header](app-header.md)
at the other end of the page. It carries the [panel-on-dark figure](../foundations/06-brand-and-motifs.md)
— the faint facing-profiles motif — behind its content, closes with the
[on-dark weave](rtr-brand.md), and always ends on the **territorial
acknowledgment**. It is pinned to the bottom of short pages with `mt-auto`.

## Import

```tsx
import { AppFooter } from "@/components/app-footer";

<AppFooter />;
```

The footer takes no props; it renders the same content on every page.

## Anatomy

| Region | Content |
| --- | --- |
| Brand block | `h4` **Reconciliation Through Relationships**, the description, and a home link |
| Weave | The on-dark [`Weave`](rtr-brand.md) strip, ~240px wide |
| Acknowledgment | The italic territorial acknowledgment, above the fold’s hairline rule |
| Figure | The `rtr-panel-on-dark` facing-profiles motif at 5% opacity behind it all |

The description reads, verbatim: “Building meaningful relationships between
Indigenous and non-Indigenous people.” The home link points to
`https://rightrelationship.ca` and opens in a new tab
(`target="_blank" rel="noopener noreferrer"`).

## Territorial acknowledgment

The acknowledgment is the footer’s reason for being consistent on every page. It
sits below a hairline top rule (`border-on-dark/15`) in italic `--on-dark-soft`
text, capped at `max-w-3xl`, and reads verbatim:

> Each gathering begins by acknowledging the treaty territory and traditional
> lands on which it takes place. Region-specific acknowledgments are confirmed
> with local Indigenous partners.

Do not paraphrase, shorten, or relocate this text — it is a standing commitment,
not decorative copy. Region-specific acknowledgments are confirmed with local
Indigenous partners rather than generated.

## Colour & surface

| Token | Role |
| --- | --- |
| `bg-spruce-900` | The footer band |
| `--on-dark-soft` | Body and link text |
| `--on-dark` | The heading and link hover |
| `rtr-panel-on-dark` | The 5%-opacity facing-profiles figure |
| `rtr-weave-on-dark` | The ochre-and-teal woven strip |

The type is 14.5px, a step down from body copy, to keep the footer quiet beneath
the page’s main content.

## Accessibility

- The weave and the background figure are decorative and marked
  `aria-hidden="true"`; they carry no meaning a screen reader needs.
- The home link is a real, focusable anchor with visible hover feedback
  (`--on-dark-soft` → `--on-dark`).
- `--on-dark-soft` on spruce-900 meets AA for the body text; keep any added
  footer text at that contrast or brighter.
- Because the footer opens the external site in a new tab, it keeps
  `rel="noopener noreferrer"` — preserve it on any link you add.

## Related

- [App header](app-header.md) — the matching spruce bar at the top of the page
- [RTR brand](rtr-brand.md) — the `Weave` strip and brand marks
- [Brand & motifs](../foundations/06-brand-and-motifs.md) — the panel-on-dark figure
- [Color](../foundations/03-color.md) — the spruce and on-dark tokens
