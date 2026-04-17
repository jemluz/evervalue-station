# EVA Station — Roadmap

## Planning Horizon

This roadmap is organized by phases and designed for incremental delivery.

---

## Phase P0 — Essentials (MVP)

### Outcome

A reliable converter + price reference experience that users can trust daily.

### Scope

1. Universal converter behavior (BTC, SATS, USD, BRL, EVA)
2. Clear price reference section (EVA/BTC/USD/BRL context)
3. Stable loading/error states for data surfaces
4. Replace mock converter data with real adapter boundaries

### Exit Criteria

- Converter values are consistent across all fields
- Live rate pipeline is integrated with graceful fallbacks
- Health page reflects real data-layer checks
- Lint passes consistently

---

## Phase P1 — Core Metrics (V1)

### Outcome

Essential token metrics added without compromising simplicity.

### Scope

1. Supply metrics (total, burned, circulating)
2. Holder metrics (count + optional trend)
3. Polling/revalidation policy by data type
4. First automated unit tests for conversion and key metric mappers

### Exit Criteria

- Supply/holder cards are visible and reliable
- Metric update cadence is documented and implemented
- Critical logic has baseline unit coverage

---

## Phase P2 — Market and Simulation (V2)

### Outcome

Broader analytical context and practical planning tools for users.

### Scope

1. Market data (market cap, 24h volume, liquidity references)
2. Investment calculator scenarios
3. UX polish for comparative analysis workflow
4. Expand automated checks (integration/smoke)

### Exit Criteria

- User can run basic investment scenarios from current prices
- Market context cards are integrated with consistent status handling
- Regression risk reduced by broader automated checks

---

## Cross-Cutting Tracks

### Documentation Alignment

- Keep docs synchronized with real implementation
- Track key decisions and deviations as features evolve

### Integration Hardening

- Encapsulate external providers behind adapters/hooks
- Handle retries, partial failures, and stale fallback states

### Quality and Delivery

- Keep changes small and traceable
- Prefer feature-by-feature verification and release

---

## Immediate Next Feature Candidates

1. Convert `useConversorRates` from mock to real data adapter
2. Activate SWR-based revalidation where applicable
3. Add unit tests for converter math and formatting
4. Align metadata and README stack versions with current code
