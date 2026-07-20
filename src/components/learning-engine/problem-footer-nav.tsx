"use client";

import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProblemFooterNavProps {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onShowList: () => void;
}

export function ProblemFooterNav({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onShowList,
}: ProblemFooterNavProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-800/80 bg-zinc-950/90 px-4 py-2.5">
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 border-zinc-800 bg-zinc-900/50 text-xs text-zinc-300 hover:bg-zinc-800"
        onClick={onPrev}
        disabled={!hasPrev}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Previous Problem
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 border-zinc-800 bg-zinc-900/50 text-xs text-zinc-300 hover:bg-zinc-800"
        onClick={onShowList}
      >
        <List className="h-3.5 w-3.5" />
        Problem List
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 border-zinc-800 bg-zinc-900/50 text-xs text-zinc-300 hover:bg-zinc-800"
        onClick={onNext}
        disabled={!hasNext}
      >
        Next Problem
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
