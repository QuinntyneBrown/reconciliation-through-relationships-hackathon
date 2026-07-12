<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Acceptance Test Driven Development (ATDD)

Every change to source code behavior or a public code contract must be driven by acceptance tests. Follow this loop:

1. **Write the acceptance test first.** Before touching implementation code, write (or update) a test that expresses the expected behavior from the perspective of the user or consuming code. Run it and watch it fail for the right reason.
2. **Implement the smallest change** that makes the acceptance test pass.
3. **Refactor** only while the suite is green.

Documentation-only, repository metadata, configuration, and template changes do not require a new or intentionally failing acceptance test when they do not alter application behavior. Validate those changes with the smallest relevant checks, such as formatting, link validation, schema validation, or a configuration dry run. Add an acceptance test if a non-source change modifies a user-visible runtime contract.

## Boundary interface tests — the fast core of the suite

Most acceptance coverage should live in **boundary interface tests**: tests that exercise the system at its public boundaries (API route handlers, server actions, service/module public APIs, component contracts) rather than through a full browser stack. These must be **fast** — fast enough to run on every change without hesitation.

- Call the boundary directly in-process (invoke the route handler, server action, or public function) instead of booting servers or real browsers.
- Stub or fake external dependencies (network, database, third-party services) at the boundary so each test runs in milliseconds.
- Assert on the contract (inputs, outputs, status codes, emitted events), not on internals — tests should survive refactors.
- Reserve slow browser/E2E tests for a handful of critical user journeys; everything else belongs in the fast boundary suite.
- Run the fast boundary suite before considering any change complete. If it gets slow, treat that as a defect and fix it.
