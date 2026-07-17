// should normalize usd, brl, btc, sats, updated_at
// should guarantee bitcoin.sats = 100000000 as fixed reference
// should keep evervalue-coin.sats from payload as variable reference

import { normalizedCoingeckoPrice } from "../../src/validation/normalize-coingecko-price";

describe("normalizeCoingeckoPrice", () => {
  it("keep bitcoin.sats = 100000000 as fixed reference", () => {
    const input = {
      btc: { usd: 60000, brl: 300000, sats: 100000000 },
      eva: { usd: 30, brl: 170, btc: 0.000001, sats: 50000 },
    };

    const result = normalizedCoingeckoPrice(input);
    expect(result.btc.sats).toBe(100000000);
  });
});
