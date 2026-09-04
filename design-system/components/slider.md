# Slider

A slider picks a number from a continuous range by dragging a thumb along a
track. `src/components/ui/slider.tsx` wraps the Base UI `Slider` primitive.

> **Status — available, not yet used.** The Slider ships in the component
> library but no product screen renders one today. Its natural first home is the
> facilitator settings **cohort threshold** (the minimum eligible participants
> to suggest forming a regional cohort, constrained to 3–20), which is currently
> a small number [Input](input.md). Treat the specimen below as the intended
> look, not shipped UI.

![A card with two sliders. The first, "Cohort threshold", reads "5 participants" and shows a spruce-filled track a little over half along with a white, ochre-ringed thumb. The second is labelled "Disabled" at "40%" and appears muted and lowered in opacity, its thumb sitting left of the middle.](../images/slider.png)

## Overview

Reach for a slider when a rough position along a range is more meaningful than a
typed number and the exact value matters less than the sense of "more or less".
When the precise number matters — and cohort threshold is a borderline case — a
number [Input](input.md) is often clearer, so always pair a slider with a
visible read-out of its current value.

## Import

```tsx
import { Slider } from "@/components/ui/slider";

<Slider defaultValue={[5]} min={3} max={20} />
<Slider defaultValue={[25, 75]} min={0} max={100} /> {/* two-thumb range */}
```

The value is an **array**, one entry per thumb. Pass a single-element array for a
simple slider and a two-element array for a range; the component renders a thumb
per value. Defaults are `min={0}` and `max={100}`.

## Anatomy

| Part | Value | Class |
| --- | --- | --- |
| Track | Sand rail, 4px tall, fully rounded | `bg-muted` + `h-1` |
| Range (indicator) | Spruce fill from the minimum to the thumb | `bg-primary` |
| Thumb | 12px white circle with an ochre (`--ring`) border | `size-3 border-ring bg-white` |

## States

| State | Rendering | Class |
| --- | --- | --- |
| Hover / focus / active | A translucent ochre ring grows around the thumb | `hover:ring-3 focus-visible:ring-3 active:ring-3` |
| Disabled | Whole control drops to 50% opacity | `data-disabled:opacity-50` |

The range fill uses the semantic `--primary` role, so it is spruce in the light
theme and ochre in the dark theme. An invisible `after:-inset-2` around the thumb
enlarges the drag target beyond its 12px size.

## Orientation

The slider is horizontal by default and full-width. Base UI's vertical
orientation is supported too — a vertical slider gets a minimum height and lays
its track top-to-bottom — set it through the primitive's `orientation` prop when
a vertical control fits the layout better.

## API

```tsx
<Slider
  defaultValue={number[]}   // uncontrolled; one entry per thumb
  value={number[]}          // controlled
  onValueChange={(value: number[]) => void}
  min={number}              // default 0
  max={number}              // default 100
  step={number}
  disabled={boolean}
  // …all Base UI Slider props (orientation, name, …)
/>
```

## Writing guidelines

- Always show the current value next to the slider ("5 participants", "40%") —
  a slider without a read-out leaves the person guessing.
- Label the units, not just the number, when the range isn't self-evident.
- Set `min`, `max`, and `step` to the real constraints (cohort threshold is
  3–20, step 1) so the thumb can only land on valid values.

## Accessibility

- Bind a [Label](form-field.md) to the slider and keep a visible value read-out.
- The thumb is keyboard-operable through Base UI (arrow keys step, Home/End jump
  to the ends).
- The ochre focus ring matches the system's focus treatment; don't remove it.
- When an exact value is essential and hard to hit by dragging, offer a number
  [Input](input.md) as well or instead.

## Related

- [Input](input.md) — the number field cohort threshold uses today
- [Switch](switch.md) · [Checkbox](checkbox.md) — the other setting controls
- [Form field](form-field.md) — labelling and value read-out
