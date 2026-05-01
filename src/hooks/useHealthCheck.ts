import { useEffect, useMemo, useState } from "react";
import {
  COINGECKO_URLS,
  INITIAL_ENDPOINT_STATE,
} from "@/components/health/utils";
import type { HealthData, UseHealthCheckResult } from "@/types/health";

/**
 * Builds the local mock payload used by the health hook while backend status is static.
 *
 * @returns Health data object with an "ok" status and current ISO timestamp.
 *
 * @example
 * Input:
 * buildMockHealthData()
 *
 * Output:
 * { status: "ok", checkedAt: "2026-04-29T12:00:00.000Z" }
 */
const buildMockHealthData = (): HealthData => ({
  status: "ok",
  checkedAt: new Date().toISOString(),
});

/**
 * Normalizes unknown request errors to user-friendly and raw string messages.
 *
 * @param error Unknown error thrown by fetch or parsing operations.
 * @returns Normalized error payload used by endpoint state.
 *
 * @example
 * Input:
 * normalizeHealthError(new Error("HTTP 500"))
 *
 * Output:
 * { errorMessage: "HTTP 500", rawError: "Error: HTTP 500" }
 */
function normalizeHealthError(error: unknown): {
  errorMessage: string;
  rawError: string;
} {
  if (error instanceof DOMException && error.name === "AbortError") {
    return {
      errorMessage: "Request aborted",
      rawError: `${error.name}: ${error.message}`,
    };
  }

  if (error instanceof Error) {
    return {
      errorMessage: error.message,
      rawError: `${error.name}: ${error.message}`,
    };
  }

  const rawError = typeof error === "string" ? error : JSON.stringify(error);

  return {
    errorMessage: "Unknown request error",
    rawError,
  };
}

/**
 * Performs a health assertion against an endpoint by checking HTTP status and JSON parsing.
 *
 * @param url Endpoint URL to verify.
 * @param signal Abort signal used to cancel the request on cleanup.
 * @returns A promise that resolves when the endpoint is healthy, or rejects with a descriptive error.
 *
 * @example
 * Input:
 * await assertEndpointHealthy(
 *   "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
 *   new AbortController().signal,
 * )
 *
 * Output:
 * Promise<void> resolved (for a 2xx JSON response)
 */
async function assertEndpointHealthy(
  url: string,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch(url, {
    signal,
    cache: "no-store",
  });

  if (!res.ok) {
    const statusText = res.statusText
      ? ` - ${res.statusText.toLowerCase()}`
      : "";
    throw new Error(`HTTP ${res.status}${statusText}`);
  }

  try {
    await res.json();
  } catch {
    throw new Error("Invalid JSON response");
  }
}

/**
 * Runs CoinGecko health checks and exposes aggregate/loading/error states for the health page.
 *
 * @returns Hook state containing static health data and per-endpoint request status.
 *
 * @example
 * Input:
 * useHealthCheck()
 *
 * Output:
 * {
 *   data: { status: "ok", checkedAt: "2026-04-29T12:00:00.000Z" },
 *   isLoading: false,
 *   isError: false,
 *   coinGeckoStatusByEndpoint: {
 *     evaPrice: { status: "ok" },
 *     btcPrice: { status: "ok" }
 *   }
 * }
 */
export function useHealthCheck(): UseHealthCheckResult {
  // Keep a stable timestamp per hook lifecycle while SWR is disabled.
  const data = useMemo(() => buildMockHealthData(), []);

  const [coinGeckoStatusByEndpoint, setCoinGeckoStatusByEndpoint] = useState<
    UseHealthCheckResult["coinGeckoStatusByEndpoint"]
  >({
    evaPrice: INITIAL_ENDPOINT_STATE,
    btcPrice: INITIAL_ENDPOINT_STATE,
  });

  useEffect(() => {
    const controller = new AbortController();

    const runCheck = async (key: keyof typeof COINGECKO_URLS, url: string) => {
      setCoinGeckoStatusByEndpoint((prev) => ({
        ...prev,
        [key]: INITIAL_ENDPOINT_STATE,
      }));

      try {
        await assertEndpointHealthy(url, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setCoinGeckoStatusByEndpoint((prev) => ({
          ...prev,
          [key]: { status: "ok" },
        }));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const { errorMessage, rawError } = normalizeHealthError(error);

        setCoinGeckoStatusByEndpoint((prev) => ({
          ...prev,
          [key]: {
            status: "fail",
            errorMessage,
            rawError,
          },
        }));
      }
    };

    void runCheck("evaPrice", COINGECKO_URLS.evaPrice);
    void runCheck("btcPrice", COINGECKO_URLS.btcPrice);

    return () => {
      controller.abort();
    };
  }, []);

  const statuses = Object.values(coinGeckoStatusByEndpoint).map(
    (entry) => entry.status,
  );
  const isLoading = statuses.includes("loading");
  const isError = statuses.includes("fail");

  return {
    data,
    isLoading,
    isError,
    coinGeckoStatusByEndpoint,
  };
}
