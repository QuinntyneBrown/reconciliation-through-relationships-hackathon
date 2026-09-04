# Alert

Alerts are inline banners that carry a persistent message in the flow of the
page. The system ships one component with a tint per meaning:
`src/components/ui/alert.tsx`.

![Four stacked inline alert banners, each rounded with a matching border and tint: a blue-green "You're on the waitlist." notice, a spruce "Learning journey complete." success, an ochre "One module left." caution, and a berry "This connection is under review." banner. Each leads with a bold sentence over a lighter description line.](../images/alerts.png)

## Overview

An alert stays on the page until the situation it describes changes, which is
what sets it apart from a [Toast](toast.md): use it for status a participant
needs to keep seeing — "You're on the waitlist.", "This connection is under
review." Each alert is a rounded-xl banner with a single border-and-tint pair
drawn from one meaning, leading with a bolded sentence and an optional
description beneath.

## Import

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

<Alert variant="info">
  <Info />
  <AlertTitle>You're on the waitlist.</AlertTitle>
  <AlertDescription>
    A facilitator reviews every match personally. We'll email you when a
    recommendation is ready.
  </AlertDescription>
</Alert>;
```

The icon is optional and passed as the first child — a lucide SVG. When
present it sits in its own column and spans both the title and description
rows; the component sizes it to 18px.

## Variants

Each variant is a border, background tint, and text colour from one palette
family:

| Variant | Palette | Use for |
| --- | --- | --- |
| `default` | River | Neutral status, same as `info` |
| `info` | River | A neutral notice ("You're on the waitlist.") |
| `success` | Spruce | A completed milestone ("Learning journey complete.") |
| `caution` | Ochre | Something that needs attention soon ("One module left.") |
| `destructive` | Berry | A problem or a hold ("This connection is under review.") |
| `danger` | Berry | Same as `destructive` |

`default`/`info` and `destructive`/`danger` render identically today; they are
separate names so their meanings can diverge later without touching call
sites. The default variant is `default` (river).

## Anatomy

| Part | Renders | Notes |
| --- | --- | --- |
| `Alert` | `div` with `role="alert"` | The banner; carries the variant tint |
| `AlertTitle` | `div` | The bolded lead sentence |
| `AlertDescription` | `div` | Supporting copy; inline links are underlined |
| `AlertAction` | `div` | Optional control pinned to the top-right corner |

Leading SVG icon (optional) — pass a lucide icon as the first child of
`Alert`; the layout shifts to a two-column grid with the icon spanning both
text rows.

## The error summary

The onboarding wizard renders a destructive alert as an error summary at the
top of a step: a bolded heading — `Please fix {n} error(s) to continue` — over
a list of anchor links, one per invalid field, that jump to the offending
input. It pairs with a red per-field message below each bad field (which is
plain text, not an `Alert`). See
[states-feedback.html](../../mocks/states-feedback.html) for both.

## String catalog

Every alert and validation string in the app is catalogued verbatim, with its
source line, in [states-feedback.html](../../mocks/states-feedback.html).

## API

```tsx
<Alert variant="default | info | success | caution | destructive | danger">
  {/* optional leading <Icon /> */}
  <AlertTitle>…</AlertTitle>
  <AlertDescription>…</AlertDescription>
  {/* optional */}
  <AlertAction>…</AlertAction>
</Alert>
```

`Alert` accepts all `div` props plus `variant`; default is `default`.

## Writing guidelines

- Lead with the situation in the title as a full sentence: "This connection is
  under review."
- Use the description for what happens next: "A facilitator is taking a closer
  look. You'll hear back soon."
- Match the variant to the meaning — caution (ochre) for a nudge, destructive
  (berry) for a problem or hold, success (spruce) for a milestone.
- If the message can safely vanish after a moment, it's a [Toast](toast.md),
  not an alert.

## Accessibility

- `Alert` carries `role="alert"`, so assistive technology announces it when it
  appears; reserve it for genuinely important messages.
- Colour is never the only signal — every alert leads with a worded title, and
  the meaning is in the sentence, not just the tint.
- The error summary's anchor links let keyboard users jump straight to each
  invalid field.

## Related

- [Toast](toast.md) — transient confirmations that dismiss themselves
- [Form field](form-field.md) — inline field errors that pair with the summary
- [Badge](badge.md) — compact status pills for the same meanings
- [Color](../foundations/03-color.md) — the palette families behind each variant
