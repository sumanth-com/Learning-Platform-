import type { NotificationChannel } from "@/lib/user-settings";
import {
  isNotificationChannelEnabled,
  readUserSettings,
} from "@/lib/user-settings";
import { playSelectedNotificationSound } from "@/lib/game-sounds";
import { CERT_FLOW } from "@/features/certifications/lib/paths";

export type AppNotification = {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  read: boolean;
};

const STORAGE_KEY = "SupraBase.notifications.v2";
const LEGACY_KEYS = ["SupraBase.notifications.v1"];

type PushInput = {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  href?: string;
  /** If true, refresh createdAt and mark unread when id already exists */
  bump?: boolean;
  playSound?: boolean;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readAll(): AppNotification[] {
  if (!canUseStorage()) return [];
  try {
    const fromV2 = window.localStorage.getItem(STORAGE_KEY);
    const raw =
      fromV2 ??
      LEGACY_KEYS.map((k) => window.localStorage.getItem(k)).find(Boolean) ??
      null;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppNotification[];
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed.filter(
      (n) =>
        n &&
        typeof n.id === "string" &&
        !n.id.startsWith("n-learn-") &&
        !n.id.startsWith("n-mentor-") &&
        !n.id.startsWith("n-achieve-")
    );
    if (!fromV2) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

function writeAll(items: AppNotification[]) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("suprabase:notifications-changed"));
  } catch {
    /* ignore */
  }
}

export function pushNotification(input: PushInput): AppNotification | null {
  if (!canUseStorage()) return null;
  const now = new Date().toISOString();
  const items = readAll();
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
            createdAt: now,
            read: false,
          }
        : n
    );
    writeAll(next);
    if (input.playSound !== false) playSelectedNotificationSound();
    return next.find((n) => n.id === input.id) ?? null;
  }

  const created: AppNotification = {
    id: input.id,
    channel: input.channel,
    title: input.title,
    body: input.body,
    href: input.href,
    createdAt: now,
    read: false,
  };
  writeAll([created, ...items].slice(0, 80));
  if (input.playSound !== false) playSelectedNotificationSound();
  return created;
}

/** Fired when the learner passes a certification assessment. */
export function notifyCertificationPassed(input: {
  certificationId: string;
  title: string;
  score: number;
}) {
  return pushNotification({
    id: `cert-passed-${input.certificationId}`,
    channel: "achievements",
    title: "Congratulations!",
    body: `You successfully cleared the ${input.title} certification test with a score of ${input.score}%. Generate your certificate and download the PDF anytime.`,
    href: CERT_FLOW.results(input.certificationId),
    bump: true,
  });
}

/** Fired when a certificate document is issued. */
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
    title: "Your certificate is ready",
    body: `${input.recipientName}, your ${input.title} certificate${
      input.score != null ? ` (${input.score}%)` : ""
    } is ready. Open it to download the PDF or share your verified credential.`,
    href: CERT_FLOW.certificate(input.certificationId),
    bump: true,
  });
}

/**
 * Sync inbox with certificates already saved on this device
 * (so earned certs always show — and only when they exist).
 */
export function syncCertificateNotifications() {
  if (!canUseStorage()) return;
  try {
    const raw =
      window.localStorage.getItem("SupraBase.certifications.v1") ??
      window.localStorage.getItem("supralearn.certifications.v1");
    if (!raw) return;
    const parsed = JSON.parse(raw) as {
      certificates?: Array<{
        id: string;
        certificationId: string;
        title: string;
        recipientName: string;
        issuedAt: string;
      }>;
    };
    const certs = parsed.certificates ?? [];
    if (certs.length === 0) return;

    let items = readAll();
    let changed = false;

    for (const cert of certs) {
      const id = `cert-earned-${cert.id}`;
      if (items.some((n) => n.id === id)) continue;
      items = [
        {
          id,
          channel: "achievements",
          title: "Your certificate is ready",
          body: `${cert.recipientName}, your ${cert.title} certificate is ready. Open it to download the PDF or share your verified credential.`,
          href: CERT_FLOW.certificate(cert.certificationId),
          createdAt: cert.issuedAt || new Date().toISOString(),
          read: false,
        },
        ...items,
      ];
      changed = true;
    }

    if (changed) writeAll(items.slice(0, 80));
  } catch {
    /* ignore */
  }
}

export function listNotifications(): AppNotification[] {
  syncCertificateNotifications();
  const prefs = readUserSettings();
  if (prefs.notificationsMuted) return [];
  return readAll()
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
  const next = readAll().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  writeAll(next);
}

export function markAllNotificationsRead() {
  writeAll(readAll().map((n) => ({ ...n, read: true })));
}

export function clearReadNotifications() {
  writeAll(readAll().filter((n) => !n.read));
}

export function deleteNotification(id: string) {
  writeAll(readAll().filter((n) => n.id !== id));
}

export function clearAllNotifications() {
  writeAll([]);
}

export function notificationChannelLabel(channel: NotificationChannel) {
  if (channel === "learning") return "Learning";
  if (channel === "mentor") return "Mentor";
  return "Certifications";
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
