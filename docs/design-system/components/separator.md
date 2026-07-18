# Separator

A one-pixel rule that groups related content by dividing it:
`src/components/ui/separator.tsx`.

![A parchment card with two stacked settings rows — "Show my region on the participant map" and "Share my interests with recommendations" — divided by faint horizontal rules, and a bottom row of inline links "Profile", "Privacy", and "Notifications" split by short vertical rules.](../images/separator.png)

## Overview

A separator is the quietest divider in the system: a single hairline in the
`--border` color. Use it to separate sections that already belong together —
rows in a settings list, groups of links in a footer. When content needs a
heavier boundary, that is a job for a [Card](card.md) or spacing, not a rule.

## Import

```tsx
import { Separator } from "@/components/ui/separator";

<Separator className="my-6" />
```

Built on the Base UI `Separator` primitive. It defaults to horizontal; pass
`orientation="vertical"` to divide inline items:

```tsx
<nav className="flex items-center gap-3">
  <a href="/profile">Profile</a>
  <Separator orientation="vertical" className="h-4" />
  <a href="/privacy">Privacy</a>
  <Separator orientation="vertical" className="h-4" />
  <a href="/notifications">Notifications</a>
</nav>
```

The profile page uses the horizontal form to divide sections:
`<Separator className="my-6" />`.

## Orientation

| Orientation | Rendering | Notes |
| --- | --- | --- |
| `horizontal` (default) | 1px tall, full width (`h-px w-full`) | Add vertical margin (`my-6`) to space it from neighbors |
| `vertical` | 1px wide, stretches to the row height (`w-px self-stretch`) | Give it a height (`h-4`) when its parent doesn’t stretch it |

Both draw in the `--border` color, so the rule sits a hair lighter than
`--border-strong` inputs and reads as a divider rather than an edge.

## API

```tsx
<Separator
  orientation="horizontal | vertical"   // default: "horizontal"
  // ...Base UI Separator props (className, …)
/>
```

## Writing guidelines

- Separate, don’t decorate. If a rule isn’t dividing two distinct groups,
  remove it and let spacing do the work.
- One weight only — don’t thicken or recolor the rule for emphasis.
- Prefer spacing between unlike sections and a separator only between like
  items in a list.

## Accessibility

- Base UI renders the separator with the correct `role="separator"` and
  `aria-orientation`, so assistive tech announces the division.
- A separator is never interactive and never the only cue for a boundary —
  headings and spacing carry the structure; the rule reinforces it.

## Related

- [Card](card.md) — its header and footer use a border, not a separator, for the edge
- [Dropdown menu](dropdown-menu.md) — groups menu items with its own separator
- [App footer](app-footer.md) — vertical separators between footer links
- [Layout & spacing](../foundations/05-layout-and-spacing.md) — when space, not a rule, is the right divider
