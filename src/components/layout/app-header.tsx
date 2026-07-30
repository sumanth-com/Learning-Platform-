import Link from "next/link";
import { BookOpen, LayoutDashboard, UserRound } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  active?: "dashboard" | "roadmap" | "learn" | "profile";
}

export function AppHeader({ active }: AppHeaderProps) {
  const roadmapActive = active === "roadmap" || active === "learn";

  return (
    <header className="relative z-10 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href={AUTH_ROUTES.dashboard}
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <SupraBaseMark className="h-8 w-8" />
          <span className="gradient-text">Suprabase</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href={AUTH_ROUTES.dashboard}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2",
                active === "dashboard" && "bg-zinc-800 text-zinc-50"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href={CURRICULUM_ROUTES.roadmap}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2",
                roadmapActive && "bg-zinc-800 text-zinc-50"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Roadmap</span>
            </Button>
          </Link>
          <Link href={AUTH_ROUTES.profile}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2",
                active === "profile" && "bg-zinc-800 text-zinc-50"
              )}
            >
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </Link>
          <LogoutButton size="sm" />
        </nav>
      </div>
    </header>
  );
}
