# Overview

Eva Station will be a website for price lookup (USD, BTC, BRL, SATS, and EVA).

This website came from the need to open multiple browser tabs to check prices every time I was going to buy the EVA token (evervalue coin).

## General architecture

EVA Station will be composed of:

- 1 frontend system
- 2 backend systems
- 1 database

These systems depend on the Coingecko API for price lookup:
https://api.coingecko.com/api/v3

System behavior will be:

- User queries Frontend
- Frontend queries Backend I
- Backend I queries database and responds to Frontend
- Backend II queries Coingecko API and writes to Database
- Database stores prices and Coingecko API status

In the future, the system will fetch on-chain data, and Coingecko API queries will become a fallback (when it is not possible to establish an on-chain connection).

---

### Behavior

**Frontend**:

- Must display a form with inputs: BTC, USD, EVA, BRL, and SATS
- Each input must reflect updated prices
- When changing value in one input, other inputs must be updated with corresponding conversion.
  - For example: when entering R$ 100.00 in BRL input, USD, BTC, EVA, and SATS values must be equivalent of R$ 100.00 converted to each currency.

**Backend I:**

- Must perform all conversion calculations (if needed) and provide ready-to-use information to Frontend.
- Must query Database to read/get price information.
- Must query Database to read/get status information.

**Backend II**:

- Must query Coingecko API to get updated price values.
- Must query Coingecko API to get updated API status.
- Must perform price and status queries periodically (every 5 min) to keep data fidelity, as a cronjob.
- Must write updated data (prices and status) to Database.

**Database**:

- Must store price values (USD, BRL, SATS, EVA, and BTC)
- Must store Coingecko API status.
- Can provide information (prices and status) to Backend I.
- Can be updated (prices and status) by Backend II.

**Coingecko API endpoints**:

- To check status: `https://api.coingecko.com/api/v3/ping`
- To check prices: `https://api.coingecko.com/api/v3/simple/price?ids=evervalue-coin,bitcoin&vs_currencies=usd,brl,btc,sats`

- **Result**: Receives JSON with both objects. For EVA, Coingecko already performs internal conversion to BTC, USD, and BRL.
- **Advantage**: Single transaction in 5-min cronjob.

---
