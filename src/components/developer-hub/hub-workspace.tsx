"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  Library,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import devForgeArt from "@/assets/Devforge.png";
import devForgeDarkArt from "@/assets/DevforgeDark.png";
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
import type { HubCategoryId } from "@/features/developer-hub/types";
import { cn } from "@/lib/utils";

function HubSelect({
  value,
  onChange,
  ariaLabel,
  children,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={cn(
          "h-9 appearance-none rounded-full border border-border/80 bg-card",
          "pl-3.5 pr-9 text-[13px] font-medium tracking-[-0.01em] text-foreground",
          "outline-none transition-[border-color,box-shadow,background-color] duration-150",
          "hover:border-foreground/20 hover:bg-background",
          "focus-visible:border-foreground/25 focus-visible:ring-2 focus-visible:ring-foreground/10"
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        strokeWidth={2}
      />
    </div>
  );
}

export function DeveloperHubWorkspace() {
  const [category, setCategory] = useState<HubCategoryId | "all">("all");
  const [sort, setSort] = useState<"popular" | "updated" | "rating" | "reading">(
    "popular"
  );
  const library = useHubLibrary();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
  }, []);

  const filtering = category !== "all";

  const results = useMemo(
    () =>
      searchHubResources({
        category,
        difficulty: "all",
        sort,
      }),
    [category, sort]
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
          className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="w-full pb-16 sm:pb-20">
            <div className="px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
              <section className="relative overflow-hidden rounded-[1.75rem] border border-border/50 bg-card/90 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_0%,rgba(120,140,160,0.12),transparent_55%),radial-gradient(50%_60%_at_0%_100%,rgba(90,110,100,0.06),transparent_50%)]"
                />
                <div className="relative px-6 py-8 sm:px-9 sm:py-10 lg:px-11 lg:py-11">
                  <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
                    <div className="min-w-0 text-left">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/90">
                        Dev Forge
                      </p>
                      <h2 className="mt-3 max-w-[20ch] text-[28px] font-semibold leading-[1.12] tracking-[-0.04em] text-foreground sm:text-[34px]">
                        Production skills.
                        <span className="block text-foreground/85">
                          Built with intent.
                        </span>
                      </h2>
                      <p className="mt-4 max-w-[36rem] text-[15px] leading-[1.65] text-muted-foreground sm:text-[16px]">
                        A curated library of system design, backend, DevOps, and
                        interview guides — each one focused on trade-offs,
                        architecture, and how real teams ship.
                      </p>
                    </div>

                    <div
                      aria-hidden
                      className="relative mx-auto w-full max-w-[22rem] lg:mx-0 lg:ml-auto lg:max-w-[25rem]"
                    >
                      <div className="absolute -inset-4 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_45%,rgba(233,150,143,0.2),transparent_72%)] blur-xl dark:bg-[radial-gradient(60%_60%_at_50%_45%,rgba(236,72,153,0.16),transparent_72%)]" />
                      <Image
                        src={devForgeArt}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 25rem, 22rem"
                        className="relative h-[12rem] w-full rounded-[2.25rem] object-cover drop-shadow-[0_26px_45px_rgba(167,66,61,0.2)] dark:hidden lg:h-[14.5rem]"
                      />
                      <Image
                        src={devForgeDarkArt}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 25rem, 22rem"
                        className="relative hidden h-[12rem] w-full rounded-[2.25rem] object-cover drop-shadow-[0_26px_48px_rgba(236,72,153,0.18)] dark:block lg:h-[14.5rem]"
                      />
                    </div>
                  </div>

                  <div className="mt-9 grid gap-3 sm:grid-cols-3 sm:gap-4">
                    <div className="rounded-2xl border border-border/60 bg-background/75 p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:p-5">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/80">
                        <BookOpen className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <p className="mt-3.5 text-[14px] font-semibold tracking-[-0.02em] text-foreground">
                        Structured paths
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                        Overview to implementation — one coherent narrative,
                        not a pile of bookmarks.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/75 p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:p-5">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/80">
                        <Briefcase className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <p className="mt-3.5 text-[14px] font-semibold tracking-[-0.02em] text-foreground">
                        Industry context
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                        The same decisions that show up in design reviews,
                        incidents, and hiring loops.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/75 p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:p-5">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/80">
                        <Target className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <p className="mt-3.5 text-[14px] font-semibold tracking-[-0.02em] text-foreground">
                        Depth that scales
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                        Clear entry points for newcomers. Sharp detail for
                        engineers already shipping.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="sticky top-0 z-20 mt-6 border-y border-border/60 bg-background px-4 py-3.5 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium tracking-[-0.01em] transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15",
                      category === "all"
                        ? "bg-foreground text-background shadow-sm"
                        : "border border-border/80 bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    )}
                  >
                    All
                  </button>

                  <HubSelect
                    value={category === "all" ? "all" : category}
                    onChange={(v) => setCategory(v as HubCategoryId | "all")}
                    ariaLabel="Filter by category"
                  >
                    <option value="all">All categories</option>
                    {HUB_QUICK_FILTERS.filter((f) => f.id !== "all").map(
                      (f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      )
                    )}
                  </HubSelect>
                </div>

                <HubSelect
                  value={sort}
                  onChange={(v) => setSort(v as typeof sort)}
                  ariaLabel="Sort resources"
                >
                  <option value="popular">Popularity</option>
                  <option value="updated">Recently updated</option>
                  <option value="rating">Highest rated</option>
                  <option value="reading">Shortest first</option>
                </HubSelect>
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
