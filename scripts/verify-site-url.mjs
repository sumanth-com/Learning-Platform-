/**
 * Quick check that production URL resolution ignores Vercel hosts.
 * Run: node scripts/verify-site-url.mjs
 */

function readConfiguredSiteUrl(env) {
  const candidates = [env.NEXT_PUBLIC_SITE_URL, env.NEXT_PUBLIC_APP_URL];
  for (const candidate of candidates) {
    const raw = (candidate ?? "").trim().replace(/\/+$/, "");
    if (!raw) continue;
    const host = raw.replace(/^https?:\/\//i, "").split("/")[0] ?? "";
    if (/\.vercel\.app$/i.test(host)) continue;
    return raw;
  }
  return "";
}

function resolveSiteUrl(env) {
  const raw = readConfiguredSiteUrl(env);
  const fallback =
    env.NODE_ENV === "production"
      ? "https://suprabase.in"
      : "http://localhost:3000";
  if (!raw) return fallback;
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProtocol).origin;
  } catch {
    return fallback;
  }
}

const cases = [
  {
    name: "production ignores vercel APP_URL",
    env: {
      NODE_ENV: "production",
      NEXT_PUBLIC_APP_URL: "https://suprabase.vercel.app",
    },
    expect: "https://suprabase.in",
  },
  {
    name: "production uses SITE_URL",
    env: {
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://suprabase.in",
      NEXT_PUBLIC_APP_URL: "https://suprabase.vercel.app",
    },
    expect: "https://suprabase.in",
  },
  {
    name: "local keeps localhost",
    env: {
      NODE_ENV: "development",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    },
    expect: "http://localhost:3000",
  },
];

let failed = 0;
for (const c of cases) {
  const got = resolveSiteUrl(c.env);
  const ok = got === c.expect;
  console.log(`${ok ? "PASS" : "FAIL"} ${c.name}: ${got}`);
  if (!ok) failed += 1;
}
process.exit(failed ? 1 : 0);
