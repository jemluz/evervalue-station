import { env } from "@/config/env";
import type {
  CoinGeckoEndpointKey,
  EndpointHealthCheckState,
} from "@/types/health";

/**
 * Builds a CoinGecko `simple/price` URL with the expected query params.
 *
 * @param params Input values used to compose the URL.
 * @param params.baseUrl Base CoinGecko API URL (for example, `https://api.coingecko.com/api/v3`).
 * @param params.ids Comma-separated CoinGecko asset ids.
 * @param params.vsCurrencies Comma-separated quote currencies sent as `vs_currencies`.
 * @returns Fully-qualified URL ready to be used in a fetch call.
 *
 * @example
 * Input:
 * buildCoinGeckoSimplePriceUrl({
 *   baseUrl: "https://api.coingecko.com/api/v3",
 *   ids: "bitcoin,evervalue-coin",
 *   vsCurrencies: "usd,brl"
 * })
 *
 * Output:
 * "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cevervalue-coin&vs_currencies=usd%2Cbrl"
 */
function buildCoinGeckoSimplePriceUrl(params: {
  baseUrl: string;
  ids: string;
  vsCurrencies: string;
}): string {
  const { baseUrl, ids, vsCurrencies } = params;
  const url = new URL("simple/price", `${baseUrl}/`);

  url.search = new URLSearchParams({
    ids,
    vs_currencies: vsCurrencies,
  }).toString();

  return url.toString();
}

export const COINGECKO_URLS: Record<CoinGeckoEndpointKey, string> = {
  evaPrice: buildCoinGeckoSimplePriceUrl({
    baseUrl: env.COINGECKO_BASE_URL,
    ids: "evervalue-coin",
    vsCurrencies: "usd,brl,btc,sats",
  }),
  btcPrice: buildCoinGeckoSimplePriceUrl({
    baseUrl: env.COINGECKO_BASE_URL,
    ids: "bitcoin",
    vsCurrencies: "usd,brl",
  }),
};

export const INITIAL_ENDPOINT_STATE: EndpointHealthCheckState = {
  status: "loading",
};

/**
 * Formats a check timestamp into a readable pt-BR date-time string.
 *
 * @param checkedAt ISO date-time string.
 * @returns Formatted local date-time, or the original input when invalid.
 *
 * @example
 * Input:
 * formatCheckedAt("2026-04-29T12:00:00.000Z")
 *
 * Output:
 * "29/04/2026, 09:00:00"
 */
export function formatCheckedAt(checkedAt: string): string {
  const date = new Date(checkedAt);

  if (Number.isNaN(date.getTime())) {
    return checkedAt;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}
