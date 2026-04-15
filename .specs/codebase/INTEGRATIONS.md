# EVA Station — Integrations Map

## Active Integrations in Current Code

- `ethers` package is imported in `/health` page for a runtime availability check via `ethers.version`.
- No live HTTP data-fetching integration is currently active in hooks/components.

## Environment and Config

- `src/config/env.ts` validates server env using Zod.
- Current required key in code: `COINGECKO_BASE_URL` (defaulted).

## Documented but Not Yet Implemented in Runtime

Project docs describe planned integrations:

- Arbitrum RPC
- CoinGecko API
- AwesomeAPI (BRL FX)
- Arbiscan API
- Optional SWR data fetching strategy

These integrations are not currently wired in active source paths for converter values.

## Integration Maturity

- Stage: scaffold/prototype
- Data source for converter: in-memory mock rates
- Health endpoint: local mock payload in hook
