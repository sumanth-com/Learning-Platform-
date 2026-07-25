type Bucket = {
  count: number;
  resetAt: number;
  lastAt: number;
};

const buckets = new Map<string, Bucket>();

function getBucket(key: string, windowMs: number): Bucket {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || now > existing.resetAt) {
    const next = { count: 0, resetAt: now + windowMs, lastAt: 0 };
    buckets.set(key, next);
    return next;
  }
  return existing;
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSec: number;
  remaining: number;
};

/** Fixed-window rate limit (in-memory; fine for single-instance / edge MVP). */
export function checkRateLimit(
  key: string,
  opts: { limit: number; windowMs: number; minIntervalMs?: number }
): RateLimitResult {
  const bucket = getBucket(key, opts.windowMs);
  const now = Date.now();

  if (opts.minIntervalMs && bucket.lastAt && now - bucket.lastAt < opts.minIntervalMs) {
    const retryAfterSec = Math.ceil(
      (opts.minIntervalMs - (now - bucket.lastAt)) / 1000
    );
    return { allowed: false, retryAfterSec, remaining: 0 };
  }

  if (bucket.count >= opts.limit) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { allowed: false, retryAfterSec, remaining: 0 };
  }

  bucket.count += 1;
  bucket.lastAt = now;
  return {
    allowed: true,
    retryAfterSec: 0,
    remaining: Math.max(0, opts.limit - bucket.count),
  };
}

export const AUTH_RATE_LIMITS = {
  forgotPassword: { limit: 5, windowMs: 15 * 60_000, minIntervalMs: 30_000 },
  resendVerification: { limit: 5, windowMs: 15 * 60_000, minIntervalMs: 60_000 },
  login: { limit: 20, windowMs: 15 * 60_000 },
} as const;
