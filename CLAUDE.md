@AGENTS.md

# Development process

Use Acceptance Test Driven Development (ATDD) for every change: write a failing acceptance test first, make it pass, then refactor. Prefer fast boundary interface tests (route handlers, server actions, module public APIs, component contracts, exercised in-process with external dependencies stubbed) over slow browser E2E tests — see the ATDD section in AGENTS.md for the full rules.
