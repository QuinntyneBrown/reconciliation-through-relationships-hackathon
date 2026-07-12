@AGENTS.md

# Development process

Use Acceptance Test Driven Development (ATDD) for changes to source code behavior or public code contracts: write a failing acceptance test first, make it pass, then refactor. Documentation-only, repository metadata, configuration, and template changes do not require an acceptance test when they do not change runtime behavior; validate them with the smallest relevant checks instead. Prefer fast boundary interface tests (route handlers, server actions, module public APIs, component contracts, exercised in-process with external dependencies stubbed) over slow browser E2E tests — see the ATDD section in AGENTS.md for the full rules.
