"use client";

import { ConversorProvider } from "./ConversorContext";
import { ConversorCard } from "./ConversorCard";
import { PriceReferences } from "./PriceReferences";
import { ConversorTitle } from "./ConversorTitle";

function ConversorPageContent() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center bg-transparent">
      <div className="conversor-fit-scale w-full max-w-xl space-y-6 px-4">
        <ConversorTitle />
        <PriceReferences />
        <ConversorCard />
      </div>
    </div>
  );
}

export function ConversorPage() {
  return (
    <ConversorProvider>
      <ConversorPageContent />
    </ConversorProvider>
  );
}
