# Dialog

Dialogs are modal popups for a focused task or a read-only detail view. The
system assembles them from a set of named parts:
`src/components/ui/dialog.tsx`.

![A "Schedule a call" dialog centred on a dimmed spruce backdrop: a rounded parchment card with a thin ochre strand across its top edge, a heading and the line "A Zoom link will be created and shared with both of you", a Topic field and a Date and time field, and a "Cancel" and solid "Schedule call" button pair aligned to the bottom-right.](../images/dialog.png)

## Overview

A dialog interrupts. Reserve it for a self-contained task the participant
should finish or dismiss before moving on — scheduling a call, reviewing a
partner's profile — never for content that belongs on the page. Every dialog
is a rounded-2xl parchment popup with a 1px border and a 4px ochre-700 strand
across its top edge, laid over a spruce-tinted backdrop that dims the page
behind it. A ghost icon close sits in the top-right corner; footer actions
align to the right.

## Import

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger render={<Button>Schedule call</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Schedule a call</DialogTitle>
      <DialogDescription>
        A Zoom link will be created and shared with both you and David.
      </DialogDescription>
    </DialogHeader>
    <DialogBody>{/* form fields */}</DialogBody>
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Cancel</Button>} />
      <Button>Schedule call</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

Built on the Base UI `Dialog` primitive. `Dialog` renders the root,
`DialogContent` portals the popup and its backdrop into the body, and focus is
trapped inside the popup until it closes.

## Anatomy

| Part | Renders | Notes |
| --- | --- | --- |
| `Dialog` | Base UI `Dialog.Root` | Owns open state; accepts `open` / `onOpenChange` for controlled use |
| `DialogTrigger` | `Dialog.Trigger` | The element that opens the dialog |
| `DialogContent` | Portal + backdrop + `Dialog.Popup` | The parchment card; centred, `max-w-[520px]` on `sm` and up |
| `DialogOverlay` | `Dialog.Backdrop` | Spruce-tinted scrim (`--overlay`, spruce at 55%); rendered for you by `DialogContent` |
| `DialogHeader` | `div` | Title block; padded `pr-20` to clear the close button |
| `DialogKicker` | `div` | Optional uppercase ochre eyebrow above the title |
| `DialogTitle` | `Dialog.Title` | Heading font, `text-xl`; labels the dialog for assistive tech |
| `DialogDescription` | `Dialog.Description` | Muted supporting line; inline links pick up link colours |
| `DialogBody` | `div` | The main content region (`px-6 py-4`) |
| `DialogFooter` | `div` | Action row; right-aligned on `sm` and up, reversed stack on mobile |
| `DialogClose` | `Dialog.Close` | Dismisses the dialog; used by the corner button and any "Cancel" |
| `DialogPortal` | `Dialog.Portal` | Lower-level escape hatch when you compose the popup by hand |

## Layout

Content flows top to bottom: an optional `DialogKicker`, the `DialogTitle` and
`DialogDescription` inside a `DialogHeader`, the `DialogBody`, then a
`DialogFooter`. The header reserves space on the right (`pr-20`) so a long
title never collides with the close button.

The close button is on by default. Pass `showCloseButton={false}` to
`DialogContent` to remove it — do this only when the dialog can still be
dismissed another way (a footer "Cancel", the backdrop, or Escape).

### Footer actions

`DialogFooter` aligns buttons to the right and orders them so the primary
action sits last (rightmost). On narrow screens the row reverses into a stack
with the primary action on top. Keep the primary action solid and step every
other action down to `outline` or `ghost` — see [Button](button.md). A
low-emphasis escape action (for example a destructive "Leave without saving")
may be pushed to the left edge, away from the confirm/cancel pair; the
specimen marks that slot `.push-left`.

Passing `showCloseButton` to `DialogFooter` (default `false`) appends a
standard outline "Close" button for dialogs that need only a dismiss.

## Sizing

`DialogContent` defaults to `max-w-[520px]` and shrinks to fit narrow
viewports (`max-w-[calc(100%-2rem)]`). Override per dialog with a width class:
the scheduling form runs at `max-w-md` (about 448px) and the profile dialogs
at `max-w-lg` (about 512px).

## Live examples

Three built dialogs mirror the real screens:

- [dialog-schedule-call.html](../../mocks/dialog-schedule-call.html) — the
  `ScheduleMeetingModal` opened from a connection chat: Topic, Date, Time,
  Duration, and a "Cancel" / "Schedule call" footer.
- [dialog-partner-profile.html](../../mocks/dialog-partner-profile.html) — the
  read-only partner profile a participant opens from the chat sub-header;
  close button only, no footer.
- [dialog-facilitator-profile.html](../../mocks/dialog-facilitator-profile.html)
  — the fuller participant profile a facilitator opens from a match card,
  adding the Sex, Roles, Personal boundaries, and Additional info sections.

## API

```tsx
<Dialog open={boolean} onOpenChange={(open) => void}>
  {/* ...all Base UI Dialog.Root props */}
</Dialog>

<DialogContent showCloseButton={boolean /* default true */} />
<DialogFooter showCloseButton={boolean /* default false */} />
```

The remaining parts accept the props of the Base UI element they wrap plus
`className`. `DialogContent` composes `DialogPortal` and `DialogOverlay`
automatically; reach for those directly only when hand-building a popup.

## Writing guidelines

- Title names the task — "Schedule a call," "David Tremblay" — not "Dialog"
  or "Details."
- The description sets expectations in one plain sentence: quote the
  scheduling dialog's "A Zoom link will be created and shared with both you
  and David." verbatim as the pattern.
- Match button labels to their result; one primary action per dialog.
- Read-only detail dialogs (a profile) carry no footer — the corner close is
  the only control.

## Accessibility

- `DialogTitle` labels the dialog and `DialogDescription` describes it for
  assistive technology; include a title in every dialog.
- Focus moves into the popup on open, is trapped while open, and returns to
  the trigger on close — handled by Base UI.
- Escape and a backdrop click both dismiss the dialog.
- The corner close button carries an `sr-only` "Close" label; keep it unless
  another dismiss control is present.

## Related

- [Button](button.md) — footer action arrangement and emphasis
- [Sheet](sheet.md) — the side-anchored panel used for mobile navigation
- [Form field](form-field.md) — labels and errors inside task dialogs
- [Iconography](../foundations/07-iconography.md) — the close icon
