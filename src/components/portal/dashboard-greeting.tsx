"use client";

import { useEffect, useState } from "react";

/** Time-aware greeting. Resolves after mount so SSR and client agree. */
export function DashboardGreeting({
  firstName,
  message,
}: {
  firstName: string;
  message: string;
}) {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : hour < 21
            ? "Good evening"
            : "Working late"
    );
  }, []);

  return (
    <div className="min-w-0">
      <h1 className="truncate text-[23px] font-semibold tracking-tight text-foreground sm:text-[27px]">
        {greeting}, {firstName}
      </h1>
      <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
