import type { ElementType } from "react";

export type FieldKey = "btc" | "sats" | "usd" | "brl" | "eva";

export interface Rates {
  BTC_USD: number;
  BTC_BRL: number;
  EVA_USD: number;
  EVA_BRL: number;
}

export interface FieldDefinition {
  id: FieldKey;
  label: string;
  symbol: string;
  icon: ElementType;
  decimals: number;
  href?: string;
}

export interface ConversorBaseInput {
  field: FieldKey;
  val: string;
}

export type ConversorValues = Record<FieldKey, string>;

export interface ConversorControllerState {
  rates: Rates;
  values: ConversorValues;
  usdValue: number;
  activeInput: FieldKey | null;
  isLoading: boolean;
  isGeneratingImage: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

export interface ConversorControllerActions {
  onFieldFocus: (field: FieldKey) => void;
  onFieldBlur: () => void;
  onFieldChange: (field: FieldKey, raw: string) => void;
  onClear: () => void;
  onShare: () => void;
}

export type ConversorController = ConversorControllerState &
  ConversorControllerActions;
