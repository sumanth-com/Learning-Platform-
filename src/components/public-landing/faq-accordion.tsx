"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQS } from "./content";

export function FaqAccordion() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3aaa0]">
          FAQ
        </p>
        <h2 className="mt-3 text-balance text-[2rem] font-medium tracking-[-0.04em] text-white sm:text-[2.5rem]">
          Questions students actually ask
        </h2>
      </div>

      <div className="mt-10 space-y-3">
        {FAQS.map((item, index) => {
          const expanded = open === index;
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;
          return (
            <div
              key={item.q}
              className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]"
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-[14px] font-medium text-white sm:text-[15px]">
                  {item.q}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-white/45 transition",
                    expanded && "rotate-180 text-[#f3aaa0]"
                  )}
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!expanded}
                className="border-t border-white/8 px-5 pb-5 pt-3 text-[13px] leading-relaxed text-white/55 sm:text-[14px]"
              >
                {item.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
