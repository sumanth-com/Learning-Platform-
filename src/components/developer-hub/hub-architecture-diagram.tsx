"use client";

import {
  Cloud,
  Database,
  LayoutDashboard,
  Server,
  Smartphone,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

function Node({
  label,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  hint?: string;
  icon: typeof Server;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[108px] flex-col items-center gap-1.5 rounded-2xl border bg-background px-3.5 py-3 text-center shadow-sm",
        "border-border/70"
      )}
    >
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl",
          accent ?? "bg-muted text-foreground"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="text-[12px] font-semibold tracking-tight text-foreground">
        {label}
      </span>
      {hint ? (
        <span className="text-[10px] leading-tight text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "hidden h-px w-8 shrink-0 bg-gradient-to-r from-border via-foreground/25 to-border sm:block",
        className
      )}
    />
  );
}

function DownArrow() {
  return (
    <div aria-hidden className="flex h-6 w-px items-end justify-center bg-border">
      <span className="mb-[-2px] block h-0 w-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-foreground/30" />
    </div>
  );
}

/** Clean production architecture board — Figma-like, not ASCII. */
export function HubArchitectureDiagram({
  title = "Request path in production",
}: {
  title?: string;
}) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-muted/40 to-background p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Architecture
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-foreground">
            {title}
          </p>
        </div>
        <span className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-[10px] text-muted-foreground">
          Happy path · failure modes separate
        </span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
          <Node
            label="Client"
            hint="Web / mobile"
            icon={Smartphone}
            accent="bg-sky-500/15 text-sky-700 dark:text-sky-300"
          />
          <Arrow />
          <Node
            label="Edge / CDN"
            hint="TLS · cache"
            icon={Cloud}
            accent="bg-violet-500/15 text-violet-700 dark:text-violet-300"
          />
          <Arrow />
          <Node
            label="API gateway"
            hint="Auth · rate limit"
            icon={LayoutDashboard}
            accent="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
          />
          <Arrow />
          <Node
            label="Core service"
            hint="Business logic"
            icon={Server}
            accent="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
          />
        </div>

        <DownArrow />

        <div className="flex w-full max-w-xl flex-wrap items-stretch justify-center gap-2.5">
          <Node
            label="Cache"
            hint="Hot reads"
            icon={Workflow}
            accent="bg-amber-500/15 text-amber-800 dark:text-amber-300"
          />
          <Node
            label="Database"
            hint="Source of truth"
            icon={Database}
            accent="bg-rose-500/15 text-rose-700 dark:text-rose-300"
          />
          <Node
            label="Queue / jobs"
            hint="Async work"
            icon={Workflow}
            accent="bg-teal-500/15 text-teal-700 dark:text-teal-300"
          />
        </div>
      </div>

      <p className="mt-4 border-t border-border/60 pt-3 text-[11px] leading-relaxed text-muted-foreground">
        In real companies this board is the starting point of a design review:
        name each box’s owner, SLO, and what happens when it fails.
      </p>
    </div>
  );
}

export function HubFlowDiagram() {
  const steps = [
    { n: "01", title: "Clarify", desc: "Requirements · scale · SLOs" },
    { n: "02", title: "Boundaries", desc: "APIs · ownership · auth" },
    { n: "03", title: "Data", desc: "Model · indexes · consistency" },
    { n: "04", title: "Scale", desc: "Cache · queue · partition" },
    { n: "05", title: "Operate", desc: "Metrics · alerts · rollout" },
  ];

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-muted/40 to-background p-4 sm:p-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        Delivery flow
      </p>
      <div className="grid gap-2 sm:grid-cols-5">
        {steps.map((step, i) => (
          <div key={step.n} className="relative flex flex-col">
            <div className="rounded-2xl border border-border/70 bg-background px-3 py-3 shadow-sm">
              <p className="text-[10px] font-semibold text-muted-foreground">
                {step.n}
              </p>
              <p className="mt-1 text-[13px] font-semibold tracking-tight">
                {step.title}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {step.desc}
              </p>
            </div>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="pointer-events-none absolute -right-1.5 top-1/2 hidden h-px w-3 -translate-y-1/2 bg-border sm:block"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
