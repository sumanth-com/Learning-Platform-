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
      <h1 className="text-[1.375rem] font-semibold tracking-[-0.035em] text-foreground max-md:text-[1.25rem] max-md:leading-[1.25] sm:text-[1.65rem]">
        {greeting}, {firstName}
      </h1>
      <p className="mt-1.5 max-w-[48ch] text-[13px] leading-[1.5] tracking-[-0.01em] text-muted-foreground max-md:mt-1 max-md:text-[12.5px] max-md:leading-[1.45] max-md:line-clamp-2 sm:mt-2">
        {message}
      </p>
    </div>
  );
}
