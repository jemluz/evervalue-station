# Tests

## Decision

Use a layered test strategy for the synchronization flow:

1. unit tests for business rules
2. integration tests with PostgreSQL using Testcontainers
3. smoke checks for cron validation.

## Context

The cron job is the trust boundary between external market data and the database. Any validation or persistence error here can produce wrong prices and incorrect conversions.

## Rules

- Validate Coingecko payloads before writing to the database.
- Keep the BTC reference invariant at `100000000` sats.
- Verify database writes in a real Postgres environment.
- Use smoke checks to validate operational execution of the sync job.

## Test layers

### Unit tests

Cover isolated logic that directly affects data correctness:

- payload validation
- normalization rules
- retry and timeout policy
- financial invariants

### Integration tests

Use Vitest + Testcontainers + PostgreSQL 16 to validate the actual synchronization flow against a temporary database.

These tests confirm:

- sync completes successfully
- price data is written to the correct table
- status data is written with the fixed id
- the database behavior matches the production contracts of the service

### Smoke tests

Run a lightweight operational check after deployment or manual execution of the cronjob.

Purpose:

- verify the sync still runs
- validate that database rows are updated
- confirm status rows remain consistent with the expected schema

## Non-goals

- broad mock-heavy validation for production logic
- replacing integration tests with isolated unit-only checks
- testing frontend conversion flows before the backend contract is stable

## Decision bias

Prefer real behavior over mock validation, especially for external API and database writes.
