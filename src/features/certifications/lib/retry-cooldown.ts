/** Hours before a failed attempt can be retried. */
export const CERT_RETRY_COOLDOWN_HOURS = 6;

export const CERT_RETRY_COOLDOWN_MS =
  CERT_RETRY_COOLDOWN_HOURS * 60 * 60 * 1000;

export function retryAvailableAt(finishedAt?: string | null): number | null {
  if (!finishedAt) return null;
  const end = Date.parse(finishedAt);
  if (Number.isNaN(end)) return null;
  return end + CERT_RETRY_COOLDOWN_MS;
}

export function msUntilRetry(finishedAt?: string | null, now = Date.now()) {
  const at = retryAvailableAt(finishedAt);
  if (at == null) return 0;
  return Math.max(0, at - now);
}

export function canRetryFailedAttempt(
  status: string | undefined,
  finishedAt?: string | null,
  now = Date.now()
) {
  if (status !== "failed") return false;
  return msUntilRetry(finishedAt, now) <= 0;
}

export function formatCooldown(ms: number) {
  if (ms <= 0) return "now";
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh > 0 ? `${d}d ${rh}h` : `${d}d`;
  }
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/** Parts for a digital HH:MM:SS clock display. */
export function splitCooldown(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    hours: pad(Math.min(hours, 99)),
    minutes: pad(minutes),
    seconds: pad(seconds),
    totalSec,
  };
}
