"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Heart,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { HubResourceCard } from "@/components/developer-hub/hub-resource-card";
import { HubShareMenu } from "@/components/developer-hub/hub-share-menu";
import {
  HubArchitectureDiagram,
  HubFlowDiagram,
} from "@/components/developer-hub/hub-architecture-diagram";
import { categoryMeta } from "@/features/developer-hub/data/categories";
import {
  getHubResource,
  HUB_CATALOG,
} from "@/features/developer-hub/data/catalog";
import { buildLearningJourney } from "@/features/developer-hub/lib/learning-curriculum";
import { useHubLibrary } from "@/features/developer-hub/hooks/use-hub-library";
import type { HubResource, HubSection } from "@/features/developer-hub/types";
import { cn } from "@/lib/utils";

function SectionBlock({ section }: { section: HubSection }) {
  return (
    <section
      id={section.id}
      className="hub-section scroll-mt-24 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
        {section.title}
      </h2>

      <div className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.75] text-foreground/90">
        {section.body}
      </div>

      {section.bullets?.length ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-foreground/90">
          {section.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : null}

      {section.checklist?.length ? (
        <ul className="mt-3 space-y-2">
          {section.checklist.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-[13px]"
            >
              <span className="mt-0.5 text-muted-foreground">☐</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.kind === "architecture" ? (
        <HubArchitectureDiagram title="How a request moves in production" />
      ) : null}

      {section.kind === "diagram" ? <HubFlowDiagram /> : null}

      {section.code?.map((block) => (
        <div key={`${block.title}-${block.language}`} className="mt-4">
          {block.title ? (
            <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">
              {block.title}
            </p>
          ) : null}
          <pre className="overflow-x-auto rounded-xl border border-border/60 bg-zinc-950 p-4 text-[12px] leading-relaxed text-zinc-100">
            <code>{block.code}</code>
          </pre>
        </div>
      ))}
    </section>
  );
}

export function HubResourceReader({ resource }: { resource: HubResource }) {
  const library = useHubLibrary();
  const journey = useMemo(() => buildLearningJourney(resource), [resource]);
  const [activeSection, setActiveSection] = useState(journey[0]?.id);
  const [progress, setProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const articleRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cat = categoryMeta(resource.category);

  const related = useMemo(() => {
    const fromSlugs = (resource.relatedSlugs ?? [])
      .map((s) => getHubResource(s))
      .filter(Boolean) as HubResource[];
    const sameCategory = HUB_CATALOG.filter(
      (r) => r.category === resource.category && r.slug !== resource.slug
    );
    const next =
      (resource.nextSlug && getHubResource(resource.nextSlug)) ||
      sameCategory[0] ||
      null;
    const cards = [
      ...(next ? [next] : []),
      ...(fromSlugs.length ? fromSlugs : sameCategory),
    ].filter(
      (r, i, arr) =>
        r.slug !== resource.slug &&
        arr.findIndex((x) => x.slug === r.slug) === i
    );
    return cards.slice(0, 3);
  }, [resource]);

  const index = HUB_CATALOG.findIndex((r) => r.slug === resource.slug);
  const prev = index > 0 ? HUB_CATALOG[index - 1] : null;
  const nextGuide =
    index >= 0 && index < HUB_CATALOG.length - 1 ? HUB_CATALOG[index + 1] : null;

  useEffect(() => {
    setShareUrl(window.location.href);
    library.trackView(resource.slug, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource.slug]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      const pct = Math.round(
        (Math.min(scroller.scrollTop, Math.max(max, 1)) / Math.max(max, 1)) *
          100
      );
      setProgress(pct);
      library.setProgress(resource.slug, pct);

      for (const section of [...journey].reverse()) {
        const node = document.getElementById(section.id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= 140) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource.slug, journey, library.setProgress]);

  const onBookmark = () => {
    const willBookmark = !library.isBookmarked(resource.slug);
    library.toggleBookmark(resource.slug);
    toast.success(
      willBookmark
        ? "Saved to My Library · Bookmarks · Continue Reading"
        : "Removed from Bookmarks"
    );
  };

  return (
    <>
      <PortalChrome title={resource.title} fillViewport />
      <div
        ref={scrollRef}
        className="hub-reader relative h-full min-h-0 overflow-y-auto overscroll-y-contain"
      >
        <div
          className="hub-no-print pointer-events-none sticky top-0 z-30 h-0.5 bg-muted"
          aria-hidden
        >
          <div
            className="h-full bg-[#5B6CFF] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="border-b border-border/50 bg-muted/20 px-3 py-5 sm:px-4 sm:py-6 lg:px-5">
          <div className="mx-auto w-full max-w-3xl">
            <Link
              href="/resources"
              className="hub-no-print mb-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dev Forge
            </Link>

            <div className="rounded-2xl border border-border/70 bg-card px-5 py-7 text-center shadow-sm sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <Rocket className="h-3 w-3" />
                  Learning path
                </span>
                <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] capitalize text-muted-foreground">
                  {resource.difficulty}
                </span>
                <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {resource.readingMinutes} min
                </span>
                <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {cat.label}
                </span>
              </div>

              <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.035em] text-foreground sm:text-[32px]">
                {resource.title}
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                {resource.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                <span>{resource.author}</span>
                <span aria-hidden>·</span>
                <span>Updated {resource.updatedAt}</span>
                <span aria-hidden>·</span>
                <span>★ {resource.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-6 px-3 py-6 sm:gap-7 sm:px-4 sm:py-7 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8 lg:px-5 lg:pr-8">
          <aside className="hub-no-print hidden lg:block">
            <div className="sticky top-20 space-y-3 pl-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Learning journey
              </p>
              <nav className="max-h-[70vh] space-y-0.5 overflow-y-auto pr-1">
                {journey.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "block rounded-lg px-2 py-1.5 text-[11.5px] leading-snug transition",
                      activeSection === section.id
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="pt-2 text-[11px] text-muted-foreground">
                {progress}% complete
              </div>
            </div>
          </aside>

          <div className="min-w-0 max-w-4xl">
            <div className="hub-no-print mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onBookmark}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-medium transition",
                  library.isBookmarked(resource.slug)
                    ? "border-amber-500/40 bg-amber-500/10 text-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-3.5 w-3.5",
                    library.isBookmarked(resource.slug) && "fill-current"
                  )}
                />
                Bookmark
              </button>
              <button
                type="button"
                onClick={() => {
                  const willLike = !library.isLiked(resource.slug);
                  library.toggleLike(resource.slug);
                  toast.success(
                    willLike ? "Liked — saved to My Library" : "Removed like"
                  );
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-[12px] font-medium transition hover:bg-muted"
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5",
                    library.isLiked(resource.slug) &&
                      "fill-rose-500 text-rose-500"
                  )}
                />
                Like
              </button>
              <HubShareMenu title={resource.title} url={shareUrl || ""} />
            </div>

            <article ref={articleRef} className="space-y-5">
              {journey.map((section) => (
                <SectionBlock key={section.id} section={section} />
              ))}
            </article>

            {resource.githubUrl ? (
              <a
                href={resource.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3 text-[13px] transition hover:bg-muted"
              >
                <span>Hands-on project repos for this topic</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : null}

            <div className="hub-no-print mt-10 flex flex-wrap justify-between gap-3 border-t border-border/60 pt-6">
              {prev ? (
                <Link
                  href={`/resources/${prev.slug}`}
                  className="group max-w-[46%] rounded-xl border border-border px-3 py-3 transition hover:bg-muted/50"
                >
                  <p className="text-[11px] text-muted-foreground">Previous</p>
                  <p className="mt-0.5 truncate text-[13px] font-medium group-hover:underline">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {nextGuide ? (
                <Link
                  href={`/resources/${nextGuide.slug}`}
                  className="group max-w-[46%] rounded-xl border border-border px-3 py-3 text-right transition hover:bg-muted/50"
                >
                  <p className="text-[11px] text-muted-foreground">Next</p>
                  <p className="mt-0.5 truncate text-[13px] font-medium group-hover:underline">
                    {nextGuide.title}
                  </p>
                </Link>
              ) : null}
            </div>

            {related.length > 0 ? (
              <section className="mt-12">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <HubResourceCard
                      key={r.id}
                      resource={r}
                      bookmarked={library.isBookmarked(r.slug)}
                      onToggleBookmark={() => library.toggleBookmark(r.slug)}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
