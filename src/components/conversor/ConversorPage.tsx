"use client";

import { ConversorProvider } from "./ConversorContext";
import { ConversorCard } from "./ConversorCard";
import { PriceReferences } from "./PriceReferences";
import { ConversorTitle } from "./ConversorTitle";

function ConversorPageContent() {
  return (
    <div className="flex w-full flex-1 flex-col items-center bg-transparent pb-10">
      <div className="mt-6 w-full max-w-xl space-y-6 px-4 md:mt-12">
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
