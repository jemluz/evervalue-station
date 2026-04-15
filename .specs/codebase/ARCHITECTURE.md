# EVA Station — Architecture Map

## High-Level Architecture

Current implementation is frontend-centric, with business logic concentrated in React hooks and local utilities.

Layers in practice:

1. UI layer: App Router pages + feature components
2. Logic layer: custom hooks (`useConversorController`, `useConversorRates`, `useHealthCheck`)
3. Utility/config layer: formatting, conversion constants, env schema
4. External integration layer: currently minimal in runtime (mostly mocked data)

## Routing and Entrypoints

- `/` → converter experience (`ConversorPage`)
- `/about-eva` and `/about-us` → informational pages
- `/health` → baseline diagnostics page (ethers and SWR status)

## Core Feature Flow (Converter)

1. `ConversorPage` wraps content with `ConversorProvider`
2. `ConversorProvider` exposes `useConversorController` via context
3. `useConversorController`:
   - reads rates from `useConversorRates` (currently mocked)
   - tracks active input and base field/value
   - computes USD normalization and derived values for all fields
   - exposes actions (`onFieldChange`, `onClear`, focus handlers)
4. `ConversorCard` renders field list from `FIELDS` definition and action/status subcomponents

## Health Flow

- `useHealthCheck` returns stable mock payload (`status: ok`, current timestamp)
- `/health` additionally checks `ethers.version` and reports SWR as `not-in-use`
- SWR fetch logic exists only as commented reference

## Architectural Characteristics

- Good separation between presentational components and controller hook
- Data-fetching clients are not implemented yet in active code
- Environment validation exists but currently only validates `COINGECKO_BASE_URL`
- Metadata and some docs still reflect scaffold defaults and older architecture intent
