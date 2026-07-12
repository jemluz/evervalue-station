"use client";

import { createContext, useContext, useMemo } from "react";

import { useConversorController } from "@/hooks/useConversorController";
import type { ConversorController } from "@/types/conversor";

interface ConversorProviderProps {
  children: React.ReactNode;
}

const ConversorContext = createContext<ConversorController | null>(null);

/**
 * Provides converter state and actions to the converter subtree.
 *
 * @param props Provider props containing children.
 * @returns Converter context provider.
 */
export function ConversorProvider({ children }: ConversorProviderProps) {
  const controller = useConversorController();
  const value = useMemo(() => controller, [controller]);

  return (
    <ConversorContext.Provider value={value}>
      {children}
    </ConversorContext.Provider>
  );
}

/**
 * Reads converter context values and actions.
 *
 * @returns Converter controller from context.
 */
export function useConversorContext(): ConversorController {
  const context = useContext(ConversorContext);

  if (!context) {
    throw new Error(
      "useConversorContext must be used within a ConversorProvider.",
    );
  }

  return context;
}
