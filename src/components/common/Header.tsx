"use client";

import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Hexagon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const handleConnect = () => {
    console.log(
      "emit some toast with wallet connection will be available soon",
    );
    // toast({
    //   title: 'Em breve',
    //   description: 'A conexão com a carteira estará disponível na próxima atualização.',
    // })
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#ffba58]">
            <Hexagon className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <span className="font-medium text-lg tracking-tight text-black">EVA Station</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-black flex items-center gap-1",
                pathname === link.path ? "text-black" : "text-gray-500",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          onClick={handleConnect}
          className="rounded-full bg-black hover:bg-black/80 text-white px-6 font-medium"
        >
          Connect
        </Button>
      </div>
    </header>
  );
}
