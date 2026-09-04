# Toast

Toasts are brief, self-dismissing confirmations that slide in over the app.
They render through Sonner, configured in `src/components/ui/sonner.tsx`.

![Three stacked dark spruce toasts with light text: a success toast with an ochre check reading "Profile saved! Let's start your learning journey.", an error toast with an ochre octagon reading "Failed to schedule meeting. Please try again.", and a notification toast reading "A call has been scheduled" over "RTR Connection Call — Marie & David" with an ochre "View" button.](../images/toasts.png)

## Overview

A toast tells a participant an action worked (or didn't) and then disappears.
Use it for transient confirmations — "Settings saved.", "Match approved and
participants notified." — where the outcome doesn't need to persist on screen.
Anything the participant must not miss, or must act on, belongs in an inline
[Alert](alert.md) instead, which stays put until it's resolved.

Every toast sits on a dark inverse surface (`--inverse`, spruce-900) with
semibold on-dark text, an `shadow-rtr-2` shadow, and a per-type icon tinted
ochre.

## Import

The `Toaster` mounts once, near the app root. Raise toasts anywhere with the
`toast` function from Sonner:

```tsx
import { toast } from "sonner";

toast.success("Settings saved.");
toast.error("Failed to save settings.");
toast.info("Session expired. Please sign in again.");
```

The `Toaster` component itself is imported once by the app shell and follows
the active `next-themes` theme.

## Types

Each type swaps the leading icon; all icons are tinted `--inverse-accent`
(ochre-500):

| Type | Icon | Use for |
| --- | --- | --- |
| `success` | `CircleCheck` | A completed action ("Match approved and participants notified.") |
| `error` | `OctagonX` | A failure the participant should retry ("Failed to send message.") |
| `info` | `Info` | A neutral notice ("Session expired. Please sign in again.") |
| `warning` | `TriangleAlert` | A caution before or during an action |
| `loading` | `Loader2` | An in-flight action; the icon spins |

## Notification toast

The realtime bell raises a different shape — an untyped `toast(title, { … })`
with no status icon, a description, and a "View" action button that routes to
the related connection:

```tsx
toast(n.title, {
  description: n.body,
  action: { label: "View", onClick: () => router.push(href) },
});
```

The action button uses the ochre inverse-accent fill; the description sits in
muted on-dark text. This fires from `src/components/notification-center.tsx`
whenever a notification row is inserted for the current user — see
[Notification center](notification-center.md).

## String catalog

Every toast the app can raise is catalogued verbatim, grouped by feature and
captioned with its source line, in
[states-toasts.html](../../mocks/states-toasts.html). Two things to note from
that catalog:

- Most strings are short, sentence-case confirmations ending in a period; a
  few interpolate a name ("Connection request sent to David!").
- One string, "Account created — please sign in.", is dispatched through
  `toast.error` and so renders with the error styling and `OctagonX` icon
  despite reading as success. The catalog flags this discrepancy.

## API

```tsx
// The mounted toaster (app shell only):
<Toaster />

// Raising toasts (anywhere):
toast(message);
toast.success(message);
toast.error(message);
toast.info(message);
toast.warning(message);
toast(title, { description, action: { label, onClick } });
```

`Toaster` accepts all Sonner `ToasterProps`; the surface colours, radius,
icons, and per-slot classes are preset in `sonner.tsx`.

## Writing guidelines

- One outcome per toast, in a single sentence: "Meeting scheduled! Both
  participants have been notified."
- Name what happened, not the mechanics — "Settings saved.", not "PATCH
  succeeded."
- Match the type to the meaning; don't send a success message through
  `toast.error`.
- Add a "View" action only when there's a clear place to go; otherwise let the
  toast dismiss itself.

## Accessibility

- Toasts are transient — never put an irreversible choice or the only copy of
  important information in one. Use an [Alert](alert.md) or a
  [Dialog](dialog.md) when the message must persist.
- Sonner announces toasts to assistive technology as they appear.
- Keep action labels short and specific ("View") so they read clearly out of
  context.

## Related

- [Alert](alert.md) — persistent inline banners for messages that must stay
- [Notification center](notification-center.md) — raises the realtime "View" toast
- [Button](button.md) — the toast action button's styling lineage
- [Iconography](../foundations/07-iconography.md) — the per-type icons
