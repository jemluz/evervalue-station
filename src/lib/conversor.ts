import { Banknote, Bitcoin, Coins, DollarSign, Hexagon } from "lucide-react";

import type { FieldDefinition } from "@/types/conversor";

export const FIELDS: FieldDefinition[] = [
  {
    id: "btc",
    label: "Bitcoin",
    symbol: "BTC",
    icon: Bitcoin,
    decimals: 8,
    href: "https://www.coingecko.com/en/coins/bitcoin",
  },
  {
    id: "sats",
    label: "Satoshi",
    symbol: "SATS",
    icon: Coins,
    decimals: 0,
    href: "https://charts.bitbo.io/satoshi-per-dollar/",
  },
  {
    id: "usd",
    label: "Dólar",
    symbol: "USD",
    icon: DollarSign,
    decimals: 2,
    href: "https://www.coingecko.com/en/coins/usdc",
  },
  {
    id: "brl",
    label: "Real",
    symbol: "BRL",
    icon: Banknote,
    decimals: 2,
    href: "https://br.tradingview.com/symbols/USDBRL",
  },
  {
    id: "eva",
    label: "EVA Token",
    symbol: "EVA",
    icon: Hexagon,
    decimals: 2,
    href: "https://www.coingecko.com/en/coins/evervalue-coin",
  },
];

/**
 * Sanitizes user input for decimal values used by converter fields.
 *
 * @param value Raw input value from the field.
 * @returns Sanitized numeric string without commas, or `null` when invalid.
 * @example
 * // Input: sanitizeDecimalInput("1,234.50")
 * // Output: "1234.50"
 *
 * // Input: sanitizeDecimalInput("12a")
 * // Output: null
 */
export const sanitizeDecimalInput = (value: string): string | null => {
  const raw = value.replace(/,/g, "");
  return /^\d*\.?\d*$/.test(raw) ? raw : null;
};

/**
 * Formats a numeric value with thousands separators and trimmed decimal zeros.
 *
 * @param val Numeric value to format.
 * @param dec Maximum number of decimal places.
 * @returns Human-readable formatted number string.
 * @example
 * // Input: formatVal(12345.6, 2)
 * // Output: "12,345.6"
 *
 * // Input: formatVal(1000, 2)
 * // Output: "1,000"
 */
export const formatVal = (val: number, dec: number): string => {
  if (Number.isNaN(val)) return "";

  const [intPart, decPart] = val.toFixed(dec).split(".");
  const fmtInt = new Intl.NumberFormat("en-US").format(Number(intPart));

  if (decPart) {
    const trimmed = decPart.replace(/0+$/, "");
    return trimmed ? `${fmtInt}.${trimmed}` : fmtInt;
  }

  return fmtInt;
};
