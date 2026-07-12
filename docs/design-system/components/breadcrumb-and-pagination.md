# Breadcrumb & pagination

Two wayfinding patterns for deep and long views: a breadcrumb trail that names
where you are, and pagination that walks a long list. These are **CSS
conventions**, not `ui/` components — you build them from plain `nav` markup and
the classes in `docs/mocks/rtr.css`.

![Two stacked wayfinding rows: a breadcrumb reading "Participants › Regina region › Marie Cardinal" with the first two segments as teal links and the last in plain ink, and a pagination row with a left chevron, a filled spruce "1", the numbers 2 and 3, an ellipsis, an "8", and a right chevron.](../images/breadcrumb-pagination.png)

## Overview

Breadcrumbs and pagination answer *where am I* and *how do I move through this*.
Both are secondary to the [app header](app-header.md) and [tabs](tabs.md): reach
for them only inside long facilitator tables and drill-down views, where a title
alone no longer locates the reader.

## Breadcrumb

A `nav` labelled `aria-label="Breadcrumb"`, holding link segments separated by a
`›` character in a muted `.sep` span. The trail is 13.5px ink-soft text;
intermediate segments are river-700 links that underline on hover; the final
segment is plain text — it is the current page, so it is not a link.

```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="…">Participants</a>
  <span class="sep">›</span>
  <a href="…">Regina region</a>
  <span class="sep">›</span>
  <span>Marie Cardinal</span>
</nav>
```

| Segment | Rendering |
| --- | --- |
| Ancestor link | `--river-700`, no underline until hover |
| Separator | `›` in `--ink-faint` |
| Current page | Plain `--ink-soft` text, no link |

## Pagination

A `nav` labelled `aria-label="Pagination"`, holding page links and a highlighted
current page. Each cell is at least 38×38px with a `--r-sm` corner; the current
page is a solid spruce-700 chip in white, and a long run collapses into an
`.ellipsis` (`…`). Previous and next steps use `‹` and `›`.

```html
<nav class="pagination" aria-label="Pagination">
  <a href="…">‹</a>
  <span class="current">1</span>
  <a href="…">2</a>
  <a href="…">3</a>
  <span class="ellipsis">…</span>
  <a href="…">8</a>
  <a href="…">›</a>
</nav>
```

| Cell | Rendering |
| --- | --- |
| Page link | `--spruce-700` text; hover fills `--spruce-100` |
| Current page | Solid `--spruce-700`, white text |
| Ellipsis | `…` in `--ink-faint` |

### Shipped simplification

The numbered pagination above is the design convention. The one paginated view
shipped so far — the facilitator participants table
(`src/app/facilitator/participants/ParticipantsTable.tsx`) — renders a lighter
variant: a **“Page X of Y”** label beside a pair of `outline` `sm`
[buttons](button.md), **Previous** and **Next**, each with a chevron and disabled
at the ends of the range. Prefer that Previous/Next pattern for short ranges;
reach for the numbered `.pagination` markup only when readers need to jump across
many pages. Breadcrumbs are specified here but not yet used in a shipped route.

## Accessibility

- Give each `nav` its landmark name (`aria-label="Breadcrumb"` /
  `"Pagination"`) so both are announced and distinguishable.
- Mark the current page — `aria-current="page"` on the breadcrumb’s last segment
  and on the pagination’s current cell.
- Chevron-only controls (`‹` / `›`, or the button variant) need an accessible
  name (“Previous”, “Next”); the button pattern already labels them and disables
  at the range ends rather than leaving dead links.
- Keep hit targets at the 38–44px the CSS provides; do not shrink pagination
  cells to fit more numbers.

## Related

- [App header](app-header.md) — primary navigation between pages
- [Tabs](tabs.md) — switching panels within one view
- [Table](table.md) — the long lists pagination walks through
- [Button](button.md) — the Previous/Next controls in the shipped table
