import { cn } from "@/lib/utils";

interface StickyPageToolbarProps {
  children: React.ReactNode;
  className?: string;
}

/** Sticks below the viewport top while scrolling page content */
export function StickyPageToolbar({
  children,
  className,
}: StickyPageToolbarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 -mx-4 mb-2 border-b border-zinc-800/80 bg-zinc-950/95 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
