"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Laptop, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PORTAL_ROUTES } from "@/features/portal/types";
import { cn } from "@/lib/utils";

type ContinueOnDesktopProps = {
  className?: string;
  /** Optional feature label shown under the title. */
  featureLabel?: string;
};

/**
 * Premium companion interstitial for desktop-only workflows.
 * Shown only on small screens via DesktopOnly.
 */
export function ContinueOnDesktop({
  className,
  featureLabel,
}: ContinueOnDesktopProps) {
  const router = useRouter();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied — open it on your laptop");
    } catch {
      toast.message("Open this page on your desktop or laptop to continue");
    }
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(PORTAL_ROUTES.dashboard);
  };

  return (
    <div
      className={cn(
        "flex min-h-[min(100%,28rem)] flex-1 flex-col items-center justify-center px-5 py-10",
        "pb-[max(2.5rem,env(safe-area-inset-bottom))]",
        className
      )}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-[0_28px_70px_-40px_rgba(0,0,0,0.55)] sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 55%)",
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-[0_12px_32px_-12px_rgba(229,107,104,0.45)]">
            <Laptop className="h-7 w-7" strokeWidth={1.75} />
          </span>

          <h1 className="mt-5 text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[1.6rem]">
            Continue on Desktop
          </h1>

          {featureLabel ? (
            <p className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-primary">
              {featureLabel}
            </p>
          ) : null}

          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground sm:text-[14.5px]">
            This feature is designed for a larger workspace to provide the best
            learning experience.
          </p>
          <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground/90">
            Complete projects, coding exercises, assignments, and certification
            assessments on your desktop or laptop.
          </p>

          <div className="mt-7 flex w-full flex-col gap-2.5">
            <Button
              type="button"
              className="h-11 w-full gap-2 rounded-xl text-[13.5px] font-semibold"
              onClick={() => void copyLink()}
            >
              <Link2 className="h-4 w-4" />
              Continue on Desktop
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-2 rounded-xl border-border text-[13.5px] font-medium"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
