"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  Library,
  Search,
  Sparkles,
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<HubCategoryId | "all">("all");
  const [difficulty, setDifficulty] = useState<HubDifficulty | "all">("all");
  const [sort, setSort] = useState<"popular" | "updated" | "rating" | "reading">(
    "popular"
  );
  const deferredQuery = useDeferredValue(query);
  const library = useHubLibrary();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
  }, []);

  const results = useMemo(
    () =>
      searchHubResources({
        query: deferredQuery,
        category,
        difficulty,
        sort,
      }),
    [deferredQuery, category, difficulty, sort]
  );

  const featured = getFeaturedResources();
  const trending = getTrendingResources();

  const filtering =
    Boolean(deferredQuery) || category !== "all" || difficulty !== "all";

  return (
    <>
      <PortalChrome title="Developer Hub" fillViewport />
      <div className="relative flex h-full min-h-0 flex-col">
        <HubAuroraBackground />
        <div
          ref={scrollerRef}
          data-developer-hub-scroll
          className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
        >
          <div className="w-full pb-16 sm:pb-20">
            <div className="sticky top-0 z-20 border-b border-border/60 bg-background/95 px-4 py-3 sm:px-6 lg:px-8">
              <div className="relative mb-2.5">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search guides…"
                  aria-label="Search Developer Hub"
                  className={cn(
                    "h-11 w-full rounded-2xl border border-border/70 bg-card pl-10 pr-4 text-[14px]",
                    "outline-none transition focus:border-foreground/20 focus:ring-2 focus:ring-[#5B6CFF]/15"
                  )}
                />
              </div>

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
                    {HUB_QUICK_FILTERS.filter((f) => f.id !== "all").map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
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
                    No guides match that search. Try a broader term.
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
                        onToggleBookmark={() => library.toggleBookmark(r.slug)}
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
                        onToggleBookmark={() => library.toggleBookmark(r.slug)}
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
                        onToggleBookmark={() => library.toggleBookmark(r.slug)}
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
                            {items.length} guide{items.length === 1 ? "" : "s"}
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
