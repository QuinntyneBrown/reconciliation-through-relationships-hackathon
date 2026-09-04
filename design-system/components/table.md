# Table

The facilitator data table — a scannable grid of participants that still leads
with the person, not the record. It is a CSS pattern (`.rtr-table` in
`src/app/globals.css`), not a React component, used through plain semantic
`<table>` markup.

![A participant table with uppercase birch column headers "PARTICIPANT", "LOCATION", "BACKGROUND", "JOURNEY", and "JOINED". Each row leads with a small initials avatar and name over a background label: "Marie Cardinal / Indigenous" in "Regina, Saskatchewan · Treaty 4", "Community leader", a full spruce progress bar with a green "Ready" pill, joined "Mar 4, 2026"; "David Tremblay / Non-Indigenous", "Retired teacher", a half-filled bar with an ochre "Learning" pill, "Apr 18, 2026"; and "Amara Singh / Non-Indigenous" in "Saskatoon, Saskatchewan · Treaty 6", "Faith leader", a barely-started bar with a sand "Onboarding" pill, "Jun 2, 2026".](../images/table.png)

## Overview

Tables are for **facilitator views only**. Participants never see each other in
a grid — they meet through cards and list rows. When a facilitator does need to
scan many people at once, the table keeps the platform’s warmth: uppercase
birch headers sit lightly above the rows, and every row opens with the person —
a small avatar and name — before any status or date.

## Usage

Wrap the table in `.rtr-table-wrap` and give the table `.rtr-table`. The wrapper
provides the border, radius, parchment background, and the horizontal scroll
that keeps the 640px-minimum grid usable on narrow screens.

```tsx
<div className="rtr-table-wrap">
  <table className="rtr-table">
    <thead>
      <tr>
        <th>Name</th>
        <th className="hidden sm:table-cell">Location</th>
        <th className="hidden md:table-cell">Background</th>
        <th>Journey</th>
        <th className="hidden lg:table-cell">Joined</th>
      </tr>
    </thead>
    <tbody className="divide-border divide-y">
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3">
          <Link href={`/profile/${p.id}`} className="flex items-center gap-2 hover:underline">
            <Avatar size="sm"><AvatarFallback>{initials}</AvatarFallback></Avatar>
            <span className="font-medium">{p.first_name} {p.last_name}</span>
          </Link>
        </td>
        <td className="hidden px-4 py-3 sm:table-cell">{p.city}, {p.province}</td>
        {/* … */}
      </tr>
    </tbody>
  </table>
</div>
```

This is exactly the shape of `src/app/facilitator/participants/ParticipantsTable.tsx`.
Columns collapse from the right as the viewport narrows — Location appears at
`sm`, Background at `md`, Joined at `lg` — while Name and Journey always show.

## Anatomy

| Class | Rendering |
| --- | --- |
| `.rtr-table-wrap` | 1px border, 16px radius, parchment fill, `overflow-x: auto` |
| `.rtr-table` | Full-width, `min-width: 640px`, 15px body text |
| `.rtr-table th` | Birch fill, `ink-soft` text, uppercase, 12.5px bold, `0.08em` tracking, left-aligned |
| `.rtr-table td` | 13px × 16px padding, middle-aligned, hairline bottom border |
| Row hover | The row background warms to birch |

## The three rules

1. **Lead with the person.** The first column is always the avatar and name —
   never an ID, a record number, or a raw status. The person is the subject of
   the row; everything else describes them.
2. **Region, not address.** The location column shows a region — city,
   province, and treaty territory (“Regina, Saskatchewan · Treaty 4”) — never a
   street address. A facilitator needs to know where someone is, not where they
   live.
3. **Facilitator surfaces only.** Reach for `.rtr-table` inside facilitator
   tooling. On participant-facing pages, use [cards](card.md) and
   [list rows](list-row.md) so people are met one at a time.

## Content

Inside cells, reuse the system’s parts rather than inventing table-specific
styling: a small [avatar](avatar.md) plus name in the person column, a
[badge](badge.md) for background, and a slim [progress](progress.md) bar beside
a status pill in the journey column. Dates are set small and muted.

## Accessibility

- Use real semantic markup — `<table>`, `<thead>`, `<th>`, `<tbody>`, `<td>` —
  so screen readers announce rows and columns. Never rebuild a table from
  `<div>`s.
- Give each `<th>` a `scope` (`col` here) so cells are associated with their
  header.
- The scroll container should be reachable and scrollable by keyboard; keep the
  most identifying columns (Name, Journey) outside the horizontally-scrolled
  overflow so they’re always visible.
- Row status is carried by the pill’s text, not by color — see [Badge](badge.md).

## Related

- [List row](list-row.md) — the participant-facing alternative to a table row
- [Avatar](avatar.md) — the small avatar that leads each row
- [Badge](badge.md) — background labels and journey status pills
- [Progress](progress.md) — the slim journey bar in the Journey column
- [Pagination](breadcrumb-and-pagination.md) — the Previous / Next controls below a long table
