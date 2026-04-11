import { useEffect, useMemo, useState } from "react";

import type { Rates } from "@/types/conversor";

const MOCK_RATES: Rates = {
  BTC_USD: 65000,
  BTC_BRL: 325000,
  EVA_USD: 0.1,
  EVA_BRL: 0.5,
};

interface UseConversorRatesResult {
  rates: Rates;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Returns converter rate data and operational status.
 *
 * @returns Rate payload and status flags for the converter flow.
 */
export function useConversorRates(): UseConversorRatesResult {
  const rates = useMemo(() => MOCK_RATES, []);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  return {
    rates,
    isLoading: false,
    error: null,
    lastUpdated,
  };
}
