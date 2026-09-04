# Layout & spacing

Layout is calm and single-minded: one column of content on a birch page,
parchment surfaces for anything that groups, and a 4px-based spacing scale.

## Spacing scale

An eight-step scale, exposed to Tailwind as `rtr-1` … `rtr-8` (usable as
`p-rtr-5`, `gap-rtr-3`, …) and to the specimen CSS as `--s1` … `--s8`:

| Step | Value | Typical use |
| --- | --- | --- |
| `rtr-1` | 4px | Icon-to-text gaps, pill dot offsets |
| `rtr-2` | 8px | Gaps inside controls, tag rows |
| `rtr-3` | 12px | Gaps between related controls |
| `rtr-4` | 16px | Card grid gaps, field-to-field rhythm |
| `rtr-5` | 24px | Card padding, section-internal spacing |
| `rtr-6` | 32px | Section padding |
| `rtr-7` | 48px | Large section breaks, empty-state padding |
| `rtr-8` | 64px | Hero and page-level breathing room |

Between the scale steps, standard Tailwind spacing utilities are used for
fine-grained control inside components.

## Containers

| Container | Max width | Used for |
| --- | --- | --- |
| Narrow | 720px | Reading pages: learning content, forms |
| Default | 1100px | Most participant pages |
| Wide | 1280px | Dashboards, facilitator tables, the header bar |

All containers keep a 24px (`rtr-5`) horizontal gutter.

## Breakpoints

Two breakpoints do almost all responsive work:

| Breakpoint | What changes |
| --- | --- |
| **860px** | The [app header](../components/app-header.md) nav collapses into the mobile [sheet](../components/sheet.md); multi-column facilitator layouts stack |
| **620px** | Grids collapse to a single column; the [journey stepper](../components/journey-stepper.md) hides non-current labels; type ramps down via `clamp()` |

Content grids (`cols-2`, `cols-3`, `cols-4` in the specimens; Tailwind grid
utilities in the app) collapse to one column below 620px — no intermediate
two-column states except on the 4-up stat tiles.

## Surfaces

| Surface | Background | Border | Radius | Shadow |
| --- | --- | --- | --- | --- |
| Page | birch | — | — | — |
| [Card](../components/card.md) | parchment | 1px `--border` | 16px | `shadow-rtr-1` |
| [List row](../components/list-row.md) | parchment | 1px `--border` | 20px+ | none |
| [Dialog](../components/dialog.md) / [menu](../components/dropdown-menu.md) | parchment | 1px `--border` | 16px | `shadow-rtr-2` |
| Dark panel | spruce-800/900 | — | 16px | — |
| Subtle tint | spruce-100 / sand | — | 16px | — |

Hierarchy comes from the parchment-on-birch contrast and hairline borders,
not from stacked shadows — elevation is reserved for things that float
(dialogs, menus, toasts, tooltips).

## Radius scale

| Radius | Value | Where |
| --- | --- | --- |
| Checkbox | 4px | Checkboxes only |
| Small | 8px | Small buttons, chips |
| Control | 10px | Buttons, inputs, selects |
| Medium | 12px | Skeletons, inner surfaces |
| Large | 16px | Cards, dialogs, alerts, panels |
| 2xl–4xl | 20–28px | List rows, hero panels |
| Pill | 999px | Pills, avatars, seats, switch |

## Rules

- One primary action per view, placed where the eye lands last (bottom-right
  of a dialog, end of a card, hero left).
- Sections separate with space (`rtr-6`/`rtr-7`) or a single hairline — never
  both.
- Wide content (tables) scrolls horizontally inside its own container rather
  than breaking the page — see [Table](../components/table.md).

## Related

- [Design tokens](02-design-tokens.md) — shape and elevation tokens
- [Card](../components/card.md) — the standard surface
