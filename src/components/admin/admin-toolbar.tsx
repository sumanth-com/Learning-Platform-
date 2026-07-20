"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterOption = { value: string; label: string };

type AdminToolbarProps = {
  placeholder?: string;
  filters?: FilterOption[];
  filterKey?: string;
};

export function AdminToolbar({
  placeholder = "Search…",
  filters,
  filterKey = "filter",
}: AdminToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const activeFilter = searchParams.get(filterKey) ?? "all";

  function update(params: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
    });
    next.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`);
    });
  }

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          update({ q: String(form.get("q") ?? "") || null });
        }}
      >
        <Input
          name="q"
          defaultValue={q}
          placeholder={placeholder}
          className="bg-zinc-900/50"
        />
      </form>
      {filters && filters.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <Button
              key={f.value}
              type="button"
              size="sm"
              variant={activeFilter === f.value ? "default" : "outline"}
              className={cn(pending && "opacity-70")}
              onClick={() => update({ [filterKey]: f.value })}
            >
              {f.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
