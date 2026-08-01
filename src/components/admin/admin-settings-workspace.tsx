"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Database,
  KeyRound,
  Loader2,
  Mail,
  Shield,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import {
  useTheme,
  type ThemePreference,
} from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "@/features/auth/actions/auth-actions";
import { ADMIN_ROUTES } from "@/features/admin/types";
import type { SystemHealth } from "@/features/admin/services/system.service";
import { cn } from "@/lib/utils";

type Props = {
  email: string;
  fullName?: string;
  role: string;
  health: SystemHealth;
};

function SettingsCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card px-5 py-5 shadow-sm sm:px-6 sm:py-5",
        className
      )}
    >
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        ok ? "bg-emerald-500" : "bg-rose-500"
      )}
      aria-hidden
    />
  );
}

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function AdminSettingsWorkspace({
  email,
  fullName,
  role,
  health,
}: Props) {
  const { preference, setTheme } = useTheme();
  const [resetLinkPending, startResetLink] = useTransition();
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const handleSendResetLink = () => {
    if (!email) {
      toast.error("No email on this account");
      return;
    }
    startResetLink(async () => {
      const result = await forgotPasswordAction({ email });
      if (!result.success) {
        toast.error(result.error ?? "Could not send reset link");
        return;
      }
      setResetLinkSent(true);
      toast.success(`Reset link sent to ${email}.`);
    });
  };

  const integrationRows = [
    {
      label: "Supabase project URL",
      ok: health.integrations.supabaseUrl,
      detail: health.integrations.supabaseUrl ? "Configured" : "Missing",
    },
    {
      label: "Service role key",
      ok: health.integrations.serviceRole,
      detail: health.integrations.serviceRole
        ? "Configured (invite flow)"
        : "Missing — approvals will fail",
    },
    {
      label: "Resend API",
      ok: health.integrations.resend,
      detail: health.integrations.resend
        ? "Ready to send invite emails"
        : "Not configured",
    },
    {
      label: "Email from address",
      ok: health.integrations.emailFrom,
      detail: health.integrations.emailFrom
        ? "Custom sender set"
        : "Using fallback sender",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-8">
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <SettingsCard
          className="h-full"
          title="Appearance"
          description="Choose how the Super Admin portal looks. Changes apply instantly."
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-foreground">Theme</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                System, light, or dark
              </p>
            </div>
            <div className="relative w-[8.75rem] shrink-0">
              <select
                aria-label="Theme"
                value={preference}
                onChange={(e) => setTheme(e.target.value as ThemePreference)}
                className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background py-0 pl-3.5 pr-9 text-[13px] font-medium text-foreground outline-none transition hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              >
                {THEME_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard className="h-full" title="Account & security">
          <div className="flex h-full flex-col gap-4">
            <div className="min-w-0">
              <p className="truncate text-[14px] text-foreground">
                Signed in as{" "}
                <span className="font-semibold">
                  {email || fullName?.trim() || "your account"}
                </span>
              </p>
              <p className="mt-1 text-[13px] capitalize leading-relaxed text-muted-foreground">
                Role · {role.replaceAll("_", " ")}
              </p>
              {resetLinkSent ? (
                <p className="mt-2 text-[12px] font-medium text-emerald-700 dark:text-emerald-400">
                  Link sent — check your inbox (and spam folder).
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full shrink-0 border-border text-foreground hover:bg-muted sm:w-auto sm:self-start"
              disabled={resetLinkPending || !email}
              onClick={handleSendResetLink}
            >
              {resetLinkPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {resetLinkSent ? "Resend link" : "Reset password"}
            </Button>
          </div>
        </SettingsCard>
      </div>

      <SettingsCard
        title="Database health"
        description="Live connectivity and row counts across core platform tables."
      >
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border/80 bg-muted/20 px-4 py-3">
          <Database className="h-4 w-4 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-foreground">
              {health.ok ? "All systems reachable" : "Attention needed"}
            </p>
            <p className="text-[12px] text-muted-foreground">
              Checked in {health.latencyMs}ms ·{" "}
              {new Date(health.checkedAt).toLocaleString()}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
              health.ok
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
            )}
          >
            {health.ok ? "Healthy" : "Degraded"}
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/70 bg-muted/30 text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3.5 py-2.5 font-medium">Table</th>
                <th className="px-3.5 py-2.5 font-medium">Rows</th>
                <th className="px-3.5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {health.tables.map((row) => (
                <tr
                  key={row.table}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-3.5 py-2.5">
                    <p className="font-medium text-foreground">{row.label}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {row.table}
                    </p>
                  </td>
                  <td className="px-3.5 py-2.5 tabular-nums text-foreground">
                    {row.count.toLocaleString()}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-2 text-[12px] text-muted-foreground">
                      <StatusDot ok={row.ok} />
                      {row.ok ? "OK" : row.error || "Error"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <SettingsCard
          title="Integrations"
          description="Services powering invites, auth, and email delivery."
        >
          <ul className="space-y-3">
            {integrationRows.map((row) => (
              <li
                key={row.label}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/15 px-3.5 py-3"
              >
                <StatusDot ok={row.ok} />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">
                    {row.label}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {row.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {health.integrations.appUrl ? (
            <p className="mt-3 truncate text-[12px] text-muted-foreground">
              App URL · {health.integrations.appUrl}
            </p>
          ) : null}
        </SettingsCard>

        <SettingsCard
          title="Access & invites"
          description="Invite-only mode is enforced. Students join only after Super Admin approval."
        >
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/15 px-3.5 py-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  Roles
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  Only <span className="font-medium">super_admin</span> and{" "}
                  <span className="font-medium">student</span>. No other staff
                  roles.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/15 px-3.5 py-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  Approval flow
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  Approve → create auth user → invite link → branded email.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="h-10 w-full sm:w-auto">
              <Link href={ADMIN_ROUTES.accessRequests}>
                Open access requests
              </Link>
            </Button>
          </div>
        </SettingsCard>
      </div>

      <SettingsCard
        title="Platform controls"
        description="Operational shortcuts for running Suprabase as a business."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              href: ADMIN_ROUTES.students,
              label: "Students",
              body: "Accounts, progress, and access status",
              icon: Workflow,
            },
            {
              href: ADMIN_ROUTES.learning,
              label: "Learning CMS",
              body: "Courses, weeks, lessons, and resources",
              icon: Workflow,
            },
            {
              href: ADMIN_ROUTES.notifications,
              label: "Notifications",
              body: "Announcements and platform updates",
              icon: Mail,
            },
            {
              href: ADMIN_ROUTES.analytics,
              label: "Analytics",
              body: "Growth, retention, and completion",
              icon: Database,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-border/70 bg-muted/15 px-4 py-3 transition hover:border-border hover:bg-muted/40"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-[13px] font-semibold text-foreground">
                    {item.label}
                  </p>
                </div>
                <p className="text-[12px] text-muted-foreground">{item.body}</p>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-[12px] text-muted-foreground">
          Revenue, subscriptions, coupons, and CRM connectors will attach here
          without changing this layout.
        </p>
      </SettingsCard>
    </div>
  );
}
