"use client";

import { useEffect, useState } from "react";

/** Time-aware greeting. Resolves after mount so SSR and client agree. */
export function DashboardGreeting({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = useState("Welcome back");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setGreeting(
      hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : hour < 21
            ? "Good evening"
            : "Burning the midnight oil"
    );
    setToday(
      now.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    );
  }, []);

  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
        {today || "\u00A0"}
      </p>
      <h1 className="mt-1 truncate text-[22px] font-semibold tracking-tight text-foreground sm:text-[26px]">
        {greeting}, {firstName}
      </h1>
    </div>
  );
}
