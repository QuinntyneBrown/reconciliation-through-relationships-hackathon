# Specifications — subsystem registry

The requirements are organized first by the same **subsystems** used in [`docs/detailed-designs`](../detailed-designs/README.md), then by **capability** within each subsystem. A capability is a coherent, independently reusable area of functionality (the building blocks other solutions could be assembled from). Each subsystem's namesake capability keeps its high-level requirements (`L1.md`) and detailed requirements (`L2.md`) at the subsystem root; additional capabilities use named subfolders.

Reverse-engineered from the implemented system on 2026-07-12. Sources of truth, in priority order: the acceptance test suites (`boundary-interface-tests/specs/`, `e2e/tests/`), the application source (`src/`) and database migrations (`supabase/migrations/`), the UI state catalogs (`docs/mocks/`), and the intent documents (`docs/challenge.txt`, `docs/plan.md`, `docs/DECISIONS.md`).

## Subsystems

| Subsystem | Capability folders |
|---|---|
| [Authentication & Access](auth-access/) | [`landing/`](auth-access/landing/L1.md), [`auth-access/`](auth-access/L1.md) |
| [Onboarding](onboarding/) | [`onboarding/`](onboarding/L1.md) |
| [Learning Journey](learning/) | [`learning/`](learning/L1.md) |
| [Matching & Participant Discovery](matching/) | [`matching/`](matching/L1.md) |
| [Profiles](profiles/) | [`profiles/`](profiles/L1.md) |
| [Connections](connections/) | [`connections/`](connections/L1.md), [`meetings/`](connections/meetings/L1.md) |
| [Facilitation](facilitation/) | [`facilitation/`](facilitation/L1.md) |
| [Cohort Map](cohort-map/) | [`cohort-map/`](cohort-map/L1.md) |
| [Notifications](notifications/) | [`notifications/`](notifications/L1.md) |
| [Shared, cross-subsystem requirements](shared/) | [`portal-shell/`](shared/portal-shell/L1.md), [`foundations/`](shared/foundations/L1.md), [`design-system/`](shared/design-system/L1.md) |

The first nine folders mirror the detailed-design subsystem structure. `shared/` holds requirements that deliberately span those subsystem boundaries: application shell/navigation, security and data foundations, accessibility, and responsive design.

## Capabilities

| Code | Capability | Subsystem | Folder | L1 requirements |
|---|---|---|---|---|
| `LAND` | Public Landing | Authentication & Access | [`landing/`](auth-access/landing/L1.md) | `L1-LAND-001` |
| `AUTH` | Authentication & Access | Authentication & Access | [`auth-access/`](auth-access/L1.md) | `L1-AUTH-002`, `L1-AUTH-003` |
| `SHELL` | Portal Shell & Navigation | Shared | [`portal-shell/`](shared/portal-shell/L1.md) | `L1-SHELL-004` |
| `ONBRD` | Guided Onboarding & Intake | Onboarding | [`onboarding/`](onboarding/L1.md) | `L1-ONBRD-005`, `L1-ONBRD-014` |
| `LEARN` | Learning Journey | Learning Journey | [`learning/`](learning/L1.md) | `L1-LEARN-006` |
| `MATENG` | Matching Engine & Discovery | Matching & Participant Discovery | [`matching/`](matching/L1.md) | `L1-MATENG-007` |
| `PROF` | Participant Profiles | Profiles | [`profiles/`](profiles/L1.md) | `L1-PROF-008` |
| `CONN` | Connections & Messaging | Connections | [`connections/`](connections/L1.md) | `L1-CONN-009` |
| `MEET` | Meeting Scheduling | Connections | [`meetings/`](connections/meetings/L1.md) | `L1-MEET-010` |
| `NOTIF` | Notifications | Notifications | [`notifications/`](notifications/L1.md) | `L1-NOTIF-011` |
| `COHRT` | Regional Map & Cohorts | Cohort Map | [`cohort-map/`](cohort-map/L1.md) | `L1-COHRT-012` |
| `FACIL` | Facilitator Administration | Facilitation | [`facilitation/`](facilitation/L1.md) | `L1-FACIL-013` |
| `FOUND` | Security & Data Foundations | Shared | [`foundations/`](shared/foundations/L1.md) | `L1-FOUND-015`, `L1-FOUND-016` |
| `DSGN` | Accessibility & Responsive Design | Shared | [`design-system/`](shared/design-system/L1.md) | `L1-DSGN-017`, `L1-DSGN-018` |

Cross-capability appendices:

- [GAPS.md](GAPS.md) — known gaps and limitations (`GAP-NNN`), referenced by `**Status:** Not satisfied` requirements.
- [TRACEABILITY.md](TRACEABILITY.md) — requirement-to-test traceability.

## Requirement ID scheme

IDs have the form `L<level>-<CAP>-<NNN>`, e.g. `L2-MATENG-024`:

- `L1` = high-level requirement, `L2` = detailed requirement. Each L2 traces to exactly one L1 **within the same capability**.
- `<CAP>` is the capability code from the registry above.
- `<NNN>` is the requirement number. Numbers carried over from the legacy flat scheme are unchanged (only the capability code was inserted), so per-capability sequences are not contiguous. **New requirements** take the next number after the capability's highest existing `<NNN>` at that level; the full ID (level + code + number) is what must be unique.

### Legacy ID mapping

The 2026-07-12 restructure moved the flat `docs/specs/L1.md` / `docs/specs/L2.md` into capability folders. The 2026-07-18 reorganization grouped those capability folders under their owning subsystems without changing capability names or requirement IDs. The legacy ID mapping is mechanical — `L1-NNN` became `L1-<CAP>-NNN` (number unchanged) — with capabilities assigned as follows:

| Capability | Legacy L1 IDs | Legacy L2 IDs |
|---|---|---|
| `LAND` | L1-001 | L2-001…L2-005 |
| `AUTH` | L1-002; L1-003 | L2-006…L2-012 |
| `SHELL` | L1-004 | L2-013…L2-014 |
| `ONBRD` | L1-005; L1-014 | L2-015…L2-019; L2-061…L2-062 |
| `LEARN` | L1-006 | L2-020…L2-023 |
| `MATENG` | L1-007 | L2-024…L2-030 |
| `PROF` | L1-008 | L2-031…L2-034 |
| `CONN` | L1-009 | L2-035…L2-043 |
| `MEET` | L1-010 | L2-044…L2-046 |
| `NOTIF` | L1-011 | L2-047…L2-050 |
| `COHRT` | L1-012 | L2-051…L2-053 |
| `FACIL` | L1-013 | L2-054…L2-060 |
| `FOUND` | L1-015; L1-016 | L2-063…L2-072 |
| `DSGN` | L1-017; L1-018 | L2-073…L2-076 |

## Conventions

- Requirements use **must/shall** language.
- **Overlap rule:** a behavior that manifests at one route belongs to that feature's capability, even when it is security- or accessibility-flavored. The cross-cutting capabilities (`FOUND`, `DSGN`) own only data-layer constraints, app-wide UI invariants, and viewport patterns.
- Requirements state **intended** behavior as evidenced by code, tests, and documentation. Where the running system does not yet meet an intended requirement, the L2 carries a `**Status:** Not satisfied` line referencing [GAPS.md](GAPS.md). No performance or observability L1 exists because the codebase states no measurable target, and reverse-engineering must not invent one.
- The platform brand is always "Reconciliation Through Relationships" (never "RTR Portal").
- Acceptance tests must carry a trace header using full capability-coded IDs, e.g.:

```typescript
// Acceptance Test
// Traces to: L2-ONBRD-015, L2-ONBRD-016
// Description: Onboarding step validation and persistence
```

## Out of scope

The following capabilities are documented in `docs/` (plan, brain-dump, architecture) but are **not implemented**; they are excluded from this specification and carry no requirement IDs:

- Magic-link (passwordless) authentication — the built system uses email + password.
- An `admin` role — the database and application recognize only `participant` and `facilitator`.
- Email reminders (Resend integration).
- Events management.
- Cohort creation and membership management UI (the `cohorts`/`cohort_members` tables exist; no creation flow does).
- Native Land Digital API integration (an external help link only).
