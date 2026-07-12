# Empty state

A dashed birch panel that stands in when there’s nothing to show yet: a muted
brand mark, a plain-language title, a short description, and at most one action.
Source: `src/components/empty-state.tsx`, styled by `.rtr-empty-state` in
`src/app/globals.css`.

![Two empty-state panels side by side, each a birch panel with a dashed birch-grey border. Each is centred around a muted brand mark — the birch-grey circle with one dashed strand and no dots — above a Fraunces heading and a muted description. The left panel is headed "No recommendations yet" and carries a spruce outline "Complete your profile" button; the right is headed "No connections yet" with no action.](../images/empty-states.png)

## Overview

An empty state is a moment of waiting, not a failure, and the panel is written to
feel that way: the [muted brand mark](rtr-brand.md) — a circle still waiting to
form — sits above a calm heading and a sentence that explains *why* it’s empty
and what happens next. Because relationships in this product genuinely take time,
most empty states reassure rather than prompt; an action is offered only when
there’s a useful next step.

The component enforces the discipline: one title, one description, and a single
optional `action` slot. There is no room for two competing buttons.

## Import

```tsx
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Reassurance only — no action
<EmptyState
  title="No recommendations yet"
  description="A facilitator is reviewing potential matches for you. Check back soon."
/>

// With a single next step
<EmptyState
  title="No active connections yet"
  description="Your facilitator reviews every match personally. While you wait, keep your profile current so recommendations reflect who you are."
  action={
    <Button asChild variant="secondary">
      <Link href="/dashboard">Explore recommendations</Link>
    </Button>
  }
/>
```

## Anatomy

| Part | Rendering |
| --- | --- |
| Panel | 1.5px **dashed** `border-strong`, `r-lg` radius, birch fill, centred text |
| Mark | [`BrandMark muted`](rtr-brand.md), 64px, centred above the title |
| Title | `<h3>`, Fraunces |
| Description | `ink-soft` body, capped at `max-w-md`; accepts rich nodes, not just a string |
| Action | Optional single node — almost always one `secondary` [button](button.md) |

## API

```tsx
<EmptyState
  title={string}          // the headline (required)
  description={ReactNode}  // plain-language explanation (required)
  action={ReactNode}       // at most one action; omit for reassurance-only states
  className={string}
/>
```

`description` is a `ReactNode`, so it can hold emphasis or a short paragraph (the
map page passes a sentence with an `<em>`). `action` is a slot, not a label — pass
a real [Button](button.md) (typically `asChild` around a `Link`).

## Catalogue

Every `<EmptyState>` usage in the app, with copy quoted verbatim from source.
The full inventory — including the shorter inline empty messages that don’t use
this component — lives in the
[states & feedback catalogue](../../mocks/states-feedback.html).

| Where | Title | Description | Action |
| --- | --- | --- | --- |
| Dashboard · Recommended tab | No recommendations yet | A facilitator is reviewing potential matches for you. Check back soon. | — |
| Dashboard · Connections tab | No active connections yet | Your facilitator reviews every match personally. While you wait, keep your profile current so recommendations reflect who you are. | Explore recommendations → `#recommended` |
| Connections page | No active connections yet | Your facilitator reviews every match personally. While you wait, keep your profile current so recommendations reflect who you are. | Explore recommendations → `/dashboard` |
| Map page | No cohort in your region yet | Circles take time. Every eligible participant brings a regional gathering closer. | — |

> **Grounding note.** The hero screenshot uses illustrative copy (“…your profile
> does the work — the more you share, the better the match,” “Complete your
> profile,” “When you connect with someone, your conversation will live here…”)
> that does **not** match the shipped strings. The table above is the source of
> truth; the screenshot is a styled composition of the panel form.

## Writing guidelines

- Name the emptiness plainly in the title: “No recommendations yet,” “No cohort
  in your region yet.” The “yet” matters — it promises this is temporary.
- Use the description to explain the *why* and set expectations, in the product’s
  unhurried voice: “Circles take time.”
- Offer an action only when there’s a genuinely useful next step. Two of the four
  states deliberately offer none.
- When you do offer one, it’s a single `secondary` button — never a primary, never
  two.

## Accessibility

- The muted mark is decorative (`aria-hidden`); the title (`<h3>`) is the real
  heading a screen reader lands on, so the state has a proper text label.
- Copy carries the whole message — the dashed border and drained mark are
  reinforcement, not the only signal that a region is empty. See
  [Accessibility](../foundations/08-accessibility.md).
- The optional action is a standard focusable [button](button.md) with the usual
  focus ring.

## Related

- [RTR brand](rtr-brand.md) — the muted mark at the top of every empty state
- [Button](button.md) — the single `secondary` action
- [Card](card.md) — the surface an empty state often replaces
- [States & feedback catalogue](../../mocks/states-feedback.html) — every empty string, inline and component
