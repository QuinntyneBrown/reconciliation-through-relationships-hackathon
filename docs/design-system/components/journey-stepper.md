# Journey stepper

A numbered rail that shows where someone is in a multi-step flow. Completed
steps carry a spruce check, the current step is ochre, upcoming steps stay
muted, and the connecting line fills as the person advances. Source:
`src/components/journey-stepper.tsx` with the `.rtr-stepper` styles in
`src/app/globals.css`.

![A five-step journey stepper on a parchment card. "Basic info" and "Location" are complete, each a filled spruce circle with a white check and joined by a solid spruce line; "Faith & interests" is the current step, a filled ochre circle numbered 3; "Availability" (4) and "Matching" (5) are upcoming, shown as hollow outlined circles with muted grey labels and a faint connecting line.](../images/stepper.png)

## Overview

The stepper turns a form or wizard into a walk with a visible destination. Three
states read at a glance: a **completed** step is a solid spruce circle with a
check, the **current** step is a solid ochre circle showing its number, and an
**upcoming** step is a hollow outline. The rail between steps fills spruce up to
the current position, so progress is legible from the connecting line alone.

Steps are numbered automatically with a CSS counter, so the component takes only
the labels and the current index — you never hand it numbers.

## Import

```tsx
import { JourneyStepper } from "@/components/journey-stepper";

<JourneyStepper
  steps={["Basic info", "Location", "Faith & interests", "Availability", "Matching"]}
  currentStep={2}
/>
```

`currentStep` is **zero-based**: `2` marks the third label as current, the two
before it as done, and the rest as upcoming.

## States

| State | Applied to | Rendering |
| --- | --- | --- |
| `done` | Steps before `currentStep` | Spruce-600 circle, white check (`✓`); label spruce-700; incoming line spruce |
| `current` | The step at `currentStep` | Ochre-500 circle, spruce-900 number; label spruce-800; `aria-current="step"` |
| `upcoming` | Steps after `currentStep` | Hollow circle, `border-strong` outline, `ink-faint` number and label |

Each state is written to a `data-state` attribute on the `<li>`, so the styling
is driven entirely by data — there are no conditional class names to keep in
sync.

### Responsive behaviour

Below **620px** the labels for every step except the current one collapse to
zero size, leaving a clean row of numbered circles with only the active step
named. This keeps the rail usable on a phone without wrapping five labels.

## Compact step chips

The onboarding wizard uses a lighter-weight indicator in its header rather than
the full rail: a [Progress](progress.md) bar with a “Step *n* of *N*” caption,
followed by a row of pill-shaped step chips.

![An onboarding header card. A "Create your profile" label sits opposite "Step 3 of 5"; below it an ochre progress bar is filled about three-fifths; below that five pill chips read Basics, Location, Faith & interests, Availability, Matching, with the first two in pale river tint, the current "Faith & interests" solid spruce with white text, and the last two in muted sand.](../images/step-chips.png)

The chips are rendered inline in `src/app/onboarding/page.tsx`. Each is a small
rounded-full pill:

| Chip state | Rendering |
| --- | --- |
| Completed | `bg-accent/20` river tint, `accent-foreground` text |
| Current | Solid `bg-primary` spruce, `primary-foreground` text |
| Upcoming | No fill, `muted-foreground` text |

The bar and the chips answer different questions on the same screen — the bar
shows *how far*, the chips show *which sections* — so they pair rather than
duplicate. The paired progress bar uses its ochre variant here.

> **Grounding note.** The live onboarding chips use the flow’s full section names
> (`"Basic Info"`, `"Location & Treaty"`, `"Faith & Interests"`, `"Availability
> & Format"`, `"Matching Preferences"`). The specimen above abbreviates them
> (“Basics,” “Location,” “Faith & interests,” “Availability,” “Matching”) to fit
> the row; keep the fuller labels when the header has room.

## API

```tsx
<JourneyStepper
  steps={string[]}     // ordered step labels (required)
  currentStep={number} // zero-based index of the active step (required)
  className={string}
/>
```

Renders an ordered list (`<ol class="rtr-stepper">`) labelled `“Step {n} of
{total}”`. The compact chips are not a component — they live in the onboarding
header markup.

## Writing guidelines

- Label steps by what the person does there, in two or three words: “Basic
  info,” “Availability,” not “Step one.”
- Keep the count small. The rail is designed for the five-step onboarding
  journey; past six or seven steps, reach for a different pattern.
- Use sentence case and no trailing punctuation, matching every other label in
  the system.

## Accessibility

- The list is labelled `“Step {n} of {total}”`, and the active step carries
  `aria-current="step"` so assistive technology can announce position.
- State is never colour-only: completed steps add a check glyph and current
  steps show a number, so the three states are distinguishable without
  perceiving spruce versus ochre — see
  [Accessibility](../foundations/08-accessibility.md).
- On narrow screens the current step keeps its visible label; don’t suppress it.

## Related

- [Progress](progress.md) — the bar the compact chips pair with
- [Badge](badge.md) — the pill shape the step chips borrow
- [Page intro](page-intro.md) — the header a stepper often sits beneath
- [Colour](../foundations/03-color.md) — spruce (done), ochre (current), muted (upcoming)
