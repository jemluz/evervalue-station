import { Image, RefreshCcw, X } from "lucide-react";

import { useConversorContext } from "@/components/conversor/ConversorContext";
import { Button } from "@/components/ui/button";

export function ConversorActions() {
  const { onClear, onShare, isGeneratingImage } = useConversorContext();

  return (
    <div className="mt-3 flex gap-3">
      <Button
        variant="ghost"
        onClick={onClear}
        className="h-14 w-42 shrink-0 rounded-[16px] border border-gray-100 bg-[#FAFAFA] font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 hover:cursor-pointer"
      >
        <X className="mr-2 h-5 w-5" />
        Clear
      </Button>
      <Button
        onClick={onShare}
        disabled={isGeneratingImage}
        className="h-14 flex-1 rounded-[16px] bg-[#ff9b12] font-medium text-white shadow-sm hover:bg-[#ff9300]   hover:cursor-pointer disabled:cursor-not-allowed"
      >
        {isGeneratingImage ? (
          <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Image className="mr-2 h-5 w-5" />
        )}
        Take a screenshot
      </Button>
    </div>
  );
}
