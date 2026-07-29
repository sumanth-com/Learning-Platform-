import { cn } from "@/lib/utils";

/** Static ambient wash that does not trigger repaints while scrolling. */
export function HubAuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute -left-[18%] -top-[8%] h-[48%] w-[62%] rounded-full opacity-20 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--palette-terracotta, var(--color-primary)) 42%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[12%] top-[2%] h-[42%] w-[55%] rounded-full opacity-20 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--palette-slate, #38bdf8) 40%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-8%] left-[18%] h-[40%] w-[58%] rounded-full opacity-15 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--palette-sage, #34d399) 38%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
    </div>
  );
}
