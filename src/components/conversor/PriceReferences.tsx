import { Bitcoin, Hexagon } from "lucide-react";

import { useConversorContext } from "./ConversorContext";
import { CurrencyBadge } from "./CurrencyBadge";

export function PriceReferences() {
  const { rates } = useConversorContext();

  return (
    <div className="flex justify-center gap-3 text-sm font-medium">
      <CurrencyBadge
        val={rates.EVA_USD}
        icon={Hexagon}
        color="#FC9201"
        prefix="EVA"
        dec={6}
      />
      <CurrencyBadge
        val={rates.BTC_USD}
        icon={Bitcoin}
        color="#F7931A"
        prefix="BTC"
        dec={2}
      />
    </div>
  );
}
