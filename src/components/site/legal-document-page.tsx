import type { ReactNode } from "react";
import { SiteCard, SitePageShell } from "@/components/site/site-page-shell";

/** Current month + year, e.g. "July 2026". */
export function currentMonthYear(date = new Date()) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export function LegalDocumentPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <SitePageShell wide>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <SiteCard className="w-full px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-medium tracking-[0.1em] text-[#f3b7ac]/80 uppercase">
              Legal
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.03em] text-white sm:text-[2.5rem]">
              {title}
            </h1>
            <p className="mt-4 text-[14.5px] leading-7 text-white/50 sm:text-[15px]">
              {description}
            </p>
            <p className="mt-3 text-[12px] text-white/35">
              Last updated {currentMonthYear()}
            </p>
          </header>

          <div className="mx-auto mt-10 max-w-3xl space-y-8 text-left text-[14px] leading-7 text-white/60 sm:mt-12 [&_a]:text-[#f3b7ac] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white [&_h2]:text-[16px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-white [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
            {children}
          </div>
        </SiteCard>
      </div>
    </SitePageShell>
  );
}
