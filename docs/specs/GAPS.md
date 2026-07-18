<!-- Cross-capability appendix: gaps span multiple capabilities, so they live here rather than in any one capability folder. -->

# Known gaps and limitations

Requirements marked `Status: Not satisfied` in the capability L2 files reference GAP-001 through GAP-007. GAP-008 through GAP-012 are internal inconsistencies or dead code with no user-facing contract; they carry no requirement of their own but are recorded so they are not rediscovered.

| ID | Gap | Affected requirement(s) | Evidence |
|---|---|---|---|
| GAP-001 | `connections.status` CHECK constraint permits only `pending`/`active`, but the app writes `pending_review`; the facilitator-review flow is unenforceable as migrated | L2-FOUND-070 (also blocks L2-CONN-037/3, L2-FACIL-057/3) | `supabase/migrations/001_initial_schema.sql` vs `src/app/connections/components/ConnectionChat.tsx` |
| GAP-002 | `connections` is not in the `supabase_realtime` publication, so live connection-status updates never arrive despite the UI subscription | L2-FOUND-072 | migration 001 publication vs `ConnectionChat.tsx` subscription |
| GAP-003 | `profiles` SELECT policy's eligibility branch lacks an authentication requirement; with the blanket grants in migration 003, onboarded profiles (including `lat`/`lng` and personal boundaries) are readable with only the anon key | L2-FOUND-064 | `001_initial_schema.sql`, `003_api_grants.sql` |
| GAP-004 | `map_consent` is enforced only by client-side filtering; all eligible participants' coordinates are shipped to the browser | L2-FOUND-065 | `src/app/dashboard/page.tsx`, `ParticipantMap.tsx` |
| GAP-005 | `notifications` INSERT policy allows any authenticated user to create arbitrary notifications for any user (spoofable) | L2-FOUND-066 | `004` migration |
| GAP-006 | `system_settings.cohort_threshold` is written by facilitator settings but never read; cohort logic hardcodes 5 | L2-FACIL-060 | `SettingsClient.tsx` vs `src/domain/constants.ts`, `dashboard/page.tsx` |
| GAP-007 | Participant map popups build HTML via `setHTML()` with unescaped profile fields — a stored-XSS vector for map-consented profiles | L2-FOUND-069 | `src/components/… ParticipantMap.tsx` popup |
| GAP-008 | Settings copy says "Facilitator approval is always required regardless", but with auto-matching enabled a mutual connect activates with no review; the tested toggle behavior is canonized (L2-CONN-037, L2-FACIL-058) and the copy contradicts it | L2-CONN-037, L2-FACIL-058 (informational) | `SettingsClient.tsx` copy vs `ConnectionChat.handleConnect` |
| GAP-009 | The cohort banner's "Create cohort" button has no handler; no cohort-creation flow exists | L2-MATENG-027 (display only) | `CohortBanner.tsx` |
| GAP-010 | Two divergent vocabularies coexist: `src/domain/constants.ts`/`schema.ts` (hyphenated values, 2-letter provinces, `self-described`) vs the live DB/UI (underscored values, full province names, `prefer_not_to_say`) | L1-ONBRD-014 (informational) | `src/domain/*` vs migrations + onboarding |
| GAP-011 | `SupabaseRepository` is an unimplemented stub; `DATA_SOURCE=supabase` breaks `/map` and `/api/participants` | L1-COHRT-012, L1-ONBRD-014 (informational) | `src/data/supabase/supabase-repository.ts` |
| GAP-012 | `messages.read_at` is never written; chat read receipts are permanently in the "sent" state | L2-CONN-041 (informational) | schema vs `ConnectionChat.tsx` |
