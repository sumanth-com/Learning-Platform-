"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
  }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    data-progress-root=""
    className={cn(
      "relative h-2.5 w-full overflow-hidden rounded-full bg-[#b7a994] ring-1 ring-[#5C3A21]/25",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-progress-indicator=""
      className={cn(
        "h-full rounded-full bg-emerald-500 transition-all duration-150 ease-out",
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
