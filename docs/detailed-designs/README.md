# Detailed designs

The detailed-design collection describes the implemented Reconciliation Through Relationships platform as 25 vertical feature slices. A vertical slice contains the frontend, backend, domain, and data elements required to deliver one coherent behavior.

Each feature folder contains one focused architecture description (AD) in `README.md` and a `diagrams` folder. Every design contains L2 requirement text with its parent L1 specification identifier; no design reproduces L1 requirement text. Each diagram exists as PlantUML source and an inline PNG rendering.

The prose uses the controlled vocabulary and impersonal, declarative register defined by the [Architecture Description Style Guide](https://github.com/QuinntyneBrown/architecture-description-style-guide). These focused designs do not claim full conformance with 42010:2022.

## Authentication and access

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Public landing](auth-access/public-landing/README.md) | Presents the program, explains the four-stage relationship journey, and directs a visitor to account creation or sign-in. | `L2-LAND-001`, `L2-LAND-002`, `L2-LAND-003`, `L2-LAND-004`, `L2-LAND-005` |
| [Account authentication](auth-access/account-authentication/README.md) | Creates password accounts, establishes sessions, exchanges authentication codes, and selects the first route after authentication. | `L2-AUTH-006`, `L2-AUTH-007`, `L2-AUTH-008`, `L2-AUTH-009` |
| [Role and journey route gating](auth-access/route-gating/README.md) | Refreshes the session and restricts route access according to authentication, role, onboarding completion, and learning completion. | `L2-AUTH-010`, `L2-AUTH-011`, `L2-AUTH-012` |

## Onboarding

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Participant intake wizard](onboarding/intake-wizard/README.md) | Collects a participant profile across five validated steps, preserves local progress, persists the completed profile, and opens the learning journey. | `L2-ONBRD-015`, `L2-ONBRD-016`, `L2-ONBRD-017`, `L2-ONBRD-018`, `L2-ONBRD-019` |
| [Participant intake API](onboarding/participant-intake-api/README.md) | Lists participants and validates creation requests against the shared intake schema before delegating persistence to the configured repository. | `L2-ONBRD-061`, `L2-ONBRD-062` |

## Learning journey

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Audience learning catalog](learning/module-catalog/README.md) | Loads the participant's applicable learning track, orders its modules, distinguishes optional content, and renders the active module. | `L2-LEARN-020` |
| [Learning progress and completion](learning/progress-completion/README.md) | Records module completion, advances through incomplete content, releases the dashboard gate after all required modules, and preserves retry state after write failures. | `L2-LEARN-021`, `L2-LEARN-022`, `L2-LEARN-023` |

## Matching and discovery

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Participant recommendations](matching/recommendations/README.md) | Scores eligible opposite-background participants, selects the highest applicable candidates, and presents recommendation, waitlist, and empty states. | `L2-MATENG-024`, `L2-MATENG-025`, `L2-MATENG-026` |
| [Cohort formation banner](matching/cohort-formation-banner/README.md) | Detects when a participant's city reaches the cohort threshold and presents a regional formation prompt when the participant belongs to no cohort. | `L2-MATENG-027` |
| [Participant directory](matching/participant-directory/README.md) | Lists journey-eligible participants, applies combined discovery filters, paginates results, and switches to a consent-filtered city-level map. | `L2-MATENG-028`, `L2-MATENG-029` |
| [Dashboard connection summary](matching/dashboard-connections/README.md) | Summarizes a participant's relationships by partner and status with filtering, pagination, explanations, and conversation links. | `L2-MATENG-030` |

## Participant profiles

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Participant profile viewing](profiles/participant-profile/README.md) | Resolves the current or selected participant, enforces participant-only visibility, and renders the shareable relationship profile. | `L2-PROF-031`, `L2-PROF-032`, `L2-PROF-033` |
| [Profile connection action](profiles/profile-connect-action/README.md) | Derives the relationship action from the current connection state and sends, cancels, responds to, or opens a connection from a participant profile. | `L2-PROF-034` |

## Connections and meetings

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Connection request consent](connections/connection-requests/README.md) | Creates and withdraws peer requests, records each participant's consent, and activates or queues the relationship after mutual consent. | `L2-CONN-035`, `L2-CONN-036`, `L2-CONN-037`, `L2-CONN-038` |
| [Connections list](connections/connections-list/README.md) | Loads the participant's relationships newest-first, resolves each partner, displays the current state, and links to the relationship conversation. | `L2-CONN-039` |
| [Authorized realtime messaging](connections/realtime-messaging/README.md) | Authorizes conversation access, loads ordered history, persists trimmed messages, notifies the partner, and streams new messages into both open conversations. | `L2-CONN-040`, `L2-CONN-041`, `L2-CONN-042` |
| [Connection meeting scheduling](connections/meeting-scheduling/README.md) | Shows the next call, validates a scheduling dialog, creates a Zoom meeting on the backend, persists it, notifies the partner, and reports distinct failure contracts. | `L2-CONN-043`, `L2-MEET-044`, `L2-MEET-045`, `L2-MEET-046` |

## Notifications

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Realtime notification center](notifications/notification-center/README.md) | Loads the recent inbox, displays unread state, marks one or all notifications read, routes by notification data, and delivers new alerts without a page reload. | `L2-NOTIF-047`, `L2-NOTIF-049`, `L2-NOTIF-050` |
| [Domain notification production](notifications/notification-production/README.md) | Records recipient notifications after connection requests, approvals, messages, and scheduled meetings so the notification center can deliver them. | `L2-NOTIF-048` |

## Regional map and cohorts

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Consent-first regional aggregation](cohort-map/regional-aggregation/README.md) | Selects journey-eligible consenting participants, groups them by city and province, and exposes only regional counts. | `L2-COHRT-051` |
| [Regional cohort readiness](cohort-map/cohort-readiness/README.md) | Compares regional participant counts with the cohort threshold and renders role-appropriate region cards, readiness states, and the empty explanation. | `L2-COHRT-052`, `L2-COHRT-053` |

## Facilitator administration

| Vertical slice | Scope | L2 specifications |
| --- | --- | --- |
| [Facilitator community overview](facilitation/community-overview/README.md) | Role-gates the facilitator workspace, computes five community counts in parallel, and links each summary or quick action to its management route. | `L2-FACIL-054` |
| [Facilitator participant directory](facilitation/participant-directory/README.md) | Loads every participant, derives journey status, combines search and filters, paginates the collection, and links each row to its profile. | `L2-FACIL-055` |
| [Facilitator match management](facilitation/match-management/README.md) | Creates scored manual matches and approves or rejects proposed matches and mutual connection requests while notifying participants after approval. | `L2-FACIL-056`, `L2-FACIL-057` |
| [Matching and cohort settings](facilitation/platform-settings/README.md) | Loads and persists auto-matching and cohort-threshold settings and supplies the mutual-consent activation policy. | `L2-FACIL-058`, `L2-FACIL-059`, `L2-FACIL-060` |

## Diagram set

Every vertical slice contains the same five view components:

- a C4 system context view;

- a C4 container view;

- a C4 component view;

- a UML class view;

- a UML sequence view with nested Reconciliation Through Relationships application, frontend, and backend boxes.

The shared figure order and caption pattern establish one structure across the collection.
