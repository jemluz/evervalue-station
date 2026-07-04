Although EVA endpoint returns price in BTC, there are three reasons to monitor Bitcoin independently:

- **SATS Calculation**: Coingecko does not always return `sats` as stable `vs_currency` for all tokens. Having real BTC/USD price allows Backend I to calculate SATS in fail-safe way:
  - 1 BTC = 100,000,000 SATS
  - So Backend I does: `(EVA_Price_in_BTC * 100,000,000)` to guarantee SATS value, without depending on API rounding.

- **Backing Fidelity**: EVA has "BTC floor price" model (minimum BTC price that rises daily). Monitoring BTC/BRL pair in isolation lets you validate whether appreciation you see in EVA is real gain against Bitcoin or only exchange market fluctuation (BRL/USD).

- **Status Redundancy**: If EVA/BTC pair shows liquidity anomaly on exchange (which can happen with smaller tokens), you still have global Bitcoin price to keep system functional for other conversions.
