import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-indigo-500/40 bg-indigo-500/15 text-indigo-300",
        secondary: "border-zinc-700 bg-zinc-800 text-zinc-200",
        success: "border-emerald-500/45 bg-emerald-500/15 text-emerald-300",
        warning: "border-amber-500/45 bg-amber-500/15 text-amber-300",
        destructive: "border-red-500/45 bg-red-500/15 text-red-300",
        purple: "border-purple-500/45 bg-purple-500/15 text-purple-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
