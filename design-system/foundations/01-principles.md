# Principles

Three principles govern every design decision in Reconciliation Through
Relationships. When a component page and a principle disagree, the principle
wins.

## Welcome before wow

Participants range widely in age and comfort with technology. The interface
optimizes for being *understood*, not for being impressive.

In practice:

- **Large type, generous targets.** Body text is 16.5px; every interactive
  element is at least 44px tall (36px only in dense facilitator rows).
- **Plain words.** Buttons name the action’s result — “Schedule call,” never
  “Submit.” Reading level is checked with RTR staff.
- **One clear action per screen.** A view has exactly one primary button;
  everything else steps back into outline, soft, or quiet variants.
- **Readability first.** The body face is Atkinson Hyperlegible, designed by
  the Braille Institute for low-vision readers — accessibility is a stated
  goal of the platform, not an afterthought.

## Consent is a design element

Nothing about a person is shown until they choose to share it. The components
encode this rule so screens cannot accidentally break it:

- **[Avatars](../components/avatar.md) are initials-only, by design.** Photos
  are exchanged in conversation after both people agree to connect — the
  system never displays them beforehand.
- **The map shows regions, never addresses.** Location displays are
  city/region granularity; precise location is visible to no one, and city
  detail only to facilitators.
- **Matching is mediated.** A facilitator reviews every recommendation before
  two people are introduced, and both people must agree before contact opens.

## Abstract, not appropriated

The visual motifs — the two-strand weave, the open circle, the facing-figures
panel — are geometric abstractions of relationship and gathering. They are
deliberately not imitations of any nation’s visual culture.

- Motifs stay abstract: strands, arcs, circles, seats.
- The [brand mark](../components/rtr-brand.md) is two arcs, ochre and river,
  forming one circle that stays open at top and bottom — the relationship is
  never closed to others.
- **Final iconography must be reviewed with RTR’s Indigenous leadership**
  before it ships. Treat every motif in this system as pending that review.

## How the principles show up in components

| Principle | Component rules it produces |
| --- | --- |
| Welcome before wow | One primary [button](../components/button.md) per view · plain-language [alerts](../components/alert.md) and [empty states](../components/empty-state.md) · 44px touch targets |
| Consent is a design element | Initials-only [avatars](../components/avatar.md) · region-level [tables](../components/table.md) and map displays · facilitator-mediated flows |
| Abstract, not appropriated | The [weave](06-brand-and-motifs.md) used once per view, never as wallpaper · [cohort circle](../components/cohort-circle.md) seats as abstract dots |

## Related

- [Accessibility](08-accessibility.md) — the commitments in detail
- [Brand & motifs](06-brand-and-motifs.md) — the motif vocabulary
