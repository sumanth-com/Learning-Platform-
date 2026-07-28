import {
  areAchievementSoundsEnabled,
  areCelebrationSoundsEnabled,
  areNotificationSoundsEnabled,
  readUserSettings,
  type NotificationSoundId,
} from "@/lib/user-settings";

function getAudioContext() {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  return new AudioCtx();
}

function playToneSequence(
  notes: Array<{
    freq: number;
    start: number;
    duration: number;
    volume: number;
    type?: OscillatorType;
  }>
) {
  try {
    const ctx = getAudioContext();
    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = note.type ?? "triangle";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start);
      const t0 = ctx.currentTime + note.start;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(note.volume, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        t0 + note.duration
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + note.duration + 0.05);
    }
    const end =
      Math.max(...notes.map((n) => n.start + n.duration)) * 1000 + 400;
    window.setTimeout(() => void ctx.close(), end);
  } catch {
    /* Autoplay policy or unsupported — silent fail */
  }
}

/** Preview or play a selected notification tone. */
export function playNotificationTone(
  sound: Exclude<NotificationSoundId, "off">,
  opts?: { force?: boolean }
) {
  if (typeof window === "undefined") return;
  if (!opts?.force && !areNotificationSoundsEnabled()) return;

  if (sound === "chime") {
    playToneSequence([
      { freq: 523.25, start: 0, duration: 0.16, volume: 0.1 },
      { freq: 659.25, start: 0.12, duration: 0.22, volume: 0.09 },
    ]);
    return;
  }
  if (sound === "ping") {
    playToneSequence([
      {
        freq: 880,
        start: 0,
        duration: 0.12,
        volume: 0.07,
        type: "sine",
      },
    ]);
    return;
  }
  playToneSequence([
    { freq: 784, start: 0, duration: 0.12, volume: 0.11, type: "square" },
    { freq: 523.25, start: 0.14, duration: 0.18, volume: 0.1, type: "square" },
    { freq: 659.25, start: 0.3, duration: 0.28, volume: 0.09, type: "triangle" },
  ]);
}

export function playSelectedNotificationSound(opts?: { force?: boolean }) {
  const sound = readUserSettings().notificationSound;
  if (sound === "off") return;
  playNotificationTone(sound, opts);
}

/** Short achievement chime via Web Audio — no external files. */
export function playUnlockSound() {
  if (typeof window === "undefined") return;
  if (!areAchievementSoundsEnabled()) return;
  const sound = readUserSettings().notificationSound;
  if (sound === "off") return;
  playNotificationTone(sound);
}

export function playLevelCompleteSound() {
  if (typeof window === "undefined") return;
  if (!areCelebrationSoundsEnabled()) return;
  playToneSequence([
    { freq: 392, start: 0, duration: 0.4, volume: 0.08, type: "sine" },
    { freq: 523.25, start: 0.12, duration: 0.4, volume: 0.08, type: "sine" },
    { freq: 659.25, start: 0.24, duration: 0.4, volume: 0.08, type: "sine" },
  ]);
}
