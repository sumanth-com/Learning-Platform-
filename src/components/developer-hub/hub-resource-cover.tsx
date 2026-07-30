"use client";

import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/utils";
import type { HubCoverStyle } from "@/features/developer-hub/data/cover-images";
import { HUB_BRAND_ASSETS } from "@/features/developer-hub/data/hub-brand-assets";

function CoverDots({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const patternId = `hub-dot-${id}`;
  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={patternId}
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/** Brand mark with soft depth. Static by design so grids never jitter on scroll. */
function BrandMark3D({
  src,
  alt,
  glow,
}: {
  src: string;
  alt: string;
  glow: string;
}) {
  return (
    <div className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center sm:h-20 sm:w-20">
      <div
        aria-hidden
        className={cn("absolute h-[85%] w-[85%] rounded-full blur-xl", glow)}
      />
      <div
        aria-hidden
        className="absolute inset-[10%] rounded-[1.25rem] bg-white/60 shadow-[0_12px_26px_-14px_rgba(20,30,40,0.4),0_1px_0_rgba(255,255,255,0.85)_inset] ring-1 ring-black/[0.04]"
      />
      <Image
        src={src}
        alt={alt}
        width={72}
        height={72}
        className={cn(
          "relative z-[1] h-11 w-11 object-contain drop-shadow-[0_8px_14px_rgba(20,30,40,0.24)]",
          "sm:h-12 sm:w-12"
        )}
        unoptimized
      />
    </div>
  );
}

export function HubResourceCover({
  style,
  className,
}: {
  style: HubCoverStyle;
  className?: string;
}) {
  const asset = HUB_BRAND_ASSETS[style.brand];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-t-2xl",
        style.tone.surface,
        className
      )}
    >
      <CoverDots className={cn(style.tone.line, "opacity-40")} />

      <div
        aria-hidden
        className={cn(
          "absolute -left-12 -top-14 h-40 w-40 rounded-full blur-2xl",
          style.tone.glowA
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute -bottom-14 -right-10 h-44 w-44 rounded-full blur-2xl",
          style.tone.glowB
        )}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/25 to-transparent"
      />

      <div className="relative flex h-full min-h-[10.75rem] items-center gap-3 px-5 py-5">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                "h-1.5 w-5 shrink-0 rounded-full",
                style.tone.accent
              )}
            />
            <span
              title={style.eyebrow}
              className={cn(
                "min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.1em]",
                style.tone.muted
              )}
            >
              {style.eyebrow}
            </span>
          </div>
          <h3
            className={cn(
              "text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.035em] [text-wrap:balance] sm:text-[1.4rem]",
              style.tone.ink
            )}
          >
            {style.label}
          </h3>
        </div>

        <div className="relative shrink-0">
          <BrandMark3D
            src={asset.src}
            alt={`${style.label} logo`}
            glow={asset.glow}
          />
        </div>
      </div>
    </div>
  );
}
