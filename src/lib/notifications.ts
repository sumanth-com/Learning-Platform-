import type { NotificationChannel } from "@/lib/user-settings";
import {
  isNotificationChannelEnabled,
  readUserSettings,
} from "@/lib/user-settings";
import { playSelectedNotificationSound } from "@/lib/game-sounds";
import { CERT_FLOW } from "@/features/certifications/lib/paths";

/** Template used to render the full message in the inbox reading pane. */
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

const STORAGE_KEY = "SupraBase.notifications.v2";
const LEGACY_KEYS = ["SupraBase.notifications.v1"];

type PushInput = {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  href?: string;
  kind?: NotificationKind;
  meta?: NotificationMeta;
  /** If true, refresh createdAt and mark unread when id already exists */
  bump?: boolean;
  playSound?: boolean;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

/** Older entries were saved before `kind` existed. */
function kindFromId(id: string): NotificationKind {
  if (id.startsWith("cert-passed-")) return "cert-passed";
  if (id.startsWith("cert-earned-")) return "cert-earned";
  return "generic";
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
    const cleaned = parsed
      .filter(
        (n) =>
          n &&
          typeof n.id === "string" &&
          !n.id.startsWith("n-learn-") &&
          !n.id.startsWith("n-mentor-") &&
          !n.id.startsWith("n-achieve-")
      )
      .map((n) => (n.kind ? n : { ...n, kind: kindFromId(n.id) }));
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
            kind: input.kind ?? n.kind,
            meta: { ...n.meta, ...input.meta },
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
    kind: input.kind ?? kindFromId(input.id),
    meta: input.meta,
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
        score?: number;
      }>;
    };
    const certs = parsed.certificates ?? [];
    if (certs.length === 0) return;

    let items = readAll();
    let changed = false;

    for (const cert of certs) {
      const id = `cert-earned-${cert.id}`;
      const existing = items.find((n) => n.id === id);
      if (existing) {
        if (!existing.meta?.certTitle) {
          items = items.map((n) =>
            n.id === id
              ? {
                  ...n,
                  kind: "cert-earned" as const,
                  title: `Your ${cert.title} certificate is ready`,
                  body: `${cert.recipientName}, your verified ${cert.title} certificate has been issued. Download the PDF or share your credential link anytime.`,
                  href: n.href ?? CERT_FLOW.certificate(cert.certificationId),
                  meta: {
                    certificationId: cert.certificationId,
                    certificateId: cert.id,
                    certTitle: cert.title,
                    recipientName: cert.recipientName,
                    score: cert.score,
                  },
                }
              : n
          );
          changed = true;
        }
        continue;
      }
      items = [
        {
          id,
          channel: "achievements",
          kind: "cert-earned",
          title: `Your ${cert.title} certificate is ready`,
          body: `${cert.recipientName}, your verified ${cert.title} certificate has been issued. Download the PDF or share your credential link anytime.`,
          href: CERT_FLOW.certificate(cert.certificationId),
          meta: {
            certificationId: cert.certificationId,
            certificateId: cert.id,
            certTitle: cert.title,
            recipientName: cert.recipientName,
            score: cert.score,
          },
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

/** Sender identity shown in the inbox, mirroring a transactional email. */
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

/** Absolute timestamp for the reading pane header. */
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
