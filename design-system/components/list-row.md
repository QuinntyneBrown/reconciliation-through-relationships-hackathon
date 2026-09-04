# List row

A whole-row link: a rounded parchment row that carries a person and a status,
used for connections and facilitator quick actions. It is a composition
(`.list-row` in the specimen; `rounded-2xl` link rows in the app), not a
dedicated component.

![Three rounded parchment rows, each a full-width link. A spruce "DT" avatar with "David Tremblay" over "Regina, Saskatchewan · Last message 2 days ago" and a green "Active" pill; a river "HM" avatar with "Helen McKay" over "Regina, Saskatchewan · You requested to connect" and a sand "Pending" pill; and an ochre "JB" avatar with "Review a new match" over "Jonas Braun · Moose Jaw, Saskatchewan" and a trailing chevron.](../images/list-rows.png)

## Overview

The list row is the participant-facing counterpart to a [table](table.md) row.
Where a table packs people into a grid for a facilitator to scan, a list row
gives each person their own soft card-like row — avatar, name, a line of
context, and a trailing status. The **entire row is one link**, so there is a
single, generous target and nothing to hunt for.

## Usage

The connections list renders each row as a single `Link` with a 20px radius
(`rounded-2xl`), a 1px border, and `shadow-rtr-1`. On hover the border warms to
spruce.

```tsx
<Link
  href={`/connections/${connection.id}`}
  className="border-border bg-parchment hover:border-spruce-600 shadow-rtr-1 flex items-center gap-4 rounded-2xl border p-5 no-underline transition-colors"
>
  <Avatar>
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
  <div className="min-w-0 flex-1">
    <p className="truncate font-medium">
      {partner.first_name} {partner.last_name}
    </p>
    <p className="text-muted-foreground text-xs">
      {partner.city}, {partner.province}
    </p>
  </div>
  <Badge variant="matched">Active</Badge>
</Link>
```

This is the shape used in `src/app/dashboard/components/ConnectionsTab.tsx`.

## Anatomy

| Slot | Content |
| --- | --- |
| Leading | A default-size [avatar](avatar.md) with the person’s initials |
| Body | A bold name over a muted context line (region, last message, or the reason the row exists), both truncating on overflow (`min-w-0`, `truncate`) |
| Trailing | Either a [status pill](badge.md) or a chevron |

## Trailing element

- **Status pill** for a stateful row — “Active,” “Pending,” “Under review.” The
  pill names the state in words; see [Badge](badge.md).
- **Chevron** for an action row that leads somewhere to do something — the
  “Review a new match” row ends in a `›` rather than a status, signalling
  navigation rather than reporting a state.

Use one or the other, never both.

## States

| State | Rendering |
| --- | --- |
| Rest | Parchment fill, `--border` hairline, `shadow-rtr-1`, 20px radius |
| Hover | Border warms to spruce (`hover:border-spruce-600`); the row is otherwise unchanged |
| Focus | The link shows the global 2px ochre focus ring |

## Writing guidelines

- Lead with the person. The bold line is a name (or, for an action row, the
  action — “Review a new match” — with the person named in the context line).
- Keep the context line to one truncating line: a region, a “Last message 2
  days ago,” or the reason the row is here (“You requested to connect”).
- Follow the same **region, not address** rule as tables — show a city and
  province, never a street address.

## Accessibility

- Make the whole row a single link or button. Don’t place additional
  independent links inside it — a nested control inside a row-link is a keyboard
  and screen-reader trap.
- Because the visible pill or chevron is inside the link, ensure the link’s
  accessible name still reads as the person and their state (the truncating
  name and status text both live in the link).
- Rows stack with real spacing between them (`space-y-2`), so each is an
  individually focusable target.

## Related

- [Table](table.md) — the facilitator grid this pattern replaces for participants
- [Card](card.md) — when a row needs more than one line of content or its own actions
- [Avatar](avatar.md) — the leading initials avatar
- [Badge](badge.md) — the trailing status pill
- [Empty state](empty-state.md) — what shows when the list has no rows
