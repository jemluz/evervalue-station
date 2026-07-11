## Backend II - Decisions (Pilot)

### Stack

- TypeScript + Node.js
- Kysely (no Prisma)
- Native Node fetch
- Zod for API payload validation
- PostgreSQL

### Architecture

- Backend II runs as dedicated worker for background synchronization.
- Project stays in monorepo, with Backend II separated by responsibility from Backend I and Frontend.

### Schedule

- Scheduler: GitHub Actions (`*/5 * * * *`).
- GitHub Actions triggers Backend II synchronization job every 5 minutes.

### Runtime flow (Backend II)

1. GitHub Actions runs every 5 minutes.
2. Workflow executes `run-sync-prices.ts`.
3. Job calls Coingecko `ping` and `simple/price`.
4. Payload is validated with Zod.
5. Upsert updates Price and Status tables through Kysely.

### GitHub Actions (minimum)

```yaml
name: sync-prices

on:
  schedule:
    - cron: "*/5 * * * *"
  workflow_dispatch:

jobs:
  run-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter backend-ii sync:prices
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          COINGECKO_BASE_URL: https://api.coingecko.com/api/v3
```

### Responsibilities

- Query Coingecko status endpoint: `/ping`.
- Query Coingecko price endpoint: `/simple/price?ids=evervalue-coin,bitcoin&vs_currencies=usd,brl,btc,sats`.
- Validate payload with Zod.
- Persist data with upsert:
  - Price table: BTC and EVA market fields (`usd`, `brl`, `btc`, `sats`, `updated_at`).
  - Status table: single heartbeat row (`id = 1`, `is_online`, `latency_ms`, `error_log`, `last_check`).

### SATS Fidelity Rule

- Treat `bitcoin.sats = 100000000` as fixed reference.
- Persist `evervalue-coin.sats` from Coingecko payload.
- Keep writes consistent to support reliable conversions in Backend I.

### Future Evolution

- Add on-chain data collection on Arbitrum in next phase.
- Keep Coingecko as fallback when on-chain connection is unavailable.
