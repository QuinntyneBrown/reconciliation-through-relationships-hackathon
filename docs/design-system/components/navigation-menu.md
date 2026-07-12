# Navigation menu

A hover/focus-driven menu bar with animated flyout panels. Built on the Base UI
`NavigationMenu` primitive in `src/components/ui/navigation-menu.tsx`.

## Status — not used in the product

This primitive is available in the library but is **not used anywhere in the
shipped application**. All navigation in Reconciliation Through Relationships is
built from the [app header](app-header.md) (inline underline links) and, below
861px, the [Sheet](sheet.md) mobile panel. The product has a flat information
architecture with no mega-menu flyouts, so this component has never been needed.

It is retained because it is part of the underlying component library and costs
nothing to keep: should a future surface need a multi-column flyout (for example,
a grouped resource menu on the marketing site), the styled primitive is ready
rather than needing to be rebuilt. Until then, treat the app header and Sheet as
the only navigation components to reach for.

No screenshot exists for this page because the component is not rendered anywhere
to capture.

## What it is

A thin styling layer over Base UI’s `NavigationMenu`. The wrapper exports these
subcomponents:

| Part | Role |
| --- | --- |
| `NavigationMenu` | Root; renders the trigger row and portals its positioner |
| `NavigationMenuList` | The horizontal list of top-level items |
| `NavigationMenuItem` | One item in the list |
| `NavigationMenuTrigger` | An item that opens a flyout; shows a rotating chevron |
| `NavigationMenuContent` | The flyout panel, animated by activation direction |
| `NavigationMenuLink` | A leaf link inside a panel or the bar |
| `NavigationMenuIndicator` | The small arrow pointing at the active trigger |
| `NavigationMenuPositioner` | Portalled positioner + popup + viewport (internal) |

The module also exports `navigationMenuTriggerStyle`, a `cva` factory, for
applying the trigger’s look to a bare link.

## If you adopt it

- Prefer extending the app header first; introduce this component only when a
  genuine grouped/flyout menu is required, and record that decision.
- Match the header’s spruce-on-parchment palette and the system focus ring
  rather than the primitive’s neutral defaults.
- Revisit this page — remove the status note and add a specimen screenshot — once
  the component actually ships.

## Related

- [App header](app-header.md) — the navigation the product actually uses
- [Sheet](sheet.md) — the mobile navigation panel
- [Dropdown menu](dropdown-menu.md) — the shipped anchored-menu pattern
