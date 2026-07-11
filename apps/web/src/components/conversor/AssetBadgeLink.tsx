import type { ElementType } from "react";

interface AssetBadgeLinkProps {
  icon: ElementType;
  symbol: string;
  href?: string;
  ariaLabel?: string;
}
export function AssetBadgeLink({
  icon: Icon,
  symbol,
  href,
  ariaLabel,
}: AssetBadgeLinkProps) {
  const content = (
    <>
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-4 w-4 text-black" />
      </div>
      <span className="text-sm font-medium text-black">{symbol}</span>
    </>
  );

  const className =
    "flex h-10 shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pr-3 pl-2 shadow-sm";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel ?? `Open ${symbol} on CoinGecko`}
      className={className}
    >
      {content}
    </a>
  );
}
