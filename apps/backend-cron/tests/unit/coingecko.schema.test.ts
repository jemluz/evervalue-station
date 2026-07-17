// should accept valid payload for bitcoin and evervalue-coin
// should reject invalid payload missing required fields

import { validateCoingeckoPayload } from "../../src/validation/normalize-coingecko-price";

describe("Coingecko schema validation", () => {
  it("should accept valid payload for bitcoin and evervalue-coin", () => {
    const validPayload = {
      btc: { usd: 50000, brl: 300000, sats: 100000000 },
      evervaluecoin: { usd: 1, brl: 5, btc: 0.00002, sats: 2000 },
    };

    expect(() => validateCoingeckoPayload(validPayload)).not.toThrow();
  });
});
