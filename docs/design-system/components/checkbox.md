# Checkbox

A checkbox toggles one independent option on or off. `src/components/ui/checkbox.tsx`
wraps the Base UI `Checkbox` primitive: a 20px spruce-filling box you pair with
a [Label](form-field.md) to build a choice row or a choice card.

![An "Availability" group of three checkbox rows: "Weekday evenings" and "Weekends" are checked, showing a white check on a spruce-filled box; "Weekday daytime" is an empty parchment box.](../images/form-choices.png)

## Overview

Use a checkbox for options that are **independent** — any number can be on at
once (availability days, preferred formats, participation categories). When the
options are mutually exclusive, use a [Radio group](radio-group.md); when a
single setting flips a behavior on or off, use a [Switch](switch.md).

## Import

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

<div className="flex items-center gap-3">
  <Checkbox
    id="day_monday"
    checked={selected}
    onCheckedChange={setSelected}
  />
  <Label htmlFor="day_monday" className="cursor-pointer">Monday</Label>
</div>
```

## Anatomy

| Property | Value | Class |
| --- | --- | --- |
| Size | 20px square | `size-5` |
| Radius | 4px (softly rounded, not a circle) | `rounded-checkbox` (`--radius-checkbox`) |
| Border | 1.5px border-strong | `border-control border-input` |
| Fill (unchecked) | Parchment | `bg-card` |
| Fill (checked) | Spruce (`--primary`) with a white check | `data-checked:bg-primary text-primary-foreground` |
| Check icon | 16px | `CheckIcon` |

The box sits `mt-0.5` from the top so it aligns with the first line of a
multi-line label, and an invisible `after:-inset-2.5` extends the tap target
10px beyond the 20px box in every direction.

## States

| State | Rendering | Class |
| --- | --- | --- |
| Hover | Border turns spruce | `hover:border-primary` |
| Checked | Spruce fill, white check, spruce border | `data-checked:bg-primary data-checked:border-primary` |
| Focus | 2px ochre outline, 2px offset | `focus-visible:outline-ring` |
| Invalid | Berry border and outline | `aria-invalid:border-destructive aria-invalid:outline-destructive` |
| Disabled | Sand fill, 60% opacity, `not-allowed` cursor | `disabled:bg-muted disabled:opacity-60` |

Because the checked fill uses the semantic `--primary` role, the box fills
spruce in the light theme and ochre in the dark theme, staying in sync with the
rest of the UI.

## Choice rows

The everyday pattern is a checkbox beside a [Label](form-field.md), often inside
a bordered, full-width row that is itself clickable — the whole row toggles the
box, enlarging the target well beyond the 20px control:

```tsx
<div
  className="border-border hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3"
  onClick={() => toggle(value)}
>
  <Checkbox
    checked={selected.includes(value)}
    onCheckedChange={() => toggle(value)}
    id={`cat_${value}`}
    aria-invalid={!!categoriesError}
  />
  <Label htmlFor={`cat_${value}`} className="cursor-pointer">{label}</Label>
</div>
```

For a group of checkboxes, wrap them in a `<fieldset>` with a `<legend>` and put
one `aria-invalid` / error message on the group — see [form field](form-field.md).

## Choice cards

A richer variant for onboarding's participation categories pairs the checkbox
with a **title and a one-line description** in a bordered card. When selected,
the card border turns spruce and the fill shifts to spruce-100, so the choice
reads at a glance:

![Three participation-category choice cards in a row. The first, "Indigenous participant" with the description "Community, cultural, or organizational connection", is selected — a spruce-tinted fill, spruce border, and a checked box. "Non-Indigenous participant" ("Here to listen, learn, and build a relationship") and "Faith or community leader" ("Bringing a congregation or group along") are unselected parchment cards.](../images/choice-cards.png)

Reach for a choice card (over a plain choice row) when each option needs a
sentence of explanation to choose well.

## API

```tsx
<Checkbox
  checked={boolean | "indeterminate"}
  onCheckedChange={(checked) => void}
  id={string}            // match the Label's htmlFor
  aria-invalid={boolean}
  disabled={boolean}
  // …all Base UI Checkbox props
/>
```

## Writing guidelines

- Label each option with what turning it **on** means, in sentence case:
  "Weekday evenings", "Show me on the regional map".
- Order options predictably (chronological for days, most-common first
  otherwise).
- For a required "at least one" group, say so in the legend or a hint —
  "Select all that apply. At least one … is required."

## Accessibility

- Every checkbox has a [Label](form-field.md) with a matching `htmlFor` / `id`,
  so the label text is clickable and announced.
- Group related checkboxes in a `<fieldset>` / `<legend>` and attach validation
  to the group.
- The `after:-inset-2.5` hit area keeps the target comfortable even though the
  box is 20px.

## Related

- [Radio group](radio-group.md) — for one-of-many, mutually exclusive choices
- [Switch](switch.md) — for a single on/off setting
- [Form field](form-field.md) — legend, hint, and error assembly for groups
