"use client";

import { cn } from "@/lib/utils";

export function BrowserFrame({
  children,
  className,
  url = "app.suprabase.dev",
  toolbar,
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
  toolbar?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#121214] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.85)]",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/8 bg-[#1a1a1d]/95 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="min-w-0 flex-1 rounded-full border border-white/8 bg-black/30 px-3 py-1.5 text-center text-[11px] text-white/45">
          {url}
        </div>
        {toolbar}
      </div>
      <div className="relative min-h-[280px] bg-[#0d0d0f]">{children}</div>
    </div>
  );
}
