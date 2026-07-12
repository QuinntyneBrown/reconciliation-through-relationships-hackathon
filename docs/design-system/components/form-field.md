# Form field

A form field is a **composition**, not a single component: a label, a control,
optional hint text, and — when validation fails — an error message, wired
together for the screen reader. The label is `src/components/ui/label.tsx`; the
rest is the assembly pattern used across the onboarding wizard.

![A stacked form: a bold "Full name" label with a berry asterisk over an empty input placeholding "e.g. Marie Cardinal" and the hint "Shown to facilitators and, after you both agree, to your connection."; a "Province or territory" select showing "Saskatchewan"; a "City, town, or county" field in its error state with a berry border and the message "Enter your city or town so we can find participants near you."; and an optional "A little about you" textarea.](../images/form-text-fields.png)

## Overview

There is no `<FormField>` wrapper to import. A field is four parts stacked with
an 8px gap (`space-y-2`):

1. A [`Label`](#label) bound to the control with `htmlFor` / `id`.
2. The control — [Input](input.md), [Textarea](textarea.md),
   [Select](select.md), [Checkbox](checkbox.md), [Radio group](radio-group.md),
   or [Switch](switch.md).
3. Optional **hint** text — a muted paragraph under the label that sets
   expectations before the person types.
4. An **error message** that appears only after a failed submit, tied to the
   control with `aria-describedby`.

Keeping the field as a plain composition means every control shares the same
label, hint, and error treatment without a bespoke wrapper per input type.

## Anatomy

| Part | Element | Rendering |
| --- | --- | --- |
| Label | `<Label>` | `text-label` (15px), bold, spruce-800 (`text-heading`) |
| Required marker | trailing ` *` | Berry (`--destructive`) asterisk appended to the label |
| Hint | `<p>` | `text-sm` (14px), muted ink-soft, sits directly under the label |
| Control | Input / Select / … | The 46px-tall control, see each component page |
| Error message | `<p>` | `text-sm`, medium weight, berry (`text-destructive`) |

## Label

```tsx
import { Label } from "@/components/ui/label";

<Label htmlFor="first_name">First name *</Label>
<Input id="first_name" /* … */ />
```

`Label` renders a native `<label>`. It is bold `text-label` (15px) in
spruce-800, `select-none`, and it dims to the subtle ink-faint color when the
field is disabled — either through a wrapping `group[data-disabled="true"]` or a
disabled `peer` sibling, so the label greys out in step with its control.

| Prop | Type | Notes |
| --- | --- | --- |
| `htmlFor` | `string` | Must match the control's `id`. This is what makes the label clickable and announces it with the control. |
| `className` | `string` | Merged after the base classes (e.g. `cursor-pointer` on choice rows, `text-base font-medium` for a group legend). |
| …`<label>` props | — | Any native label attribute. |

## The required marker

Required fields append a trailing asterisk to the **label text** —
`<Label>First name *</Label>` — and optional fields carry none, so “Bio” and
“Additional matching information” read as clearly optional. In the design
specimen the asterisk is a berry (`--destructive`) `*`, signalling "required"
in the same berry the error message will use if the field is left blank; the
shipped onboarding labels currently append the asterisk as plain text within
the label. Never rely on the asterisk alone for a critical constraint — state
it in the hint when it matters.

## Hint text

Hint text is a muted paragraph placed under the label, before the control:

```tsx
<Label htmlFor="full_name">Full name *</Label>
<Input id="full_name" placeholder="e.g. Marie Cardinal" />
<p className="text-muted-foreground text-sm">
  Shown to facilitators and, after you both agree, to your connection.
</p>
```

Use it for privacy reassurances ("Only your city will be shown on the map —
never your exact address") and format guidance. It is `text-sm` in the muted
ink-soft color. There is no dedicated `Hint` component — it is a paragraph, so
that longer hints can carry links (for example the "Use native-land.ca" link on
the Treaty area field).

## Error message

When a submit fails validation, render the message with `FieldErrorMessage`,
which owns the `id` that the control points at through `aria-describedby`:

```tsx
<Input
  id="city"
  aria-invalid={!!cityError}
  aria-describedby={cityError?.errorId}
/>
<FieldErrorMessage error={cityError} />
```

`FieldErrorMessage`
(`src/app/onboarding/components/OnboardingErrors.tsx`) renders a berry
(`text-destructive`), `text-sm`, medium-weight paragraph, and returns `null`
when there is no error. Setting `aria-invalid` on the control also flips it to
its berry border and berry focus outline — see the shared control contract on
the [Input](input.md) page.

The validation copy itself lives in two places worth bookmarking:
[`docs/mocks/states-feedback.html`](../../mocks/states-feedback.html) is the
catalog of the exact error strings, and
[`docs/mocks/pattern-onboarding-validation.html`](../../mocks/pattern-onboarding-validation.html)
shows the full validate-on-submit pattern (error summary, focus management,
per-field messages).

## Field groups

Radio and checkbox sets are wrapped in a `<fieldset>` with a `<legend>` instead
of a `Label`, so the whole group announces as one labelled unit. The fieldset
carries an `id` and `tabIndex={-1}` so the form's error summary can move focus
straight to it:

```tsx
<fieldset id="sex_group" tabIndex={-1} aria-describedby={sexError?.errorId}>
  <legend className="text-base font-medium">Sex *</legend>
  <RadioGroup /* … */>{/* items */}</RadioGroup>
  <FieldErrorMessage error={sexError} />
</fieldset>
```

At the top of the form, an [Alert](alert.md)-based **error summary** lists every
failed field as an anchor link ("Please fix 3 errors to continue"), letting the
person jump to the field that needs fixing.

## Writing guidelines

- Labels are nouns in sentence case, no colon: "Full name", "Province or
  territory", "A little about you".
- Mark required fields with a trailing ` *`; leave optional fields unmarked
  rather than labelling them "(optional)".
- Hints set expectations or reassure about privacy — keep them to one sentence.
- Error messages say what to do, not just what went wrong: "Enter your city or
  town so we can find participants near you," not "Invalid."

## Accessibility

- Every control has a programmatic label — a `Label` with matching `htmlFor` /
  `id`, or a `<legend>` inside a `<fieldset>` for grouped controls.
- Errors are tied to their control with `aria-describedby` and flagged with
  `aria-invalid`, so the message is announced when focus lands on the field.
- Error state is never carried by the berry border alone — a text message
  always accompanies it.
- The label is a real `<label>`, so tapping the label text focuses (or toggles)
  the control, enlarging the touch target.

## Related

- [Input](input.md) · [Textarea](textarea.md) · [Select](select.md) — text and
  choice controls that sit inside a field
- [Checkbox](checkbox.md) · [Radio group](radio-group.md) · [Switch](switch.md)
  — grouped controls that use a `<legend>` instead of a label
- [Alert](alert.md) — the error-summary pattern at the top of a form
- [Typography](../foundations/04-typography.md) — the `text-label` role
- [Accessibility](../foundations/08-accessibility.md) — labelling and error
  conventions
