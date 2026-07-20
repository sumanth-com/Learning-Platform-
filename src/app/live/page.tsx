"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, Copy, Check, MapPin, Radio } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { MODULE_LABELS } from "@/lib/module-progress";
import {
  getLiveViewUrl,
  subscribeLiveActivity,
  type LiveActivitySnapshot,
} from "@/lib/live-activity-sync";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day ago`;
}

function isRecentlyActive(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() < 30 * 60 * 1000;
}

export default function LiveLearningPage() {
  const hydrated = useStoreHydrated();
  const storeResume = useProgressStore((s) => s.resumePosition);
  const profileName = useProgressStore((s) => s.profile.name);
  const getModuleWeekProgress = useProgressStore((s) => s.getModuleWeekProgress);
  const [snapshot, setSnapshot] = useState<LiveActivitySnapshot | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return subscribeLiveActivity(setSnapshot);
  }, []);

  useEffect(() => {
    if (!hydrated || !storeResume) return;
    setSnapshot((prev) => {
      const next: LiveActivitySnapshot = {
        ...storeResume,
        learnerName: profileName,
      };
      if (
        prev &&
        prev.updatedAt === next.updatedAt &&
        prev.href === next.href &&
        prev.learnerName === next.learnerName
      ) {
        return prev;
      }
      return next;
    });
  }, [hydrated, storeResume, profileName]);

  const live: LiveActivitySnapshot | null = useMemo(() => {
    if (storeResume && hydrated) {
      return { ...storeResume, learnerName: profileName };
    }
    return snapshot;
  }, [storeResume, hydrated, profileName, snapshot]);
  const moduleKey = live?.module === "roadmap" ? "practice" : live?.module ?? "practice";
  const weekId = live?.weekId ?? 1;

  const weekPct = useMemo(() => {
    if (!hydrated || !live) return 0;
    return getModuleWeekProgress(moduleKey, weekId).percentage;
  }, [hydrated, live, getModuleWeekProgress, moduleKey, weekId]);

  const isLive = live ? isRecentlyActive(live.updatedAt) : false;
  const liveUrl = typeof window !== "undefined" ? getLiveViewUrl() : "/live";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-emerald-400" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Live Learning</h1>
        </div>
        <p className="text-sm text-zinc-500">
          Open this page anytime to see where {live?.learnerName ?? profileName} is practicing right now.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Share this link</p>
        <div className="mt-2 flex gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-indigo-300">
            {liveUrl}
          </code>
          <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={copyLink}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <article
        className={cn(
          "relative overflow-hidden rounded-2xl border p-6 shadow-xl",
          isLive
            ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-zinc-900 to-zinc-950"
            : "border-zinc-800 bg-zinc-900/60"
        )}
      >
        {isLive && (
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        )}

        <div className="relative flex items-start gap-4">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
            {isLive && (
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/25" />
            )}
            <span
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-full border-2",
                isLive ? "border-emerald-400/50 bg-emerald-500/10" : "border-zinc-700 bg-zinc-800"
              )}
            >
              <Activity className={cn("h-5 w-5", isLive ? "text-emerald-400" : "text-zinc-500")} />
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-zinc-100">{live?.learnerName ?? profileName}</span>
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  Live now
                </span>
              ) : (
                <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Last seen
                </span>
              )}
            </div>

            {live ? (
              <>
                <div className="mt-4 flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Learning right now
                    </p>
                    <p className="mt-1 text-base font-semibold text-zinc-100">
                      {live.topicTitle ?? live.title}
                    </p>
                    {(live.lessonTitle || live.subtitle) && (
                      <p className="mt-1 text-sm text-indigo-200">
                        {live.lessonTitle ?? live.subtitle}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-zinc-500">
                      {MODULE_LABELS[moduleKey]} · Week {live.weekId} · Updated{" "}
                      {formatRelativeTime(live.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-[11px] text-zinc-500">
                    <span>Week {weekId} progress</span>
                    <span className="font-semibold tabular-nums text-indigo-300">{weekPct}%</span>
                  </div>
                  <Progress value={weekPct} className="h-2 bg-zinc-800" />
                </div>

                <Link href={live.href} className="mt-5 inline-block">
                  <Button variant="gradient" size="sm" className="h-9 gap-2">
                    Go to this lesson
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                No activity yet. When {profileName} opens a challenge or topic, it will show here automatically.
              </p>
            )}
          </div>
        </div>
      </article>

      <p className="text-center text-xs text-zinc-600">
        Updates every few seconds while she practices on this device or browser.
      </p>
    </div>
  );
}
