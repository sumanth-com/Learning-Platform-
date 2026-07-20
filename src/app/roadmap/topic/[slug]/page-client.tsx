"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROADMAP_SLUG_REDIRECTS } from "@/curriculum/java-roadmap";

const LEGACY_WEEK_MAP: Record<string, { week: string; topic?: string }> = {
  loops: { week: "2", topic: "for-loop" },
  conditionals: { week: "2", topic: "if-else" },
  arrays: { week: "2", topic: "1d-arrays" },
};

/** Redirect old /roadmap/topic/* URLs to /roadmap/week/* */
export default function LegacyTopicRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  useEffect(() => {
    const weekSlug = ROADMAP_SLUG_REDIRECTS[slug] ?? slug;
    const weekNum = weekSlug.replace("week-", "");
    const legacy = LEGACY_WEEK_MAP[slug];
    const params = new URLSearchParams();
    if (legacy?.topic) params.set("topic", legacy.topic);
    const qs = params.toString();
    router.replace(qs ? `/roadmap/week/${weekNum}?${qs}` : `/roadmap/week/${weekNum}`);
  }, [slug, router]);

  return (
    <div className="py-20 text-center">
      <p className="text-zinc-500">Redirecting to week lesson…</p>
      <Link href="/roadmap">
        <span className="mt-4 inline-block text-sm text-indigo-400 hover:underline">Back to Quest Map</span>
      </Link>
    </div>
  );
}
