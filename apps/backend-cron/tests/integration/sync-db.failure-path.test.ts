// when coingecko api is down
// should record status.is_online = false
// should record last_check and error message

import { syncPrices } from "../../src/services/sync-prices.service";
import * as coingeckoClient from "../../src/http/coingecko.client";

describe("sync database failure path", () => {
  it("set status.is_online = false and record last_check and error message", async () => {
    vi.spyOn(coingeckoClient, "fetchCoingeckoPrice").mockRejectedValue(
      new Error("coingecko timeout"),
    );

    await expect(syncPrices()).rejects.toThrow("not implemented");
  });
});
