# EVA Station — Testing Map

## Current State

- No automated test framework configured (no Jest/Vitest/Playwright/Cypress files found).
- No `*.test.*` or `*.spec.*` files detected in repository.

## Available Quality Gates

- Lint only:
  - `npm run lint`
  - `npm run lint:check`
  - `npm run lint:fix`

## Existing Manual Validation Surface

- Converter flow (`/`): input sanitization + cross-field recalculation
- Health route (`/health`): visual status of ethers import and SWR usage marker
- Static informational pages (`/about-eva`, `/about-us`)

## Gaps

- No unit tests for conversion math and formatting (`formatVal`, multipliers, derived values)
- No integration tests for hook/controller behavior
- No route/component smoke tests

## Minimum Next Step (Suggested)

1. Add unit tests for converter utility and controller calculations.
2. Add one route-level smoke test for `/` and `/health`.
3. Keep lint as mandatory pre-merge gate.
