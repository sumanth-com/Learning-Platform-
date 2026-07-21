"use client";

import { Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePortalShell } from "@/components/portal/portal-shell-context";
import type { PortalUser } from "@/features/portal/types";

type StudentHeaderProps = {
  title?: string;
  subtitle?: string;
  user: PortalUser;
};

export function StudentHeader({ title, subtitle, user }: StudentHeaderProps) {
  const { collapsed, toggleCollapsed, toggleMobile } = usePortalShell();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/90 bg-zinc-950/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 md:hidden"
          onClick={toggleMobile}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="hidden h-9 w-9 md:inline-flex"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        <div className="min-w-0 flex-1">
          {title ? (
            <>
              <h1 className="truncate text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="truncate text-xs text-zinc-500">{subtitle}</p>
              ) : null}
            </>
          ) : (
            <div className="relative hidden max-w-md md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search curriculum, projects, notes…"
                className="h-9 border-zinc-800 bg-zinc-900/50 pl-9 text-sm"
                readOnly
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-zinc-200">{user.name}</p>
            <p className="text-[10px] capitalize text-zinc-500">{user.role}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600/20 text-sm font-semibold text-indigo-300">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
