/**
 * Lightweight client preferences — localStorage `SupraBase-settings`.
 */

import { SETTINGS_STORAGE_KEY } from "@/lib/client-persistence";

export type NotificationChannel = "learning" | "mentor" | "achievements";
export type NotificationSoundId = "chime" | "ping" | "bell" | "off";

export type UserSettings = {
  /** Mute all notifications (inbox) */
  notificationsMuted: boolean;
  /** Tone for in-app notification alerts */
  notificationSound: NotificationSoundId;
  /** Roadmap, assignments, projects, study updates */
  notifyLearning: boolean;
  /** AI Mentor tips and replies */
  notifyMentor: boolean;
  /** Certifications, unlocks, streaks */
  notifyAchievements: boolean;
  /** Confetti overlays */
  celebrationsEnabled: boolean;
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  notificationsMuted: false,
  notificationSound: "chime",
  notifyLearning: true,
  notifyMentor: true,
  notifyAchievements: true,
  celebrationsEnabled: true,
};

export const NOTIFICATION_SOUNDS: {
  id: Exclude<NotificationSoundId, "off">;
  label: string;
  description: string;
}[] = [
  {
    id: "chime",
    label: "Soft Chime",
    description: "Gentle two-note tone for everyday alerts.",
  },
  {
    id: "ping",
    label: "Soft Ping",
    description: "Gentle sound for low-distraction environments.",
  },
  {
    id: "bell",
    label: "Alert Bell",
    description: "Louder tone for urgent notifications.",
  },
];

function canUseStorage() {
  return typeof window !== "undefined";
}

function migrateLegacy(parsed: Record<string, unknown>): Partial<UserSettings> {
  const next: Partial<UserSettings> = {};
  if (typeof parsed.notificationsMuted === "boolean") {
    next.notificationsMuted = parsed.notificationsMuted;
  } else if (typeof parsed.soundsMuted === "boolean") {
    next.notificationsMuted = parsed.soundsMuted;
  }
  if (
    parsed.notificationSound === "chime" ||
    parsed.notificationSound === "ping" ||
    parsed.notificationSound === "bell" ||
    parsed.notificationSound === "off"
  ) {
    next.notificationSound = parsed.notificationSound;
  } else if (parsed.soundsMuted === true) {
    next.notificationSound = "off";
  }
  if (typeof parsed.notifyLearning === "boolean") {
    next.notifyLearning = parsed.notifyLearning;
  } else if (typeof parsed.studyReminders === "boolean") {
    next.notifyLearning = parsed.studyReminders;
  }
  if (typeof parsed.notifyMentor === "boolean") {
    next.notifyMentor = parsed.notifyMentor;
  }
  if (typeof parsed.notifyAchievements === "boolean") {
    next.notifyAchievements = parsed.notifyAchievements;
  } else if (typeof parsed.achievementSounds === "boolean") {
    next.notifyAchievements = parsed.achievementSounds;
  }
  if (typeof parsed.celebrationsEnabled === "boolean") {
    next.celebrationsEnabled = parsed.celebrationsEnabled;
  }
  return next;
}

export function readUserSettings(): UserSettings {
  if (!canUseStorage()) return { ...DEFAULT_USER_SETTINGS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_USER_SETTINGS };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return { ...DEFAULT_USER_SETTINGS, ...migrateLegacy(parsed) };
  } catch {
    return { ...DEFAULT_USER_SETTINGS };
  }
}

export function writeUserSettings(next: UserSettings) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent("suprabase:settings-changed", { detail: next })
    );
  } catch {
    /* ignore quota */
  }
}

export function updateUserSettings(
  patch: Partial<UserSettings>
): UserSettings {
  const next = { ...readUserSettings(), ...patch };
  writeUserSettings(next);
  return next;
}

export function isNotificationChannelEnabled(channel: NotificationChannel) {
  const s = readUserSettings();
  if (s.notificationsMuted) return false;
  if (channel === "learning") return s.notifyLearning;
  if (channel === "mentor") return s.notifyMentor;
  return s.notifyAchievements;
}

export function areNotificationSoundsEnabled() {
  const s = readUserSettings();
  return s.notificationSound !== "off";
}

export function areAchievementSoundsEnabled() {
  return (
    areNotificationSoundsEnabled() &&
    isNotificationChannelEnabled("achievements")
  );
}

export function areCelebrationSoundsEnabled() {
  return areAchievementSoundsEnabled();
}

export function areCelebrationsEnabled() {
  return readUserSettings().celebrationsEnabled;
}
