# Input

A single-line text control. `src/components/ui/input.tsx` wraps the Base UI
`Input` primitive and applies the shared control contract that Input, Textarea,
and the Select trigger all inherit from `control-styles.ts`.

![A "Full name" field placeholding "e.g. Marie Cardinal", and below it a "City, town, or county" field in its error state — a berry border with the message "Enter your city or town so we can find participants near you."](../images/form-text-fields.png)

## Overview

Input is a thin styling layer over the native `<input>`: it forwards `type`,
`value`, `placeholder`, and every other input attribute untouched, and paints
on the RTR control look. Pair it with a [Label](form-field.md) and, when a
submit fails, a berry error message — see the [form field](form-field.md)
pattern for the full assembly.

## Import

```tsx
import { Input } from "@/components/ui/input";

<Input id="city" placeholder="e.g. Saskatoon" />
<Input id="age" type="number" min="13" max="120" />
<Input id="q" type="search" placeholder="Search participants…" />
```

## The shared control contract

Input, [Textarea](textarea.md), and the [Select](select.md) trigger all import
`controlStyles` from `src/components/ui/control-styles.ts`, so they read as one
family. The contract:

| Property | Value | Token |
| --- | --- | --- |
| Background | Parchment `#fffdf7` | `bg-card` |
| Text | Ink `#22322c` | `text-foreground` |
| Placeholder | Ink-faint `#8a968e` | `placeholder:text-subtle-foreground` |
| Border | 1.5px, border-strong `#c9bca3` | `border-control` / `border-input` |
| Radius | 10px | `rounded-control` (`--radius-control`) |
| Padding | 10px vertical, 14px horizontal | `py-2.5 px-3.5` |
| Min height | ~46px (per the specimen) | `min-h-control` |
| Font | 16px, weight 400, Atkinson sans | `text-base font-normal font-sans` |

The 16px text size is deliberate: on iOS a font size below 16px makes Safari
zoom the page when the field is focused, so every text control stays at 16px.

### States

| State | Rendering | Classes |
| --- | --- | --- |
| Hover | Border turns spruce (`--primary`) | `hover:border-primary` |
| Focus | Spruce border **plus** a 2px ochre outline offset 1px | `focus-visible:border-primary focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-1` |
| Invalid | Berry border and berry outline when `aria-invalid` is set | `aria-invalid:border-destructive aria-invalid:outline-destructive` |
| Disabled | Sand (`--muted`) fill, faint text, `not-allowed` cursor | `disabled:bg-muted disabled:text-subtle-foreground disabled:cursor-not-allowed` |

The ochre focus outline is the same ring used everywhere in the system, so
keyboard focus is unmistakable regardless of the control's own border color.

## Error state

Setting `aria-invalid` is what turns the field berry — you do not add an error
class. Wire it to the field's validation result and point the field at its
message:

```tsx
<Input
  id="city"
  value={data.city}
  onChange={(e) => onChange({ city: e.target.value })}
  aria-invalid={!!cityError}
  aria-describedby={cityError?.errorId}
/>
<FieldErrorMessage error={cityError} />
```

## Search and file inputs

- `type="search"` renders as an ordinary input. The specimen's magnifier icon
  comes from a wrapping `.search` container, not the Input itself — compose the
  icon around the field.
- `type="file"` is styled too: the file-picker button is borderless, transparent,
  and bold (`file:font-bold`), sitting inline with the field.

## API

```tsx
<Input
  type="text | email | number | search | password | file | …"
  id={string}            // match the Label's htmlFor
  aria-invalid={boolean} // paints the field berry
  aria-describedby={string}
  disabled={boolean}
  // …all native <input> props (value, onChange, placeholder, min, max, …)
/>
```

Built on the Base UI `Input` primitive; there is no `variant` or `size` prop —
every input is one size. Constrain width with a utility class when a field
should be narrow (the cohort-threshold number input uses `className="w-24"`).

## Writing guidelines

- Placeholders show an example, not an instruction: "e.g. Saskatoon", not
  "Enter your city". Never put required information only in the placeholder — it
  vanishes on typing.
- Use the right `type` so mobile keyboards and validation match the data:
  `type="number"` for age, `type="email"` for email.
- Reassure in the hint, not the placeholder: privacy notes belong under the
  label.

## Accessibility

- Always pair with a [Label](form-field.md) whose `htmlFor` matches the input's
  `id`.
- Use `aria-invalid` and `aria-describedby` together so the error is announced
  on focus; the berry border never carries the error alone.
- The 46px min height and 16px text meet the platform's touch-target and
  no-zoom rules.

## Related

- [Form field](form-field.md) — label, hint, and error assembly
- [Textarea](textarea.md) · [Select](select.md) — the other controls sharing
  `control-styles.ts`
- [Color](../foundations/03-color.md) — the parchment / border-strong / ochre
  roles used here
- [Accessibility](../foundations/08-accessibility.md)
