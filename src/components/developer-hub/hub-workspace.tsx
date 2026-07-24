"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Briefcase,
  Compass,
  Library,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { HubAuroraBackground } from "@/components/developer-hub/hub-aurora-background";
import { HubResourceCard } from "@/components/developer-hub/hub-resource-card";
import {
  HUB_CATEGORIES,
  HUB_QUICK_FILTERS,
} from "@/features/developer-hub/data/categories";
import {
  getFeaturedResources,
  getResourcesByCategory,
  getTrendingResources,
  HUB_CATALOG,
} from "@/features/developer-hub/data/catalog";
import { searchHubResources } from "@/features/developer-hub/lib/search";
import { useHubLibrary } from "@/features/developer-hub/hooks/use-hub-library";
import type { HubCategoryId, HubDifficulty } from "@/features/developer-hub/types";
import { cn } from "@/lib/utils";

export function DeveloperHubWorkspace() {
  const [category, setCategory] = useState<HubCategoryId | "all">("all");
  const [difficulty, setDifficulty] = useState<HubDifficulty | "all">("all");
  const [sort, setSort] = useState<"popular" | "updated" | "rating" | "reading">(
    "popular"
  );
  const library = useHubLibrary();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
  }, []);

  const filtering = category !== "all" || difficulty !== "all";

  const results = useMemo(
    () =>
      searchHubResources({
        category,
        difficulty,
        sort,
      }),
    [category, difficulty, sort]
  );

  const featured = getFeaturedResources();
  const trending = getTrendingResources();

  return (
    <>
      <PortalChrome title="Dev Forge" fillViewport />
      <div className="relative flex h-full min-h-0 flex-col">
        <HubAuroraBackground />
        <div
          ref={scrollerRef}
          data-developer-hub-scroll
          className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
        >
          <div className="w-full pb-16 sm:pb-20">
            <div className="px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
              <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(91,108,255,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.08),transparent_50%)]"
                />
                <div className="relative px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <Compass className="h-3.5 w-3.5" />
                    Learning paths
                  </p>
                  <h2 className="mt-2 max-w-2xl text-[24px] font-semibold tracking-[-0.035em] text-foreground sm:text-[30px]">
                    Build production skills, not just notes
                  </h2>
                  <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                    Dev Forge is your guided library of system design, backend,
                    devops, and interview paths — written the way real teams
                    ship: requirements, trade-offs, diagrams, and hands-on
                    practice.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3.5">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Clear journeys
                      </div>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                        Follow structured paths from overview to architecture,
                        code, and projects — not scattered articles.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3.5">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        Real-company context
                      </div>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                        Learn how APIs, storage, caching, and queues show up in
                        production decisions interviewers and teams care about.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3.5">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        Useful at every level
                      </div>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                        Freshers get a confident start; experienced developers
                        sharpen trade-offs and interview depth.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="sticky top-0 z-20 mt-5 border-y border-border/60 bg-background/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      "all",
                      "beginner",
                      "intermediate",
                      "advanced",
                      "expert",
                    ] as const
                  ).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-[12px] capitalize transition",
                        difficulty === d
                          ? "border-foreground bg-foreground font-medium text-background"
                          : "border-border/70 bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      )}
                    >
                      {d}
                    </button>
                  ))}

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as HubCategoryId | "all")
                    }
                    className="h-8 rounded-full border border-border/70 bg-card px-3 text-[12px] text-foreground outline-none"
                    aria-label="Filter by category"
                  >
                    <option value="all">All categories</option>
                    {HUB_QUICK_FILTERS.filter((f) => f.id !== "all").map(
                      (f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="h-8 rounded-full border border-border/70 bg-card px-3 text-[12px] text-foreground outline-none"
                  aria-label="Sort resources"
                >
                  <option value="popular">Popularity</option>
                  <option value="updated">Recently updated</option>
                  <option value="rating">Rating</option>
                  <option value="reading">Reading time</option>
                </select>
              </div>
            </div>

            <div className="px-4 pt-5 sm:px-6 lg:px-8">
              {filtering ? (
                <section>
                  <h2 className="text-[15px] font-semibold tracking-tight">
                    {results.length} result{results.length === 1 ? "" : "s"}
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {results.map((r) => (
                      <HubResourceCard
                        key={r.id}
                        resource={r}
                        bookmarked={library.isBookmarked(r.slug)}
                        onToggleBookmark={() => library.toggleBookmark(r.slug)}
                      />
                    ))}
                  </div>
                  {results.length === 0 ? (
                    <p className="mt-10 text-center text-sm text-muted-foreground">
                      No guides match those filters. Try a broader selection.
                    </p>
                  ) : null}
                </section>
              ) : (
                <div>
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-[15px] font-semibold tracking-tight">
                        Featured resources
                      </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {featured.map((r) => (
                        <HubResourceCard
                          key={r.id}
                          resource={r}
                          featured
                          bookmarked={library.isBookmarked(r.slug)}
                          onToggleBookmark={() =>
                            library.toggleBookmark(r.slug)
                          }
                        />
                      ))}
                    </div>
                  </section>

                  <section className="mt-12">
                    <div className="mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-[17px] font-semibold tracking-tight">
                        Trending
                      </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {trending.map((r) => (
                        <HubResourceCard
                          key={r.id}
                          resource={r}
                          bookmarked={library.isBookmarked(r.slug)}
                          onToggleBookmark={() =>
                            library.toggleBookmark(r.slug)
                          }
                        />
                      ))}
                    </div>
                  </section>

                  <section className="mt-12">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Library className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-[17px] font-semibold tracking-tight">
                          All guides
                        </h2>
                      </div>
                      <p className="text-[12px] text-muted-foreground">
                        {HUB_CATALOG.length} available
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {HUB_CATALOG.map((r) => (
                        <HubResourceCard
                          key={`all-${r.id}`}
                          resource={r}
                          bookmarked={library.isBookmarked(r.slug)}
                          onToggleBookmark={() =>
                            library.toggleBookmark(r.slug)
                          }
                        />
                      ))}
                    </div>
                  </section>

                  <section className="mt-14 space-y-10">
                    <div className="flex items-center gap-2">
                      <Library className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-[17px] font-semibold tracking-tight">
                        Browse by category
                      </h2>
                    </div>
                    {HUB_CATEGORIES.map((cat) => {
                      const items = getResourcesByCategory(cat.id);
                      if (items.length === 0) return null;
                      return (
                        <div key={cat.id} id={`category-${cat.id}`}>
                          <div className="mb-3 flex items-end justify-between gap-3">
                            <div>
                              <h3 className="text-[15px] font-semibold">
                                {cat.label}
                              </h3>
                              <p className="text-[12px] text-muted-foreground">
                                {cat.description}
                              </p>
                            </div>
                            <span className="text-[12px] text-muted-foreground">
                              {items.length} guide
                              {items.length === 1 ? "" : "s"}
                            </span>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((r) => (
                              <HubResourceCard
                                key={r.id}
                                resource={r}
                                bookmarked={library.isBookmarked(r.slug)}
                                onToggleBookmark={() =>
                                  library.toggleBookmark(r.slug)
                                }
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
