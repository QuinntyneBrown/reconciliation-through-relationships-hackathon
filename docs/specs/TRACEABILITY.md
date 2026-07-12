# Requirement-to-test traceability

`B/x` = `boundary-interface-tests/specs/x.spec.ts`; `E/nn` = `e2e/tests/nn-*.spec.ts`. "—" = no automated test yet (candidate for future ATDD work).

| L2 | Test coverage |
|---|---|
| L2-LAND-001…L2-LAND-005 | B/public-and-auth; E/01 (journey headings, CTAs) |
| L2-AUTH-006 | — (signup exercised manually; e2e users are seeded) |
| L2-AUTH-007, L2-AUTH-008 | B/public-and-auth; E/01 |
| L2-AUTH-009 | — |
| L2-AUTH-010, L2-AUTH-011 | B/public-and-auth; E/01 |
| L2-AUTH-012 | B/facilitator; E/01 |
| L2-SHELL-013 | B/public-and-auth; E/01 |
| L2-SHELL-014 | B/onboarding; B/learning; B/dashboard-and-profiles; B/facilitator; E/01 |
| L2-ONBRD-015 | B/onboarding; E/02 |
| L2-ONBRD-016…L2-ONBRD-019 | B/onboarding |
| L2-LEARN-020 | E/03 |
| L2-LEARN-021, L2-LEARN-022 | B/learning; E/03 |
| L2-LEARN-023 | B/learning |
| L2-MATENG-024 | — (unit-level; surfaced via B/dashboard-and-profiles score assertions) |
| L2-MATENG-025 | B/dashboard-and-profiles; E/04 |
| L2-MATENG-026, L2-MATENG-027 | B/dashboard-and-profiles |
| L2-MATENG-028, L2-MATENG-029 | B/dashboard-and-profiles; E/04 |
| L2-MATENG-030 | B/dashboard-and-profiles |
| L2-PROF-031 | B/dashboard-and-profiles; E/04 |
| L2-PROF-032 | — |
| L2-PROF-033 | E/04 |
| L2-PROF-034 | B/dashboard-and-profiles; B/connections |
| L2-CONN-035 | B/connections; E/05 |
| L2-CONN-036 | B/connections |
| L2-CONN-037 | B/connections; E/05 |
| L2-CONN-038 | B/connections |
| L2-CONN-039 | B/connections; E/05 |
| L2-CONN-040 | — |
| L2-CONN-041 | B/connections; E/05 |
| L2-CONN-042 | — (realtime; exercised implicitly in E/05 same-page flows) |
| L2-CONN-043 | B/connections |
| L2-MEET-044 | B/connections; E/05 |
| L2-MEET-045, L2-MEET-046 | B/connections (Zoom mocked at the HTTP boundary; real-Zoom e2e deliberately skipped) |
| L2-NOTIF-048 | B/dashboard-and-profiles; B/connections; B/facilitator (notification rows asserted at the persistence boundary) |
| L2-NOTIF-047, L2-NOTIF-049, L2-NOTIF-050 | — (bell UI, mark-read, and click routing untested) |
| L2-COHRT-051, L2-COHRT-052 | B/map; E/04 |
| L2-COHRT-053 | B/map |
| L2-FACIL-054…L2-FACIL-059 | B/facilitator; E/06 |
| L2-FACIL-060 | — (Not satisfied; see GAP-006) |
| L2-ONBRD-061, L2-ONBRD-062 | — |
| L2-FOUND-063, L2-FOUND-067, L2-FOUND-068, L2-FOUND-071 | — (schema/policy level) |
| L2-FOUND-064…L2-FOUND-066, L2-FOUND-069, L2-FOUND-070, L2-FOUND-072 | — (Not satisfied; see [GAPS.md](GAPS.md)) |
| L2-DSGN-073 | B/onboarding |
| L2-DSGN-074 | B/public-and-auth |
| L2-DSGN-075 | B/public-and-auth; E/01 |
| L2-DSGN-076 | B/public-and-auth |
