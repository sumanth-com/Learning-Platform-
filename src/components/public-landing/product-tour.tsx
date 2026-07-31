"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./browser-frame";
import { TOUR_TABS, type TourTabId } from "./content";
import { DemoFrame } from "./feature-demos";
import { useDemoClock, useInViewOnce, usePrefersReducedMotion } from "./demo-hooks";

export function ProductTour() {
  const [active, setActive] = useState<TourTabId>("dashboard");
  const tab = TOUR_TABS.find((item) => item.id === active) ?? TOUR_TABS[0];
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInViewOnce(0.25);
  const { progress, playing, replay, toggle } = useDemoClock({
    durationMs: tab.durationMs,
    active: inView,
    reducedMotion: reduced,
  });

  useEffect(() => {
    if (!inView || reduced || progress < 1) return;
    const index = TOUR_TABS.findIndex((item) => item.id === active);
    const timer = window.setTimeout(() => {
      const next = TOUR_TABS[(index + 1) % TOUR_TABS.length];
      setActive(next.id);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [active, inView, progress, reduced]);

  return (
    <section
      id="tour"
      ref={ref}
      className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3aaa0]">
          Product tour
        </p>
        <h2 className="mt-3 text-balance text-[2rem] font-medium tracking-[-0.04em] text-white sm:text-[2.75rem]">
          See SupraBase in action
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
          Short, muted walkthroughs of the real workflows — switch tabs anytime,
          or let the tour autoplay.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {TOUR_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-[12px] font-medium transition",
              active === item.id
                ? "border-white bg-white text-[#181719]"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
            )}
            aria-pressed={active === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-xl text-center text-[13px] text-white/45">
        {tab.caption}
      </p>

      <div className="mt-8">
        <BrowserFrame
          url={`app.suprabase.dev/${tab.id}`}
          toolbar={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
                aria-label={playing ? "Pause demo" : "Play demo"}
              >
                {playing && progress < 1 ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={replay}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
                aria-label="Replay demo"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          }
        >
          <DemoFrame kind={active} progress={progress} />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#db5b65] to-[#f1a379] transition-[width] duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </BrowserFrame>
      </div>
    </section>
  );
}
