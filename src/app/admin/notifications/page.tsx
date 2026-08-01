import { Bell, Mail, Megaphone, Wrench } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminContext } from "@/features/admin/lib/require-admin";

export const metadata = {
  title: "Notifications",
};

const CHANNELS = [
  {
    title: "Announcements",
    description: "Platform-wide updates for all students.",
    icon: Megaphone,
    status: "Coming soon",
  },
  {
    title: "Course releases",
    description: "Notify learners when new weeks or modules go live.",
    icon: Bell,
    status: "Coming soon",
  },
  {
    title: "Email campaigns",
    description: "Branded emails via Resend for invites and updates.",
    icon: Mail,
    status: "Invite emails live",
  },
  {
    title: "Maintenance alerts",
    description: "Scheduled downtime and system notices.",
    icon: Wrench,
    status: "Coming soon",
  },
] as const;

export default async function AdminNotificationsPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  return (
    <div>
      <AdminPageHeader
        title="Notifications"
        description="Send announcements, platform updates, maintenance notices, and course release emails."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <div
              key={channel.title}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.1em] text-zinc-500">
                  {channel.status}
                </span>
              </div>
              <h2 className="font-medium text-zinc-100">{channel.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">{channel.description}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        Push notifications and broadcast composer will plug into this surface
        without changing the Super Admin layout.
      </p>
    </div>
  );
}
