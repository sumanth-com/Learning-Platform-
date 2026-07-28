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

/** Floating brand mark with soft 3D depth (shadow stack + glow). */
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
    <div className="relative flex h-[5.5rem] w-[5.5rem] items-center justify-center sm:h-24 sm:w-24">
      <div
        aria-hidden
        className={cn(
          "absolute h-[90%] w-[90%] rounded-full blur-2xl",
          glow
        )}
      />
      {/* Depth plate */}
      <div
        aria-hidden
        className="absolute inset-[10%] rounded-[1.35rem] bg-white/55 shadow-[0_18px_40px_-12px_rgba(20,30,40,0.45),0_2px_0_rgba(255,255,255,0.8)_inset] ring-1 ring-black/[0.04] backdrop-blur-[2px]"
      />
      <div
        aria-hidden
        className="absolute inset-[18%] translate-y-1 rounded-[1.1rem] bg-black/[0.06] blur-[1px]"
      />
      <Image
        src={src}
        alt={alt}
        width={72}
        height={72}
        className={cn(
          "relative z-[1] h-12 w-12 object-contain drop-shadow-[0_10px_18px_rgba(20,30,40,0.28)]",
          "sm:h-14 sm:w-14",
          "transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-0.5"
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
      <CoverDots className={cn(style.tone.line, "opacity-45")} />

      <div
        aria-hidden
        className={cn(
          "absolute -left-14 -top-16 h-48 w-48 rounded-full blur-3xl",
          style.tone.glowA
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute -bottom-16 -right-12 h-52 w-52 rounded-full blur-3xl",
          style.tone.glowB
        )}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/30 to-transparent"
      />

      <div className="relative flex h-full min-h-[10.75rem] items-center gap-4 px-5 py-5">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={cn("h-1.5 w-6 rounded-full", style.tone.accent)} />
            <span
              className={cn(
                "truncate text-[10px] font-semibold uppercase tracking-[0.14em]",
                style.tone.muted
              )}
            >
              {style.eyebrow}
            </span>
          </div>
          <h3
            className={cn(
              "truncate whitespace-nowrap text-[1.45rem] font-semibold tracking-[-0.04em] sm:text-[1.6rem]",
              style.tone.ink
            )}
          >
            {style.label}
          </h3>
        </div>

        <div className="relative shrink-0 pr-0.5">
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
