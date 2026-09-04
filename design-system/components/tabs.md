# Tabs

Underline tabs switch between panels of a single view without a page change.
Built on the Base UI `Tabs` primitive in `src/components/ui/tabs.tsx`.

![A row of underline tabs: "Recommended" is active with a heading-weight label and an ochre underline and carries a round count chip reading 3, followed by "Connections" with a leading chat icon and a chip reading 2, and "All participants" with a leading people icon.](../images/tabs.png)

## Overview

A tab set is a horizontal row of triggers over a shared bottom rule. The active
trigger draws an **ochre-700 underline** (`--secondary-foreground`) and darkens
its label to heading weight; the rest sit in muted text until hovered. Tabs are
for switching between peer views of the same data — the dashboard’s
Recommended / Connections / All participants — not for navigating between pages,
which belongs to the [app header](app-header.md).

## Import

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList className="w-full justify-start gap-2">
    <TabsTrigger value="recommended">Recommended</TabsTrigger>
    <TabsTrigger value="connections">Connections</TabsTrigger>
    <TabsTrigger value="all">All participants</TabsTrigger>
  </TabsList>

  <TabsContent value="recommended" className="mt-6">…</TabsContent>
  <TabsContent value="connections" className="mt-6">…</TabsContent>
  <TabsContent value="all" className="mt-6">…</TabsContent>
</Tabs>
```

## Parts

| Part | Role |
| --- | --- |
| `Tabs` | Root. Owns `value` / `onValueChange` and the `orientation` |
| `TabsList` | The trigger row; draws the shared 2px `--border` rule |
| `TabsTrigger` | One tab. `value` ties it to its panel |
| `TabsContent` | The panel shown when its `value` is active |

## States

| State | Rendering |
| --- | --- |
| Default | `--muted-foreground` label, transparent 3px bottom border |
| Hover | Label darkens to `--heading-foreground` |
| Active | `--heading-foreground` label, ochre-700 (`--secondary-foreground`) 3px underline |
| Focus | 2px `--ring` outline, inset 2px, via `:focus-visible` |
| Disabled | 50% opacity, pointer events off |

Each trigger is `min-h-11` (44px) — a full touch target — with a bold
`text-label` sans-serif label.

## Leading icons

A trigger accepts a leading [icon](../foundations/07-iconography.md) as its first
child; icons are auto-sized to 16px and sit before the label with a 6px gap. The
dashboard pairs a chat icon with **Connections** and a people icon with **All
participants**.

```tsx
<TabsTrigger value="connections" className="gap-2">
  <MessageCircle />
  Connections
</TabsTrigger>
```

## Count chips

The running total beside a label is **composed inline**, not a built-in slot —
render a pill after the label text and show it only when the count is non-zero:

```tsx
<TabsTrigger value="recommended" className="gap-2">
  Recommended
  {recommendedMatches.length > 0 && (
    <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
      {recommendedMatches.length}
    </span>
  )}
</TabsTrigger>
```

The chip uses `--primary` (spruce) on `--primary-foreground`, matching the count
[badge](badge.md) elsewhere in the system.

## Orientation

`Tabs` defaults to `orientation="horizontal"`. Passing `orientation="vertical"`
turns the list into a column with a right-hand 2px rule and moves the active
strand to the trigger’s right edge — useful for tall settings panes. All shipped
tab sets are horizontal.

## API

```tsx
<Tabs
  value={string}
  onValueChange={(value: string) => void}
  orientation="horizontal | vertical"   // default "horizontal"
  // ...all Base UI Tabs.Root props
/>
```

`TabsList` also accepts `variant` (only `default` today) and exports
`tabsListVariants` for styling adjacent list-like elements. Uncontrolled use is
supported via `defaultValue` in place of `value`/`onValueChange`.

## Accessibility

- Base UI wires roving focus and arrow-key movement between triggers, with
  `role="tab"` / `role="tabpanel"` and the `aria-selected` / `aria-controls`
  relationships handled for you.
- The focus ring is always visible on keyboard focus (2px ochre, inset).
- When a count matters to the choice, keep it in the visible label — do not rely
  on colour alone to signal the active tab; the heading-weight label carries the
  state too.

## Related

- [Badge](badge.md) — the count-chip styling reused in tab labels
- [Iconography](../foundations/07-iconography.md) — leading-icon sizing
- [App header](app-header.md) — for navigating between pages, not panels
- [Card](card.md) — the surface tab panels usually sit within
