"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { useAdminShell } from "@/components/admin/admin-shell-context";
import { HeaderNotifications } from "@/components/notifications/header-notifications";
import { ProfileMenu } from "@/components/portal/profile-menu";
import {
  getAdminBreadcrumbs,
  getAdminPageTitle,
} from "@/features/admin/lib/breadcrumbs";
import { ADMIN_ROUTES } from "@/features/admin/types";

type AdminTopbarProps = {
  userName?: string | null;
  userRole?: string | null;
};

export function AdminTopbar({ userName, userRole }: AdminTopbarProps) {
  const pathname = usePathname();
  const { toggleMobileOpen } = useAdminShell();
  const breadcrumbs = getAdminBreadcrumbs(pathname);
  const title = getAdminPageTitle(pathname);
  const displayName = userName?.trim() || "Super Admin";
  const displayRole = (userRole ?? "super_admin").replaceAll("_", " ");

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/90 bg-zinc-950/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 shrink-0 lg:hidden"
          onClick={toggleMobileOpen}
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <AdminBreadcrumbs items={breadcrumbs} />
          <p className="mt-0.5 truncate text-sm font-medium text-zinc-100 sm:hidden">
            {title}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <HeaderNotifications inboxHref={ADMIN_ROUTES.notifications} />
          <ProfileMenu
            name={displayName}
            role={displayRole}
            helpHref={ADMIN_ROUTES.settings}
            helpLabel="Settings"
          />
        </div>
      </div>
    </header>
  );
}
