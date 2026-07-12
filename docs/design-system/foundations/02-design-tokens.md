# Design tokens

All visual decisions flow from one token file:
[`src/styles/design-tokens.css`](../../../src/styles/design-tokens.css). It is
imported by the application (`src/app/globals.css`) and mirrored by the static
specimen stylesheet (`docs/mocks/rtr.css`), so the app and the mock catalog
always render from the same values.

## Architecture: palette → roles → utilities

```
Palette tokens          Semantic roles              Tailwind utilities
--spruce-700   ──────►  --primary          ──────►  bg-primary, text-primary…
--berry-700    ──────►  --destructive      ──────►  bg-destructive…
--parchment    ──────►  --card, --popover  ──────►  bg-card, bg-popover…
```

**Components consume semantic roles, never palette values.** A card is
`bg-card`, not `bg-parchment`; a delete button is `bg-destructive`, not
`bg-berry-700`. The palette may also be used directly through utilities like
`bg-spruce-800` for brand surfaces (headers, footers, hero panels) where the
color *is* the meaning.

Because the roles are remapped inside a `.dark` block, dark theme is a
token-only change — no component knows which theme it is rendering in.

## Palette tokens

Drawn from the land: spruce forest, birchbark, prairie ochre, river water,
wild berry. See [Color](03-color.md) for meaning and usage; the full swatch
set with hex values:

| Token | Value | Token | Value |
| --- | --- | --- | --- |
| `--spruce-900` | `#142823` | `--ochre-700` | `#9a5b14` |
| `--spruce-800` | `#1e3d36` | `--ochre-600` | `#c07a22` |
| `--spruce-700` | `#2a5148` | `--ochre-500` | `#d89543` |
| `--spruce-600` | `#396b5e` | `--ochre-200` | `#efd9b4` |
| `--spruce-200` | `#c6d9ce` | `--ochre-100` | `#f7ead1` |
| `--spruce-100` | `#e0eae2` | `--berry-800` | `#6f2726` |
| `--river-700` | `#2c5f66` | `--berry-700` | `#8c3130` |
| `--river-600` | `#37767c` | `--berry-100` | `#f4dfdc` |
| `--river-200` | `#c4dcda` | `--birch` | `#f9f5eb` |
| `--river-100` | `#dfecea` | `--parchment` | `#fffdf7` |
| `--ink` | `#22322c` | `--sand` | `#efe7d7` |
| `--ink-soft` | `#5a6a61` | `--on-dark` | `#f4efe3` |
| `--ink-faint` | `#8a968e` | `--on-dark-soft` | `#b9c6bc` |

## Semantic roles (light theme)

| Role | Maps to | Used for |
| --- | --- | --- |
| `--background` | birch | Page background |
| `--foreground` | ink | Body text |
| `--heading-foreground` | spruce-800 | Headings |
| `--card` / `--popover` | parchment | Cards, inputs, menus, dialogs |
| `--primary` / `--primary-hover` | spruce-700 / 800 | Primary actions |
| `--primary-subtle` | spruce-100 | Tints behind primary content |
| `--secondary` / `--secondary-foreground` | ochre-100 / 700 | Soft (ochre) emphasis |
| `--accent` / `--accent-foreground` | river-100 / 700 | Quiet (river) emphasis |
| `--muted` / `--muted-foreground` | sand / ink-soft | Disabled fills, secondary text |
| `--subtle-foreground` | ink-faint | Placeholder and tertiary text |
| `--destructive` (+ `-hover`, `-subtle`) | berry-700 / 800 / 100 | Destructive actions, errors |
| `--border` / `--border-strong` | `#e0d6c2` / `#c9bca3` | Hairlines / control outlines |
| `--input` | border-strong | Text-control borders |
| `--ring` | ochre-600 | Focus rings |
| `--link` / `--link-hover` | river-700 / spruce-800 | Links |
| `--success`, `--warning`, `--info` (+ `-subtle`) | spruce, ochre, river | Status meanings |
| `--overlay` | spruce-900 @ 55% | Dialog backdrop |
| `--inverse`, `--inverse-foreground` | spruce-900 / on-dark | Dark surfaces (toasts) |
| `--inverse-accent` | ochre-500 | Accent on dark surfaces |

The `.dark` block remaps the same roles onto the dark palette (background
becomes spruce-900, cards spruce-800, primary flips to ochre-500 with
spruce-900 text, borders become translucent on-dark). See
`src/styles/design-tokens.css:106`.

## Shape

| Token | Value | Used for |
| --- | --- | --- |
| `--r-sm` / `radius-sm` | 8px | Small chips, link-button corners |
| `--radius-control` | 10px | Buttons, inputs, selects (the control radius) |
| `--r-md` / `radius-md` | 12px | Skeletons, medium surfaces |
| `--r-lg` / `radius-lg` | 16px | Cards, dialogs, panels |
| `--radius-2xl`–`--radius-4xl` | 20–28px | List rows, large panels |
| `--radius-checkbox` | 4px | Checkboxes |
| `--r-pill` | 999px | Pills, avatars, seats |
| `--control-border-width` | 1.5px | Outlined controls and buttons |

## Elevation

Two shadows only — elevation is used sparingly on the parchment surfaces:

| Token | Value | Used for |
| --- | --- | --- |
| `--shadow-1` (`shadow-rtr-1`) | `0 1px 2px … , 0 4px 14px …` (6–7% ink) | Cards |
| `--shadow-2` (`shadow-rtr-2`) | `0 2px 6px … , 0 12px 32px …` (8–14% ink) | Dialogs, menus, tooltips |

## Motion

| Token | Value |
| --- | --- |
| `--motion-duration` | 180ms |
| `--motion-easing` | ease |

Transitions are limited to color/background/border on interactive elements
and enter/exit fades on overlays. `prefers-reduced-motion: reduce` disables
all of it — see [Accessibility](08-accessibility.md).

## Type and spacing tokens

The Tailwind theme (`src/app/globals.css`) adds role-specific text sizes
(`text-action`, `text-card-title`, `text-caption`, `text-label`,
`text-status`) documented in [Typography](04-typography.md), and an
RTR spacing scale (`--spacing-rtr-1` … `--spacing-rtr-8`, 4–64px) documented
in [Layout & spacing](05-layout-and-spacing.md).

## Rules

- Never hard-code a hex value in a component; add a token if one is missing.
- Consume roles (`bg-primary`) rather than palette (`bg-spruce-700`) unless
  the surface is explicitly a brand surface.
- When a component changes in the app, update `docs/mocks/rtr.css` and the
  specimen catalog together — they are the reference render for this
  documentation’s screenshots.
