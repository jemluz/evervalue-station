import { syncPrices } from "../../src/services/sync-prices.service";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

let container: Awaited<ReturnType<PostgreSqlContainer["start"]>>;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16.14-alpine3.24")
    .withDatabase("testdb")
    .withUsername("testuser")
    .withPassword("testpassword")
    .start();
});

afterAll(async () => {
  await container.stop();
});

// when coingecko api is up
// should record/update prices in db
// should record/update status in db
// should status id be 1 (fixed index)

describe("sync database: happy path", () => {
  it("should record/update price/status", async () => {
    await expect(syncPrices()).resolves.toBeUndefined();
  });
});
