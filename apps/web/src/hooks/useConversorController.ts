import { useMemo, useState } from "react";

import { formatVal } from "@/lib/conversor";
import { useConversorRates } from "@/hooks/useConversorRates";
import type {
  ConversorBaseInput,
  ConversorController,
  ConversorValues,
  FieldKey,
  Rates,
} from "@/types/conversor";

/**
 * Builds field multipliers relative to USD from current rates.
 *
 * @param rates Current converter rates.
 * @returns Multipliers keyed by converter field.
 * @example
 * // Input: buildMultipliers({ BTC_USD: 65000, BTC_BRL: 325000, EVA_USD: 0.1, EVA_BRL: 0.5 })
 * // Output: { usd: 1, btc: 65000, sats: 0.00065, brl: 0.2, eva: 0.1 }
 */
function buildMultipliers(rates: Rates): Record<FieldKey, number> {
  return {
    usd: 1,
    btc: rates.BTC_USD,
    sats: rates.BTC_USD / 100_000_000,
    brl: rates.BTC_USD / rates.BTC_BRL,
    eva: rates.EVA_USD,
  };
}

/**
 * Formats values for all fields while preserving active input behavior.
 *
 * @param base Base field and raw value entered by the user.
 * @param usdValue Current USD value derived from base input.
 * @param rates Current converter rates.
 * @param activeInput Field currently focused by the user.
 * @returns Formatted display values for each field.
 * @example
 * // Input: buildValues({ field: "btc", val: "1" }, 65000, rates, null)
 * // Output: { btc: "1", sats: "100,000,000", usd: "65,000", brl: "325,000", eva: "650,000" }
 */
function buildValues(
  base: ConversorBaseInput,
  usdValue: number,
  rates: Rates,
  activeInput: FieldKey | null,
): ConversorValues {
  if (!base.val || base.val === ".") {
    return {
      btc: "",
      sats: "",
      usd: "",
      brl: "",
      eva: "",
      [base.field]: base.val,
    };
  }

  const getStr = (field: FieldKey, val: number, dec: number): string => {
    if (activeInput === field) {
      return field === base.field
        ? base.val
        : formatVal(val, dec).replace(/,/g, "");
    }

    return formatVal(val, dec);
  };

  return {
    usd: getStr("usd", usdValue, 2),
    btc: getStr("btc", usdValue / rates.BTC_USD, 8),
    sats: getStr("sats", usdValue / (rates.BTC_USD / 100_000_000), 0),
    brl: getStr("brl", usdValue / (rates.BTC_USD / rates.BTC_BRL), 2),
    eva: getStr("eva", usdValue / rates.EVA_USD, 2),
  };
}

/**
 * Orchestrates all converter state, computed values, and user actions.
 *
 * @returns A single controller object for converter UI and interactions.
 * @example
 * // Input: useConversorController()
 * // Output: { rates, values, usdValue, activeInput, onFieldChange, onClear, ... }
 */
export function useConversorController(): ConversorController {
  const { rates, isLoading, error, lastUpdated } = useConversorRates();
  const [base, setBase] = useState<ConversorBaseInput>({
    field: "btc",
    val: "",
  });
  const [activeInput, setActiveInput] = useState<FieldKey | null>(null);

  const multipliers = useMemo(() => buildMultipliers(rates), [rates]);

  const usdValue = useMemo(
    () => (parseFloat(base.val) || 0) * multipliers[base.field],
    [base, multipliers],
  );

  const values = useMemo(
    () => buildValues(base, usdValue, rates, activeInput),
    [base, usdValue, rates, activeInput],
  );

  /**
   * Placeholder share action until image generation is implemented.
   */
  const onShare = (): void => {};

  return {
    rates,
    values,
    usdValue,
    activeInput,
    isLoading,
    isGeneratingImage: false,
    lastUpdated,
    error,
    onFieldFocus: setActiveInput,
    onFieldBlur: () => setActiveInput(null),
    onFieldChange: (field, raw) => setBase({ field, val: raw }),
    onClear: () => setBase({ field: "btc", val: "" }),
    onShare,
  };
}
