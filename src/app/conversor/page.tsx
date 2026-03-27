"use client";

export default function ConversorPage() {
  return (
    <div className="min-h-screen bg-white p-8 font-mono dark:bg-black dark:text-white">
      <h1 className="mb-2 text-2xl font-bold">Conversor</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        check EVA eva price and convert to USD, BRL, BTC, and SATS
      </p>

      <ul className="space-y-2">
      </ul>

      <p className="mt-8 text-xs text-gray-400">
        Last checked at: <span suppressHydrationWarning>sometime</span>
      </p>
    </div>
  );
}
