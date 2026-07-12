# Switch

A switch flips a single setting on or off. `src/components/ui/switch.tsx` wraps
the Base UI `Switch` primitive — a 46×26px track whose white thumb slides
between a warm-tan "off" and a spruce "on".

![A settings card with two rows. "Show my region on the participant map" has its switch on — a spruce-green track with the white thumb slid to the right. "Automatically match eligible participants" has its switch off — a warm-tan track with the thumb on the left.](../images/switch.png)

## Overview

Use a switch for a setting that reads naturally as **on or off** and whose label
names a state, not a choice: "Auto-matching enabled", "Show me on the regional
map". For picking among options use a [Radio group](radio-group.md) or
[Checkbox](checkbox.md); the switch is for behaviors you turn on and off.

## Import

```tsx
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<div className="flex items-center justify-between">
  <Label htmlFor="auto_matching" className="cursor-pointer">Auto-matching enabled</Label>
  <Switch id="auto_matching" checked={enabled} onCheckedChange={setEnabled} />
</div>
```

## Sizes

| `size` | Track | Thumb | Use for |
| --- | --- | --- | --- |
| `default` | 46 × 26px | 20px | Settings rows and preference toggles |
| `sm` | 36 × 20px | 16px | Dense rows where a full-size switch is too heavy |

## Anatomy and states

| Property | Value | Class |
| --- | --- | --- |
| Track (off) | Border-strong, a warm tan | `data-unchecked:bg-border-strong` |
| Track (on) | Spruce-600 | `data-checked:bg-spruce-600` |
| Thumb | White, soft shadow, slides on toggle | `bg-white shadow-sm` + `translate-x-*` |
| Focus | 2px ochre outline, 2px offset | `focus-visible:outline-ochre-600` |
| Invalid | Berry outline | `aria-invalid:outline-berry-700` |
| Disabled | 50% opacity, `not-allowed` cursor | `data-disabled:opacity-50` |

The thumb slides over 180ms, and an invisible `after:-inset-x-3 after:-inset-y-2`
extends the tap target past the track. The track uses fixed palette values
(spruce-600 on, border-strong off), so the "on" state stays spruce in both
themes.

## Usage in the product

- **Matching preferences** (onboarding) — one switch per weighting factor:
  "Location (same city/region)", "Shared interests", "Same sex", each in a
  bordered row with the label on the left and the switch on the right.
- **Facilitator settings** — "Auto-matching enabled", with a caption clarifying
  that facilitator approval is still required regardless.
- **Visibility** — "Show my region on the participant map".

The standard layout is a `flex items-center justify-between` row: label (and any
caption) on the left, switch on the right.

## API

```tsx
<Switch
  checked={boolean}
  onCheckedChange={(checked: boolean) => void}
  size="default | sm"
  id={string}            // match the Label's htmlFor
  disabled={boolean}
  aria-invalid={boolean}
  // …all Base UI Switch props
/>
```

Defaults: `size="default"`.

## Writing guidelines

- Label the **on** state as a fact, not an imperative: "Auto-matching enabled",
  not "Enable auto-matching".
- If turning the switch on has a caveat or consequence, put it in a caption
  under the label ("Facilitator approval is always required regardless").
- Don't pair a switch with a Save button for a setting that also needs an
  explicit save — make clear whether the toggle takes effect immediately.

## Accessibility

- Bind a [Label](form-field.md) to the switch with `htmlFor` / `id` so tapping
  the label toggles it.
- State is conveyed by the thumb position and track color together, not color
  alone; the label always names the setting.
- The focus outline is the same 2px ochre ring used across the system.

## Related

- [Checkbox](checkbox.md) — for selecting options from a set
- [Radio group](radio-group.md) — for one-of-many choices
- [Form field](form-field.md) — labelling and layout
