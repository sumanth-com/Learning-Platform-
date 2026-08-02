/**
 * Notifications — server (learner_notifications) is source of truth.
 * LocalStorage is a short-lived cache for snappy UI.
 */

import type { NotificationChannel } from "@/lib/user-settings";
import {
  isNotificationChannelEnabled,
  readUserSettings,
} from "@/lib/user-settings";
import { playSelectedNotificationSound } from "@/lib/game-sounds";
import { CERT_FLOW } from "@/features/certifications/lib/paths";
import {
  getActiveWorkspaceUserId,
  scopedWorkspaceKey,
  WORKSPACE_STORAGE_BASES,
} from "@/lib/client-workspace";
import {
  clearNotificationsAction,
  listLearnerNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/features/progress/actions/progress-actions";
import { createClient } from "@/lib/supabase/client";

export type NotificationKind = "cert-passed" | "cert-earned" | "generic";

export type NotificationMeta = {
  certificationId?: string;
  certificateId?: string;
  certTitle?: string;
  recipientName?: string;
  score?: number;
  passingScore?: number;
};

export type AppNotification = {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  read: boolean;
  kind?: NotificationKind;
  meta?: NotificationMeta;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function notificationsKey(): string | null {
  return scopedWorkspaceKey(
    WORKSPACE_STORAGE_BASES.notifications,
    getActiveWorkspaceUserId()
  );
}

function kindFromId(id: string): NotificationKind {
  if (id.startsWith("cert-passed-")) return "cert-passed";
  if (id.startsWith("cert-earned-")) return "cert-earned";
  return "generic";
}

function readCache(): AppNotification[] {
  if (!canUseStorage()) return [];
  try {
    const key = notificationsKey();
    if (!key) return [];
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppNotification[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((n) => (n.kind ? n : { ...n, kind: kindFromId(n.id) }));
  } catch {
    return [];
  }
}

function writeCache(items: AppNotification[]) {
  if (!canUseStorage()) return;
  const key = notificationsKey();
  if (!key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("suprabase:notifications-changed"));
  } catch {
    /* ignore */
  }
}

async function pushToServer(input: {
  id?: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  href?: string;
  kind?: NotificationKind;
  meta?: NotificationMeta;
}) {
  const userId = getActiveWorkspaceUserId();
  if (!userId) return;
  try {
    const supabase = createClient();
    await supabase.from("learner_notifications").insert({
      profile_id: userId,
      channel: input.channel,
      title: input.title,
      body: input.body,
      href: input.href ?? null,
      kind: input.kind ?? "generic",
      meta: input.meta ?? {},
    } as never);
  } catch {
    /* ignore — UI still has cache */
  }
}

export function pushNotification(input: {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  href?: string;
  kind?: NotificationKind;
  meta?: NotificationMeta;
  bump?: boolean;
  playSound?: boolean;
}): AppNotification | null {
  if (!canUseStorage()) return null;
  const now = new Date().toISOString();
  const items = readCache();
  const existing = items.find((n) => n.id === input.id);

  if (existing) {
    if (!input.bump) return existing;
    const next = items.map((n) =>
      n.id === input.id
        ? {
            ...n,
            title: input.title,
            body: input.body,
            href: input.href ?? n.href,
            kind: input.kind ?? n.kind,
            meta: { ...n.meta, ...input.meta },
            createdAt: now,
            read: false,
          }
        : n
    );
    writeCache(next);
    if (input.playSound !== false) playSelectedNotificationSound();
    return next.find((n) => n.id === input.id) ?? null;
  }

  const created: AppNotification = {
    id: input.id,
    channel: input.channel,
    title: input.title,
    body: input.body,
    href: input.href,
    kind: input.kind ?? kindFromId(input.id),
    meta: input.meta,
    createdAt: now,
    read: false,
  };
  writeCache([created, ...items].slice(0, 80));
  void pushToServer(created);
  if (input.playSound !== false) playSelectedNotificationSound();
  return created;
}

export function notifyCertificationPassed(input: {
  certificationId: string;
  title: string;
  score: number;
  passingScore?: number;
  recipientName?: string;
}) {
  return pushNotification({
    id: `cert-passed-${input.certificationId}`,
    channel: "achievements",
    kind: "cert-passed",
    title: `You passed the ${input.title} certification test`,
    body: `Congratulations! You cleared the ${input.title} Skills Certification Test with a score of ${input.score}%. Generate your certificate to download it as a PDF.`,
    href: CERT_FLOW.results(input.certificationId),
    meta: {
      certificationId: input.certificationId,
      certTitle: input.title,
      score: input.score,
      passingScore: input.passingScore,
      recipientName: input.recipientName,
    },
    bump: true,
  });
}

export function notifyCertificateEarned(input: {
  certificateId: string;
  certificationId: string;
  title: string;
  recipientName: string;
  score?: number;
}) {
  return pushNotification({
    id: `cert-earned-${input.certificateId}`,
    channel: "achievements",
    kind: "cert-earned",
    title: `Your ${input.title} certificate is ready`,
    body: `${input.recipientName}, your verified ${input.title} certificate has been issued. Download the PDF or share your credential link anytime.`,
    href: CERT_FLOW.certificate(input.certificationId),
    meta: {
      certificationId: input.certificationId,
      certificateId: input.certificateId,
      certTitle: input.title,
      recipientName: input.recipientName,
      score: input.score,
    },
    bump: true,
  });
}

export function syncCertificateNotifications() {
  /* Server workspace hydrate is the authority; no local cert fan-out. */
}

export async function refreshNotificationsFromServer() {
  const result = await listLearnerNotificationsAction();
  if (!result.success || !result.data) return readCache();
  const mapped: AppNotification[] = result.data.notifications.map((n) => ({
    id: n.id,
    channel: n.channel,
    title: n.title,
    body: n.body,
    href: n.href ?? undefined,
    createdAt: n.created_at,
    read: n.read,
    kind: (n.kind as NotificationKind) || "generic",
    meta: (n.meta as NotificationMeta) || undefined,
  }));
  writeCache(mapped);
  return mapped;
}

export function listNotifications(): AppNotification[] {
  const prefs = readUserSettings();
  if (prefs.notificationsMuted) return [];
  return readCache()
    .filter((n) => isNotificationChannelEnabled(n.channel))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function unreadNotificationCount() {
  return listNotifications().filter((n) => !n.read).length;
}

export function markNotificationRead(id: string) {
  const next = readCache().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  writeCache(next);
  void markNotificationReadAction(id);
}

export function markAllNotificationsRead() {
  writeCache(readCache().map((n) => ({ ...n, read: true })));
  void markAllNotificationsReadAction();
}

export function clearReadNotifications() {
  writeCache(readCache().filter((n) => !n.read));
  void clearNotificationsAction(true);
}

export function deleteNotification(id: string) {
  writeCache(readCache().filter((n) => n.id !== id));
  void clearNotificationsAction(false).then(() => {
    /* full clear then re-push remaining would be heavy; delete via cache-only ok for soft delete */
  });
}

export function clearAllNotifications() {
  writeCache([]);
  void clearNotificationsAction(false);
}

export function notificationChannelLabel(channel: NotificationChannel) {
  if (channel === "learning") return "Learning";
  if (channel === "mentor") return "Mentor";
  return "Certifications";
}

export function notificationSender(channel: NotificationChannel) {
  if (channel === "learning") {
    return {
      name: "SupraBase Learning",
      email: "learning@suprabase.dev",
    };
  }
  if (channel === "mentor") {
    return {
      name: "SupraBase AI Mentor",
      email: "mentor@suprabase.dev",
    };
  }
  return {
    name: "SupraBase Certifications",
    email: "certifications@suprabase.dev",
  };
}

export function formatNotificationDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatNotificationTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(ms / 60_000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
