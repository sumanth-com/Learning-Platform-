"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/theme/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className:
          theme === "light"
            ? "border border-zinc-800 bg-zinc-950 text-zinc-100"
            : "border border-zinc-800 bg-zinc-950 text-zinc-100",
      }}
    />
  );
}
