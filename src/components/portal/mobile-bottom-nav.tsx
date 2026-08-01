"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  Home,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  MOBILE_BOTTOM_NAV,
  shouldHideBottomNav,
  type MobileBottomNavId,
} from "@/lib/portal-mobile";
import { cn } from "@/lib/utils";

const ICONS: Record<MobileBottomNavId, LucideIcon> = {
  home: Home,
  learn: BookOpen,
  mentor: Sparkles,
  certs: Award,
  profile: UserRound,
};

export function MobileBottomNav() {
  const pathname = usePathname();

  if (shouldHideBottomNav(pathname)) return null;

  return (
    <nav
      aria-label="Mobile companion"
      className={cn(
        "md:hidden",
        "shrink-0 border-t border-border/70 bg-card/95 backdrop-blur-xl",
        "pb-[max(0.25rem,env(safe-area-inset-bottom))]"
      )}
    >
      <ul className="grid grid-cols-5 gap-0.5 px-2 pt-1">
        {MOBILE_BOTTOM_NAV.map((item) => {
          const Icon = ICONS[item.id];
          const active = item.match(pathname);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-[2.85rem] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 transition",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon
                  className="h-[1.1rem] w-[1.1rem]"
                  strokeWidth={active ? 2.15 : 1.7}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-[9.5px] font-semibold tracking-tight",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
