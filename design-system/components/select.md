# Select

A dropdown for choosing one option from a known list. `src/components/ui/select.tsx`
wraps the Base UI `Select` primitive, so the trigger matches the other form
controls and the popup opens as a portalled, keyboard-navigable list.

![A "Province or territory" field: a bold label over a parchment select trigger reading "Saskatchewan" with a down-chevron on the right.](../images/form-text-fields.png)

## Overview

Select is not one component but a set of parts you compose, the same shape as
Base UI's own API. The trigger wears the shared [control contract](input.md)
(parchment fill, 1.5px border-strong border, 10px radius, spruce hover/focus
border, ochre focus outline), so a closed select is visually a sibling of an
[Input](input.md). Use it when the options are a fixed, known set — provinces,
formats — and a free-text [Input](input.md) otherwise.

## Import

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

<Select value={province} onValueChange={(v) => setProvince(v ?? "")}>
  <SelectTrigger id="province" aria-invalid={!!provinceError}>
    <SelectValue placeholder="Select province or territory" />
  </SelectTrigger>
  <SelectContent>
    {PROVINCES.map((p) => (
      <SelectItem key={p} value={p}>{p}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

## Parts

| Part | Role |
| --- | --- |
| `Select` | Root. Holds `value` / `onValueChange` (or `defaultValue`). |
| `SelectTrigger` | The control the person clicks. Wears `controlStyles` and appends a down-chevron. Takes `size="sm" | "default"`. |
| `SelectValue` | Renders the current selection, or the `placeholder` (in ink-faint) when nothing is chosen. |
| `SelectContent` | The portalled popup: parchment surface, `shadow-rtr-2`, rounded-xl border, open/close fade-and-zoom animation. |
| `SelectItem` | One option. Min height 40px; on highlight it fills spruce-100 (`bg-primary-subtle`); the selected item shows a check on the right. |
| `SelectGroup` + `SelectLabel` | Group related options under an uppercase caption heading. |
| `SelectSeparator` | A hairline rule between groups. |
| `SelectScrollUpButton` / `SelectScrollDownButton` | Chevron affordances that appear when the list overflows. |

## Trigger sizes

| `size` | Min height | Radius |
| --- | --- | --- |
| `default` | ~46px, matching Input | `rounded-control` (10px) |
| `sm` | ~40px (`min-h-control-sm`) | `rounded-lg` — for dense facilitator toolbars |

## States

The trigger inherits every state from the shared contract: spruce hover/focus
border, a 2px ochre focus outline, and a berry border when `aria-invalid` is
set. Set `aria-invalid` on the `SelectTrigger` (not the root) and pair it with
`aria-describedby` so the field can show and announce its error:

```tsx
<SelectTrigger id="province" aria-invalid={!!provinceError} aria-describedby={provinceError?.errorId}>
  <SelectValue placeholder="Select province or territory" />
</SelectTrigger>
```

## Popup placement

`SelectContent` accepts the Base UI positioner props so you can steer the popup:
`side` (default `"bottom"`), `sideOffset` (default `4`), `align` (default
`"center"`), `alignOffset`, and `alignItemWithTrigger` (default `true`, which
lines the chosen item up over the trigger). The popup is width-matched to the
trigger and caps its height to the available space, scrolling with the
chevron buttons when the list is long.

## Writing guidelines

- The placeholder is an instruction to choose ("Select province or territory"),
  since a select has no example to model — this is the one control where an
  instruction-style placeholder is right.
- Keep option labels parallel and full: full province and territory names, not
  abbreviations.
- Reach for [Radio group](radio-group.md) instead when there are only two or
  three options and showing them all helps the person decide.

## Accessibility

- Give the `SelectTrigger` an `id` and bind a [Label](form-field.md) to it with
  `htmlFor`.
- The popup is fully keyboard-navigable (type-ahead, arrow keys, Enter) and
  manages focus itself through Base UI.
- Validity is conveyed with `aria-invalid` plus a text error message, never the
  berry border alone.

## Related

- [Input](input.md) — the shared control contract the trigger uses
- [Radio group](radio-group.md) — for a small, always-visible set of options
- [Form field](form-field.md) — label, hint, and error assembly
- [Dropdown menu](dropdown-menu.md) — for *actions*, where Select is for
  *values*
