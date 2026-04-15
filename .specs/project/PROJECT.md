# EVA Station — Project Charter

## Product

EVA Station is an on-chain analysis dashboard focused on EVA (Arbitrum), starting with a real-time converter and price references.

## Purpose

Centralize the essential EVA analysis workflow in one place, reducing tab/context switching for frequent buyers and analysts.

## Primary User

- Frequent EVA buyer and tracker
- Analyst validating pricing and token context quickly

## Problem Statement

Today, users often need to combine multiple sources manually (explorer + conversion math + price references). This creates friction and repeated manual work.

## Product Goals

1. Deliver a universal converter: BTC ↔ SATS ↔ USD ↔ BRL ↔ EVA
2. Keep EVA pricing references visible and easy to compare
3. Expand progressively into reliable on-chain and market metrics
4. Keep UX simple, predictable, and fast

## Scope

### In Scope (current direction)

- Converter and price references as the core experience
- Phased expansion for metrics (supply, holders, market data)
- Documentation-first development and clear contribution patterns

### Out of Scope (for now)

- Full tokenomics suite in initial releases
- Multi-token portfolio tracking

## Current Baseline (April 2026)

- App Router structure and converter UI are implemented
- Conversion logic is centralized in hooks/context
- Runtime data sources are still mocked for converter and health
- Automated tests are not yet present; lint is the active gate

## Success Criteria

- User can complete conversion and price-check workflow without external tab hopping
- Data refresh behavior is trustworthy and transparent
- MVP essentials ship before deeper analytics scope
- Docs remain synchronized with implementation decisions

## Constraints and Quality Bar

- TypeScript strict mode
- Reusable hook-based business logic
- UI components should stay presentation-focused
- External integrations must include loading/error handling
- Incremental delivery preferred over large batches
